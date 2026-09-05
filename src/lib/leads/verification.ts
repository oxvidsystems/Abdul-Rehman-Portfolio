import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

/**
 * STEP 12 — the verification code itself.
 *
 * Pure crypto and policy. No Firestore, no HTTP, no email — so it can be
 * tested directly, which is the only way to be sure of any of it.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHY A PEPPERED HMAC AND NOT A PLAIN HASH
 * ─────────────────────────────────────────────────────────────────────
 * A 6-digit code has one million possible values. A plain SHA-256 of it is
 * not protection: anyone holding the database can enumerate all million in
 * well under a second and recover every live code. So the stored digest is
 * an HMAC keyed with a secret that lives only in the environment. Without
 * that secret the digest is useless, and the secret is never in the
 * database, never in the bundle, and never in a log.
 *
 * The code is also bound into the HMAC input alongside the verification id,
 * so a digest lifted from one record cannot be replayed against another.
 *
 * The plaintext code exists in exactly two places and briefly: in memory
 * while the email is being composed, and in the recipient's inbox. It is
 * never written to Firestore and never logged — see the note on
 * `issueCode`.
 */

/** Ten minutes. Long enough to find the email, short enough to matter. */
export const CODE_TTL_MS = 10 * 60_000;

/** Wrong guesses before the code is burned. 5 of 1,000,000 is generous. */
export const MAX_ATTEMPTS = 5;

/** New codes per verification before the visitor has to start over. */
export const MAX_RESENDS = 3;

/** Minimum gap between sends, so "resend" can't be used to spam an inbox. */
export const RESEND_COOLDOWN_MS = 60_000;

export type VerificationRecord = {
  leadId: string;
  /** HMAC of `${id}:${code}`. Never the code. */
  codeHash: string;
  expiresAt: number;
  attempts: number;
  resends: number;
  lastSentAt: number;
  /** Set the moment a code is accepted. A consumed record is dead. */
  consumedAt: number | null;
};

export class VerificationSecretMissingError extends Error {
  constructor() {
    super(
      "VERIFICATION_PEPPER is not set. Codes cannot be hashed safely without it."
    );
    this.name = "VerificationSecretMissingError";
  }
}

function pepper(): string {
  const value = process.env.VERIFICATION_PEPPER;
  // Refusing to start is the right failure. The alternative — quietly
  // falling back to an unkeyed hash — would look identical in every test
  // and be worthless the day the database leaked.
  if (!value || value.length < 32) throw new VerificationSecretMissingError();
  return value;
}

/** Unguessable handle for the verification, used as the document id. */
export function newVerificationId(): string {
  return randomBytes(18).toString("base64url");
}

/**
 * A six-digit code from the CSPRNG. `randomInt` is uniform over the range —
 * `Math.random()` is neither uniform nor unpredictable, and a predictable
 * verification code is not a verification.
 */
export function newCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCode(verificationId: string, code: string): string {
  return createHmac("sha256", pepper())
    .update(`${verificationId}:${code}`)
    .digest("hex");
}

/**
 * Constant-time comparison. A byte-by-byte `===` leaks, through timing, how
 * many leading digits were right — which turns a million-guess space into
 * about sixty.
 */
function digestsMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export type IssuedCode = {
  verificationId: string;
  /** In memory only, on its way to the mailer. Never stored, never logged. */
  code: string;
  record: VerificationRecord;
};

/**
 * Mint a fresh code for a lead.
 *
 * The returned `code` is the ONLY moment the plaintext exists on the server.
 * It goes to the mailer and is dropped. Do not add it to a log line, an
 * error message, an analytics event or an API response — a code in a log is
 * a code in whatever reads logs.
 */
export function issueCode(leadId: string, now = Date.now()): IssuedCode {
  const verificationId = newVerificationId();
  const code = newCode();
  return {
    verificationId,
    code,
    record: {
      leadId,
      codeHash: hashCode(verificationId, code),
      expiresAt: now + CODE_TTL_MS,
      attempts: 0,
      resends: 0,
      lastSentAt: now,
      consumedAt: null,
    },
  };
}

/**
 * Replace the code on an existing verification. The previous code stops
 * working the instant this returns — a resend invalidates, it does not add a
 * second valid code.
 */
export function reissueCode(
  verificationId: string,
  record: VerificationRecord,
  now = Date.now()
): { code: string; record: VerificationRecord } {
  const code = newCode();
  return {
    code,
    record: {
      ...record,
      codeHash: hashCode(verificationId, code),
      expiresAt: now + CODE_TTL_MS,
      attempts: 0,
      resends: record.resends + 1,
      lastSentAt: now,
      consumedAt: null,
    },
  };
}

export type CheckOutcome =
  | { status: "verified"; record: VerificationRecord }
  | { status: "wrong"; record: VerificationRecord; attemptsLeft: number }
  | { status: "expired" }
  | { status: "consumed" }
  | { status: "locked" };

/**
 * Check a submitted code. Order matters: consumed and expired are decided
 * before the digest is compared, so a dead record cannot be used as an
 * oracle, and an exhausted record cannot be retried.
 */
export function checkCode(
  verificationId: string,
  record: VerificationRecord,
  submitted: string,
  now = Date.now()
): CheckOutcome {
  if (record.consumedAt !== null) return { status: "consumed" };
  if (now > record.expiresAt) return { status: "expired" };
  if (record.attempts >= MAX_ATTEMPTS) return { status: "locked" };

  const cleaned = submitted.replace(/\D/g, "");
  const attempts = record.attempts + 1;

  if (cleaned.length !== 6 || !digestsMatch(record.codeHash, hashCode(verificationId, cleaned))) {
    return {
      status: "wrong",
      record: { ...record, attempts },
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempts),
    };
  }

  return {
    status: "verified",
    // Consumed in the same object that gets written back, so the code is
    // dead from the moment it succeeds. Single use means single use.
    record: { ...record, attempts, consumedAt: now },
  };
}

export function canResend(
  record: VerificationRecord,
  now = Date.now()
): { allowed: true } | { allowed: false; reason: "cooldown" | "limit"; waitMs: number } {
  if (record.resends >= MAX_RESENDS) {
    return { allowed: false, reason: "limit", waitMs: 0 };
  }
  const elapsed = now - record.lastSentAt;
  if (elapsed < RESEND_COOLDOWN_MS) {
    return { allowed: false, reason: "cooldown", waitMs: RESEND_COOLDOWN_MS - elapsed };
  }
  return { allowed: true };
}
