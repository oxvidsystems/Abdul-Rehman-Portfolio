"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PRIMARY_ENQUIRY_EMAIL, PRIMARY_ENQUIRY_HREF } from "@/lib/contact";
import { LEAD_LIMITS, PROJECT_TYPES } from "@/lib/leads/types";
import { useReveal } from "@/lib/use-reveal";

/**
 * STEP 21 — the enquiry form in the Contact section.
 *
 * ─────────────────────────────────────────────────────────────────────
 * IT REUSES THE LEAD PIPELINE. IT DOES NOT ADD ONE.
 * ─────────────────────────────────────────────────────────────────────
 * `LEAD_SOURCES` in lib/leads/types.ts has always listed "contact-section"
 * alongside "chat-widget" — the backend was built expecting this form. So
 * this posts to the same three endpoints the chat widget posts to, and
 * inherits, unchanged and without a second copy to keep in step:
 *
 *   · server-side validation in lib/leads/validate.ts, which is the ONLY
 *     validation that decides anything. The `required`, `type` and
 *     `maxLength` attributes below are a courtesy to the person typing;
 *     the browser can be told to ignore every one of them and the server
 *     will still refuse a bad lead. Field errors shown under the inputs
 *     are the server's own words, echoed from its 422.
 *   · email-ownership proof. A submitted lead is written PENDING with
 *     `emailVerified: false` and is promoted only when a code sent to that
 *     inbox comes back — a well-formed address is never treated as a real
 *     one, and nothing here can set `qualified`.
 *   · rate limiting on start, verify, and resend, keyed on BOTH the
 *     requester and the address.
 *
 * There are no credentials in this file and none reach the browser: every
 * secret lives behind the route handlers. The form posts the six fields the
 * client specified and nothing else — no tracking id, no fingerprint.
 *
 * `projectType` is sent as free text on purpose. The server classifies it
 * (lib/leads/validate.ts → matchProjectType); an unrecognised value is filed
 * as "Other" with the visitor's own words kept in `projectInterest`. The
 * options offered here come from PROJECT_TYPES, which is itself derived from
 * the chat widget's quick replies, so the two lists cannot drift apart.
 */

const RESEND_COOLDOWN_MS = 60_000;
const CODE_LENGTH = 6;
const OTHER = "Something else";

type Phase = "form" | "sending" | "verify" | "checking" | "done";
type FieldErrors = Partial<Record<string, string>>;

const FIELDS = ["name", "email", "phone", "projectType", "projectGoal"] as const;

function startErrorFor(code?: string): string {
  switch (code) {
    case "rate_limited":
      return "That's a few enquiries in a short time — give it a few minutes and try again.";
    case "invalid":
      return "Some details didn't pass our checks — see the notes below.";
    case "mailer_unavailable":
    case "verification_unavailable":
    case "storage_unavailable":
      return `We can't take enquiries through the form right now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`;
    default:
      return `Couldn't send just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`;
  }
}

export function ContactForm() {
  const panel = useReveal<HTMLDivElement>({ threshold: 0.12 });
  const uid = useId();
  const [phase, setPhase] = useState<Phase>("form");
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const formRef = useRef<HTMLFormElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  /* one ticker for the resend countdown — no timer per render */
  useEffect(() => {
    if (phase !== "verify" && phase !== "checking") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  /* move focus with the step, so a keyboard user is never left behind */
  useEffect(() => {
    if (phase === "verify") codeRef.current?.focus();
    if (phase === "done") headingRef.current?.focus();
  }, [phase]);

  const waitLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (phase === "sending") return;
      const data = new FormData(event.currentTarget);
      const chosen = String(data.get("projectType") ?? "");
      setPhase("sending");
      setError(null);
      setNotice(null);
      setFieldErrors({});

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone"),
            // the server classifies this; "Something else" sends the words
            projectType: chosen === OTHER ? String(data.get("otherType") ?? "") : chosen,
            projectGoal: data.get("projectGoal"),
            additionalMessage: data.get("additionalMessage") ?? "",
            source: "contact-section",
            page: typeof window !== "undefined" ? window.location.pathname : "",
            referrer: typeof document !== "undefined" ? document.referrer : "",
          }),
        });
        const payload: {
          error?: string;
          fields?: FieldErrors;
          verificationId?: string;
          email?: string;
        } = await response.json().catch(() => ({}));

        if (response.ok && payload.verificationId) {
          setVerificationId(payload.verificationId);
          setSentTo(payload.email ?? String(data.get("email") ?? ""));
          setAttemptsLeft(null);
          setCode("");
          setResendAt(Date.now() + RESEND_COOLDOWN_MS);
          setNow(Date.now());
          setPhase("verify");
          return;
        }
        if (payload.fields) setFieldErrors(payload.fields);
        setPhase("form");
        setError(startErrorFor(payload.error));
      } catch {
        setPhase("form");
        setError(`Couldn't send just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
      }
    },
    [phase]
  );

  const check = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!verificationId || phase === "checking") return;
      setPhase("checking");
      setError(null);
      setNotice(null);
      try {
        const response = await fetch("/api/leads/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verificationId, code }),
        });
        const payload: { error?: string; verified?: boolean; attemptsLeft?: number } =
          await response.json().catch(() => ({}));

        if (response.ok && payload.verified) {
          setPhase("done");
          return;
        }
        setPhase("verify");
        setCode("");
        if (payload.error === "wrong_code") {
          setAttemptsLeft(payload.attemptsLeft ?? null);
          setError(
            payload.attemptsLeft
              ? `That code didn't match — ${payload.attemptsLeft} ${
                  payload.attemptsLeft === 1 ? "try" : "tries"
                } left.`
              : "That code didn't match."
          );
          return;
        }
        if (payload.error === "code_expired") {
          setError("That code has expired. Send a new one below.");
          return;
        }
        if (payload.error === "too_many_attempts") {
          setError(
            `Too many tries. Please start again, or email ${PRIMARY_ENQUIRY_EMAIL} directly.`
          );
          return;
        }
        if (payload.error === "already_verified") {
          setPhase("done");
          return;
        }
        setError(`Couldn't check that just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
      } catch {
        setPhase("verify");
        setError(`Couldn't check that just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
      }
    },
    [code, phase, verificationId]
  );

  const resend = useCallback(async () => {
    if (!verificationId || waitLeft > 0) return;
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/leads/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId }),
      });
      const payload: { error?: string; email?: string; retryAfter?: number } = await response
        .json()
        .catch(() => ({}));

      if (response.ok) {
        setResendAt(Date.now() + RESEND_COOLDOWN_MS);
        setNow(Date.now());
        setAttemptsLeft(null);
        setCode("");
        setNotice(`A new code is on its way to ${payload.email ?? sentTo}.`);
        codeRef.current?.focus();
        return;
      }
      if (payload.error === "resend_cooldown" || payload.error === "rate_limited") {
        setResendAt(Date.now() + (payload.retryAfter ?? 60) * 1000);
        setNow(Date.now());
        setError("Give it a moment before asking for another code.");
        return;
      }
      if (payload.error === "resend_limit") {
        setError(
          `That's all the codes we can send for this enquiry. Please email ${PRIMARY_ENQUIRY_EMAIL}.`
        );
        return;
      }
      if (payload.error === "already_verified") {
        setPhase("done");
        return;
      }
      setError(`Couldn't send another code. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
    } catch {
      setError(`Couldn't send another code. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
    }
  }, [sentTo, verificationId, waitLeft]);

  const err = (field: string) =>
    fieldErrors[field] ? (
      <p className="cf-err" id={`${uid}-${field}-err`}>
        {fieldErrors[field]}
      </p>
    ) : null;
  const described = (field: string) =>
    fieldErrors[field] ? `${uid}-${field}-err` : undefined;

  return (
    /* Three elements, because a 3D panel needs three jobs kept apart:
       .cf-wrap owns the perspective, .cf-stage owns the rotation and the
       riser plate behind it, and .cf owns the glass. They cannot be merged —
       backdrop-filter creates its own stacking context, so a riser drawn as
       a pseudo-element on the glass itself is trapped behind that glass and
       never seen. */
    <div
      ref={panel.ref}
      id="enquiry"
      className={`cf-wrap ${panel.revealed ? "animate-reveal-up" : "opacity-0"}`}
    >
      <div className="cf-stage">
        <div className="cf">
        {/* ---------------- step 1: the details ---------------- */}
        {(phase === "form" || phase === "sending") && (
          <form ref={formRef} className="cf-form" onSubmit={submit} noValidate={false}>
            <div className="cf-row">
              <div className="cf-field">
                <label htmlFor={`${uid}-name`}>Your name</label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  required
                  maxLength={LEAD_LIMITS.name}
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={described("name")}
                  placeholder="Abdul Rehman"
                />
                {err("name")}
              </div>
              <div className="cf-field">
                <label htmlFor={`${uid}-email`}>Email</label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  required
                  maxLength={LEAD_LIMITS.email}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={described("email")}
                  placeholder="you@company.com"
                />
                {err("email")}
              </div>
            </div>

            <div className="cf-row">
              <div className="cf-field">
                <label htmlFor={`${uid}-phone`}>Phone</label>
                <input
                  id={`${uid}-phone`}
                  name="phone"
                  type="tel"
                  required
                  maxLength={LEAD_LIMITS.phone}
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={described("phone")}
                  placeholder="+92 322 1690030"
                />
                {err("phone")}
              </div>
              <div className="cf-field">
                <label htmlFor={`${uid}-type`}>Project type</label>
                <select
                  id={`${uid}-type`}
                  name="projectType"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.projectType)}
                  aria-describedby={described("projectType")}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {PROJECT_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value={OTHER}>{OTHER}</option>
                </select>
                {err("projectType")}
              </div>
            </div>

            {type === OTHER && (
              <div className="cf-field">
                <label htmlFor={`${uid}-other`}>What do you have in mind?</label>
                <input
                  id={`${uid}-other`}
                  name="otherType"
                  type="text"
                  required
                  maxLength={LEAD_LIMITS.projectType}
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  placeholder="A few words is plenty"
                />
              </div>
            )}

            <div className="cf-field">
              <label htmlFor={`${uid}-goal`}>What&rsquo;s the goal?</label>
              <textarea
                id={`${uid}-goal`}
                name="projectGoal"
                required
                rows={3}
                maxLength={LEAD_LIMITS.projectGoal}
                aria-invalid={Boolean(fieldErrors.projectGoal)}
                aria-describedby={described("projectGoal")}
                placeholder="What should it do, and who is it for?"
              />
              {err("projectGoal")}
            </div>

            <div className="cf-field">
              <label htmlFor={`${uid}-notes`}>
                Anything else <span className="cf-opt">optional</span>
              </label>
              <textarea
                id={`${uid}-notes`}
                name="additionalMessage"
                rows={2}
                maxLength={LEAD_LIMITS.additionalMessage}
                placeholder="Timeline, budget range, links — whatever helps"
              />
            </div>

            {error && (
              <p className="cf-alert" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="cf-send" disabled={phase === "sending"}>
              {phase === "sending" ? "Sending…" : "Send enquiry"}
              <span aria-hidden>&rarr;</span>
            </button>
            <p className="cf-fine">
              I&rsquo;ll only use these details to reply to this enquiry. Prefer email?{" "}
              <a href={PRIMARY_ENQUIRY_HREF}>{PRIMARY_ENQUIRY_EMAIL}</a>
            </p>
          </form>
        )}

        {/* ---------------- step 2: prove the inbox ---------------- */}
        {(phase === "verify" || phase === "checking") && (
          <form className="cf-form cf-verify" onSubmit={check}>
            <p className="cf-step">Step 2 of 2</p>
            <h4 className="cf-vh">Check your inbox</h4>
            <p className="cf-sub">
              I sent a {CODE_LENGTH}-digit code to <strong>{sentTo}</strong>. Pop it in below
              and your enquiry is on its way.
            </p>

            <div className="cf-field">
              <label htmlFor={`${uid}-code`}>Verification code</label>
              <input
                ref={codeRef}
                id={`${uid}-code`}
                name="code"
                className="cf-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                aria-describedby={`${uid}-code-help`}
                placeholder="000000"
              />
              <p className="cf-fine" id={`${uid}-code-help`}>
                {attemptsLeft !== null
                  ? `${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left.`
                  : "The code expires shortly after it is sent."}
              </p>
            </div>

            {error && (
              <p className="cf-alert" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="cf-notice" role="status">
                {notice}
              </p>
            )}

            <div className="cf-actions">
              <button
                type="submit"
                className="cf-send"
                disabled={phase === "checking" || code.length !== CODE_LENGTH}
              >
                {phase === "checking" ? "Checking…" : "Confirm"}
                <span aria-hidden>&rarr;</span>
              </button>
              <button type="button" className="cf-ghost" onClick={resend} disabled={waitLeft > 0}>
                {waitLeft > 0 ? `Resend in ${waitLeft}s` : "Send a new code"}
              </button>
            </div>
          </form>
        )}

        {/* ---------------- done ---------------- */}
        {phase === "done" && (
          <div className="cf-done">
            <span className="cf-tick" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 12.5 5.5 5.5L20 7" />
              </svg>
            </span>
            <p className="cf-step" ref={headingRef} tabIndex={-1}>
              Enquiry confirmed
            </p>
            <h4 className="cf-vh">Thank you — it&rsquo;s with me.</h4>
            <p className="cf-sub">
              Your address is confirmed and the enquiry has landed. I&rsquo;ll read it myself
              and reply to <strong>{sentTo}</strong>.
            </p>
            <p className="cf-alt">
              Something to add? <a href={PRIMARY_ENQUIRY_HREF}>{PRIMARY_ENQUIRY_EMAIL}</a>
            </p>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {phase === "verify"
            ? `A code was sent to ${sentTo}. Enter it to confirm your enquiry.`
            : phase === "done"
              ? "Your enquiry is confirmed."
              : ""}
        </p>
        </div>
      </div>
    </div>
  );
}
