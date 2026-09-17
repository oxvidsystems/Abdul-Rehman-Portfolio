import { NextResponse } from "next/server";
import { fail, readHandle, readJsonBody } from "@/lib/leads/api-guards";
import { getClient, isStoreConfigured, mapLeadRow } from "@/lib/leads/store";
import { sendMail } from "@/lib/leads/mailer";
import { ownerNotification } from "@/lib/leads/notify";
import { checkRateLimit, clientIp, requesterKey } from "@/lib/leads/rate-limit";
import { checkCode, VerificationSecretMissingError, type VerificationRecord } from "@/lib/leads/verification";

/**
 * STEP 12 — POST /api/leads/verify : consume a code, promote the lead.
 *
 * This is the only place `emailVerified` becomes true, and it does so only
 * after a code the visitor could not have guessed came back to us from the
 * inbox they claimed. That is what makes it ownership verification rather
 * than syntax checking.
 *
 * The read-check-write runs inside a Postgres transaction, with the
 * verification row locked by `SELECT ... FOR UPDATE`. Without that lock, two
 * simultaneous guesses both read `attempts: 4`, both write `attempts: 5`,
 * and the limit silently becomes "5 per parallel request" instead of 5.
 *
 * Every failure answers with the same shape and no detail about WHY beyond
 * what the visitor legitimately needs (attempts left, expired, start over).
 * A response that distinguished "no such verification" from "wrong code"
 * would let someone enumerate live verification ids.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Outcome =
  | { kind: "gone" }
  | { kind: "wrong"; attemptsLeft: number }
  | { kind: "expired" }
  | { kind: "consumed" }
  | { kind: "locked" }
  | { kind: "verified"; leadId: string };

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  if (!isStoreConfigured()) return fail(503, "storage_unavailable");

  const ipKey = requesterKey(clientIp(request.headers));
  // Attempts are limited per verification record as well; this second limit
  // stops one requester grinding through many records in parallel.
  const verdict = await checkRateLimit(`verify:${ipKey}`);
  if (!verdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: verdict.retryAfter },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfter) } }
    );
  }

  const verificationId = readHandle(parsed.body.verificationId);
  const submitted = typeof parsed.body.code === "string" ? parsed.body.code : "";
  if (!verificationId) return fail(400, "malformed_body");

  try {
    const client = await getClient();
    let outcome: Outcome;

    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `SELECT lead_id, code_hash, expires_at, attempts, resends, last_sent_at, consumed_at
           FROM verifications WHERE id = $1 FOR UPDATE`,
        [verificationId]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        outcome = { kind: "gone" };
      } else {
        const row = rows[0];
        const record: VerificationRecord = {
          leadId: row.lead_id,
          codeHash: row.code_hash,
          expiresAt: Number(row.expires_at),
          attempts: row.attempts,
          resends: row.resends,
          lastSentAt: Number(row.last_sent_at),
          consumedAt: row.consumed_at === null ? null : Number(row.consumed_at),
        };
        const result = checkCode(verificationId, record, submitted);

        if (result.status === "wrong") {
          await client.query(`UPDATE verifications SET attempts = $1 WHERE id = $2`, [
            result.record.attempts,
            verificationId,
          ]);
          await client.query("COMMIT");
          outcome = { kind: "wrong", attemptsLeft: result.attemptsLeft };
        } else if (result.status !== "verified") {
          await client.query("ROLLBACK");
          outcome = { kind: result.status };
        } else {
          await client.query(
            `UPDATE verifications SET attempts = $1, consumed_at = $2 WHERE id = $3`,
            [result.record.attempts, result.record.consumedAt, verificationId]
          );
          await client.query(
            `UPDATE leads
               SET email_verified = true, verification_status = 'verified',
                   qualified = true, verified_at = NOW()
             WHERE id = $1`,
            [record.leadId]
          );
          await client.query("COMMIT");
          outcome = { kind: "verified", leadId: record.leadId };
        }
      }
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }

    switch (outcome.kind) {
      case "verified":
        // Best effort, deliberately AFTER the transaction and deliberately
        // not awaited into the result: the visitor has already proved they
        // own the address, and a mail provider having a bad minute must not
        // undo that. A failure is logged and leaves `ownerNotifiedAt` unset,
        // which is exactly what listUnnotifiedVerifiedLeads() looks for.
        await notifyOwner(outcome.leadId);
        return NextResponse.json({ ok: true, verified: true });
      case "wrong":
        return fail(422, "wrong_code", { attemptsLeft: outcome.attemptsLeft });
      case "expired":
        await markLead(verificationId, "expired");
        return fail(410, "code_expired");
      case "locked":
        await markLead(verificationId, "failed");
        return fail(429, "too_many_attempts");
      case "consumed":
        return fail(409, "already_verified");
      default:
        // Unknown id and deleted-by-cleanup are the same answer on purpose.
        return fail(410, "code_expired");
    }
  } catch (error) {
    if (error instanceof VerificationSecretMissingError) {
      console.error("[leads]", error.message);
      return fail(503, "verification_unavailable");
    }
    console.error("[leads] verify failed", error);
    return fail(500, "verify_failed");
  }
}

/**
 * Tell info@oxvidsystems.com. Never throws — see the call site.
 *
 * It re-reads the lead rather than being handed the code's record, so the
 * only thing it can possibly put in an email is lead data. The verification
 * code and id are not in scope here at all.
 */
async function notifyOwner(leadId: string) {
  try {
    const client = await getClient();
    let leadRow: Record<string, unknown> | undefined;
    try {
      const { rows } = await client.query(`SELECT * FROM leads WHERE id = $1`, [leadId]);
      leadRow = rows[0];
    } finally {
      client.release();
    }
    if (!leadRow) return;

    const lead = mapLeadRow(leadRow);
    await sendMail(ownerNotification(lead, leadId));

    const client2 = await getClient();
    try {
      await client2.query(`UPDATE leads SET owner_notified_at = NOW() WHERE id = $1`, [leadId]);
    } finally {
      client2.release();
    }
  } catch (error) {
    console.error("[leads] owner notification failed for", leadId, error);
  }
}

/** Reflect a dead verification on the lead so it reads honestly in the console. */
async function markLead(verificationId: string, status: "expired" | "failed") {
  try {
    const client = await getClient();
    try {
      const { rows } = await client.query(`SELECT lead_id FROM verifications WHERE id = $1`, [
        verificationId,
      ]);
      const leadId = rows[0]?.lead_id;
      if (!leadId) return;
      await client.query(`UPDATE leads SET verification_status = $1 WHERE id = $2`, [
        status,
        leadId,
      ]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[leads] could not mark lead status", error);
  }
}

export async function GET() {
  return fail(405, "method_not_allowed");
}
