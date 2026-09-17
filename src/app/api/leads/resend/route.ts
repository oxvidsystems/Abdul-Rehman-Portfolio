import { NextResponse } from "next/server";
import { fail, readHandle, readJsonBody } from "@/lib/leads/api-guards";
import { getClient, isStoreConfigured } from "@/lib/leads/store";
import { isMailerConfigured, MailerUnavailableError, sendMail, verificationEmail } from "@/lib/leads/mailer";
import { checkRateLimit, clientIp, requesterKey } from "@/lib/leads/rate-limit";
import { cleanLine } from "@/lib/leads/sanitize";
import { LEAD_LIMITS } from "@/lib/leads/types";
import { isLikelyEmail } from "@/lib/chat-flow";
import {
  canResend,
  CODE_TTL_MS,
  reissueCode,
  VerificationSecretMissingError,
  type VerificationRecord,
} from "@/lib/leads/verification";

/**
 * STEP 12 — POST /api/leads/resend : send a new code, optionally to a new
 * address.
 *
 * "Resend code" and "Change email" are the same operation: mint a new code
 * and send it. Splitting them into two routes would have duplicated the
 * cooldown, the resend cap and the rate limit — three chances for the two
 * copies to drift apart, with the weaker one becoming the way in.
 *
 * A resend INVALIDATES the previous code rather than adding a second valid
 * one. Two live codes would double the guess space for free, and mean a code
 * the visitor abandoned still works.
 *
 * Changing the address also resets the attempt counter, because the previous
 * failures were against a different inbox — but it does NOT reset the resend
 * counter, or "change email" would be an unlimited way around the cap.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Prepared =
  | { kind: "gone" }
  | { kind: "consumed" }
  | { kind: "blocked"; reason: "cooldown" | "limit"; waitMs: number }
  | { kind: "ok"; code: string; leadId: string };

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  if (!isStoreConfigured()) return fail(503, "storage_unavailable");
  if (!isMailerConfigured()) return fail(503, "mailer_unavailable");

  const ipKey = requesterKey(clientIp(request.headers));
  const verdict = await checkRateLimit(`resend:${ipKey}`);
  if (!verdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: verdict.retryAfter },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfter) } }
    );
  }

  const verificationId = readHandle(parsed.body.verificationId);
  if (!verificationId) return fail(400, "malformed_body");

  // Optional. Present means "change email"; absent means "resend".
  let newEmail: string | null = null;
  if (parsed.body.email !== undefined) {
    const candidate = cleanLine(parsed.body.email, LEAD_LIMITS.email).toLowerCase();
    if (!isLikelyEmail(candidate)) {
      return fail(422, "invalid", {
        fields: { email: "That doesn't look like an email address." },
      });
    }
    newEmail = candidate;

    // /api/leads limits per address as well as per IP, so that one requester
    // cannot use many IPs to bombard one inbox, and one IP cannot walk a
    // list of addresses. Changing the address here sends a code to an
    // arbitrary inbox too, so it needs the same defence.
    const addressVerdict = await checkRateLimit(`email:${requesterKey(newEmail)}`);
    if (!addressVerdict.allowed) {
      return NextResponse.json(
        { ok: false, error: "rate_limited", retryAfter: addressVerdict.retryAfter },
        { status: 429, headers: { "Retry-After": String(addressVerdict.retryAfter) } }
      );
    }
  }

  try {
    const client = await getClient();
    let prepared: Prepared;

    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `SELECT lead_id, code_hash, expires_at, attempts, resends, last_sent_at, consumed_at
           FROM verifications WHERE id = $1 FOR UPDATE`,
        [verificationId]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        prepared = { kind: "gone" };
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

        if (record.consumedAt !== null) {
          await client.query("ROLLBACK");
          prepared = { kind: "consumed" };
        } else {
          // Changing the address is allowed to bypass the cooldown once,
          // because the visitor is correcting a typo, not hammering an
          // inbox. The resend cap still applies.
          const gate = canResend(record);
          if (!gate.allowed && !(newEmail && gate.reason === "cooldown")) {
            await client.query("ROLLBACK");
            prepared = { kind: "blocked", reason: gate.reason, waitMs: gate.waitMs };
          } else {
            const { code, record: next } = reissueCode(verificationId, record);
            await client.query(
              `UPDATE verifications
                 SET code_hash = $1, expires_at = $2, attempts = 0, resends = $3,
                     last_sent_at = $4, consumed_at = NULL
               WHERE id = $5`,
              [next.codeHash, next.expiresAt, next.resends, next.lastSentAt, verificationId]
            );

            if (newEmail) {
              await client.query(
                `UPDATE leads SET email = $1, email_verified = false, verification_status = 'pending'
                 WHERE id = $2`,
                [newEmail, record.leadId]
              );
            }

            await client.query("COMMIT");
            prepared = { kind: "ok", code, leadId: record.leadId };
          }
        }
      }
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }

    if (prepared.kind === "gone") return fail(410, "code_expired");
    if (prepared.kind === "consumed") return fail(409, "already_verified");
    if (prepared.kind === "blocked") {
      return NextResponse.json(
        {
          ok: false,
          error: prepared.reason === "limit" ? "resend_limit" : "resend_cooldown",
          retryAfter: Math.ceil(prepared.waitMs / 1000),
        },
        { status: 429 }
      );
    }

    const client2 = await getClient();
    let to: string | null = newEmail;
    let firstName = "";
    try {
      const { rows } = await client2.query(`SELECT name, email FROM leads WHERE id = $1`, [
        prepared.leadId,
      ]);
      const lead = rows[0];
      if (!to) to = lead?.email ?? null;
      firstName = (lead?.name ?? "").split(" ")[0] ?? "";
    } finally {
      client2.release();
    }
    if (!to) return fail(500, "write_failed");

    const mail = verificationEmail(prepared.code, firstName);
    await sendMail({ ...mail, to });

    return NextResponse.json({ ok: true, email: to, expiresInMs: CODE_TTL_MS }, { status: 202 });
  } catch (error) {
    if (error instanceof VerificationSecretMissingError) {
      console.error("[leads]", error.message);
      return fail(503, "verification_unavailable");
    }
    if (error instanceof MailerUnavailableError) {
      console.error("[leads]", error.message);
      return fail(503, "mailer_unavailable");
    }
    console.error("[leads] resend failed", error);
    return fail(500, "write_failed");
  }
}

export async function GET() {
  return fail(405, "method_not_allowed");
}
