"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CHAT_ASSISTANT,
  CHAT_INTRO,
  CHAT_STEPS,
  CHAT_VERIFIED,
  CHAT_VERIFY_INTRO,
  CHAT_VERIFY_PROMPT,
  isLikelyEmail,
  validate,
  type ChatStep,
} from "@/lib/chat-flow";
import { ChatIcon } from "./icons";
import { PRIMARY_ENQUIRY_EMAIL, PRIMARY_ENQUIRY_HREF } from "@/lib/contact";

/**
 * STEP 10 — customer chat widget, UI ONLY.
 *
 * What this is: the launcher, the panel and the conversation
 * experience — typing indicator, quick replies, message animation,
 * progress, back, minimise/close, mobile sheet.
 *
 * What this is NOT: a lead pipeline. `onComplete` is a stub. Nothing
 * is stored, nothing is sent, no endpoint, no keys. Client-side
 * validation here only checks the *shape* of an answer; per the brief
 * a lead is not VERIFIED until the address is proven by a single-use,
 * time-limited, rate-limited OTP checked on the server. Whoever wires
 * the backend must treat anything from this widget as unverified.
 *
 * No claim is made anywhere in the copy that this is an AI, a bot, or
 * anything other than a short form with a conversational shape.
 *
 * State model: `answers` is the single source of truth and the message
 * list is derived from it, so "back" is just popping an answer — there
 * is no transcript to keep in sync with the step pointer.
 */

type Answer = { id: ChatStep["id"]; value: string };
type Phase =
  | "asking"
  | "review"
  | "sending"
  /** code sent, waiting for the visitor to type it */
  | "verify"
  /** a code is in flight to the server */
  | "verifying"
  | "verified";

/**
 * How long "Alex is typing" lasts. Proportional to the message, because a
 * fixed beat makes a one-line question feel laboured and a four-line welcome
 * feel like it teleported. Floored and capped so it never becomes a wait.
 */
function typingTimeFor(text: string): number {
  return Math.min(1100, Math.max(420, 260 + text.length * 9));
}

const RESEND_COOLDOWN_MS = 60_000;

/** Server error codes turned into something a visitor can act on. */
function startErrorFor(code?: string): string {
  switch (code) {
    case "rate_limited":
      return "That's a few enquiries in a short time — give it a few minutes and try again.";
    case "invalid":
      return "Something in the details didn't pass our checks — mind stepping back and looking them over?";
    case "mailer_unavailable":
    case "verification_unavailable":
    case "storage_unavailable":
      return `We can't take enquiries through the chat right now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`;
    default:
      return `Couldn't send just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`;
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [announced, setAnnounced] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [freeText, setFreeText] = useState(false);
  const [phase, setPhase] = useState<Phase>("asking");
  const [confirmClear, setConfirmClear] = useState(false);

  /* ---- verification (Step 12) ---- */
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [resendAt, setResendAt] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [dead, setDead] = useState(false);
  /** Bumped on every rejected code so the field can shake once per attempt. */
  const [shake, setShake] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  /** Set whenever the panel is dismissed, so focus can go back where it came from. */
  const returnFocus = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const stepIndex = answers.length;
  const step: ChatStep | undefined = CHAT_STEPS[stepIndex];
  const total = CHAT_STEPS.length;
  const started = answers.length > 0 || input.trim().length > 0;

  const answerFor = useCallback(
    (id: ChatStep["id"]) => answers.find((a) => a.id === id)?.value ?? "",
    [answers]
  );

  /* ---- reveal the next prompt after a short "typing" beat ---- */
  useEffect(() => {
    if (!open || announced) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAnnounced(true);
      return;
    }
    setTyping(true);
    const next =
      phase === "asking" ? (CHAT_STEPS[stepIndex]?.prompt ?? "") : CHAT_VERIFY_INTRO;
    const t = window.setTimeout(() => {
      setTyping(false);
      setAnnounced(true);
    }, typingTimeFor(next));
    return () => window.clearTimeout(t);
  }, [open, announced, phase, stepIndex]);

  /* ---- resend cooldown ticker ---- */
  useEffect(() => {
    if (!resendAt) return;
    const tick = () => setCooldown(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [resendAt]);

  /* ---- keep the newest message in view ---- */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    /* `error` is in here on purpose: showing a validation line grows the
       composer, which would otherwise leave the newest message hidden
       behind it. */
  }, [answers, announced, typing, phase, open, error, notice, changingEmail]);

  /* ---- move focus into the panel as each step arrives, so the whole
         conversation is answerable from the keyboard ---- */
  useEffect(() => {
    if (open && announced && phase === "verify" && !changingEmail) {
      codeRef.current?.focus();
    }
  }, [open, announced, phase, changingEmail]);

  useEffect(() => {
    if (!open || !announced || phase !== "asking" || !step) return;
    if (step.kind !== "choice" || freeText) {
      inputRef.current?.focus();
    } else {
      composerRef.current?.querySelector("button")?.focus();
    }
  }, [open, announced, phase, step, freeText]);

  /* ---- Escape minimises ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmClear(false);
        returnFocus.current = true;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ---- put focus back on the launcher when the panel closes ----
     Without this a keyboard user is dropped at the top of the document and
     has to tab the whole page again to get back to where they were. */
  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    launcherRef.current?.focus();
  }, [open]);

  const commit = useCallback(
    (value: string) => {
      if (!step) return;
      const problem = validate(step, value);
      if (problem) {
        setError(problem);
        return;
      }
      setError(null);
      setInput("");
      setFreeText(false);
      setAnnounced(false);
      setAnswers((prev) => [...prev, { id: step.id, value: value.trim() }]);
      if (stepIndex + 1 >= total) setPhase("review");
    },
    [step, stepIndex, total]
  );

  const goBack = useCallback(() => {
    setError(null);
    setFreeText(false);
    setConfirmClear(false);
    if (phase !== "asking") {
      setPhase("asking");
      setAnnounced(true);
    }
    setAnswers((prev) => {
      const next = prev.slice(0, -1);
      setInput(prev[prev.length - 1]?.value ?? "");
      return next;
    });
    setAnnounced(true);
  }, [phase]);

  const reset = useCallback(() => {
    setAnswers([]);
    setInput("");
    setError(null);
    setFreeText(false);
    setPhase("asking");
    setAnnounced(false);
    setConfirmClear(false);
    setVerificationId(null);
    setVerifyEmail("");
    setCode("");
    setAttemptsLeft(null);
    setResendAt(0);
    setChangingEmail(false);
    setEmailDraft("");
    setNotice(null);
    setDead(false);
  }, []);

  /**
   * Start the enquiry: POST the answers, get a verification handle back.
   *
   * A 202 means the server stored a PENDING lead and emailed a code. It does
   * NOT mean the enquiry is done — `emailVerified` is still false and stays
   * false until /api/leads/verify accepts the code. That is the whole point
   * of this step, so the UI must not celebrate here.
   */
  const onComplete = useCallback(async () => {
    setPhase("sending");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answerFor("name"),
          email: answerFor("email"),
          phone: answerFor("phone"),
          projectType: answerFor("build"),
          projectGoal: answerFor("goal"),
          additionalMessage: answerFor("notes"),
          source: "chat-widget",
          page: typeof window !== "undefined" ? window.location.pathname : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });

      const payload: {
        error?: string;
        verificationId?: string;
        email?: string;
      } = await response.json().catch(() => ({}));

      if (response.ok && payload.verificationId) {
        setVerificationId(payload.verificationId);
        setVerifyEmail(payload.email ?? answerFor("email"));
        setAttemptsLeft(null);
        setResendAt(Date.now() + RESEND_COOLDOWN_MS);
        setAnnounced(false);
        setPhase("verify");
        return;
      }

      setPhase("review");
      setError(startErrorFor(payload.error));
    } catch {
      setPhase("review");
      setError(`Couldn't send just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
    }
  }, [answerFor]);

  /** Submit a typed code. Every outcome is decided by the server. */
  const submitCode = useCallback(async () => {
    if (!verificationId) return;
    const cleaned = code.replace(/\D/g, "");
    if (cleaned.length !== 6) {
      setError("The code is six digits.");
      return;
    }
    setPhase("verifying");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/leads/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, code: cleaned }),
      });
      const payload: { error?: string; attemptsLeft?: number } = await response
        .json()
        .catch(() => ({}));

      if (response.ok) {
        setCode("");
        setAnnounced(false);
        setPhase("verified");
        return;
      }

      setPhase("verify");
      setShake((n) => n + 1);
      if (payload.error === "wrong_code") {
        setAttemptsLeft(payload.attemptsLeft ?? null);
        setError(
          payload.attemptsLeft === 0
            ? "That's the last attempt used. Send a new code to try again."
            : `That code doesn't match.${
                payload.attemptsLeft ? ` ${payload.attemptsLeft} attempts left.` : ""
              }`
        );
        return;
      }
      if (payload.error === "code_expired") {
        setDead(true);
        setError("That code has expired. Send a new one and I'll wait.");
        return;
      }
      if (payload.error === "too_many_attempts") {
        setDead(true);
        setError("Too many attempts on that code. Send a new one to carry on.");
        return;
      }
      if (payload.error === "already_verified") {
        setPhase("verified");
        return;
      }
      setError(`Couldn't check that just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
    } catch {
      setPhase("verify");
      setError(`Couldn't check that just now. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
    }
  }, [verificationId, code]);

  /**
   * Send a new code. With `nextEmail` this is "change email"; without it,
   * "resend". One request either way — the server treats them as the same
   * operation, so the client does too.
   */
  const resendCode = useCallback(
    async (nextEmail?: string) => {
      if (!verificationId) return;
      setError(null);
      setNotice(null);
      try {
        const response = await fetch("/api/leads/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            nextEmail ? { verificationId, email: nextEmail } : { verificationId }
          ),
        });
        const payload: { error?: string; email?: string; retryAfter?: number } =
          await response.json().catch(() => ({}));

        if (response.ok) {
          setVerifyEmail(payload.email ?? nextEmail ?? verifyEmail);
          setCode("");
          setAttemptsLeft(null);
          setDead(false);
          setChangingEmail(false);
          setEmailDraft("");
          setResendAt(Date.now() + RESEND_COOLDOWN_MS);
          setNotice(
            nextEmail ? `New code sent to ${nextEmail}.` : "New code sent — check your inbox."
          );
          return;
        }

        if (payload.error === "resend_cooldown") {
          setResendAt(Date.now() + (payload.retryAfter ?? 60) * 1000);
          setError("Give it a moment before asking for another code.");
          return;
        }
        if (payload.error === "resend_limit") {
          setError(
            `That's the last new code I can send. Please email ${PRIMARY_ENQUIRY_EMAIL} instead.`
          );
          return;
        }
        if (payload.error === "invalid") {
          setError("That doesn't look like an email address.");
          return;
        }
        if (payload.error === "already_verified") {
          setPhase("verified");
          return;
        }
        setError(`Couldn't send a new code. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
      } catch {
        setError(`Couldn't send a new code. Please email ${PRIMARY_ENQUIRY_EMAIL}.`);
      }
    },
    [verificationId, verifyEmail]
  );

  const progress = phase === "asking" ? stepIndex : total;

  /**
   * Identifies WHICH control set the composer is showing, so the crossfade
   * fires when it genuinely swaps — quick replies to a text field, field to
   * code entry — and not on every keystroke, which would flicker.
   */
  const composerKey = [
    phase,
    step?.id ?? "-",
    freeText ? "free" : "",
    changingEmail ? "email" : "",
  ].join(":");

  const transcript = useMemo(() => {
    const rows: {
      key: string;
      from: "bot" | "user";
      text: string;
      muted?: boolean;
    }[] = [
      { key: "intro", from: "bot", text: CHAT_INTRO },
    ];
    answers.forEach((a, i) => {
      rows.push({ key: `q-${a.id}`, from: "bot", text: CHAT_STEPS[i].prompt });
      rows.push({
        key: `a-${a.id}`,
        from: "user",
        text: a.value || "Skipped",
        muted: !a.value,
      });
    });
    if (phase === "asking" && step && announced) {
      rows.push({ key: `q-${step.id}`, from: "bot", text: step.prompt });
      if (freeText && step.freeTextPrompt) {
        rows.push({ key: `q-${step.id}-free`, from: "bot", text: step.freeTextPrompt });
      }
    }
    if ((phase === "verify" || phase === "verifying" || phase === "verified") && announced) {
      rows.push({ key: "verify-intro", from: "bot", text: CHAT_VERIFY_INTRO });
      rows.push({ key: "verify-prompt", from: "bot", text: CHAT_VERIFY_PROMPT });
    }
    if (phase === "verified" && announced) {
      rows.push({ key: "verified", from: "bot", text: CHAT_VERIFIED });
    }
    return rows;
  }, [answers, phase, step, announced, freeText]);

  return (
    <>
      <Launcher
        open={open}
        onOpen={() => setOpen(true)}
        buttonRef={launcherRef}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="Project enquiry"
        aria-describedby="chat-status"
        aria-hidden={!open}
        data-open={open}
        className={`chat-panel fixed z-50 flex flex-col overflow-hidden bg-paper-0 shadow-lg ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* ---------------- header ---------------- */}
        <header className="relative shrink-0 bg-ink-950 px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-ink-800 font-display text-body font-bold text-accent-mint ring-1 ring-ink-700"
                aria-hidden
              >
                {CHAT_ASSISTANT.initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-body font-semibold tracking-tight text-paper-0">
                  {CHAT_ASSISTANT.name}
                </p>
                <p className="mt-0.5 truncate font-mono text-micro tracking-widest text-ink-300">
                  OXVID SYSTEMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <HeaderButton
                label="Minimise"
                onClick={() => {
                  setConfirmClear(false);
                  returnFocus.current = true;
                  setOpen(false);
                }}
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <path d="M3.5 8.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </HeaderButton>
              <HeaderButton
                label="Close and clear"
                onClick={() => {
                  if (started) {
                    setConfirmClear(true);
                    return;
                  }
                  returnFocus.current = true;
                  setOpen(false);
                }}
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </HeaderButton>
            </div>
          </div>

          {/*
            The progress bar is `aria-hidden` because six coloured slivers
            say nothing out loud. This says it instead — politely, so it
            never interrupts someone mid-sentence.
          */}
          <p id="chat-status" className="sr-only" role="status" aria-live="polite">
            {phase === "asking"
              ? `Question ${Math.min(stepIndex + 1, total)} of ${total}`
              : phase === "review"
                ? "Review your answers before sending"
                : phase === "sending"
                  ? "Sending"
                  : phase === "verify" || phase === "verifying"
                    ? `Verifying ${verifyEmail}`
                    : "Email verified"}
          </p>

          {/* progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-1 gap-1" aria-hidden>
              {CHAT_STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`chat-progress-seg h-[3px] flex-1 ${
                    i < progress ? "bg-accent-mint" : "bg-ink-800"
                  }`}
                />
              ))}
            </div>
            <p className="font-mono text-micro tracking-widest text-ink-300">
              {phase === "asking"
                ? `${Math.min(stepIndex + 1, total)} / ${total}`
                : phase === "sending"
                  ? "SENDING"
                  : phase === "verify" || phase === "verifying"
                    ? "VERIFY EMAIL"
                    : phase === "verified"
                      ? "VERIFIED"
                      : "REVIEW"}
            </p>
          </div>

          {confirmClear && (
            <div className="chat-msg mt-4 flex items-center justify-between gap-3 rounded-md border border-ink-700 bg-ink-900 px-3 py-2">
              <p className="text-small text-ink-100">Clear this conversation?</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    returnFocus.current = true;
                    setOpen(false);
                  }}
                  className="font-mono text-micro tracking-widest text-accent-mint underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="font-mono text-micro tracking-widest text-ink-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ---------------- transcript ---------------- */}
        {/*
          `data-chat-log` is a stable hook, not decoration: the preview build
          re-drives this markup with vanilla JS, and selecting the transcript
          by `[aria-live]` broke the moment a second live region (the
          screen-reader status line above) was added to the panel. A named
          attribute cannot be stolen that way.
        */}
        <div
          ref={listRef}
          data-chat-log
          className="flex flex-1 flex-col overflow-y-auto bg-paper-50 px-5 py-5"
          aria-live="polite"
        >
          <div className="mt-auto space-y-3">
          {transcript.map((m) =>
            m.from === "bot" ? (
              <BotBubble key={m.key} text={m.text} />
            ) : (
              <UserBubble key={m.key} text={m.text} muted={m.muted} />
            )
          )}

          {typing && <TypingBubble />}

          {(phase === "review" || phase === "sending") && announced && (
            <Review answers={answers} onEdit={goBack} />
          )}

          {notice && (phase === "verify" || phase === "verifying") && (
            <p className="chat-msg rounded-md border border-accent-mint bg-paper-0 px-3.5 py-2.5 text-small text-accent-teal-dark">
              {notice}
            </p>
          )}

          {phase === "verified" && <Verified email={verifyEmail} onReset={reset} />}
          </div>
        </div>

        {/* ---------------- composer ---------------- */}
        {phase !== "verified" && (
          <div
            ref={composerRef}
            className="chat-composer shrink-0 border-t border-paper-200 bg-paper-0 px-5 pt-3"
          >
            {error && (
              <p className="chat-alert mb-2 text-small text-signal-error" role="alert">
                {error}
              </p>
            )}
            <div key={composerKey} className="chat-composer-body">

            {phase === "verify" || phase === "verifying" ? (
              changingEmail ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    const candidate = emailDraft.trim().toLowerCase();
                    if (!isLikelyEmail(candidate)) {
                      setError("That doesn't look like an email address.");
                      return;
                    }
                    void resendCode(candidate);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    autoFocus
                    value={emailDraft}
                    onChange={(e) => {
                      setEmailDraft(e.target.value);
                      if (error) setError(null);
                    }}
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-label="New email address"
                    className="chat-field min-w-0 flex-1 rounded-sm border border-paper-300 bg-paper-0 px-3 py-2 text-small text-ink-900 placeholder:text-paper-400"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md bg-ink-900 px-3 py-2 font-mono text-micro tracking-widest text-paper-0 transition-colors duration-fast hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                  >
                    SEND CODE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangingEmail(false);
                      setEmailDraft("");
                      setError(null);
                    }}
                    className="shrink-0 rounded-md px-2 py-2 font-mono text-micro tracking-widest text-ink-500 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                  >
                    CANCEL
                  </button>
                </form>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate font-mono text-micro tracking-widest text-ink-400">
                      SENT TO <span className="text-ink-700">{verifyEmail.toUpperCase()}</span>
                    </p>
                    {attemptsLeft !== null && attemptsLeft > 0 && (
                      <p className="shrink-0 font-mono text-micro tracking-widest text-signal-error">
                        {attemptsLeft} LEFT
                      </p>
                    )}
                  </div>

                  <form
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      void submitCode();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={codeRef}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (error) setError(null);
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="000000"
                      aria-label="6-digit verification code"
                      disabled={phase === "verifying" || dead}
                      className={`chat-field chat-code min-w-0 flex-1 rounded-sm border border-paper-300 bg-paper-0 px-3 py-2 text-center font-mono text-body tracking-[0.5em] text-ink-900 placeholder:tracking-[0.5em] placeholder:text-paper-400 disabled:bg-paper-100 ${shake ? "chat-shake" : ""}`}
                      key={`code-${shake}`}
                      data-filled={code.length === 6 ? "true" : "false"}
                    />
                    <button
                      type="submit"
                      disabled={phase === "verifying" || dead || code.length !== 6}
                      aria-busy={phase === "verifying"}
                      className={`shrink-0 rounded-md px-4 py-2 font-mono text-micro tracking-widest text-paper-0 transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal disabled:cursor-not-allowed disabled:opacity-50 ${
                        code.length === 6 && phase !== "verifying"
                          ? "bg-accent-teal-dark hover:bg-accent-teal"
                          : "bg-ink-900 hover:bg-ink-700"
                      }`}
                    >
                      {phase === "verifying" ? "CHECKING\u2026" : "VERIFY"}
                    </button>
                  </form>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <button
                      type="button"
                      onClick={() => void resendCode()}
                      disabled={cooldown > 0}
                      className="font-mono text-micro tracking-widest text-ink-500 underline underline-offset-4 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                    >
                      {cooldown > 0 ? `RESEND IN ${cooldown}S` : "RESEND CODE"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangingEmail(true);
                        setEmailDraft(verifyEmail);
                        setError(null);
                      }}
                      className="font-mono text-micro tracking-widest text-ink-500 underline underline-offset-4 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                    >
                      CHANGE EMAIL
                    </button>
                  </div>
                </div>
              )
            ) : phase === "review" || phase === "sending" ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={phase === "sending"}
                  aria-busy={phase === "sending"}
                  className="flex-1 rounded-md bg-ink-900 px-4 py-3 font-mono text-micro tracking-widest text-paper-0 transition-all duration-fast hover:-translate-y-0.5 hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {phase === "sending" ? "SENDING\u2026" : "SEND ENQUIRY"}
                </button>
                {phase !== "sending" && <BackButton onClick={goBack} />}
              </div>
            ) : step && announced ? (
              step.kind === "choice" && !freeText ? (
                <div className="flex flex-wrap gap-2">
                  {step.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (option === step.freeTextOption) {
                          setFreeText(true);
                          setError(null);
                          return;
                        }
                        commit(option);
                      }}
                      className="chat-chip rounded-md border border-paper-300 px-3 py-2 text-small text-ink-700 hover:border-accent-teal hover:text-accent-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                    >
                      {option}
                    </button>
                  ))}
                  {stepIndex > 0 && <BackButton onClick={goBack} />}
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    commit(input);
                  }}
                  className="flex items-center gap-2"
                >
                  {stepIndex > 0 && <BackButton onClick={goBack} />}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (error) setError(null);
                    }}
                    type={step.kind === "email" ? "email" : step.kind === "tel" ? "tel" : "text"}
                    inputMode={step.kind === "tel" ? "tel" : undefined}
                    autoComplete={
                      step.id === "name"
                        ? "name"
                        : step.kind === "email"
                          ? "email"
                          : step.kind === "tel"
                            ? "tel"
                            : "off"
                    }
                    placeholder={step.placeholder}
                    aria-label={step.prompt}
                    className="chat-field min-w-0 flex-1 rounded-sm border border-paper-300 bg-paper-0 px-3 py-2 text-small text-ink-900 placeholder:text-paper-400"
                  />
                  {step.optional && !input.trim() ? (
                    <button
                      type="button"
                      onClick={() => commit("")}
                      className="shrink-0 rounded-md px-3 py-2 font-mono text-micro tracking-widest text-ink-500 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                    >
                      SKIP
                    </button>
                  ) : (
                    <button
                      type="submit"
                      aria-label="Send"
                      className="shrink-0 rounded-md bg-ink-900 px-3 py-2 text-paper-0 transition-all duration-fast hover:-translate-y-0.5 hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                        <path
                          d="M3 8h9M8.5 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </button>
                  )}
                </form>
              )
            ) : (
              <div className="h-[42px]" aria-hidden />
            )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Keeps the launcher off the reader's content.
 *
 * Two reasons to get out of the way, and neither is a timer:
 *
 *  1. THEY ARE READING DOWNWARDS. A fixed button parked over the bottom-right
 *     corner sits on top of the page for the entire visit, and on a phone
 *     that corner is where text ends up. It slides out while the reader
 *     scrolls down and comes back the moment they stop or scroll up — the
 *     same instant they might want it.
 *
 *  2. THEY ARE IN THE CONTACT SECTION. That section already carries every
 *     phone number and address; a floating "let's talk" button on top of it
 *     is noise arguing with the page.
 *
 * It never disappears outright — it translates, so it cannot blink.
 */
function useLauncherTuck(open: boolean): boolean {
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    if (open) return;

    let lastY = window.scrollY;
    let inZone = false;
    let scrollingDown = false;
    let idle = 0;

    const apply = () => setTucked(inZone || scrollingDown);

    const onScroll = () => {
      const y = window.scrollY;
      // Ignore jitter and the rubber-banding at the very top.
      if (Math.abs(y - lastY) > 6 && y > 120) {
        scrollingDown = y > lastY;
        lastY = y;
        apply();
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        scrollingDown = false;
        apply();
      }, 550);
    };

    // Any region that declares `data-chat-clear` owns its own corner while
    // it is on screen. Contact carries every phone number and address, so a
    // floating "let's talk" on top of it is noise; the Work gallery is
    // pinned, and its own "view live site" button sat directly underneath
    // this launcher at 320px for the entire length of that pin — measured,
    // not guessed. A pinned section cannot be scrolled out from under a
    // floating control, so the control has to yield.
    // `[data-chat-clear]` is honoured at every width. `[data-chat-clear-narrow]`
    // is honoured only below `sm`, which is exactly where the Hero's call to
    // action goes full width and lands in this corner. Step 17 narrowed this
    // from `lg`: at 834px the CTA is already auto-width and sits on the left,
    // so there was nothing to avoid — the launcher was simply unavailable for
    // the whole Hero on every tablet, which the Step 14 suite caught by
    // timing out trying to click it.
    const narrow = window.matchMedia("(max-width: 39.999rem)");
    const zones = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-chat-clear], [data-chat-clear-narrow]"
      )
    );
    const intersecting = new Set<Element>();

    const inClearZone = () => {
      for (const zone of intersecting) {
        if (zone.hasAttribute("data-chat-clear")) return true;
        if (narrow.matches && zone.hasAttribute("data-chat-clear-narrow")) {
          return true;
        }
      }
      return false;
    };

    // NOT a threshold. A threshold is a ratio of the *element*, and the Work
    // gallery is 4487px tall against a 568px viewport — it can never exceed
    // 12.6% intersection, so `threshold: 0.15` never fired and the launcher
    // sat on that section's own "view live site" button for the whole pin.
    // A negative rootMargin asks the right question instead: is this region
    // occupying the middle half of the screen?
    const io = zones.length
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) intersecting.add(entry.target);
              else intersecting.delete(entry.target);
            }
            inZone = inClearZone();
            apply();
          },
          { rootMargin: "-25% 0px -25% 0px", threshold: 0 }
        )
      : null;
    if (io) for (const zone of zones) io.observe(zone);

    const onMedia = () => {
      inZone = inClearZone();
      apply();
    };
    narrow.addEventListener("change", onMedia);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      narrow.removeEventListener("change", onMedia);
      io?.disconnect();
    };
  }, [open]);

  // A hidden launcher while the panel is open is handled by its own classes;
  // don't let a stale tuck survive the panel closing.
  return open ? false : tucked;
}

function Launcher({
  open,
  onOpen,
  buttonRef,
}: {
  open: boolean;
  onOpen: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const tucked = useLauncherTuck(open);

  return (
    <button
      ref={buttonRef}
      type="button"
      data-tucked={tucked ? "true" : "false"}
      onClick={onOpen}
      aria-expanded={open}
      aria-label="Let’s talk — start a project enquiry"
      className={`chat-launcher group fixed bottom-5 right-5 z-50 flex items-center justify-center gap-3 rounded-lg bg-ink-950 px-4 py-3 text-paper-0 shadow-lg transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 ${
        open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
    >
      <span className="chat-launcher-ring" aria-hidden />
      <ChatIcon className="relative h-5 w-5 sm:h-[18px] sm:w-[18px]" />
      <span className="relative hidden font-mono text-micro tracking-widest sm:block">
        LET&rsquo;S TALK
      </span>
    </button>
  );
}

function HeaderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-300 transition-colors duration-fast hover:bg-ink-800 hover:text-paper-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
    >
      {children}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md border border-paper-300 px-3 py-2 font-mono text-micro tracking-widest text-ink-500 transition-colors duration-fast hover:border-ink-300 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
    >
      BACK
    </button>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="chat-msg flex items-start gap-2.5">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-ink-900 font-display text-small font-bold text-accent-mint"
        aria-hidden
      >
        {CHAT_ASSISTANT.initial}
      </span>
      <p className="max-w-[80%] whitespace-pre-line rounded-md border border-paper-200 bg-paper-0 px-3.5 py-2.5 text-small leading-normal text-ink-800">
        {text}
      </p>
    </div>
  );
}

function UserBubble({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <div className="chat-msg flex justify-end">
      <p
        className={`max-w-[80%] break-words rounded-md px-3.5 py-2.5 text-small leading-normal ${
          muted
            ? "border border-paper-300 bg-paper-0 italic text-ink-400"
            : "bg-ink-700 text-paper-0"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="chat-msg flex items-start gap-2.5" aria-label="Typing">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-ink-900 font-display text-small font-bold text-accent-mint"
        aria-hidden
      >
        {CHAT_ASSISTANT.initial}
      </span>
      <span className="flex items-center gap-1 rounded-md border border-paper-200 bg-paper-0 px-3.5 py-3">
        <i className="chat-dot" />
        <i className="chat-dot" />
        <i className="chat-dot" />
      </span>
    </div>
  );
}

function Review({ answers, onEdit }: { answers: Answer[]; onEdit: () => void }) {
  return (
    <div className="chat-msg rounded-md border border-paper-200 bg-paper-0 p-4">
      <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
        BEFORE YOU SEND
      </p>
      <dl className="mt-3 space-y-2.5">
        {CHAT_STEPS.map((s) => {
          const value = answers.find((a) => a.id === s.id)?.value;
          if (!value) return null;
          return (
            <div key={s.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
              <dt className="font-mono text-micro tracking-widest text-ink-400">
                {s.summaryLabel.toUpperCase()}
              </dt>
              <dd className="min-w-0 break-words text-small text-ink-800">{value}</dd>
            </div>
          );
        })}
      </dl>
      <button
        type="button"
        onClick={onEdit}
        className="mt-4 font-mono text-micro tracking-widest text-ink-500 underline underline-offset-4 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
      >
        EDIT LAST ANSWER
      </button>
    </div>
  );
}

function Verified({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="chat-msg rounded-md border border-paper-200 bg-paper-0 p-5 text-center">
      <span className="relative mx-auto block h-9 w-9" aria-hidden>
        <span className="chat-tick-glow" />
        <span className="chat-tick-badge relative flex h-9 w-9 items-center justify-center rounded-sm bg-accent-teal text-paper-0">
          <svg viewBox="0 0 20 20" className="h-4 w-4">
            <path
              className="chat-tick-path"
              pathLength={1}
              d="M4 10.5l4 4 8-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <p className="mt-4 text-body font-semibold tracking-tight text-ink-900">
        Email verified
      </p>
      {email && (
        <p className="mt-2 break-words text-small leading-normal text-ink-500">
          Confirmed as <span className="text-ink-800">{email}</span>. Abdul has
          your details.
        </p>
      )}
      <p className="mt-4 text-small text-ink-500">
        Prefer email?{" "}
        <a
          href={PRIMARY_ENQUIRY_HREF}
          className="text-accent-teal-dark underline underline-offset-4"
        >
          {PRIMARY_ENQUIRY_EMAIL}
        </a>
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 font-mono text-micro tracking-widest text-ink-400 underline underline-offset-4 transition-colors duration-fast hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
      >
        START ANOTHER
      </button>
    </div>
  );
}
