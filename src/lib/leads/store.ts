import { Pool, type PoolClient } from "pg";
import { randomBytes } from "node:crypto";
import type { Lead } from "./types";

/**
 * STEP 11 (rev. 2) — lead storage, via Postgres (Vercel's own Storage tab).
 *
 * WHY POSTGRES AND NOT FIREBASE
 * The original design used Firestore via the Admin SDK. A Postgres database
 * connected from the Vercel dashboard (Storage tab -> Create Database ->
 * Postgres -> Connect to Project) does the same job — a durable, server-only
 * store the browser can never reach directly — without a second cloud
 * account, a service-account JSON key, or three secrets to copy in by hand.
 * Connecting it is one click, and Vercel injects POSTGRES_URL into the
 * project's environment on its own. Nothing below is ever typed in by a
 * person.
 *
 * `pg` (node-postgres) rather than a Vercel-specific client: it is the
 * standard driver for any Postgres, so this keeps working if the database
 * ever moves providers, and its API is exactly what every route already
 * calls (`client.query(text, params)`, `client.release()`).
 *
 * SCHEMA
 * Created lazily on first use with CREATE TABLE IF NOT EXISTS — there is no
 * separate migration step to run by hand.
 *
 * UNCONFIGURED IS NOT "SILENTLY FINE"
 * With no connection string this throws LeadStoreUnavailableError and the
 * route answers 503, exactly as the Firestore version did.
 */

export class LeadStoreUnavailableError extends Error {
  constructor(reason: string) {
    super(`Lead store unavailable: ${reason}`);
    this.name = "LeadStoreUnavailableError";
  }
}

function connectionString(): string | undefined {
  // POSTGRES_URL is what Vercel's Postgres storage integration injects.
  // DATABASE_URL covers a database connected some other way (e.g. Neon's
  // own Vercel integration, or a manually-added provider).
  return process.env.POSTGRES_URL || process.env.DATABASE_URL;
}

/** True when the environment carries what the store needs. */
export function isStoreConfigured(): boolean {
  return Boolean(connectionString());
}

/**
 * Unguessable id for a lead or verification row. Not auto-increment —
 * nothing should be able to enumerate leads by counting up, the same reason
 * the Firestore version used an opaque document id.
 */
export function newId(): string {
  return randomBytes(16).toString("base64url");
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;
  const url = connectionString();
  if (!url) {
    throw new LeadStoreUnavailableError(
      "missing POSTGRES_URL — connect Postgres to this project in the Vercel dashboard (Storage tab)"
    );
  }
  pool = new Pool({
    connectionString: url,
    // Vercel/Neon Postgres requires TLS and uses a certificate `pg` doesn't
    // chain-validate out of the box. The connection is still encrypted;
    // this only relaxes certificate-authority verification, the standard
    // arrangement for connecting `pg` to a managed Postgres like this.
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
  return pool;
}

let schemaReady: Promise<void> | null = null;

async function ensureSchema(client: PoolClient): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          phone TEXT NOT NULL,
          project_type TEXT NOT NULL,
          project_goal TEXT NOT NULL,
          additional_message TEXT NOT NULL DEFAULT '',
          source TEXT NOT NULL,
          page TEXT,
          referrer TEXT,
          project_interest TEXT,
          spam_signals JSONB,
          created_at TIMESTAMPTZ NOT NULL,
          verification_status TEXT NOT NULL,
          qualified BOOLEAN,
          verified_at TIMESTAMPTZ,
          owner_notified_at TIMESTAMPTZ
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS verifications (
          id TEXT PRIMARY KEY,
          lead_id TEXT NOT NULL REFERENCES leads(id),
          code_hash TEXT NOT NULL,
          expires_at BIGINT NOT NULL,
          attempts INT NOT NULL DEFAULT 0,
          resends INT NOT NULL DEFAULT 0,
          last_sent_at BIGINT NOT NULL,
          consumed_at BIGINT
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS rate_limits (
          key TEXT PRIMARY KEY,
          count INT NOT NULL,
          window_start BIGINT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL
        );
      `);
    })().catch((error) => {
      // Let the next caller try again instead of caching a failed schema.
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

/**
 * One checked-out client, schema guaranteed to exist. Callers MUST
 * `client.release()` when done — wrap the call site in try/finally, same
 * discipline as any pooled connection.
 */
export async function getClient(): Promise<PoolClient> {
  const client = await getPool().connect();
  try {
    await ensureSchema(client);
  } catch (error) {
    client.release();
    throw error;
  }
  return client;
}

/** Turn a `leads` row back into the shape the rest of the app expects. */
export function mapLeadRow(row: Record<string, unknown>): Lead {
  return {
    name: row.name as string,
    email: row.email as string,
    emailVerified: Boolean(row.email_verified),
    phone: row.phone as string,
    projectType: row.project_type as string,
    projectGoal: row.project_goal as string,
    additionalMessage: (row.additional_message as string) ?? "",
    source: row.source as string,
    createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at as string),
    verificationStatus: row.verification_status as Lead["verificationStatus"],
    page: (row.page as string | null) ?? undefined,
    referrer: (row.referrer as string | null) ?? undefined,
    projectInterest: (row.project_interest as string | null) ?? undefined,
    spamSignals: (row.spam_signals as string[] | null) ?? undefined,
    qualified: (row.qualified as boolean | null) ?? undefined,
    verifiedAt: row.verified_at ? new Date(row.verified_at as string) : undefined,
    ownerNotifiedAt: row.owner_notified_at ? new Date(row.owner_notified_at as string) : undefined,
  };
}
