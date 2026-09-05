/**
 * STEP 17 — security headers.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHY THE SCRIPT POLICY IS THE SHAPE IT IS
 * ─────────────────────────────────────────────────────────────────────
 * The strongest script policy is `'nonce-…' 'strict-dynamic'`: only scripts
 * this server stamped may run. That needs a fresh nonce in the HTML on every
 * request, so it only works on a page rendered per request.
 *
 * This was built and measured, not assumed. With middleware minting a nonce
 * and the home page left STATIC, Next served prebuilt HTML and none of the
 * nine script tags carried the nonce — under `strict-dynamic` every one of
 * them would have been blocked and the site would have been dead on arrival.
 * Forcing the page dynamic fixed it (9 of 9 nonced, both inline RSC payload
 * scripts included), at the cost of turning every single page view into a
 * server render — on Firebase Hosting, a function invocation per visit,
 * cold starts included, for a page that has nothing per-request to say.
 *
 * That trade is not worth it here, so the page stays static and `script-src`
 * carries `'unsafe-inline'` for the RSC payload Next inlines. What that gives
 * up is real and worth naming: an injected <script> would run. What it does
 * NOT give up is the containment around it — `connect-src 'self'` and
 * `img-src` without a remote host mean such a script has nowhere to send what
 * it steals, `form-action 'self'` means it cannot repoint a submission,
 * `base-uri 'self'` means it cannot silently redirect every relative URL on
 * the page, and `frame-ancestors 'none'` means the page cannot be framed and
 * clickjacked at all.
 *
 * The site also renders no user-supplied HTML anywhere: no
 * dangerouslySetInnerHTML, no innerHTML, no third-party scripts, and lead
 * text is escaped at the point of output (see lib/leads/sanitize.ts). The
 * CSP here is the second line, not the first.
 *
 * Switching to nonce-strict is one flag away and is recorded in the go-live
 * checklist for the client to decide with the hosting bill in front of them.
 */
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // See the note above: static rendering means no per-request nonce.
  // 'unsafe-eval' is added ONLY in dev — Next's dev-mode HMR/Turbopack
  // client uses eval() to rebuild stack traces, and without it the
  // console fills with "eval() is not supported in this environment"
  // and dev tooling breaks. Production never gets 'unsafe-eval'.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // The design drives transforms and colours through inline style attributes
  // on nearly every animated element. Nonces do not apply to style
  // attributes, so this is required for the site to move at all.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // 'self' (not 'none') so the same-origin resume PDF can render inside
  // the "View Resume" popup's <iframe> via the browser's built-in PDF
  // viewer — that viewer is implemented as an internal <embed>, which
  // object-src also gates. Nothing cross-origin is ever framed.
  "object-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  // Stops a browser second-guessing a Content-Type — the mechanism behind
  // "upload a .jpg, have it executed as script".
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Belt to the CSP's frame-ancestors braces, for anything that predates it.
  { key: "X-Frame-Options", value: "DENY" },
  // Origin to other sites, full URL only to ourselves.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here uses any of these, so nothing here should be able to ask.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()",
  },
  // Two years, subdomains included. Inert over plain http, so a local dev
  // server is unaffected.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // Isolates this page's browsing context from any cross-origin popup/tab
  // it opens, so a same-tab window.opener reference can't be used to reach
  // back in. "same-origin" (not same-origin-allow-popups) since nothing on
  // this site needs a popup to talk back to the opening page.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Nothing this origin serves is meant to be loaded as a cross-origin
  // sub-resource (an <img>/<script> embed from another site). Blocking that
  // by default closes off a class of Spectre-style side-channel and
  // cross-origin leak attacks for no cost — nothing here is embedded
  // anywhere else on purpose.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // "X-Powered-By: Next.js" tells an attacker which advisories to read first.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The resume needs to render inside this site's own "View Resume"
        // popup <iframe>. The blanket X-Frame-Options: DENY above blocks
        // ANY framing of the response, even same-origin — CSP's
        // frame-ancestors doesn't help here, since X-Frame-Options is
        // enforced independently by the framed resource itself. This
        // rule runs after the general one and overrides just those two
        // headers, only for this one file.
        source: "/resume.pdf",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: CSP.replace("frame-ancestors 'none'", "frame-ancestors 'self'"),
          },
        ],
      },
      {
        // A lead endpoint answers with a verification handle. Nothing between
        // the visitor and this server has any business keeping a copy.
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        // Content-stable font files under a name that never changes meaning.
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
