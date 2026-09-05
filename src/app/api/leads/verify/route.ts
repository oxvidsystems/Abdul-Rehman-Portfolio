import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { fail, readHandle, readJsonBody } from "@/lib/leads/api-guards";
import {
  getDb,
  isStoreConfigured,
  LEADS_COLLECTION,
  VERIFICATIONS_COLLECTION,
} from "@/lib/leads/firestore";
import { sendMail } from "@/lib/leads/mailer";
import { ownerNotification } from "@/lib/leads/notify";
import { checkRateLimit, clientIp, requesterKey } from "@/lib/leads/rate-limit";
import type { Lead } from "@/lib/leads/types";
import { checkCode, VerificationSecretMissingError, type VerificationRecord } from "@/lib/leads/verification";

/**
 * STEP 12 — POST /api/leads/verify : consume a code, promote the lead.
 *
 * This is the only place `emailVerified` becomes true, and it does so only
 * after a code the visitor could not have guessed came back to us from the
 * inbox they claimed. That is what makes it ownership verification rather
 * than syntax checking.
 *
 * The read-check-write runs inside a Firestore transaction. Without one, two
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
    const db = getDb();
    const ref = db.collection(VERIFICATIONS_COLLECTION).doc(verificationId);

    const outcome = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return { kind: "gone" as const };

      const record = snap.data() as VerificationRecord;
      const result = checkCode(verificationId, record, submitted);

      if (result.status === "wrong") {
        tx.update(ref, { attempts: result.record.attempts });
        return { kind: "wrong" as const, attemptsLeft: result.attemptsLeft };
      }
      if (result.status !== "verified") return { kind: result.status };

      tx.update(ref, {
        attempts: result.record.attempts,
        consumedAt: result.record.consumedAt,
      });
      tx.update(db.collection(LEADS_COLLECTION).doc(record.leadId), {
        emailVerified: true,
        verificationStatus: "verified",
        // One boolean that a lead view can filter on without having to know
        // the whole status vocabulary. Written here and nowhere else.
        qualified: true,
        verifiedAt: Timestamp.now(),
      });
      return { kind: "verified" as const, leadId: record.leadId };
    });

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
        // Unknown id and deleted-by-TTL are the same answer on purpose.
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
    const db = getDb();
    const ref = db.collection(LEADS_COLLECTION).doc(leadId);
    const snap = await ref.get();
    const data = snap.data();
    if (!data) return;

    const lead: Lead = {
      ...(data as Omit<Lead, "createdAt" | "verifiedAt">),
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      verifiedAt: data.verifiedAt?.toDate?.() ?? new Date(),
    };

    await sendMail(ownerNotification(lead, leadId));
    await ref.update({ ownerNotifiedAt: Timestamp.now() });
  } catch (error) {
    console.error("[leads] owner notification failed for", leadId, error);
  }
}

/** Reflect a dead verification on the lead so it reads honestly in the console. */
async function markLead(verificationId: string, status: "expired" | "failed") {
  try {
    const db = getDb();
    const snap = await db.collection(VERIFICATIONS_COLLECTION).doc(verificationId).get();
    const leadId = (snap.data() as VerificationRecord | undefined)?.leadId;
    if (!leadId) return;
    await db.collection(LEADS_COLLECTION).doc(leadId).update({
      verificationStatus: status,
    });
  } catch (error) {
    console.error("[leads] could not mark lead status", error);
  }
}

export async function GET() {
  return fail(405, "method_not_allowed");
}
