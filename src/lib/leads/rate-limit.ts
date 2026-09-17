import { createHash } from "node:crypto";

/**
 * STEP 11 (rev. 3) — abuse protection for /api/leads.
 *
 * In-memory only. Earlier revisions kept a durable counter in
 * Firestore/Postgres so the limit held across serverless instances and
 * restarts; that database is gone now (see sheets.ts for why), and this
 * project would rather run with zero infrastructure than bring one back
 * just to hold a counter.
 *
 * WHAT THAT COSTS
 * On Vercel each serverless instance has its own memory, so the real limit
 * is "5 per 10 minutes per instance", not globally per requester. A
 * determined abuser who lands on several instances gets more than 5. For a
 * portfolio site's traffic this is an acceptable trade — it still stops a
 * single script hammering one route in a loop, which is the actual case
 * this defends against.
 *
 * PRIVACY
 * The IP is never stored anywhere durable, only hashed in memory for the
 * life of the process.
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
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export type RateLimitVerdict = {
  allowed: boolean;
  /** Seconds until the window resets. Sent as Retry-After when blocked. */
  retryAfter: number;
};

export async function checkRateLimit(key: string): Promise<RateLimitVerdict> {
  const now = Date.now();
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
