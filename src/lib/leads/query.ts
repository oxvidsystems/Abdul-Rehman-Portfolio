import { getDb, LEADS_COLLECTION } from "./firestore";
import type { Lead, VerificationStatus } from "./types";

/**
 * STEP 13 — reading leads back.
 *
 * There is deliberately NO admin dashboard here. The brief said not to build
 * an unnecessarily complex one, and it was right to: an admin UI needs
 * authentication, sessions, and a login page, and every one of those is a new
 * way to leak the whole lead table. Building that without a real need would
 * add risk, not value.
 *
 * What exists instead is this: a small, typed, server-only query surface. It
 * is what a lead view WOULD call, so when one is wanted the UI is the only
 * new thing — the data access, the shape and the ordering are already here
 * and already tested.
 *
 * Until then the business owner has two ways to see leads, and neither needs
 * any code to ship:
 *
 *   1. The notification email, which arrives at info@oxvidsystems.com the
 *      moment a lead verifies and contains every field.
 *   2. The Firestore console: Firestore → leads → filter `qualified == true`,
 *      sort by `verifiedAt` descending. That is exactly `listVerifiedLeads`.
 *
 * SERVER ONLY. These functions use the Admin SDK, which bypasses security
 * rules. Never import this into a client component, and never expose one of
 * these directly as an unauthenticated route.
 */

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error(
      "leads/query.ts was imported into client code. It reads every lead with admin privileges and must stay server-only."
    );
  }
}

export type StoredLead = Lead & { id: string };

type LeadDoc = Record<string, unknown> & {
  createdAt?: { toDate(): Date };
  verifiedAt?: { toDate(): Date };
  ownerNotifiedAt?: { toDate(): Date };
};

function toLead(id: string, data: LeadDoc): StoredLead {
  const { createdAt, verifiedAt, ownerNotifiedAt, ...rest } = data;
  return {
    id,
    ...(rest as Omit<Lead, "createdAt">),
    createdAt: createdAt?.toDate() ?? new Date(0),
    ...(verifiedAt ? { verifiedAt: verifiedAt.toDate() } : {}),
    ...(ownerNotifiedAt ? { ownerNotifiedAt: ownerNotifiedAt.toDate() } : {}),
  };
}

/**
 * Qualified leads, newest verification first.
 *
 * Filters on `qualified` rather than `verificationStatus === "verified"`: the
 * boolean is only ever written by the verification transaction, so a pending
 * or failed lead cannot appear here even if the status vocabulary changes.
 */
export async function listVerifiedLeads(limit = 50): Promise<StoredLead[]> {
  assertServer();
  const snap = await getDb()
    .collection(LEADS_COLLECTION)
    .where("qualified", "==", true)
    .orderBy("verifiedAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => toLead(d.id, d.data() as LeadDoc));
}

/** Everything in one state — for triaging what never got verified. */
export async function listLeadsByStatus(
  status: VerificationStatus,
  limit = 50
): Promise<StoredLead[]> {
  assertServer();
  const snap = await getDb()
    .collection(LEADS_COLLECTION)
    .where("verificationStatus", "==", status)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => toLead(d.id, d.data() as LeadDoc));
}

export async function getLead(id: string): Promise<StoredLead | null> {
  assertServer();
  const doc = await getDb().collection(LEADS_COLLECTION).doc(id).get();
  return doc.exists ? toLead(doc.id, doc.data() as LeadDoc) : null;
}

/**
 * Verified leads that were never successfully notified — the retry list, if a
 * mail provider outage ever swallows one. A failed notification never blocks
 * a verification, so this is where those land.
 */
export async function listUnnotifiedVerifiedLeads(limit = 50): Promise<StoredLead[]> {
  assertServer();
  const leads = await listVerifiedLeads(limit);
  return leads.filter((lead) => !lead.ownerNotifiedAt);
}
