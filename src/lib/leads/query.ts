import { getClient, mapLeadRow } from "./store";
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
 *   2. The Vercel dashboard's Postgres "Query" tab — a lightweight SQL
 *      editor built into Storage → the connected database. `SELECT * FROM
 *      leads WHERE qualified = true ORDER BY verified_at DESC` is exactly
 *      `listVerifiedLeads`.
 *
 * SERVER ONLY. These functions hold a direct database connection and must
 * never be imported into a client component or exposed as an
 * unauthenticated route.
 */

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error(
      "leads/query.ts was imported into client code. It reads every lead directly from the database and must stay server-only."
    );
  }
}

export type StoredLead = Lead & { id: string };

function toStoredLead(row: Record<string, unknown>): StoredLead {
  return { id: row.id as string, ...mapLeadRow(row) };
}

/**
 * Qualified leads, newest verification first.
 *
 * Filters on `qualified` rather than `verificationStatus = 'verified'`: the
 * boolean is only ever written by the verification transaction, so a pending
 * or failed lead cannot appear here even if the status vocabulary changes.
 */
export async function listVerifiedLeads(limit = 50): Promise<StoredLead[]> {
  assertServer();
  const client = await getClient();
  try {
    const { rows } = await client.query(
      `SELECT * FROM leads WHERE qualified = true ORDER BY verified_at DESC LIMIT $1`,
      [limit]
    );
    return rows.map(toStoredLead);
  } finally {
    client.release();
  }
}

/** Everything in one state — for triaging what never got verified. */
export async function listLeadsByStatus(
  status: VerificationStatus,
  limit = 50
): Promise<StoredLead[]> {
  assertServer();
  const client = await getClient();
  try {
    const { rows } = await client.query(
      `SELECT * FROM leads WHERE verification_status = $1 ORDER BY created_at DESC LIMIT $2`,
      [status, limit]
    );
    return rows.map(toStoredLead);
  } finally {
    client.release();
  }
}

export async function getLead(id: string): Promise<StoredLead | null> {
  assertServer();
  const client = await getClient();
  try {
    const { rows } = await client.query(`SELECT * FROM leads WHERE id = $1`, [id]);
    return rows[0] ? toStoredLead(rows[0]) : null;
  } finally {
    client.release();
  }
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
