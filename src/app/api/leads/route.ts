import { NextResponse } from "next/server";
import { fail, readJsonBody } from "@/lib/leads/api-guards";
import { appendLeadToSheet, isSheetConfigured, SheetUnavailableError } from "@/lib/leads/sheets";
import { checkRateLimit, clientIp, requesterKey } from "@/lib/leads/rate-limit";
import { validateLead } from "@/lib/leads/validate";
import type { LeadInput } from "@/lib/leads/types";

/**
 * STEP 12 (rev. 2) — POST /api/leads : validate an enquiry and drop it in
 * the Google Sheet.
 *
 * No OTP step anymore. A 202 means the row is in the sheet — that's the
 * whole flow now. See src/lib/leads/sheets.ts for why, and what that gave
 * up (email-ownership verification, owner-notification email).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  if (!isSheetConfigured()) {
    console.error("[leads] refused: LEADS_SHEET_WEBHOOK_URL is not set.");
    return fail(503, "storage_unavailable");
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
  // IPs to bombard the sheet with rows for the same inbox.
  const emailVerdict = await checkRateLimit(`email:${requesterKey(result.lead.email)}`);
  if (!emailVerdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: emailVerdict.retryAfter },
      { status: 429, headers: { "Retry-After": String(emailVerdict.retryAfter) } }
    );
  }

  try {
    await appendLeadToSheet({
      timestamp: result.lead.createdAt.toISOString(),
      name: result.lead.name,
      email: result.lead.email,
      phone: result.lead.phone,
      projectType: result.lead.projectType,
      projectInterest: result.lead.projectInterest ?? "",
      projectGoal: result.lead.projectGoal,
      additionalMessage: result.lead.additionalMessage,
      source: result.lead.source,
      page: result.lead.page ?? "",
      referrer: result.lead.referrer ?? "",
      spamSignals: result.lead.spamSignals?.join(", ") ?? "",
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    if (error instanceof SheetUnavailableError) {
      console.error("[leads]", error.message);
      return fail(503, "storage_unavailable");
    }
    // Never echo the underlying error: it can carry the webhook URL.
    console.error("[leads] write failed", error);
    return fail(500, "write_failed");
  }
}

export async function GET() {
  return fail(405, "method_not_allowed");
}
