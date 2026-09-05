import { escapeHtml } from "./sanitize";
import type { Mail } from "./mailer";
import type { Lead } from "./types";

/**
 * STEP 13 — telling the business owner about a verified lead.
 *
 * Sent ONLY on successful verification. Notifying on the pending write would
 * mean an inbox full of typos, abandoned forms and bot noise, and would make
 * the notification itself worthless as a signal. When one of these arrives,
 * someone has proved they can read the address they gave.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHAT THIS EMAIL MUST NEVER CONTAIN
 * ─────────────────────────────────────────────────────────────────────
 * The verification code, or the verification id. Neither is in `Lead`, and
 * this function takes nothing else, so there is no way to pass one in by
 * accident — the type system is the guard, not a reviewer's memory.
 *
 * The code is single-use and already consumed by the time this is sent, but
 * "already spent" is not a reason to put a credential in an inbox that gets
 * forwarded, archived and searched.
 *
 * The lead's document id IS included. It is a reference, not a secret:
 * Firestore denies all client access, so knowing an id grants nothing, and
 * without it there is no quick way to find the record again.
 */

export const OWNER_NOTIFY_FALLBACK = "info@oxvidsystems.com";

/** Where notifications go. Overridable, defaulting to the studio inbox. */
export function ownerNotifyAddress(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || OWNER_NOTIFY_FALLBACK;
}

function line(label: string, value: string): string {
  return `${label.padEnd(12)}${value}`;
}

export function ownerNotification(lead: Lead, leadId: string): Mail {
  const when = (lead.verifiedAt ?? new Date()).toISOString().replace("T", " ").slice(0, 16);
  const project = lead.projectInterest
    ? `${lead.projectType} — ${lead.projectInterest}`
    : lead.projectType;

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", `${lead.email} (verified)`],
    ["Phone", lead.phone],
    ["Project", project],
    ["Goal", lead.projectGoal],
    ["Notes", lead.additionalMessage || "—"],
    ["Source", lead.source],
    ["Created", lead.createdAt.toISOString().replace("T", " ").slice(0, 16) + " UTC"],
    ["Verified", when + " UTC"],
    ["Status", lead.verificationStatus],
    ["Ref", leadId],
  ];

  const text = [
    `New verified lead — ${lead.name}`,
    "",
    ...rows.map(([k, v]) => line(k, v)),
    ...(lead.spamSignals?.length
      ? ["", `Flagged: ${lead.spamSignals.join(", ")} — worth a look before replying.`]
      : []),
    "",
    `Reply to this email to reach ${lead.name} directly.`,
    "",
    "— OXVID Systems",
  ].join("\n");

  const cell = (v: string) =>
    `<td style="padding:8px 0;font-size:14px;line-height:1.5;color:#11221e;vertical-align:top">${escapeHtml(v)}</td>`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#fafaf9;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.2em;color:#1f7a6e">OXVID SYSTEMS</p>
    <h1 style="margin:0 0 4px;font-size:22px;font-weight:700;letter-spacing:-.02em;color:#11221e">
      New verified lead
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:#3b7267">
      ${escapeHtml(lead.name)} confirmed ${escapeHtml(lead.email)} by code.
    </p>

    <table style="width:100%;border-collapse:collapse;border-top:1px solid #dcdcd8">
      ${rows
        .map(
          ([k, v]) =>
            `<tr style="border-bottom:1px solid #f4f4f2">
               <td style="padding:8px 16px 8px 0;width:96px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;letter-spacing:.14em;color:#7db0a6;vertical-align:top">${escapeHtml(
                 k.toUpperCase()
               )}</td>
               ${cell(v)}
             </tr>`
        )
        .join("")}
    </table>

    ${
      lead.spamSignals?.length
        ? `<p style="margin:20px 0 0;padding:12px 14px;background:#f4f4f2;border-left:2px solid #b4503f;font-size:13px;line-height:1.5;color:#3b7267">
             Flagged: ${escapeHtml(lead.spamSignals.join(", "))} — worth a look before replying.
           </p>`
        : ""
    }

    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#3b7267">
      Reply to this email to reach ${escapeHtml(lead.name)} directly.
    </p>
  </div>
</body></html>`;

  return {
    to: ownerNotifyAddress(),
    subject: `New verified lead — ${lead.name} (${lead.projectType})`,
    // Hitting reply goes to the lead, not to the studio inbox itself.
    replyTo: lead.email,
    html,
    text,
  };
}
