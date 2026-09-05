import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { fail, readHandle, readJsonBody } from "@/lib/leads/api-guards";
import {
  getDb,
  isStoreConfigured,
  LEADS_COLLECTION,
  VERIFICATIONS_COLLECTION,
} from "@/lib/leads/firestore";
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

    // Step 17. /api/leads limits per address as well as per IP, so that "one
    // requester cannot use many IPs to bombard one inbox, and one IP cannot
    // walk a list of addresses". Changing the address here sends a code to an
    // arbitrary inbox too, and this route had only the per-IP limit — the
    // same defence, missing from the sibling route that needs it just as
    // much. An asymmetry like that is what ends up being the way in.
    const addressVerdict = await checkRateLimit(`email:${requesterKey(newEmail)}`);
    if (!addressVerdict.allowed) {
      return NextResponse.json(
        { ok: false, error: "rate_limited", retryAfter: addressVerdict.retryAfter },
        { status: 429, headers: { "Retry-After": String(addressVerdict.retryAfter) } }
      );
    }
  }

  try {
    const db = getDb();
    const ref = db.collection(VERIFICATIONS_COLLECTION).doc(verificationId);

    const prepared = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return { kind: "gone" as const };

      const record = snap.data() as VerificationRecord;
      if (record.consumedAt !== null) return { kind: "consumed" as const };

      // Changing the address is allowed to bypass the cooldown once, because
      // the visitor is correcting a typo, not hammering an inbox. The resend
      // cap still applies.
      const gate = canResend(record);
      if (!gate.allowed && !(newEmail && gate.reason === "cooldown")) {
        return {
          kind: "blocked" as const,
          reason: gate.reason,
          waitMs: gate.waitMs,
        };
      }

      const { code, record: next } = reissueCode(verificationId, record);
      tx.update(ref, {
        codeHash: next.codeHash,
        expiresAt: next.expiresAt,
        expiresAtTs: Timestamp.fromMillis(next.expiresAt),
        attempts: 0,
        resends: next.resends,
        lastSentAt: next.lastSentAt,
      });

      if (newEmail) {
        tx.update(db.collection(LEADS_COLLECTION).doc(record.leadId), {
          email: newEmail,
          emailVerified: false,
          verificationStatus: "pending",
        });
      }

      return { kind: "ok" as const, code, leadId: record.leadId };
    });

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

    const leadSnap = await db.collection(LEADS_COLLECTION).doc(prepared.leadId).get();
    const lead = leadSnap.data() as { email?: string; name?: string } | undefined;
    const to = newEmail ?? lead?.email;
    if (!to) return fail(500, "write_failed");

    const mail = verificationEmail(prepared.code, (lead?.name ?? "").split(" ")[0] ?? "");
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
