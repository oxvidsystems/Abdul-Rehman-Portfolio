/**
 * STEP 10 — the lead-capture conversation, as data.
 *
 * Prompts and quick-reply options are transcribed verbatim from the
 * client's brief. Keeping them here (rather than inline in the JSX)
 * means the wording, the order and the validation rules are one thing
 * to review, and the widget UI stays a rendering concern.
 *
 * ─────────────────────────────────────────────────────────────────
 * VALIDATION — read this before wiring the backend
 * ─────────────────────────────────────────────────────────────────
 * Everything below is CLIENT-SIDE ONLY, and it is only about *shape*:
 * "does this look like an email", "does this look like a phone
 * number". It exists to catch typos while someone is typing. It is
 * NOT security, and it is NOT verification.
 *
 * Per the project brief, a lead is only VERIFIED once the address has
 * been proven to belong to the person — a single-use, time-limited
 * OTP or verification link, rate-limited, checked on the server. Until
 * that exists, a submission from this widget is an UNVERIFIED enquiry
 * and must be stored and labelled as such. `isLikelyEmail` returning
 * true means nothing more than "worth sending a code to".
 *
 * There is deliberately no submit endpoint in this step: `onComplete`
 * in the widget is a stub. No storage, no network, no secrets.
 */

export type ChatStepKind = "choice" | "text" | "email" | "tel";

export type ChatStep = {
  id: "build" | "goal" | "name" | "email" | "phone" | "notes";
  kind: ChatStepKind;
  /** What the assistant says. Verbatim from the brief. */
  prompt: string;
  /** Short label used in the review summary. */
  summaryLabel: string;
  /** Quick-reply buttons, for `choice` steps. */
  options?: string[];
  /**
   * An option that means "none of these" — picking it swaps the quick
   * replies for a one-line text field instead of advancing, so the
   * answer carries real information rather than the word "other".
   */
  freeTextOption?: string;
  freeTextPrompt?: string;
  placeholder?: string;
  optional?: boolean;
};

/**
 * The assistant's name, as shown in the panel header and on every bot
 * avatar. Client-chosen (2026-08-28). Nothing in the copy claims Alex is
 * a person or an AI — the widget is a short guided form with a
 * conversational shape, and it says nothing either way.
 */
export const CHAT_ASSISTANT = { name: "Alex", initial: "A" } as const;

export const CHAT_INTRO =
  "Hi! \u{1F44B} Welcome to Oxvid Systems.\nI'd love to learn a little about your project and help you find the right solution.";

export const CHAT_STEPS: ChatStep[] = [
  {
    id: "build",
    kind: "choice",
    prompt: "What are you looking to build?",
    summaryLabel: "Project",
    options: [
      "Website",
      "E-commerce",
      "AI Automation",
      "Branding",
      "Content",
      "Something else",
    ],
    freeTextOption: "Something else",
    freeTextPrompt: "No problem — what do you have in mind?",
    placeholder: "A few words is plenty",
  },
  {
    id: "goal",
    kind: "text",
    prompt: "What's the main goal of your project?",
    summaryLabel: "Goal",
    placeholder: "e.g. more enquiries from search",
  },
  {
    id: "name",
    kind: "text",
    prompt: "Great. What's your name?",
    summaryLabel: "Name",
    placeholder: "Your name",
  },
  {
    id: "email",
    kind: "email",
    prompt: "What's the best email to reach you?",
    summaryLabel: "Email",
    placeholder: "you@company.com",
  },
  {
    id: "phone",
    kind: "tel",
    prompt: "What's your phone number?",
    summaryLabel: "Phone",
    placeholder: "+92 300 0000000",
  },
  {
    id: "notes",
    kind: "text",
    prompt: "Anything else you'd like us to know?",
    summaryLabel: "Notes",
    placeholder: "Optional — skip if you'd rather",
    optional: true,
  },
];

/* ---------------------------------------------------------------- */
/* Verification copy (Step 12). Transcribed from the client's brief.  */
/* ---------------------------------------------------------------- */

export const CHAT_VERIFY_INTRO =
  "Thanks! Before I save your project request, please verify your email.";

export const CHAT_VERIFY_PROMPT =
  "Enter the 6-digit code we sent to your email.";

export const CHAT_VERIFIED =
  "Perfect! Your email is verified. \u{1F389}\nWe've got your project details and will review them shortly.";

/* ---------------------------------------------------------------- */
/* Shape checks. Typo-catchers, not verification — see the note above. */
/* ---------------------------------------------------------------- */

/** Single `@`, something either side, a dot in the domain, no spaces. */
export function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());
}

/** 7–15 digits once formatting is stripped, matching E.164's own range. */
export function isLikelyPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[+()\d\s.-]+$/.test(value.trim());
}

export function validate(step: ChatStep, raw: string): string | null {
  const value = raw.trim();

  if (!value) {
    return step.optional ? null : "Just a short answer is fine.";
  }
  if (value.length > 600) {
    return "That's a little long — could you shorten it?";
  }

  switch (step.kind) {
    case "email":
      return isLikelyEmail(value)
        ? null
        : "That doesn't look like an email address — mind checking it?";
    case "tel":
      return isLikelyPhone(value)
        ? null
        : "That doesn't look like a phone number — mind checking it?";
    default:
      if (step.id === "name" && value.length < 2) {
        return "Just your first name is fine.";
      }
      return null;
  }
}
