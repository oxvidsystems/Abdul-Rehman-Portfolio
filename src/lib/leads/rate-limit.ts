import { createHash } from "node:crypto";
import { getClient } from "./store";

/**
 * STEP 11 — abuse protection for /api/leads.
 *
 * Two layers, because neither is sufficient alone:
 *
 *  1. AN IN-MEMORY PRE-FILTER. Free, instant, and stops a flood from one
 *     source hammering the same server instance. On serverless it is only
 *     as good as the instance's lifetime, and separate instances do not
 *     share it — which is precisely why it is not the only layer.
 *
 *  2. A DURABLE POSTGRES WINDOW. One row per requester, read with `FOR
 *     UPDATE` inside a transaction so the limit holds across instances,
 *     restarts and deploys, and two simultaneous requests cannot both read
 *     the same count and both think they're the 5th.
 *
 * PRIVACY
 * The IP is never stored. The row's key is a salted SHA-256 of it, so the
 * counter can be found again without the address existing anywhere in the
 * database. The salt lives in the environment; without it the hash is still
 * a hash, just not peppered, and the code says so rather than pretending.
 *
 * CLEANUP
 * Rows carry `expires_at` but nothing deletes them automatically — Postgres
 * has no Firestore-style TTL policy. They accumulate harmlessly (one row per
 * distinct requester per 10-minute window); a scheduled `DELETE FROM
 * rate_limits WHERE expires_at < NOW()` run occasionally (a Vercel Cron
 * hitting a small maintenance route) keeps the table tidy, but nothing
 * breaks if that's never added.
 */

export const WINDOW_MS = 10 * 60_000;
export const MAX_PER_WINDOW = 5;

type Bucket = { count: number; windowStart: number };
const memory = new Map<string, Bucket>();

/** Keeps the in-memory map from growing without bound on a long-lived host. */
function sweep(now: number) {
  if (memory.size < 500) return;
  for (const [key, bucket] of memory) {
    if (now - bucket.windowStart > WINDOW_MS) memory.delete(key);
  }
}

/**
 * The client address, as reported by the proxy in front of this app. Only
 * meaningful when that proxy is trusted and overwrites the header — Vercel
 * does. Behind an untrusted proxy `x-forwarded-for` is attacker-controlled
 * and this becomes a courtesy limit, not a control.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function requesterKey(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  if (!salt && process.env.NODE_ENV === "production") {
    console.warn(
      "[leads] RATE_LIMIT_SALT is unset — requester hashes are unsalted."
    );
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export type RateLimitVerdict = {
  allowed: boolean;
  /** Seconds until the window resets. Sent as Retry-After when blocked. */
  retryAfter: number;
};

function checkMemory(key: string, now: number): RateLimitVerdict {
  sweep(now);
  const bucket = memory.get(key);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    memory.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

async function checkPostgres(key: string, now: number): Promise<RateLimitVerdict> {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT count, window_start FROM rate_limits WHERE key = $1 FOR UPDATE`,
      [key]
    );

    if (rows.length === 0 || now - Number(rows[0].window_start) > WINDOW_MS) {
      await client.query(
        `INSERT INTO rate_limits (key, count, window_start, expires_at)
         VALUES ($1, 1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET count = 1, window_start = $2, expires_at = $3`,
        [key, now, new Date(now + WINDOW_MS)]
      );
      await client.query("COMMIT");
      return { allowed: true, retryAfter: 0 };
    }

    const data = rows[0];
    if (data.count >= MAX_PER_WINDOW) {
      await client.query("ROLLBACK");
      return {
        allowed: false,
        retryAfter: Math.ceil((Number(data.window_start) + WINDOW_MS - now) / 1000),
      };
    }

    await client.query(`UPDATE rate_limits SET count = count + 1 WHERE key = $1`, [key]);
    await client.query("COMMIT");
    return { allowed: true, retryAfter: 0 };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function checkRateLimit(key: string): Promise<RateLimitVerdict> {
  const now = Date.now();

  const fast = checkMemory(key, now);
  if (!fast.allowed) return fast;

  try {
    return await checkPostgres(key, now);
  } catch (error) {
    // The durable layer being down must not become an open door, but it
    // must not lock out real visitors either. The in-memory verdict already
    // said yes; fall back to it and make the gap visible in the logs.
    console.error("[leads] durable rate limit unavailable, using in-memory only", error);
    return fast;
  }
}
