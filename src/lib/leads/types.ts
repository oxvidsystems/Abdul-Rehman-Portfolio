import { CHAT_STEPS } from "@/lib/chat-flow";

/**
 * STEP 11 — the shape of a stored lead.
 *
 * Field list is exactly the client's spec. Nothing beyond it is collected:
 * no IP address, no user agent, no fingerprint, no tracking id. The rate
 * limiter needs to tell requesters apart, so it stores a salted SHA-256 of
 * the IP under a separate short-lived collection and never the address
 * itself — see `rate-limit.ts`.
 */

/**
 * Allowed project types, derived from the widget's own quick replies so
 * the two can never drift apart. Anything the server doesn't recognise is
 * filed as "Other" with the visitor's own words kept in `projectInterest`
 * — the server classifies, the client doesn't get to.
 */
export const PROJECT_TYPES = (CHAT_STEPS[0].options ?? []).filter(
  (option) => option !== CHAT_STEPS[0].freeTextOption
);
export const PROJECT_TYPE_OTHER = "Other";

export type VerificationStatus = "pending" | "verified" | "expired" | "failed";

export type Lead = {
  name: string;
  email: string;
  /** ALWAYS false at this stage. Set only by the (not yet built) OTP step. */
  emailVerified: boolean;
  phone: string;
  projectType: string;
  projectGoal: string;
  additionalMessage: string;
  source: string;
  /** Server clock. The client's clock is never trusted for this. */
  createdAt: Date;
  verificationStatus: VerificationStatus;

  /* ---- optional ---- */
  page?: string;
  referrer?: string;
  /** The visitor's own words when they picked "Something else". */
  projectInterest?: string;
  /** Non-blocking triage hints, e.g. "links-in-goal". Never a rejection. */
  spamSignals?: string[];

  /* ---- set only on successful verification (Step 12/13) ---- */
  /**
   * One boolean that means "this is a real, contactable enquiry". It exists
   * alongside `verificationStatus` on purpose: a status field grows values
   * over time (expired, failed, bounced, …) and every future query would
   * have to remember which of them count. A boolean cannot rot that way, and
   * it makes the Firestore console filter a single click.
   *
   * Absent on a pending lead — not `false` — so `where("qualified","==",true)`
   * needs no index gymnastics and an un-promoted lead can never match.
   */
  qualified?: boolean;
  verifiedAt?: Date;
  /** When info@oxvidsystems.com was told. Absent means the send failed. */
  ownerNotifiedAt?: Date;
};

/** What the widget is allowed to send. Everything else is ignored. */
export type LeadInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  projectType?: unknown;
  projectGoal?: unknown;
  additionalMessage?: unknown;
  source?: unknown;
  page?: unknown;
  referrer?: unknown;
};

export const LEAD_LIMITS = {
  name: 80,
  email: 254,
  phone: 32,
  projectType: 60,
  projectGoal: 600,
  additionalMessage: 1000,
  source: 40,
  page: 300,
  referrer: 300,
} as const;

/** Sources this endpoint accepts. An unknown source is filed as "unknown". */
export const LEAD_SOURCES = ["chat-widget", "contact-section"] as const;
