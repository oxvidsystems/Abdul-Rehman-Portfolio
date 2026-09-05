import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * STEP 11 — Firestore, via the Admin SDK, server-side only.
 *
 * WHY THE ADMIN SDK AND NOT THE CLIENT SDK
 * The brief requires server-side validation before anything is accepted.
 * A browser writing to Firestore directly cannot be validated server-side
 * by definition — security rules can check a document's shape, but they
 * cannot normalise a phone number, classify a project type, or decide that
 * `emailVerified` must be false. So `firestore.rules` denies every client
 * write outright, and this module — which runs only inside the route
 * handler — is the single writer. The Admin SDK bypasses rules by design,
 * which is exactly why the rules can be that strict.
 *
 * CREDENTIALS
 * Read from the environment, never bundled. `assertServer()` throws if this
 * file is ever imported into client code, so a bad refactor fails loudly at
 * runtime instead of quietly shipping a service-account key to browsers.
 * None of these names carry the NEXT_PUBLIC_ prefix, so Next will not inline
 * them into the client bundle even by accident.
 *
 * UNCONFIGURED IS NOT "SILENTLY FINE"
 * With no credentials this throws `LeadStoreUnavailableError` and the route
 * answers 503. It never pretends to have stored a lead it dropped — the
 * visitor is told to email instead, and the server logs it.
 */

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error(
      "leads/firestore.ts was imported into client code. It holds service-account credentials and must stay server-only."
    );
  }
}

export class LeadStoreUnavailableError extends Error {
  constructor(reason: string) {
    super(`Lead store unavailable: ${reason}`);
    this.name = "LeadStoreUnavailableError";
  }
}

export const LEADS_COLLECTION = "leads";
export const RATE_LIMIT_COLLECTION = "rate_limits";
/** Code material only — never the lead, never a plaintext code. TTL on `expiresAt`. */
export const VERIFICATIONS_COLLECTION = "verifications";

let cachedApp: App | null = null;

function readCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel and most dashboards store multi-line secrets with literal \n.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const missing = [
    !projectId && "FIREBASE_PROJECT_ID",
    !clientEmail && "FIREBASE_CLIENT_EMAIL",
    !privateKey && "FIREBASE_PRIVATE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new LeadStoreUnavailableError(`missing ${missing.join(", ")}`);
  }
  return { projectId: projectId!, clientEmail: clientEmail!, privateKey: privateKey! };
}

function getApp(): App {
  assertServer();
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  const credentials = readCredentials();
  cachedApp = initializeApp({
    credential: cert(credentials),
    projectId: credentials.projectId,
  });
  return cachedApp;
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}

/** True when the environment carries everything the store needs. */
export function isStoreConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}
