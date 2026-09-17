/**
 * STEP 11 (rev. 3) — lead storage, via a Google Sheet.
 *
 * WHY A SHEET AND NOT A DATABASE
 * The client wants the simplest possible way to see enquiries: open a
 * spreadsheet, no dashboard, no login screen, no account beyond the Google
 * one they already use. A Google Apps Script "Web App" deployed from inside
 * the Sheet gives exactly one URL that accepts a POST and appends a row —
 * no service-account key, no ORM, no separate cloud account, nothing to
 * install here (this uses the platform's own `fetch`).
 *
 * WHAT THIS GAVE UP
 * There is no OTP email-ownership verification and no owner-notification
 * email anymore (both needed a mail provider + a verified sending domain,
 * which is exactly the setup cost being avoided here). A lead is written to
 * the sheet the moment it passes validation — treat every row as
 * self-reported, not proven.
 *
 * UNCONFIGURED IS NOT "SILENTLY FINE"
 * With no LEADS_SHEET_WEBHOOK_URL set, this throws SheetUnavailableError and
 * the route answers 503 rather than pretending to have saved the lead.
 */

export class SheetUnavailableError extends Error {
  constructor(reason: string) {
    super(`Lead sheet unavailable: ${reason}`);
    this.name = "SheetUnavailableError";
  }
}

export function isSheetConfigured(): boolean {
  return Boolean(process.env.LEADS_SHEET_WEBHOOK_URL);
}

export async function appendLeadToSheet(row: Record<string, unknown>): Promise<void> {
  const url = process.env.LEADS_SHEET_WEBHOOK_URL;
  if (!url) {
    throw new SheetUnavailableError(
      "LEADS_SHEET_WEBHOOK_URL not set — deploy the Apps Script Web App and add its URL in Vercel"
    );
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script Web Apps answer with a redirect before the real
      // response; fetch follows it by default, but this is explicit
      // because a silent change here would look like a passing test with
      // a lead quietly dropped.
      redirect: "follow",
    });
  } catch (error) {
    throw new SheetUnavailableError(
      `request failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!response.ok) {
    throw new SheetUnavailableError(`webhook responded ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  if (payload && typeof payload === "object" && "ok" in payload && payload.ok === false) {
    throw new SheetUnavailableError("webhook reported failure");
  }
}
