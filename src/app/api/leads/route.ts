import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { fail, readJsonBody } from "@/lib/leads/api-guards";
import {
  getDb,
  isStoreConfigured,
  LEADS_COLLECTION,
  LeadStoreUnavailableError,
  VERIFICATIONS_COLLECTION,
} from "@/lib/leads/firestore";
import { isMailerConfigured, MailerUnavailableError, sendMail, verificationEmail } from "@/lib/leads/mailer";
import { checkRateLimit, clientIp, requesterKey } from "@/lib/leads/rate-limit";
import { validateLead } from "@/lib/leads/validate";
import { CODE_TTL_MS, issueCode, VerificationSecretMissingError } from "@/lib/leads/verification";
import type { LeadInput } from "@/lib/leads/types";

/**
 * STEP 12 — POST /api/leads : start an enquiry and send a code.
 *
 * What changed from Step 11: this no longer finishes the job. It writes the
 * lead as PENDING and mints a verification code. The lead only becomes a
 * verified lead in /api/leads/verify, and only if the visitor proves they
 * can read the inbox they gave us.
 *
 * A pending lead is still written, on purpose. Throwing it away until
 * verification succeeded would mean losing every honest enquiry from
 * someone who fills the form and gets distracted — a real business cost.
 * It carries `emailVerified: false` and `verificationStatus: "pending"` and
 * so can never be mistaken for a qualified lead by any query that bothers
 * to look.
 *
 * The plaintext code never touches this file's storage calls, never appears
 * in a response, and is never logged. It goes from `issueCode` into the
 * email and nowhere else.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  if (!isStoreConfigured()) {
    console.error("[leads] refused: Firebase credentials are not configured. See .env.example.");
    return fail(503, "storage_unavailable");
  }
  if (!isMailerConfigured()) {
    console.error("[leads] refused: mailer is not configured. See .env.example.");
    return fail(503, "mailer_unavailable");
  }

  const ipKey = requesterKey(clientIp(request.headers));
  const verdict = await checkRateLimit(`start:${ipKey}`);
  if (!verdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: verdict.retryAfter },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfter) } }
    );
  }

  const result = validateLead(parsed.body as LeadInput);
  if (!result.ok) return fail(422, "invalid", { fields: result.errors });

  // A second limit keyed on the address, so one requester cannot use many
  // IPs to bombard one inbox, and one IP cannot walk a list of addresses.
  const emailVerdict = await checkRateLimit(`email:${requesterKey(result.lead.email)}`);
  if (!emailVerdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: emailVerdict.retryAfter },
      { status: 429, headers: { "Retry-After": String(emailVerdict.retryAfter) } }
    );
  }

  try {
    const db = getDb();
    const { createdAt, ...rest } = result.lead;
    const leadRef = await db
      .collection(LEADS_COLLECTION)
      .add({ ...rest, createdAt: Timestamp.fromDate(createdAt) });

    const { verificationId, code, record } = issueCode(leadRef.id);
    await db.collection(VERIFICATIONS_COLLECTION).doc(verificationId).set({
      ...record,
      // Firestore TTL deletes the code material on its own. The lead stays.
      expiresAtTs: Timestamp.fromMillis(record.expiresAt),
    });

    const mail = verificationEmail(code, result.lead.name.split(" ")[0] ?? "");
    await sendMail({ ...mail, to: result.lead.email });

    return NextResponse.json(
      {
        ok: true,
        verificationId,
        email: result.lead.email,
        expiresInMs: CODE_TTL_MS,
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof VerificationSecretMissingError) {
      console.error("[leads]", error.message);
      return fail(503, "verification_unavailable");
    }
    if (error instanceof MailerUnavailableError) {
      console.error("[leads]", error.message);
      return fail(503, "mailer_unavailable");
    }
    if (error instanceof LeadStoreUnavailableError) {
      console.error("[leads]", error.message);
      return fail(503, "storage_unavailable");
    }
    // Never echo the underlying error: it can carry project ids and paths.
    console.error("[leads] start failed", error);
    return fail(500, "write_failed");
  }
}

export async function GET() {
  return fail(405, "method_not_allowed");
}
