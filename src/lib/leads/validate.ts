import { cleanBlock, cleanLine, countLinks } from "./sanitize";
import {
  LEAD_LIMITS,
  LEAD_SOURCES,
  PROJECT_TYPES,
  PROJECT_TYPE_OTHER,
  type Lead,
  type LeadInput,
} from "./types";

/**
 * STEP 11 — server-side validation. This is the authority.
 *
 * The widget has its own checks in `src/lib/chat-flow.ts`, but those exist
 * only to catch typos while someone is typing. They run in the visitor's
 * browser, which means they run only if the visitor chooses to use the
 * browser. Anything can POST to /api/leads. So every rule that matters is
 * re-applied here, on values that are assumed hostile until they pass.
 *
 * Three things this file will not do:
 *
 *  · It will not take `emailVerified` or `verificationStatus` from the
 *    request. They are not in `LeadInput` at all, and `toLead()` hardcodes
 *    them. A client that posts `emailVerified: true` is ignored, not
 *    trusted — that is the whole point of the step.
 *  · It will not accept the client's own classification of `projectType`.
 *    It matches against the known list; anything else becomes "Other" and
 *    the raw words are kept in `projectInterest`.
 *  · It will not treat a well-formed address as a real one. `email` passing
 *    here means "worth sending a code to", nothing more.
 */

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export type ValidationResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: FieldErrors };

/**
 * Deliberately conservative, and deliberately not RFC 5322. The full grammar
 * accepts quoted local parts, comments and nested escapes that no mail
 * provider in practice issues, and every regex claiming to implement it is
 * either wrong or a denial-of-service waiting to happen. This asks the only
 * question worth asking before sending a verification code: is there one @,
 * with plausible text either side and a dotted domain?
 */
const EMAIL = /^[^\s@,;<>"'()[\]\\]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

/** At least one letter from any script — rules out "123" and "..." as names. */
const HAS_LETTER = /\p{L}/u;

/** Only the characters a written phone number legitimately contains. */
const PHONE_SHAPE = /^[+()\d\s.\-]+$/;

/**
 * Lowercase the whole address. The local part is technically
 * case-sensitive per RFC, but no provider in practice treats it that way,
 * and normalising is what stops the same person becoming three leads.
 */
function normaliseEmail(value: string): string {
  return value.toLowerCase();
}

/**
 * Keep only digits, and a leading + if the visitor wrote one (or wrote the
 * 00 international prefix). No country code is ever inferred — guessing one
 * from an IP or a default would silently corrupt the number.
 */
function normalisePhone(value: string): string {
  const international = /^\s*(\+|00)/.test(value);
  const digits = value.replace(/\D/g, "");
  const trimmed = international && digits.startsWith("00") ? digits.slice(2) : digits;
  return international ? `+${trimmed}` : trimmed;
}

function matchProjectType(value: string): { type: string; interest?: string } {
  const hit = PROJECT_TYPES.find(
    (option) => option.toLowerCase() === value.toLowerCase()
  );
  if (hit) return { type: hit };
  return { type: PROJECT_TYPE_OTHER, interest: value };
}

/** Optional URL-ish field: kept only if it parses and is http(s). */
function safeUrl(raw: unknown, max: number): string | undefined {
  const value = cleanLine(raw, max);
  if (!value) return undefined;
  try {
    const url = new URL(value, "https://placeholder.invalid");
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return value;
  } catch {
    return undefined;
  }
}

export function validateLead(input: LeadInput): ValidationResult {
  const errors: FieldErrors = {};

  const name = cleanLine(input.name, LEAD_LIMITS.name);
  if (name.length < 2) {
    errors.name = "Please give a name of at least 2 characters.";
  } else if (!HAS_LETTER.test(name)) {
    errors.name = "That name doesn't contain any letters.";
  }

  const email = normaliseEmail(cleanLine(input.email, LEAD_LIMITS.email));
  if (!email) {
    errors.email = "Please give an email address.";
  } else if (!EMAIL.test(email)) {
    errors.email = "That doesn't look like an email address.";
  }

  const phoneRaw = cleanLine(input.phone, LEAD_LIMITS.phone);
  const phone = normalisePhone(phoneRaw);
  const phoneDigits = phone.replace(/\D/g, "").length;
  if (!phoneRaw) {
    errors.phone = "Please give a phone number.";
  } else if (!PHONE_SHAPE.test(phoneRaw)) {
    errors.phone = "A phone number can only contain digits, spaces, + ( ) - and .";
  } else if (phoneDigits < 7 || phoneDigits > 15) {
    // 7-15 is E.164's own range: shorter is not a number, longer cannot exist.
    errors.phone = "That doesn't look like a phone number.";
  }

  const projectTypeRaw = cleanLine(input.projectType, LEAD_LIMITS.projectType);
  if (!projectTypeRaw) {
    errors.projectType = "Please say what you're looking to build.";
  }
  const { type: projectType, interest: projectInterest } =
    matchProjectType(projectTypeRaw);

  const projectGoal = cleanBlock(input.projectGoal, LEAD_LIMITS.projectGoal);
  if (projectGoal.length < 3) {
    errors.projectGoal = "Please say a little about the goal of the project.";
  }

  const additionalMessage = cleanBlock(
    input.additionalMessage,
    LEAD_LIMITS.additionalMessage
  );

  const sourceRaw = cleanLine(input.source, LEAD_LIMITS.source);
  const source = (LEAD_SOURCES as readonly string[]).includes(sourceRaw)
    ? sourceRaw
    : "unknown";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const spamSignals: string[] = [];
  if (countLinks(projectGoal) > 1) spamSignals.push("links-in-goal");
  if (countLinks(additionalMessage) > 2) spamSignals.push("links-in-message");
  if (countLinks(name) > 0) spamSignals.push("link-in-name");

  const lead: Lead = {
    name,
    email,
    // Hardcoded. Not read from the request, at this or any later step —
    // only the OTP flow may ever set these two to anything else.
    emailVerified: false,
    verificationStatus: "pending",
    phone,
    projectType,
    projectGoal,
    additionalMessage,
    source,
    createdAt: new Date(),
  };

  if (projectInterest) lead.projectInterest = projectInterest;
  const page = safeUrl(input.page, LEAD_LIMITS.page);
  if (page) lead.page = page;
  const referrer = safeUrl(input.referrer, LEAD_LIMITS.referrer);
  if (referrer) lead.referrer = referrer;
  if (spamSignals.length > 0) lead.spamSignals = spamSignals;

  return { ok: true, lead };
}
