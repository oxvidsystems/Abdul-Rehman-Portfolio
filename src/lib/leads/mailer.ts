import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml } from "./sanitize";

/**
 * STEP 12 — sending the verification email.
 *
 * Deliberately not an SDK. Resend's API is one authenticated POST, so a
 * `fetch` costs nothing and adds no dependency; swapping in Postmark,
 * SendGrid or Mailgun means changing the URL and the body shape in one
 * function. If the client would rather send through their own oxvidsystems
 * mailbox, that is SMTP and does need a library (nodemailer) — a deliberate
 * choice for them to make, not one to make for them by default.
 *
 * UNCONFIGURED IS LOUD, NOT SILENT
 * With no API key this throws. The route answers 503 and the visitor is told
 * to email instead. A verification flow that quietly fails to send is worse
 * than none: the visitor waits for a code that was never sent.
 */

export class MailerUnavailableError extends Error {
  constructor(reason: string) {
    super(`Mailer unavailable: ${reason}`);
    this.name = "MailerUnavailableError";
  }
}

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set on the owner notification so a reply goes straight to the lead. */
  replyTo?: string;
};

export function isMailerConfigured(): boolean {
  return Boolean(
    (process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL) ||
      devOutboxEnabled()
  );
}

/**
 * A local outbox for development and tests, in the spirit of Mailhog: the
 * rendered message is written to a file instead of being sent, so the whole
 * flow can be exercised without a provider account.
 *
 * It refuses to run in production. That guard is the entire point — this
 * writes a live verification code to disk, which is fine on a laptop and
 * unacceptable on a server.
 */
function devOutboxEnabled(): boolean {
  if (process.env.LEAD_DEV_OUTBOX !== "1") return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "LEAD_DEV_OUTBOX is set in production. It writes verification codes to disk and must never be enabled on a server."
    );
  }
  return true;
}

function writeToDevOutbox(mail: Mail) {
  const dir = process.env.LEAD_DEV_OUTBOX_DIR ?? ".mail-outbox";
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${Date.now()}-${mail.to.replace(/[^a-z0-9]/gi, "_")}.txt`);
  const reply = mail.replyTo ? `Reply-To: ${mail.replyTo}\n` : "";
  writeFileSync(file, `To: ${mail.to}\n${reply}Subject: ${mail.subject}\n\n${mail.text}\n`);
}

export async function sendMail(mail: Mail): Promise<void> {
  if (devOutboxEnabled()) {
    writeToDevOutbox(mail);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new MailerUnavailableError("RESEND_API_KEY / LEAD_FROM_EMAIL not set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: [mail.replyTo] } : {}),
    }),
  });

  if (!response.ok) {
    // The provider's body can echo the recipient; the status is enough to
    // debug with and carries nothing sensitive.
    throw new MailerUnavailableError(`provider responded ${response.status}`);
  }
}

/**
 * The verification email.
 *
 * Plain, branded, and honest about what it is. No tracking pixel, no click
 * tracking, no "click here to confirm" link — a code the visitor types is
 * immune to the link-prefetching that corporate mail scanners do, which
 * silently burns single-use links before the human ever sees them.
 */
export function verificationEmail(code: string, name: string): Mail {
  const greeting = name ? `Hi ${name},` : "Hi,";

  const text = [
    greeting,
    "",
    `Your OXVID Systems verification code is ${code}`,
    "",
    "It expires in 10 minutes and can be used once.",
    "",
    "If you didn't start a project enquiry with us, you can ignore this email — nothing has been saved.",
    "",
    "— OXVID Systems",
    "info@oxvidsystems.com",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#fafaf9;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#11221e">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.2em;color:#1f7a6e">OXVID SYSTEMS</p>
    <p style="margin:0 0 28px;font-size:15px;color:#3b7267">Project enquiry</p>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Here's the code to confirm your email address:</p>

    <p style="margin:0 0 8px;padding:18px 24px;background:#11221e;color:#ffffff;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:30px;letter-spacing:.34em;text-align:center;border-radius:6px">${escapeHtml(code)}</p>
    <p style="margin:0 0 28px;font-size:13px;color:#3b7267;text-align:center">Expires in 10 minutes &middot; can be used once</p>

    <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#3b7267">
      If you didn't start a project enquiry with us, you can ignore this email &mdash; nothing has been saved.
    </p>

    <hr style="border:none;border-top:1px solid #dcdcd8;margin:0 0 16px">
    <p style="margin:0;font-size:12px;color:#7db0a6">
      OXVID Systems &middot; <a href="mailto:info@oxvidsystems.com" style="color:#1f7a6e">info@oxvidsystems.com</a>
    </p>
  </div>
</body></html>`;

  return {
    to: "",
    subject: `${code} is your OXVID verification code`,
    html,
    text,
  };
}
