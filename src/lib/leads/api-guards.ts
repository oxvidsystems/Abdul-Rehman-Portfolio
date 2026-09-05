import { NextResponse } from "next/server";

/**
 * STEP 12 — request guards shared by every /api/leads/* route.
 *
 * Pulled out of the original single route once there were three of them:
 * three copies of an origin check is three chances for one of them to drift
 * and become the way in.
 */

/** 8 KB is roughly 8x the largest honest payload on any of these routes. */
export const MAX_BODY_BYTES = 8 * 1024;

export function fail(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

/**
 * Same-origin check. An absent Origin is allowed — some legitimate clients
 * omit it, and the rate limit still applies. A present-but-wrong Origin is
 * the browser telling us this came from someone else's page.
 */
export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowed = new Set<string>();
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      allowed.add(new URL(configured).origin);
    } catch {
      /* a malformed env value must not become an open door */
    }
  }

  const host = request.headers.get("host");
  if (host) {
    // Trust the proxy's scheme when it sends one. Hardcoding https 403s a
    // same-origin request on any http deployment — a staging host, a plain
    // preview, `next start` locally — which is a self-inflicted outage, not
    // a security win. Allowing either scheme for OUR OWN host costs nothing:
    // the check exists to reject a DIFFERENT origin, and the browser is the
    // one setting that header.
    const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    if (proto) {
      allowed.add(`${proto}://${host}`);
    } else {
      allowed.add(`https://${host}`);
      allowed.add(`http://${host}`);
    }
  }
  return allowed.has(origin);
}

export type BodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: ReturnType<typeof fail> };

/** Method, content type, size and JSON shape, in the cheapest order. */
export async function readJsonBody(request: Request): Promise<BodyResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { ok: false, response: fail(415, "unsupported_media_type") };
  }
  if (!originAllowed(request)) {
    return { ok: false, response: fail(403, "bad_origin") };
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, "payload_too_large") };
  }

  const raw = await request.text();
  // content-length can lie or be absent under chunked encoding, so the
  // actual bytes are what decide.
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, "payload_too_large") };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, response: fail(400, "malformed_body") };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, response: fail(400, "malformed_body") };
  }
}

/** An opaque handle from the client: base64url, bounded length. */
export function readHandle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(trimmed)) return null;
  return trimmed;
}
