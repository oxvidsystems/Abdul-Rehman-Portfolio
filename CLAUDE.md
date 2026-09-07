# CLAUDE.md

Master build context for Claude Code (and any Claude session) working in this repository. Read this in full before making changes. Do not deviate from it without the user explicitly asking.

## ⚠️ CLIENT OVERRIDE — BRANDING (2026-08-28, explicit order, supersedes anything below that conflicts)

- **Do NOT put the OXVID Systems logo anywhere on the website.** This is Abdul Rehman's personal portfolio, not an OXVID Systems corporate site — no OXVID logo, wordmark, or favicon derived from it should appear on the live site.
- The four service reference images (`Web Development.jpeg`, `Content Writing.jpeg`, `Automation.jpeg`, `Brand Identity.jpeg`) and `Oxvid System Desciption.jpeg` were supplied **only as information about what the services are** — they are reference/briefing material, not assets to embed literally on the website unless separately instructed.
- Abdul Rehman's photo (`Abdul Rehman Image.jpeg`) may be used, but only when a build prompt explicitly calls for it — do not insert it proactively into sections that don't ask for it.
- Any instruction elsewhere in this file that conflicts with the above (e.g. "use the OXVID logo as the primary brand reference") is superseded by this override.

## Project

A premium, award-winning personal portfolio website for **Abdul Rehman** (7 years of experience), under his brand **OXVID Systems**. This is a high-end personal digital experience — not a generic portfolio, not a template. The site itself must be proof of Abdul Rehman's ability: it should communicate experience, technology, creativity, professionalism, trust, real-world project experience, and premium digital execution.

## Stack & Commands (confirmed, STEP 02)

- Framework: **Next.js 16** (App Router, TypeScript, Turbopack)
- UI/styling: **Tailwind CSS v4** (CSS-first `@theme` tokens — see `src/app/globals.css`; no `tailwind.config.ts` needed in v4)
- Package manager: **npm**
- Dev server: `npm run dev`
- Build: `npm run build`
- Start (prod): `npm run start`
- Lint: not installed yet — `eslint` / `eslint-config-next` were deliberately deferred (see note below). Add later with `npm install -D eslint eslint-config-next`.
- Deployment target: not decided yet.
- Animation library (GSAP/Lenis) and Firebase: not installed yet — added in whichever later step first needs motion/backend, per the one-task-at-a-time rule.

**Important — `node_modules` is intentionally NOT kept in this folder.** Run `npm install` yourself in a normal terminal on this machine before `npm run dev`:
```
cd "D:\Ab Rehman Porfolio Website"
npm install
npm run dev
```
Then open http://localhost:3000 (placeholder home) and http://localhost:3000/design-system (the full token preview/QA page built in Step 02).

*Why this note exists:* installing `node_modules` through Claude's remote-device bridge in this environment turned out to be extremely slow and occasionally corrupted files (the bridge's file-transfer path adds heavy per-file overhead — an `npm install` that takes seconds in a normal local terminal took many minutes here). Running `npm install` directly in your own terminal avoids that entirely. Claude will keep authoring/editing source files directly in this folder; you (or a future terminal session) should be the one to run `npm install` whenever `package.json` changes.

## Personal & Contact Information

Use exactly as given — never alter, invent, or add to these.

**Abdul Rehman** — 7 Years of Experience
- Phone (Pakistan): +92-322-1690030
- Email: m.abdulrehman111@gmail.com
- Business email: info@oxvidsystems.com

**OXVID Systems — USA Office**
182 Ridgeley Ave, Iselin, NJ 08830, USA
- Phone: +1 571 3761336
- Email: info@oxvidsystems.com (do not invent a second USA email)

The USA office must be presented professionally, not as a random address bolted onto the footer. It should appear naturally across the Contact section, an office/location block, the footer, and the lead/contact flow where appropriate — a premium "Pakistan / USA" dual-office structure is encouraged if it fits the design.

## Visual Identity

**Do not display the OXVID logo on the website** (see client override above). **Light theme first** — target balance (client-revised 2026-08-28):
- 70% light (white / off-white / very light neutral surfaces)
- 30% green / teal / cyan family — this now covers BOTH the dark brand surface AND the accent highlights together. The dark brand surface itself must read as a distinct GREEN shade (built from the same hue as the logo mark's teal-green gradient), not neutral grey/charcoal — this was an explicit client correction; the earlier grey-charcoal "ink" scale sampled from the logo's background plate was replaced.

The site must never become a full dark website — the dark green surface is a signature contrast element, not the base theme. See `src/app/globals.css` (`@theme` block) for the exact token values — that file is the single source of truth, not the percentages above.

## Design Language

Premium, editorial, minimal, technical, cinematic, modern, sophisticated, award-worthy.

**Avoid:** generic portfolio look, basic cards, Bootstrap-style layouts, template design, generic glassmorphism, excessive rounded cards, generic gradients, purple "AI aesthetic," overuse of neon, cheap 3D effects, repetitive layouts.

## Layout

- Desktop: fixed left-side navigation; main content scrolls on the right. Core interaction model is **static left + dynamic right**.
- Major sections use sticky/pinned layouts where appropriate.
- Mobile is an intentional redesign per section, not a scaled-down desktop layout.

## Navigation

Sections, in order: **HOME, ABOUT, EXPERTISE, WORK, EXPERIENCE, CONTACT**.

Use elegant section numbers, an active-section indicator, scroll progress, and a green/teal active accent.

## Motion

Use premium scroll-triggered animation, sticky sections, stacking, parallax, image reveal, clip-path, text masking, scale transitions, opacity/transform changes, and hover interactions — tastefully. Avoid excessive animation; motion must support storytelling, not decorate for its own sake. Respect `prefers-reduced-motion`.

## Stacking Project Experience (WORK section)

Projects must **not** be basic cards. They stack like cinematic editorial panels: the previous project moves slightly backward, the next overlaps it, and the new project becomes dominant. Use scale, translate, opacity, z-index, and sticky positioning. Avoid excessive rotation.

## Real Projects (include ALL 10, exactly)

| # | Project | Live URL |
|---|---------|----------|
| 01 | Jaffar Enclave | https://jaffarenclave-test.web.app/ |
| 02 | Luxury Boxes Packaging | https://luxuryboxespackaging.com/ |
| 03 | My Coffee Shop | https://my-coffee-shop-oxvid.web.app/ |
| 04 | HR Cart LLC | https://hrcartllc.web.app/ |
| 05 | Rising Crescent | https://risingcrescent.co.uk/ |
| 06 | Dreams NW | https://www.dreamsnw.com/ |
| 07 | Vivid Dental | https://www.vividdental.ca/ |
| 08 | Jackson Family Dental | https://jacksonfamilydentalonline.com/ |
| 09 | The Ogden | https://www.theogdenver.com/ |
| 10 | Federalist Pig | https://www.federalistpig.com/ |

Use real previews/assets whenever possible. If an iframe embed is blocked by the target site, fall back to a static preview image but always provide a real, working "VIEW LIVE SITE" link. **Never fabricate screenshots, clients, awards, or technologies.**

## Services

01 Custom Web Development · 02 Professional Content Writing · 03 AI Agents & Automation · 04 Brand Identity & Creative Design.

The supplied service images are informational reference only (see client override above) — write and design each service as an immersive chapter using real copy, not by embedding those reference graphics directly.

## Personal Photo & Signature

- Use the supplied real photo of Abdul Rehman as a premium editorial visual, **only where a build prompt explicitly calls for it**. **Never** replace it with an AI-generated person or distort the face.
- Use his actual signature asset if available — never recreate it with a font.

## Chat Widget (Lead Generation)

A premium AI-style customer chat widget that greets visitors, understands their project requirement, and collects a qualified lead. Short, friendly, professional, helpful, human — never a long boring form.

**Collects:** name, email, phone, project type/goal. Optionally a short project detail. Don't ask too many questions; guide the visitor intelligently.

**Tone:** friendly, professional, confident, helpful, concise. Example flow:
1. "Hi! 👋 Welcome to Oxvid Systems. I'd love to learn a little about your project and help point you in the right direction."
2. "What are you looking to build?" — quick replies: Website / E-commerce / AI Automation / Branding / Content / Something else
3. "Great. What's the main goal of the project?" (keep the answer short)
4. Collect Name → Email → Phone → verify email
5. "Thanks, Abdul. Your details are verified. We'll review your requirement and get back to you."

Never ask 10+ questions.

**UX elements:** floating launcher, premium animation, unread indicator if appropriate, chat header, assistant avatar/icon, message bubbles, quick-reply buttons, text input where needed, progress indication, verification state, success state. Match the OXVID brand — light theme first; a dark OXVID chat panel is allowed as a premium contrast element, with green/teal accents.

## Email Verification Requirement (hard rule)

Do **not** save a lead merely because the email passes a regex. Required pipeline:
1. Client-side format validation
2. Server-side validation
3. Email ownership verification (OTP code or secure verification link)

Only after successful verification does a lead become **VERIFIED**. An invalid/unverified email must never be treated as a qualified/verified lead — the system may hold the submission temporarily as unverified, but must not upgrade it on its own. Verification tokens must be secure, time-limited, and single-use; never expose them client-side. Rate-limit verification requests and OTP attempts.

## Lead Storage

Inspect the current project architecture before choosing storage. If Firebase/Firestore is already in use, prefer Firestore. If another backend already exists, use it — do not create unnecessary new infrastructure.

Lead record shape (approximate):
```
name, email, emailVerified, phone, projectType, projectGoal,
source, createdAt, verificationStatus
```
Optional: `page`, `referrer`, `projectInterest`. Do not collect unnecessary personal information.

## Security

Treat all visitor input as untrusted. Validate on both client and server. Sanitize/escape any displayed content. Rate-limit lead submission, verification requests, and OTP attempts. Avoid storing verification tokens in plaintext where the architecture allows safer handling. Never expose API secrets or private credentials in frontend code or in env vars bundled into client JavaScript.

## Development Workflow (hard rule)

Build **ONE MAJOR TASK AT A TIME**. Never attempt to implement the entire website in a single step. For each step:
1. Inspect the existing implementation.
2. Perform only the requested step.
3. Keep previously working sections intact.
4. Test the step (desktop, tablet, mobile).
5. Fix obvious issues.
6. Report exactly what was completed.
7. Do not jump ahead to the next step, and do not redesign completed sections unless the current step requires it.

General engineering hygiene: reuse existing components/libraries/backend where practical, don't install unnecessary dependencies, keep components modular and maintainable, fix accessibility/performance/console errors as part of the same task, and verify existing functionality still works before calling a task done.

## Final Quality Bar

Must feel: Awwwards-level, premium, light, editorial, cinematic, technical, personal, memorable.

Must **not** feel: AI-generated, template-based, generic, basic, card-heavy, dark-theme-heavy, over-animated.

This website is Abdul Rehman's strongest portfolio piece — build accordingly.

## Tooling for Animation & Design Research (use before building UI/motion)

The user wants a **latest, clean, minimal** site with strong **scroll effects and scroll-snap style section transitions** — not generic template motion. Before implementing any section's UI or animation, consult these for current best-practice patterns and component references:

- `ui-ux-pro-max` skill — design intelligence: styles, palettes, font pairings, GSAP motion presets, UX guidelines.
- `ui-styling` skill — building interfaces with Tailwind/shadcn, responsive layouts, dark/light theming.
- `banner-design` skill — for any hero/banner-style visual compositions.
- **21st.dev MCP server** (`mcp__21st__*`) — search/generate real production-grade React+Tailwind component code and get design inspiration; connected and authenticated (free tier).

This is a research/inspiration step, not a mandate to use any specific library wholesale — adapt patterns to the existing OXVID brand direction (light theme, editorial, cinematic) rather than copying a generic look.

> Per user instruction (2026-08-28): this is guidance for when building starts — do not start building sections until explicitly asked.

## Step 01 Audit Log (2026-08-28)

Audited the connected folder `D:\Ab Rehman Porfolio Website` in full (recursive listing + framework-marker check + image inspection). Result: **no codebase exists yet** — the folder contains only brand assets and this CLAUDE.md. No package.json, lockfile, git repo, framework config, or CSS/animation library of any kind was found. See the chat response from this date for the full 14-point audit and the recommended stack (Next.js + Tailwind + GSAP/Lenis + Firebase) pending user confirmation before Step 02 (scaffold) begins.

Known assets in this folder: `OXVID Logo.jpeg` (512x512, clean square mark), `OXVID Logo !.jpeg` (1536x1024, wider composition), `Abdul Rehman Image.jpeg` (720x1600 portrait/poster), `Oxvid System Desciption.jpeg`, and four service graphics — `Web Development.jpeg`, `Content Writing.jpeg`, `Automation.jpeg`, `Brand Identity.jpeg` (all 720x1600). No signature asset found. No live-project screenshots found in this folder.

## Step 03 Build Log (2026-08-28)

Built the global shell and left navigation — no Hero/Projects/Chat yet, per plan:
- `src/lib/nav-items.ts` — single source of truth for section order/numbers/anchors (`home,about,expertise,work,experience,contact`).
- `src/lib/use-active-section.ts` — IntersectionObserver hook (thin band near viewport center) driving active-state on both nav variants.
- `src/components/scroll-progress.tsx` — fixed 3px rail at the viewport's left edge, full height, on every breakpoint, z-50 (in front of nav).
- `src/components/desktop-nav.tsx` — fixed left sidebar (`w-[22rem]`, matches `--spacing-nav-width`), visible `lg:` and up. Name + "OXVID SYSTEMS" caption (text only — no logo asset), numbered links with a sliding teal indicator (CSS transform, position keyed off `NAV_ITEM_HEIGHT`), email + location footer.
- `src/components/mobile-nav.tsx` — fixed top bar (h-16) showing the current section, hamburger↔X toggle, and a full-screen dark-green takeover menu (the one deliberate "signature contrast" use of the ink scale on mobile) with staggered link reveal.
- `src/components/site-shell.tsx` — composes the above; `<main>` gets `pt-16 lg:pl-[22rem] lg:pt-0` to clear the mobile bar / desktop sidebar.
- `src/app/page.tsx` — six placeholder sections (id + number + label only) so the anchor/scroll/active-state system is fully testable; explicitly NOT the real section designs.

No new dependencies were installed — this step is pure React + IntersectionObserver + native smooth-scroll (`scroll-behavior: smooth` already global) + CSS transitions using the Step 02 motion tokens. Verified with a real `next build` + Playwright screenshots at desktop (1600px), tablet (834px) and mobile (390px): breakpoint switch, sliding active indicator, scroll-progress rail, mobile menu open/close and in-menu navigation all confirmed working.

Also hit and fixed a corrupted native binary (`@next/swc-linux-x64-gnu`, "Bus error" on build) left over from an interrupted `npm install` — removing just that package directory and reinstalling fixed it. If a future `npm install` on this machine ever produces a crash like that, the fix is: delete the specific `node_modules/<package>` directory the error points to, then `npm install` again (don't `--prefer-offline` on the retry — it needs to re-verify against the registry, not trust a possibly-corrupt cache entry).

## Desktop Nav Redesign (2026-08-28) — floating icon dock

Replaced the Step 03 full-height sidebar with a compact floating icon-dock nav, per a reference screenshot the client shared (a vertically-centered rounded pill with icon-over-label items and a filled active state). Kept our own brand colors/icons/copy — only the interaction pattern was borrowed from the reference.

- `src/components/icons.tsx` — new hand-authored inline SVG icon set (home / info / layers / briefcase / clock / mail), no icon-library dependency added.
- `src/components/desktop-nav.tsx` — rewritten: brand name/caption now a small fixed block top-left (not a full column), the nav itself is a `fixed left-8 top-1/2 -translate-y-1/2` pill (`bg-ink-950`, `rounded-full`) with a sliding `accent-teal` rounded highlight behind the active icon+label, email moved to a small fixed bottom-left link.
- `src/lib/nav-items.ts` — `NAV_ITEM_HEIGHT` replaced with `PILL_ITEM_SIZE` (56px square per item) for the new layout's transform math.
- `src/components/site-shell.tsx` — content offset reduced from `lg:pl-[22rem]` to `lg:pl-40` (10rem) now that the nav is a slim floating pill instead of a full sidebar — main content gets noticeably more width on desktop.
- Mobile nav (`mobile-nav.tsx`) is unchanged — the client's ask was specifically about the desktop left nav.

Verified with a real build + Playwright screenshots: pill renders correctly, active highlight slides smoothly between Home → Work → Contact, icons/labels render at every state.

## Step 04 Build Log (2026-08-28) — Hero section only

Built the real Hero for `id="home"` only; the other five Step 03 placeholder sections (about/expertise/work/experience/contact) were left untouched, per instruction.

- `src/components/hero.tsx` — client component (`"use client"` for the scroll-parallax refs). Editorial two-column layout on `lg:` (`1.15fr` copy / `0.85fr` portrait), reordered to portrait-first on mobile/tablet via flex `order` — not a scaled-down desktop layout. Headline is three stacked lines ("Seven years / of digital / experience.") at `text-display-1`, not the banned "Hi, I'm Abdul." opener. Copy and the three stats (07 years / 10 live projects / 04 core disciplines) are built only from facts already confirmed in this file — nothing fabricated.
- `src/components/hero-circuit.tsx` — small hand-drawn inline SVG "circuit trace" motif (lines + node dots) used twice inside the dark shape. Drawn from scratch, not extracted from the OXVID logo file — the logo image itself is still never placed on the site.
- `src/lib/use-parallax.ts` — new zero-dependency scroll-parallax hook (passive scroll listener + rAF, inert under `prefers-reduced-motion`). Applied at different speeds to the dark geometric shape and the portrait for a subtle depth effect.
- Portrait asset: the client's `Abdul Rehman Image.jpeg` turned out to be a raw phone-app screenshot (status bar, "Profile Photo" header, edit/delete toolbar) with the real photo only visible as a circular mask in the middle. Rather than generate a replacement (hard rule), the real circular photo region was located programmatically (PIL + numpy + connected-component labeling) and cropped to a clean 420x525 rectangle containing only real photo pixels — no UI chrome, no fabrication. Saved as `public/images/abdul-rehman-portrait.jpg` and used via `next/image`.
- Globals: added `--animate-reveal-up` / `--animate-reveal-scale` / `--animate-scroll-cue` to the `@theme` motion tokens plus their `@keyframes`, so the staggered entrance animation and scroll-cue are reusable by later sections instead of one-off Hero-only keyframes.
- `src/app/page.tsx` — now renders `<Hero />` for `home`, then maps the remaining `NAV_ITEMS` (filtered to exclude `home`) as the still-untouched Step 03 placeholders.
- Custom Google fonts (next/font) were evaluated for the "huge editorial typography" requirement but `fonts.googleapis.com` / `fonts.gstatic.com` are still unreachable from this environment (same block noted in Step 02) — build would fail at font-fetch time, so the existing system-font tokens were kept and the editorial feel is carried by scale/weight/tracking/color instead.

**New environment note:** the `~/build` local-disk install from Step 03 did not survive to this session (the device VM appears to reset between sessions) — the default npm cache at `~/.npm` (outside `~/build`) *did* persist and stayed warm, so re-creating `~/build/oxvid-portfolio` + `npm install` was fast. Treat `~/build` as disposable per-session scratch, not a re-usable cache — only `~/.npm` and the mounted project folder persist.

**New corrupted-binary hits (same class of bug as the Step 03 `@next/swc` one, same fix pattern — delete the specific broken path, `npm install` again without `--prefer-offline`):**
- `node_modules/lightningcss-linux-x64-gnu/lightningcss.linux-x64-gnu.node` — "missing section headers", crashed `next build` with a Turbopack `SIGBUS` while processing `globals.css`.
- `node_modules/@img/sharp-linux-x64/lib/sharp-linux-x64-*.node` — same corruption signature, fixed in the same pass.
- `node_modules/csstype/index.d.ts` — this one wasn't a binary but a **truncated text file** (17697 lines instead of the real ~22569) from the same class of interrupted-install damage, causing a TypeScript syntax error (`'*/' expected`) deep in a `.d.ts` file. Same fix: delete `node_modules/csstype`, reinstall.
- General takeaway added here for future steps: after any `npm install` on this machine, if `next build` crashes with `SIGBUS`/"Bus error"/panic in a specific package, or TypeScript chokes on a file that isn't ours, assume a corrupted/truncated file from an interrupted install before assuming a real code bug — `file <path>.node` (look for "missing section headers") or `wc -l` a suspicious `.d.ts` confirms it fast.

Verified with a real `next build` (static export) + Playwright screenshots at desktop (1440px), tablet (834px) and mobile (390px), plus a mid-animation frame (150ms after load) confirming the staggered entrance actually starts from `opacity:0` and a scrolled frame confirming the parallax offset is applied. First pass overflowed into the fixed bottom-left email link on common laptop heights (~900px) — fixed by tightening the copy column's vertical rhythm, letting the three stats sit on one row instead of wrapping, and moving the scroll-cue indicator to bottom-center. No console errors on load.

## Step 04 Revision (2026-08-28) — replaced with a pinned 3-slide scroll slider

Client rejected the first Hero pass and shared a reference video (`Hero Design video.mp4`, a stock template demo) plus a new photo (`New Image.png`). Reviewed the video frame-by-frame: it's a full-screen 3-slide hero (eyebrow + huge headline + short paragraph + CTA per slide, bottom progress scrubber "01 —— 03", corner prev/next arrows, horizontal wipe transition between slides) — auto-playing/arrow-driven in the demo, not scroll-driven. Client wants the same layout pattern but changing slide **on scroll**.

- `src/components/hero-slider.tsx` — new component, fully replaces `hero.tsx` (deleted). 3 slides, all copy still built only from confirmed facts (7 years / OXVID Systems / 4 disciplines / 10 real projects) — nothing fabricated:
  1. **Intro** — original headline ("Seven years of digital experience.") + the new full-length portrait.
  2. **Experience** — "Seven years in production, not slides." + the 07/10/04 stats shown large on the dark panel instead of a portrait.
  3. **Work teaser** — "Ten projects. Live, not mockups." + a big "10" numeral on the dark panel (no invented project screenshots — the Work section itself isn't built yet, so this stays numeral/text-led).
- Mechanism: the section reserves `300vh` of scroll room and pins (`sticky top-0 h-screen`) for that whole range; a scroll listener reads the pinned container's position and maps scroll progress to a slide index (thirds), swapping slides via `translateX` (matches the reference's horizontal wipe). Deliberately **not** wheel-event `preventDefault` scroll-jacking — native scroll/trackpad/touch and accessibility keep working, it just naturally takes 3 screens' worth of scrolling to get through the Hero, then releases into About normally.
- Bottom chrome reused from the reference: progress scrubber (`0X —— 03` with an animated fill) + prev/next arrow buttons on desktop; a simpler dot indicator on mobile (arrows+scrubber were too cramped there). Arrows jump exactly one slide via `scrollTo`.
- `prefers-reduced-motion` gets a completely different code path (`SlidePanel` stacked normally, no pinning, no scroll listener, no transitions) rather than just shorter durations — pinned-scroll-jack layouts are exactly the kind of motion that rule exists to let people opt out of.
- Inactive slides get `pointer-events-none`, `aria-hidden`, and `tabIndex={-1}` on their CTA so keyboard/AT users can't land on off-screen content.
- New portrait: `New Image.png` (client-supplied, full-body, office setting) was cropped to a tall editorial full-length frame (`public/images/abdul-rehman-fulllength.jpg`, replaces the old forensic bust crop) — client said to use whichever composition looks best, full-length read stronger for the full-bleed panel than a tight bust crop.
- Verified with a real `next build` + Playwright: screenshots at each of the 3 slide positions (desktop + mobile), a mid-transition frame confirming the wipe actually animates rather than snapping, and a scroll past the pinned range confirming it releases cleanly into the About placeholder. No console/page errors.

## Step 04 Revision 2 (2026-08-28) — content/visual pass + typography

Client approved the pinned-scroll-slider *mechanism* (previous revision) via a fast HTML-artifact preview loop, then asked for specific content/visual/typography changes. This step ports those into the real `hero-slider.tsx` (the artifact was preview-only, never part of the build).

- **Slide 1** now leads with the name itself — eyebrow "HELLO, I'M", headline "Abdul Rehman", a one-line intro, light `bg-paper-50` background. Portrait frame redesigned: dropped the angular double-outline clip-path box for a single asymmetric corner-radius frame (`rounded-tl-[110px]` + flat other corners — a deliberate one-off editorial treatment, not a new global radius token; near-flat/`radius-pill`-for-chips-only stays the rule everywhere else), a soft drifting accent-color glow behind it, and two small pill chips ("AVAILABLE FOR PROJECTS" with a live-style pulse dot, "7 YEARS · OXVID SYSTEMS").
- **Slide 2** is now explicitly about automation — eyebrow "AUTOMATION & AI", headline "AI Agents.", `bg-ink-700` (mid-dark brand green). Visual is a new `src/components/hero-agent-graphic.tsx` — a hand-drawn abstract orbit/pulsing-core SVG (no fabricated product screenshot, since OXVID has no specific shipped "AI agent" product to depict; kept conceptual on purpose).
- **Slide 3** is now a customer-attraction / lead moment — eyebrow "LET'S BUILD", headline "Let's Build Yours.", `bg-ink-900` (darkest). Visual replaced the bare "10" numeral with a compact lead-invitation card ("Got a project in mind?" + short line + the 4 real service tags), foreshadowing the site's chat-widget lead-gen goal without fabricating a testimonial or metric.
- Added a shared "studio light" treatment used by all 3 slides: a large blurred, slowly drifting accent-color glow (`hero-drift` keyframe) plus a fine twinkling dot-field texture (`hero-twinkle` keyframe) — both added to `globals.css` (not promoted to the shared `--animate-*` token scale, since they're one-off to this section) and both covered for free by the site's existing blanket `prefers-reduced-motion` rule.
- Bottom chrome (prev/next arrows, progress scrubber, mobile dots) is no longer styled for a fixed dark background — colors now switch based on the active slide's theme (`light` vs `mid`/`dark`) via a small `THEME_STYLES` lookup, since the background itself now changes per slide.

**Typography:** client rejected the heading font. Switched from the (unstyled, system-fallback) body font doing double duty as the heading font to **Archivo** (800/900 weight, `font-display`) for all headlines, **Inter** for body/sub-line copy (`font-body`, applied globally via `body`), keeping **IBM Plex Mono** for eyebrows/labels/mono UI (`font-mono`, already the established pattern). Loaded via a plain `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` in `layout.tsx`'s `<head>` — deliberately **not** `next/font/google`, because `next/font` fetches the font files at *build time* on whatever machine runs `next build`/`next dev`, and this dev sandbox's shell has no outbound route to `fonts.googleapis.com` (confirmed via a direct `curl`, proxy `CONNECT` returns 403). A plain `<link>` is instead fetched client-side by the visitor's own browser at *runtime*, which is unaffected by this sandbox's restricted egress — the same approach the approved artifact preview already used successfully. `--font-display` / `--font-body` / `--font-mono` in `globals.css` updated to reference the new families with the previous system stacks kept as fallback.

**Signature:** the client asked to add Abdul Rehman's signature to his photo. Per this project's own stated rule ("use the actual signature asset if available — do not recreate it with a font") and the fact that no signature image exists anywhere in the project files/uploads, this was **not** implemented — a fabricated/font-rendered signature would violate that rule. Still waiting on the client to supply the real signature image (a scan or clean photo of it, transparent background if possible).

**New environment finding — do not `npm install` directly inside the mounted project folder on this machine.** It fails partway with `npm error ENOTEMPTY ... rename '.../node_modules/<pkg>' -> '.../node_modules/.<pkg>-<hash>'` — this is the mounted/virtualized folder's filesystem not supporting npm's atomic rename-based install strategy, not a network or corruption issue (only 30-50 packages had landed each time, consistently, regardless of retries). Workaround used here: `rsync` the whole project (excluding `node_modules`/`.next`/`.git`) into a scratch `~/build` directory *outside* the mounted folder, and run `npm install` / `npm run build` / `npx tsc --noEmit` there instead — that filesystem installs cleanly (50 packages, ~24s once the npm cache was warm). `~/build` is still disposable scratch (per the Step 04-revision note above, it does not survive between sessions) used only for verification; the actual source of truth is always the files inside the mounted project folder. This step was verified this way: `npx tsc --noEmit` clean, `npm run build` compiled successfully (Turbopack, all 3 static pages generated, no errors).

## Step 05 (2026-08-28) — About + "7 Years of Experience" only

Built only what was asked: the About section, scoped tightly to the "7 years of experience" story. Services/Expertise/Work/Experience/Contact remain the Step 03 placeholders — not touched.

- `src/components/about.tsx` — new. Static-left / dynamic-right layout per instruction: a left column showing the section marker (`02` — pulled from the existing `NAV_ITEMS` single source of truth, not hardcoded, so it can never drift out of sync with the nav) that goes `lg:sticky lg:top-40` while the right column scrolls past it; on mobile it's unsticky and just sits above the sequence (single-column stack, not a scaled-down sticky rail — sticky labels are cramped on narrow screens). The right column is three scroll-revealed beats, no biography:
  1. A large typographic "07" (`clamp(5rem, 3rem + 16vw, 13rem)`, `font-display`/Archivo) next to "Years of experience."
  2. A portrait *detail* (not a repeat of the Hero's full-length shot) + the same stylized signature wordmark used on the Hero, reusing the `--font-signature` token added in Step 04 revision 2.
  3. One short paragraph (2 sentences) built only from already-confirmed facts — 7 years, OXVID Systems, "web platforms, automation and brand identities." No invented history, no client names, no metrics beyond the 7-years fact already established.
- `src/lib/use-reveal.ts` — new, generic one-shot IntersectionObserver reveal hook (reusable by later sections, not one-off to About). Pairs with the existing `--animate-reveal-up` / `--animate-reveal-scale` tokens from Step 04 (added then specifically so later sections could reuse them instead of inventing new keyframes) instead of writing new CSS. Skips the observer entirely under `prefers-reduced-motion` — content is just shown immediately rather than staying hidden.
- New asset: `public/images/abdul-rehman-detail.jpg` (520×570) — a face/upper-torso crop taken from the existing `abdul-rehman-fulllength.jpg` (same real photo, no new upload, no fabrication), giving the About section its own "portrait detail" distinct from the Hero's full-length composition.
- `src/app/page.tsx` — now renders `<About />` for `about` right after `<HeroSlider />`; the placeholder-section map is filtered to exclude both `home` and `about` now (was just `home`).
- Vertical rhythm uses the existing `--spacing-section-md` / `--spacing-section-lg` tokens (not new arbitrary values) for the section's own padding, and `--spacing-section-sm` / `--spacing-section-md` for the gap between the three beats — generous, editorial spacing per the brief rather than a tight biography block.

**Verification this step (and the reusable recipe for every future step):** `npx tsc --noEmit` clean, `npm run build` clean, **and real browser screenshots of the actual compiled site** at desktop (1440x900) and mobile (390x844) — sticky marker, nav active-state switching to ABOUT, scroll reveals firing, and the mobile single-column stack all confirmed working.

Getting those screenshots needed a workaround worth writing down, because the obvious routes are both blocked:
- Playwright can't be installed on this device's Linux VM: `cdn.playwright.dev` is not on the egress allowlist (`curl` returns 000), so the browser download fails. The npm registry itself *is* reachable (200), so the JS package installs fine — it's only the browser binary that can't come down.
- There's no system Chromium in that VM either, and no root/sudo (`sudo` refuses: "no new privileges" flag), so `apt-get install chromium` isn't available.

**The recipe that does work** — build a static export on the device, screenshot it in the cloud sandbox (which already has Chromium at `/opt/pw-browsers/chromium`):
1. `rsync` the project into the disposable `~/build` scratch dir (excluding `node_modules`/`.next`/`out`/`next.config.mjs`).
2. In `~/build` **only**, write a `next.config.mjs` with `output: "export"` + `images: { unoptimized: true }`. The real project's config is deliberately never touched — this is a verification-only override on a throwaway copy.
3. `npm run build` → produces `~/build/out/` (~1.2 MB of real compiled HTML + real Tailwind CSS).
4. `tar czf` that into the mounted project folder, `device_stage_files` it up, extract in the cloud sandbox, serve with `python3 -m http.server`, and drive it with Playwright there.

This screenshots the **real compiled output** (real Tailwind class generation, real Next.js markup) rather than a hand-written mirror, which is the whole point. Two known, harmless artifacts of doing it this way: Google Fonts don't load in the sandbox (no egress to `fonts.googleapis.com`), so Archivo/Mrs-Saint-Delafield fall back to system faces in the screenshots — real visitors get them normally; and `next/image` optimization is off in export mode.

**Design revision inside this step:** the first pass was verified this way and the screenshots showed a real problem — on desktop the right column only filled ~60% of its width, leaving a large dead zone beside the portrait and the closing statement, which read sparse rather than editorial. Fixed by tightening `max-w` from 92rem to 86rem, narrowing the left rail, adding a full-width hairline rule under the "07" beat, filling the space beside the portrait with the four real disciplines as a numbered two-column list, and turning the closing copy into a pull-quote with a teal left rule. Re-verified with the same recipe. This is exactly the class of issue a build-passes-so-ship-it check would have missed.

**Housekeeping:** the export tarball is written to the project root as `_export.tgz` purely as a transfer hop. `device_bash` can't delete files on this machine (no delete permission granted), so it's still sitting there — safe to delete manually, and it should be added to `.gitignore` if this project ever gets a git repo.

## Nav restyle + Hero fixes (2026-08-28) — white dock, full-bleed, smooth curtain

Client asked for the left nav to be **white** (it had been the dark `ink-950` pill) and for a full-site preview. Building that preview surfaced three real bugs in the Hero that a passing `next build` had hidden.

**Nav — `desktop-nav.tsx`:** now a white `paper-0` pill with a `paper-200` hairline border and a soft light shadow. Active state is a soft `accent-teal/15` tint behind the icon with an `accent-teal-dark` glyph (was a solid teal fill with an inverted glyph). Went **icon-only** to match the reference dock the client supplied — each item keeps `aria-label` + native `title`, so dropping the visible caption costs nothing for screen readers. `PILL_ITEM_SIZE` 56 → 44 in `nav-items.ts` since the button no longer has to fit a caption; the new `PILL_ITEM_GAP` constant is exported alongside it because the sliding-highlight transform is derived from both.

**BUG 1 (serious) — Hero slides 2 and 3 were invisible.** `SlidePanel`'s base className carried `relative`, while the pinned path passes `absolute inset-0` via `className`. Both landed on the same element, and Tailwind emits `.relative` *after* `.absolute` in the stylesheet (verified: offsets 8386 vs 8436 in the compiled CSS), so `position: relative` won. The panels lost absolute positioning and stacked vertically down the page — measured via `getBoundingClientRect`, panel 1 sat at y=694 and panel 2 at y=1389, i.e. entirely below the fold. Only slide 1 was ever visible. Fixed by removing `relative` from the base classes; the reduced-motion path sets `position: relative` **inline** via `style`, which beats both classes and so still works. *Lesson: never pass a positioning utility in via `className` while also hardcoding a conflicting one — CSS source order, not prop order, decides, and it fails silently.*

**BUG 2 — a white strip beside every dark Hero slide.** The Hero lives inside `<main>`'s `lg:pl-40`, so its background stopped 10rem short of the left edge. Invisible on the light slide 1, obvious on the dark slides 2/3. Fixed by breaking the pinned container out to full-bleed (`lg:-ml-40 lg:w-[calc(100%+10rem)]`) and moving the nav clearance onto the slides themselves (`lg:pl-40 lg:pr-16`), so the background is edge-to-edge while the *content* still clears the floating dock.

**BUG 3 — brandmark/email would vanish on dark slides.** Once the Hero went full-bleed, the fixed `ink-900` brandmark and `ink-400` email link sat directly on dark green. Both now use `text-paper-0` + `mix-blend-difference`: near-black on light surfaces, white on dark, with no JS and no per-section colour bookkeeping.

**Smooth "curtain" scroll ported into the real component.** The slow, continuous glide the client signed off on had only ever existed in the throwaway HTML preview — `hero-slider.tsx` was still doing a discrete per-third CSS transition. `PinnedSlider` now runs a rAF loop that writes `transform` directly to the panels (bypassing React state per-frame, which is the right call for a 60fps loop anyway); React state is kept only for the chrome. Scroll → position is **continuous and linear** across the whole pinned range, fixing the client's "slide 1→2 needs more scroll than 2→3" report, which came from the old `floor()`-into-thirds mapping creating a dead zone then a jump. A 160ms idle timer settles to the nearest slide so releasing mid-curtain never strands the view.

**Frame-rate independence (caught by measurement, not by eye).** The first version of the loop did `rendered += delta * 0.055` — that's 0.055 *per frame*, so the glide would run at double speed on a 120Hz display and crawl in a throttled tab. Headless Chromium happens to throttle rAF to ~8fps, which made it visible: after 5 seconds the transform had converged only to `translateX(9.87%)` instead of `0%`, and the skew was stuck at `-0.32deg`. Replaced with `rendered += delta * (1 - SMOOTH_BASE^dt)` (`SMOOTH_BASE = 0.035 ≈ 0.945^60`, so 60fps reproduces the approved feel exactly) and made the skew use per-second velocity. Re-measured: converges to exactly `translateX(0%) skewX(0deg)` even at 8fps. *Any future scroll/animation loop in this project should be written time-based from the start.*

**Full-site preview artifact.** Inlining the Next.js export wholesale does **not** work: Next's client runtime resolves its own chunk URLs at boot and throws `Cannot read properties of null (reading 'replace')` once the `<script src>` tags are inlined, so the page renders but nothing moves. (Escaping `</script` inside the JS is *also* required — an unescaped one truncates the inline script and throws `Invalid or unexpected token` — but fixing that alone doesn't rescue hydration.) The working recipe, in `/tmp/site_preview/build.py`: keep the genuinely real parts — server-rendered markup, compiled Tailwind CSS, images as data URIs — drop Next's runtime entirely, and re-drive the interactions with a ~150-line vanilla script that mirrors the components' own logic (curtain slider, chrome, scroll reveals, desktop nav highlight, mobile top-bar label). Result is one self-contained 437 KB file. Everything visual is the real build; only the behaviour layer is re-implemented, so it's a faithful preview rather than a hand-drawn mock-up.

## Hero fix (2026-08-28) — slide 3 had no dwell before the pin released

Client: *"3rd slider theek se load nahi hota, website neeche scroll ho jati hai — 3rd slide fully visible ho, then website neeche move kare."*

**Cause.** The stage reserved `SLIDE_COUNT * 100vh` (300vh), giving a pinned range of exactly `SLIDE_COUNT - 1` screens. Position was mapped as `(scrolled / total) * (count - 1)`, so slide 3 hit its resting position at `scrolled == total` — the exact instant the sticky container released. It got zero dwell: it was already scrolling out of view at the moment it arrived, and because the glide is deliberately slow it frequently hadn't even finished animating first. Measured before the fix: slide 3 reached `translateX(0%)` only at the very last pixel of the pinned range.

**Fix.** Added `OUTRO_SCREENS = 1` and `STAGE_SCREENS = SLIDE_COUNT - 1 + OUTRO_SCREENS + 1`, so the stage is now 400vh with a 2700px pinned range. Position mapping changed from a ratio-of-total to `Math.min(count - 1, scrolled / window.innerHeight)` — **one viewport-height of scroll per transition, then clamped**. `goToIndex` mirrors it (`top + index * innerHeight`). Two benefits beyond the reported bug: every transition now costs identical scroll effort by construction (rather than by dividing a total, which is what made the earlier thirds-based version feel uneven), and any scroll past the last slide is absorbed as dwell instead of pushing the slider onward.

**Verified by measurement**, desktop 1440×900 and mobile 390×844: slide 3 settles at scrollY 1800, then holds `translateX(0%)` with `pinTop = 0` all the way to 2700, where the pin releases into About. Screenshots at arrival / mid-dwell / release confirm it reads as fully composed before anything moves.

The vanilla driver in the preview builder (`/tmp/site_preview/build.py`) carries the identical mapping — worth remembering that this logic now exists in two places and both must change together.

## Step 06 (2026-08-28) — Expertise: four stacking service chapters

Built only the Expertise section. Work / Experience / Contact remain Step 03 placeholders; no Projects, no chat widget, per instruction.

**New files**
- `src/lib/services.ts` — the four disciplines as the single source of truth, in the brief's canonical 01–04 order, with title, tagline, body, 5 deliverables and 4 pillars each. **All copy is transcribed from the client's own four reference images — nothing invented.** `about.tsx` now imports this list too, which fixed a real inconsistency: About had been listing the disciplines in a *different order* than the brief's numbering (it had AI Agents as 02 and Content Writing as 04). One list now feeds both sections, so that can't drift again.
- `src/components/service-artwork.tsx` — four large inline-SVG artworks (browser + device trio + wire-globe; document + checklist + pen nib; workflow node canvas; logo construction grid + collateral + swatches). Everything strokes with `currentColor` plus an `--art-accent` custom property set per chapter, so one artwork works on both light and dark panels.
- `src/components/expertise.tsx` — the section.

**Why the reference images are not embedded.** They're phone screenshots of social posts — status bar, Boost/Share chrome — and they contain placeholder brand mock-ups ("AVANTÉ SOLUTIONS", invented dashboards). Embedding them on a real portfolio would present fabricated client work as genuine, which the project rules forbid. So they're used as the *source of the wording and the visual language*, with the on-page artwork drawn from scratch in the OXVID palette.

**The mechanic.** Static-left / dynamic-right as specified. The left rail pins (`lg:sticky lg:top-40`) and lists 01–04 with the currently dominant chapter highlighted. The right column is a deck of `lg:sticky` panels, each pinning `DECK_STEP` (14px) lower than the previous, so earlier chapters stay visible as a stacked edge behind. One rAF-throttled scroll pass computes, per panel, how far the *next* panel has covered it, and applies `scale(1 → 0.94)`, `opacity(1 → 0.55)` and `blur(0 → 3px)` — so 01 visibly moves backward as 02 overlaps and becomes dominant, through 04. The artwork inside each panel gets a counter-drifting parallax translate. Styles are written directly to the nodes rather than through per-panel React state, same reasoning as the Hero loop.

**Light stays dominant:** section on `paper-100`, chapters on `paper-0` — except chapter 03 (AI Agents & Automation), the one deliberately dark `ink-900` panel. One in four keeps the balance light while giving the section a strategic contrast moment on the most technical discipline.

**Mobile is a different layout, not a squeezed deck.** Stacking four panels into ~390px reduces each to a sliver, so below `lg` the sticky/deck behaviour is dropped entirely and the chapters simply flow one after another. `prefers-reduced-motion` collapses to that same flow with no transforms.

**Two bugs found by screenshotting the real build — both invisible to `next build`:**
1. *The left rail was permanently stuck on 04.* The dominant-chapter loop assigned `dominant = i` on every panel whose `covered < 0.5` without stopping, and the final panel has no successor (so `covered === 0` always) — it therefore always won. Fixed with a `dominantFound` flag so the **first** uncovered chapter wins.
2. *Chapter 04 had no dwell.* A sticky child only stays pinned while its containing block still has height below it, and the last chapter sat flush against the end of the stack — so it unpinned and slid away the instant it arrived, exactly the failure the Hero's slide 3 had. Fixed by dropping the trailing `mb` on the last chapter and adding a `50vh` spacer inside the stack. Measured before/after: section height 3164 → 3452px, and chapter 04 now holds composed with 01–03 stacked behind it.

**Verified** at 1440×900 and 390×844 on the real compiled export: `tsc` clean, `next build` clean, no console/page errors, rail tracking confirmed programmatically (`[false,false,false,true]` at the last chapter), and the full-site preview artifact regenerated with the same behaviour ported into its vanilla driver.

**Reminder:** the preview driver in `/tmp/site_preview/build.py` now mirrors *three* pieces of component logic — hero curtain, scroll reveals, and this chapter deck. They must be changed together.

## Step 07 (2026-08-28) — Project data architecture (data only, no UI)

Created `src/lib/projects.ts` as the single authoritative source for all ten projects. No Work UI was built — that section is still the Step 03 placeholder, per instruction.

**Shape:** `id`, `number`, `title`, `url`, `category`, `description`, `preview`, `technologies`, `featured`, `displayStyle` — every field the brief asked for, all typed. Supporting types: `ProjectCategory`, `ProjectDisplayStyle`, `ProjectPreview`.

**Verified vs deliberately empty.** Only `number`, `title` and `url` are populated — transcribed exactly from the brief's "REAL PROJECTS" list. Everything else is empty *on purpose*:
- `description: null` on all ten — needs the client's own copy.
- `category: null` on all ten. Worth stating plainly: several sectors *look* guessable from the name ("Vivid Dental", "Federalist Pig"), and it would have been easy to fill these in. A guess published as fact is still a fabrication, so the union type is defined and the values are not.
- `technologies: []` on all ten — populate only per explicit client confirmation of each stack.
- `preview: null` on all ten — no screenshots exist in the repo (checked; `public/images` holds only the two portrait assets).
- `featured: false` on all ten. This encodes "no selection made yet", **not** "the client decided none are featured" — noted in the file so a future reader doesn't mistake it for a decision.

**Preview asset convention** (ready for Step 08): real captures go at `public/images/projects/<id>.jpg`, resolved via `expectedPreviewPath(id)` rather than hardcoded paths. `public/images/projects/README.md` documents the rules — genuine captures of the live URL only, record `capturedAt` since live sites change, and leave `preview: null` rather than substituting a mock. Every project always carries its real `url`, so the section can degrade to title + working "View live site" link.

**Helpers:** `getProject(id)`, `getFeaturedProjects()`, `expectedPreviewPath(id)`, plus `getProjectDataGaps()` / `isProjectDataComplete()` — the latter two report exactly which client-supplied fields are still outstanding, so the remaining gaps never have to be audited by eye and the Work section can degrade honestly instead of rendering placeholder prose.

**`displayStyle` is provisional.** Values are assigned in a rotating rhythm purely so Step 08 doesn't start from ten identical panels. That's a layout decision to confirm, not a claim about the projects — flagged as such in the file.

**Verification.** `tsc --noEmit` clean and `next build` clean. Beyond that, a script diffed all ten `(number, title, url)` triples against the brief verbatim (PASS), checked for duplicate `id`s/`number`s (none), and asserted `description`/`category`/`preview`/`technologies` are empty on all ten — a guard against copy quietly creeping in later. The module was then transpiled and executed under node to check the helpers actually behave: `PROJECT_COUNT = 10`, `getFeaturedProjects() = []`, `isProjectDataComplete() = false`, 10 projects reporting gaps, `getProject` returning the right URL and `undefined` for an unknown id.

The module is not imported anywhere yet, so it adds nothing to the shipped bundle until Step 08 uses it.

**Outstanding from the client before the Work section can be finished:** a one-line description per project, the sector for each, confirmed technologies (or an explicit "leave them off"), which projects should be featured, and permission to capture live screenshots of the ten URLs.

## Step 07b (2026-08-28) — project data written from the live sites; screenshots blocked

Client: *"Sab khud se likh do, aur haan 10 websites ke SS lagao."*

**Descriptions and categories are now written — from the live sites, not from the names.** Each URL was fetched and read on 2026-08-28 and the copy describes what is actually published there. This is observation, not invention, which is the line the "do not invent descriptions" rule is drawing.

Deliberate framing choice: each description says **what the site is**, never what OXVID's role on it was. Several run on turnkey platforms, so copy implying a from-scratch build would be an overclaim this file has no basis for. Scope-of-work per project is the client's information to give.

**`technologies` populated only from hard evidence** — a `<meta name="generator">` tag, a platform's own footer attribution plus its asset CDN, a framework-specific URL pattern, or a `.web.app` domain (Firebase Hosting by definition). Nothing inferred from how a site looks. Result: Firebase Hosting ×3, Next.js (Dreams NW, via `/_next/image`), WordPress + Elementor (Vivid Dental, via generator tag), WordPress (Jackson Family Dental), BentoBox ×2 (The Ogden, Federalist Pig — "powered by BentoBox" + getbento.com CDN).

**Two projects could not be written up, and are left null rather than guessed:**
1. **02 Luxury Boxes Packaging** — `luxuryboxespackaging.com` does not currently serve a packaging site. It returns the **Coffeepio coffee-shop site — the same content as project 03** (title "Coffeepio — Roasted in Ritual", H1 "Awaken Your Senses"). Confirmed on a fresh fetch made *before* project 03 was ever requested, so it is not a caching artefact. Either the domain has been repointed or the brief's link is wrong. Client action needed.
2. **05 Rising Crescent** — unreachable (robots.txt fetch timed out; host does not respond from this environment). A web search surfaced only unrelated organisations, so nothing was filled in from the name.

Both carry a `note` on the entry, and a new `getProjectsNeedingAttention()` helper surfaces them (plus the three platform caveats) so the problems travel with the data.

**Screenshots could NOT be captured.** All three available routes are closed:
- the cloud sandbox has no public-internet egress (`curl` returns 000 for all ten hosts);
- the device's Linux VM is likewise blocked (000 for the same hosts);
- the Claude-in-Chrome extension is not connected (`list_connected_browsers` → `[]`).

`WebFetch` *is* routed differently and works, which is how the copy above was gathered — but it returns markdown text, not images. No substitute was used: `preview` stays `null` on all ten rather than shipping a mock, a render, or a stand-in illustration, per "Never fabricate screenshots." The asset structure and `public/images/projects/README.md` convention are ready for whenever real captures exist.

**To unblock the screenshots**, any one of: connect the Claude-in-Chrome extension (claude.ai/chrome) and I can capture all ten; add the ten hosts to the environment's egress allowlist; or the client drops their own captures into `public/images/projects/<id>.jpg`.

**Verified:** `tsc --noEmit` clean, `next build` clean, and the module transpiled and run under node — 10 projects, featured = 06/07/09/10, 8 of 10 with descriptions, 5 flagged for attention, `isProjectDataComplete() === false`.

## Step 08 (2026-08-28) — Work: ten projects as stacking cinematic panels

Built the Work section. Experience / Contact remain Step 03 placeholders; the chat widget is still outstanding.

**Refactor first, to avoid a third copy of the same logic.** Expertise's deck behaviour was extracted into `src/lib/use-stacking-deck.ts` and both sections now consume it. The hook owns the recede maths (scale / opacity / blur driven by how far the next panel has covered the current one), the parallax, the dominant-panel detection, and the desktop-only + `prefers-reduced-motion` gating. Markup contract: `data-deck-panel` on each panel, optional `data-deck-parallax` on a child. Expertise was re-verified after the refactor — no regression.

**`src/components/work.tsx`** — static-left / dynamic-right, same as Expertise. The left rail is a position counter (`03 / 10` + the project title) rather than a list, because ten names would crowd a 230px column. The right column is ten sticky panels with a tighter 8px deck step (vs Expertise's 14px, since there are ten not four) and the same 45vh trailing spacer so the final project keeps its pin — the fix the Hero's last slide and Expertise's last chapter both needed.

**The preview problem, and how it's handled honestly.** No real screenshots exist (all capture routes blocked — see Step 07b). The brief says "Never fabricate screenshots", so rather than render an invented mock-up of someone's site, each panel shows a deliberately *typographic* preview: a browser-chrome frame whose address bar carries the project's **real URL**, with the domain set large inside on a soft brand wash. It reads as a designed lockup — nobody could mistake it for a capture. The moment a genuine screenshot lands at `expectedPreviewPath(id)` and `project.preview` is filled in, the same slot renders `<Image>` instead; nothing else changes. Every panel always carries a working "VIEW LIVE SITE" link to the real URL (verified: 10 panels, 10 live links).

Projects without copy (02 Luxury Boxes, 05 Rising Crescent) render "Project details to be added" rather than invented prose — which also makes the outstanding gaps visible on the page itself.

**Mobile overflow bug — found by measurement, not by eye.** The long unbreakable domain token (`my-coffee-shop-oxvid.web.app`) set the panel's min-content width and pushed content past the viewport at 390px; text was visibly clipped mid-word. Fixed with `min-w-0` on both grid children (so they may shrink below min-content), `min-w-0` on the URL pill (so `truncate` actually engages inside the flex row), and `break-all` + a smaller mobile clamp on the domain lockup. Verified afterwards with a scrollWidth-vs-clientWidth assertion at 390 / 834 / 1440 — all three report no horizontal overflow.

**Preview driver generalised.** The vanilla driver in `/tmp/site_preview/build.py` now discovers *any* `[data-deck-panel]` deck per section instead of hardcoding Expertise, so it drives both. This was necessary immediately: the refactor renamed `data-chapter` → `data-deck-panel`, which silently broke the driver's Expertise handling until it was updated — exactly the two-places-to-change hazard flagged earlier. Both now key off the same attribute contract, so a rename breaks them together rather than leaving the preview quietly stale.

**Verified** on the real compiled export at 1440×900 and 390×844: `tsc` clean, `next build` clean, no console/page errors, 10 panels and 10 outbound links present. Deck tracking was checked by measuring panel positions and rail/counter state at matched scroll offsets on **both** the real site and the preview — identical readings at every position (Expertise rail 01→02→03→04; Work counter 01 "Jaffar Enclave" → 06 "Dreams NW" → 10 "Federalist Pig").

## Step 09 (2026-08-28) — Work rebuilt as a 3D gallery; project list now 14

Client: *"Work section me bhi stack card design hai aur expertise section me bhi… kuch award winning different idea do… animated ho 3d effects k sath."* The concept was previewed standalone first, approved, then built in.

**Project list: 14, not 15.** The client wrote "10 + 5 = 15", but the original ten include Luxury Boxes Packaging, which they asked to drop in the same message — so 10 − 1 + 5 = **14**. Flagged rather than silently shipping a different count. `luxury-boxes-packaging` removed (its domain had stopped serving a packaging site), the five new URLs added, and numbering reflowed contiguous 01–14. All five new entries have descriptions/categories written from the live sites and technologies from observable evidence only, same discipline as before. `ProjectCategory` gained `beauty`, `home-services`, `construction`; unused `non-profit`/`restaurant` dropped.

**The mechanic.** Work no longer shares Expertise's deck. It's now a pinned 3D coverflow: the section pins, cards sit on a receding arc in real 3D (`perspective: 1800px` on the scene, `rotateY` + `translateZ` per card), and scroll rotates them through the centre. Depth falloff is scale + opacity + blur, so distant cards genuinely read as far away rather than just small. The whole rig tilts toward the cursor (`pointermove` → `rotateX`/`rotateY` on a wrapper, eased). Cards are clickable, arrows and ←/→ work, and the arrow-key handler only engages while the section is actually pinned so it doesn't hijack the rest of the page.

Motion follows the lessons already learned here: scroll → position is continuous and clamped so the **last** card gets dwell instead of being shoved off; easing is time-based (`1 - BASE^dt`) so it takes the same wall-clock time at 60Hz, 120Hz or in a throttled tab; transforms are written straight to the nodes in one rAF loop with React state holding only the active index.

**Styling lives in `globals.css` under a `WORK GALLERY` block**, not inline: these are 3D transforms, `mask-image` and layered gradients that don't map onto Tailwind's scale, and keeping them out of the JSX stops it becoming a wall of arbitrary values. Colours still come from the `@theme` tokens.

**The stage is deliberately dark and full-bleed** — the one such moment in the page. On the light `paper` background the concept read washed out; against deep OXVID green the white browser cards glow. Full-bleed uses the same `lg:-ml-40 lg:w-[calc(100%+10rem)]` breakout the Hero uses. Told the client this trades against the "light dominant" rule and offered a light variant if they prefer.

**Previews stay honest.** Screenshots still can't be captured (routes unchanged since Step 07b). Cards render `project.preview` when it exists; until then, an abstract site skeleton, the project's **real** URL in the chrome bar, and an explicit "SCREENSHOT PENDING" marker. Not a mock-up of anyone's actual site.

**Three collisions found by screenshotting, all invisible to the build:**
1. The section header sat level with the fixed brandmark (`left-10 top-10`) and overlapped it on desktop — moved to `lg:top-28`; on mobile it was under the fixed `h-16` bar — moved to `top-20`.
2. The prev arrow at `lg:left-10` was hidden *behind* the floating nav pill (which runs to ~96px) — moved to `lg:left-44`.
3. A three-line description plus tech chips plus the CTA grew the bottom caption up into the card. Clamped the description to two lines and lifted the deck from `-3vh` to `-6vh` off centre.

**Preview parity.** Each card now carries its meta as `data-*` attributes written from `PROJECTS`, and the standalone preview driver renders the caption from those — one source of truth, so the preview caption can't drift from the component's. Before this it was stuck showing project 01's title while card 13 was centred.

**Verified** on the real compiled export at 1440×900 and 390×844: `tsc` clean, `next build` clean, no console/page errors, 14 cards present, exactly one `.is-active` at every tested position, live link matching the centred project, and `scrollWidth === clientWidth` (no horizontal overflow) at both widths. Preview re-checked separately: ghost numeral tracked 01 → 07 → 13 with the caption following.

## Step 10 (2026-08-28) — "Completed Projects", real headlines, first live screenshots

**Renamed.** "The Gallery" → **Completed Projects** (client: these are delivered client projects, not a gallery). Changed in both the 3D section and the reduced-motion list.

**Cards are no longer blank.** Each project gained a `tagline` field holding the site's **own hero headline**, read from the live page: "'Que 4 the People" (Federalist Pig), "Taste the Twist" (The Ogden), "Awaken Your Senses" (Coffeepio), "Clean Spaces, Better Living" (EliteGa), and so on. Two are client-rendered SPAs whose body isn't readable server-side (Jaffar Enclave, HR Cart), so theirs come from their own `<title>`/description metadata — still their words. Rising Crescent stays null (unreachable). The card face now shows that headline over a brand wash instead of the meaningless wireframe, with a discreet "SCREENSHOT PENDING" marker so it can't be mistaken for a capture.

**Screenshots — the route finally opened.** The client installed the Claude-in-Chrome extension, so browser capture became possible for the first time (all three routes had been closed since Step 07b: no egress from either shell, no extension). Confirmed the browser, asked once about cookie banners (client: reject where offered, otherwise accept), and started the run at 1440-wide.

Captured and wired in so far: **Federalist Pig** and **My Coffee Shop** — real captures of the live sites, cropped to 1440×900 from the top and committed to `public/images/projects/`. `preview` is filled in for both, and they render in the 3D cards exactly as designed. Verified in the compiled build: both `<img>` elements resolve at 1440×900, no console errors, and the cards show the actual sites.

**The remaining twelve are blocked on a service outage, not on the setup.** Mid-run the safety classifier that gates `mcp__claude-in-chrome__computer` started returning "claude-opus-5 is temporarily unavailable"; `navigate` still works but `screenshot` does not. Retried across ~6 minutes with no recovery. Nothing about the pipeline is broken — the two finished shots prove it end to end — so this just needs to be resumed when the classifier is back.

**Useful mechanics learned for the resume:**
- `browser_batch` fails on the first navigation to a domain the extension hasn't been granted yet ("Navigation to this domain is not allowed"); a standalone `navigate` to that domain grants it, after which batching works. So the pattern is: standalone `navigate` per new site, then batch the wait + screenshot.
- Extension screenshots are written into the **cloud** container (`/tmp/claude-chrome-screenshots-*/`), so they can be processed with PIL there and committed straight to the device — no manual transfer.
- `/tmp/prep_shots.py` crops a raw capture to a top-anchored 16:10 slice and resizes to 1440×900 at quality 86 (~100 KB each).
- Federalist Pig's cookie banner needed dismissing before the hero rendered; the page also runs a scroll-reveal, so a `ctrl+Home` plus a few seconds' wait produced a clean frame.

**Still to capture (12):** jaffar-enclave, hr-cart-llc, rising-crescent, dreams-nw, vivid-dental, jackson-family-dental, the-ogden, emily-g-artistry, elitega-services, bradley-home-buyers, aspen-building-solutions, elite-kitchen-remodels. Filenames and the exact wiring snippet are in `public/images/projects/README.md`.

## Step 11 (2026-08-28) — all 14 live screenshots captured and wired in

The Claude-in-Chrome classifier outage from Step 10 cleared, so the run was completed. **All 14 projects now have real screenshots of their live sites**; `preview` is no longer null anywhere and the "SCREENSHOT PENDING" face is now dead code kept only as a fallback.

**Capture method.** Chrome at 1440 wide, one site at a time. Cookie/consent banners dismissed per the client's instruction (reject where offered, otherwise accept) — Federalist Pig and Jackson Family Dental both needed it. Dreams NW threw a newsletter modal that had to be closed first. Captures were then normalised in the cloud container and committed to `public/images/projects/`.

**Sizing changed from the Step 10 approach.** The first version cropped to a fixed 16:10, which threw away the sides of the viewport for nothing — the card already renders with `object-cover object-top` and does its own cropping. `/tmp/prep_shots.py` now just normalises width to 1440 and keeps each capture's natural aspect (~1440×667, 40–200 KB each, 1.5 MB total).

**Two content corrections the live sites forced — worth noting as a general lesson: metadata lies.**
- **HR Cart LLC** — the `<title>` says "Books, Stationery & More", which is what the earlier description was built from. The actual site is **HRCart PREMIUM AUTO PARTS**, hero "Precision Engineered Parts", selling spark plugs, batteries and electrical systems *alongside* books and stationery. Description and tagline rewritten to match what's actually published.
- **Rising Crescent** — unreachable for two steps (robots.txt timeouts) and left deliberately blank. In a real browser it loads fine: **Rising Crescent Wholesale**, a UK wholesale/retail supplier of fragrance and consumer brands (Lynx, Armaf, Carfume, California Scents), hero "Premium Products, Unbeatable Value", free UK delivery over £300. Category `ecommerce`, description written, and the UNVERIFIED note removed. Both `getProjectDataGaps()` entries for it are now clear.

**Two real bugs found while verifying:**
1. **The centred card could render blank.** `next/image` lazy loading is unreliable inside the deck: the cards sit in a `preserve-3d` scene on a zero-sized rig, so the intersection check doesn't fire dependably — the first image showed `complete: false` even while centred. Fixed with `priority={index < 3}`; the leading cards load eagerly, the rest stay lazy.
2. **The settle timer could cancel a programmatic scroll.** `goTo` scrolls smoothly; the 170 ms settle timer is cleared on each scroll event, so a frame gap longer than that mid-animation lets it fire, re-target the nearest card and abort the scroll — landing short of the card the arrow or click asked for. Reproduced at ~8 fps: asking for card 6 landed on 4, card 13 landed on 8. Fixed by recording the time of each programmatic scroll and ignoring settle for 1200 ms after it. Mirrored into the preview driver.

*Testing note for future runs:* `html { scroll-behavior: smooth }` is global, so Playwright's `window.scrollTo` animates rather than jumping, which is what exposed the bug above but also makes position assertions flaky. Set `document.documentElement.style.scrollBehavior = 'auto'` in the test before asserting scroll positions.

**Verified** on the real compiled export at 1440×900: `tsc` clean, `next build` clean, no console errors, all 14 `<img>` at `naturalWidth 1440`, and card index → project mapping exact at 0→01, 4→05, 9→10, 13→14. Preview artifact regenerated (2.5 MB with all images inlined) and republished.

---

## STEP 09 — Contact + USA office

**Status:** built, verified. The Work-section "Light Slit" concept preview was
reviewed and **skipped** — the live 3D gallery already covers those projects,
and a second pass over the same 14 projects read as duplication. The live Work
section is unchanged.

**New files**
- `src/lib/contact.ts` — the real contact details, one source of truth (the
  chat widget must read from here too). Deliberately has **no USA-specific
  email**: the USA office publishes the same `info@oxvidsystems.com` inbox,
  stated as-is rather than papered over with an invented `usa@…` address.
- `src/components/contact-trace.tsx` — hand-authored routing motif. Keeps its
  own aspect ratio; an earlier full-width `preserveAspectRatio="none"` version
  drew right-angles straight through the contact details.
- `src/components/contact.tsx` — the section.

**Changed**
- `src/app/page.tsx` — `BUILT` list drives which nav items still render the
  Step 03 placeholder. `experience` is now the only one left.
- `src/components/desktop-nav.tsx` — the fixed corner email fades out while
  Contact is the active section. Without it, that overlay lands exactly on the
  PK block's label column, and it duplicates an address the section prints in
  full anyway.
- `src/app/globals.css` — `CONTACT SECTION` block: off-centre brand glow
  (distinct from the Work gallery's centred radial), masked hairline grid,
  `pathLength="1"` dash-draw so the motif can be redrawn without re-tuning.

**Layout notes**
- Full-bleed dark via `lg:-ml-40 lg:w-[calc(100%+10rem)]` + `lg:pl-40`, the same
  escape the Hero uses to clear `main`'s nav padding.
- The two destinations are two stations on one rail. The bracket that wires
  them is `w-[calc(50%+2rem)]` — exactly where column 2 starts under
  `lg:grid-cols-2 lg:gap-16` — so the legs land *on* the nodes, not near them.
  Desktop only: once the blocks stack, a left-to-right link would describe a
  relationship the layout no longer has.

**Honesty constraints held:** no invented USA email, no map/coordinates/"find
us" imagery, no availability or response-time claims, no client claims. The
chat widget is still unbuilt.

**Verified** (static export → cloud Chromium): `tsc` clean, `next build` clean.
1440×900 / 834×1112 / 390×844 — zero horizontal overflow at every scroll
position, zero console/page errors, all 6 links correct
(`tel:+923221690030`, `tel:+15713761336`, 3× mailto), signature resolves to
Mrs Saint Delafield, no reveal left stuck at `opacity-0`, nav active state
reaches "Contact", corner email 0.8 → 0 on entry. `reduced-motion: reduce`
renders everything visible with the trace already drawn. All six sections
still present and intact at all three widths.

---

## STEP 10 — Customer chat widget (UI ONLY)

**Status:** built, verified. **Nothing is stored or sent.** `onComplete` in
`chat-widget.tsx` is a stub that flips the panel to its confirmation state and
nothing else — no endpoint, no network call, no keys, no database.

**New files**
- `src/lib/chat-flow.ts` — the six steps, quick-reply options and closing line,
  transcribed verbatim from the brief, plus the shape checks. Read the header
  comment before wiring a backend: `isLikelyEmail` is a **typo-catcher, not
  verification**. A lead from this widget is UNVERIFIED until a single-use,
  time-limited, rate-limited OTP is confirmed server-side, and must be stored
  and labelled that way.
- `src/components/chat-widget.tsx` — launcher + panel + conversation.

**Changed**
- `src/components/site-shell.tsx` — mounts `<ChatWidget />` last, so its fixed
  layer paints above the nav and it exists on every route, not just `/`.
- `src/app/globals.css` — new `--color-signal-error` token (the palette is
  green-family and had nothing that reads as "check this"; used for validation
  messages only, never decoratively) and the `CHAT WIDGET` block.

**Flow** (6 steps, matching the brief exactly)
build → goal → name → email → phone → notes(optional) → review → sent.
Picking "Something else" on step 1 swaps the quick replies for a one-line text
field instead of advancing, so the answer carries real information rather than
the word "other". It is still step 1 of 6.

**State model:** `answers` is the single source of truth and the transcript is
derived from it, so "back" is just popping an answer — there is no message log
to keep in sync with a step pointer.

**Decisions worth knowing**
- `noValidate` on the composer form. With `type="email"` the browser silently
  blocks submit and shows its own off-brand bubble, so the styled validation
  message never appeared. Caught in testing.
- The closed panel sets `visibility: hidden` (transitioned with a delay so the
  fade-out still shows). `opacity: 0` alone leaves every control inside it
  focusable — a keyboard user tabs into an invisible form.
- Minimise (—) keeps the conversation; Close (×) clears it, behind an inline
  confirm row once anything has been entered. No native `confirm()` dialog.
- A skipped optional answer renders as a muted "Skipped" chip, not an empty
  bubble.
- No copy anywhere claims this is an AI or a bot.

**Preview parity:** `/tmp/site_preview/chat_driver.py` is a vanilla mirror of
this component for the artifact preview (which drops Next's runtime, so React
never hydrates). It reuses the component's own class strings. **If
`chat-widget.tsx` or `chat-flow.ts` changes, that mirror changes with it.**

**Verified** (static export → cloud Chromium, 1440×900 and 390×844): full run
through all six steps including the free-text branch; back restores the previous
answer into the field; invalid email and invalid phone both raise the styled
message and block advance; SKIP appears only on the optional step; review lists
every answer; send reaches the confirmation. Zero horizontal overflow at every
scroll position on 1440 / 834 / 390, zero console or page errors, all six
sections still intact. Closed panel: `visibility: hidden`, and 30 Tab presses
never land inside it. Open panel takes focus. `reduced-motion: reduce` — no
launcher ring animation, no typing delay, messages render immediately.

**Still outstanding:** the Experience section, and the whole lead pipeline
(server validation, OTP verification, rate limiting, storage).

### STEP 10a — chat widget polish (client feedback, 2026-08-28)

- **Launcher icon.** The dot-trio bubble read as a loading state, not an
  invitation. Replaced with a new `ChatIcon` in `src/components/icons.tsx` —
  a plain speech bubble with two lines of "text", drawn in the same
  24×24 / 1.75-stroke family as the nav icons, so the launcher belongs to the
  site instead of looking like a third-party widget dropped on top.
- **Corners.** Client asked for a minor radius. Applied at the existing token
  scale — `--radius-md` (6px) on the launcher, panel and message bubbles,
  `--radius-sm` (4px) on buttons, inputs and avatars. Deliberately not a large
  pill: the rest of the site is near-flat per the original brief. The mobile
  full sheet stays square because it meets the screen edges. The launcher's
  breathing ring uses `border-radius: inherit` so it can never drift from the
  button it traces.
- **Assistant name.** `OX` → **Alex**, via `CHAT_ASSISTANT` in
  `src/lib/chat-flow.ts` (one place, so the header and every avatar agree).
  The header now reads `[A] Alex / OXVID SYSTEMS`; message avatars show the
  initial. "PROJECT ENQUIRY" was dropped from the header — at 24rem it
  collided with the minimise/close buttons, and the dialog's `aria-label`
  still carries it for screen readers.
  Note: nothing in the copy claims Alex is a person or an AI. If the client
  wants that stated either way, it is a one-line change.
- `/tmp/site_preview/chat_driver.py` updated in lockstep (icon markup lives in
  the SSR output, but the avatar and every radius are re-templated there).
- Re-verified after the change: full six-step run on 1440 and 390, validation,
  back, skip, review, send — all pass; zero overflow, zero console errors.

### STEP 10b — launcher label + icon (client feedback, 2026-08-28)

- **Label:** "START A PROJECT" → **"LET'S TALK"**. Chosen over "Talk to us"
  because it echoes the Contact section's "LET'S BUILD WHAT'S NEXT." — the
  site then invites in one voice. It also removes a real clash: the Contact
  CTA is *required by the brief* to read "START A PROJECT →", so the launcher
  saying the same thing put the same words on screen twice. The Contact CTA is
  unchanged. `aria-label` updated to match the visible label.
- **Icon:** third and final attempt. A **solid** speech bubble
  (`ChatIcon` in `icons.tsx`). The dot-trio read as a loading state; the
  outlined bubble with text lines was too quiet at 18px next to bold uppercase
  type. Solid is the universally recognised chat mark and holds its weight
  small. It deliberately breaks the nav's line-icon family — the launcher is a
  standalone CTA on a dark button, not one of six icons that must read as a
  set. The tail is stroked as well as filled so `stroke-linejoin: round`
  blunts its point without hand-authored arcs.
- Launcher width on desktop dropped 158px (was wider); mobile stays the
  68px icon-plus-dot form.
- Re-verified: full six-step run on 1440 and 390 in both the real build and
  the preview mirror; zero overflow on 1440 / 834 / 390; zero console errors;
  closed panel still out of the tab order; reduced-motion clean.

---

## STEP 11 — Secure lead storage

**Inspection first, as instructed:** there was no backend. `package.json` held
`next`, `react`, `react-dom` and nothing else — no Firebase, no database, no
API route, no `.env`. So "reuse the existing architecture" had nothing to
reuse. Client chose **Firestore**, credentials to follow.

**No new infrastructure was created.** Server-side validation needs a server,
and the app already is one: `/api/leads` is a Next Route Handler. One
dependency added — `firebase-admin` — and nothing else.

### Files
- `src/lib/leads/sanitize.ts` — input hygiene (C0/C1 controls, zero-width and
  bidi-override characters, whitespace, length caps) and **separate** output
  escapers. Escaping at storage time is a bug, not a feature: it
  double-escapes the first time something renders correctly and you can never
  recover what the visitor typed. `csvCell()` neutralises spreadsheet formula
  injection for whenever leads get exported.
- `src/lib/leads/types.ts` — the Lead shape, exactly the client's field list.
  `PROJECT_TYPES` is derived from the widget's own quick replies so the two
  cannot drift.
- `src/lib/leads/validate.ts` — **the authority.** Re-validates and normalises
  everything. `emailVerified` and `verificationStatus` are not in `LeadInput`
  at all and are hardcoded in the returned object; a client posting
  `emailVerified: true` is ignored, not trusted.
- `src/lib/leads/firestore.ts` — Admin SDK, server-only (`assertServer()`
  throws if it is ever imported into client code). Unconfigured throws
  `LeadStoreUnavailableError`; the route answers 503 and logs. It never
  pretends to have stored a lead it dropped.
- `src/lib/leads/rate-limit.ts` — in-memory pre-filter **plus** a durable
  Firestore transaction window (5 per 10 min). The IP is never stored: the
  document id is a salted SHA-256 of it.
- `src/app/api/leads/route.ts` — method, content-type, origin, body-size,
  rate limit, validate, write. Node runtime (Admin SDK needs it).
- `firestore.rules` — `allow read, write: if false` on every path. The Admin
  SDK bypasses rules, so denying all client access closes the whole surface:
  no browser, no leaked web API key, no forged lead, no collection listing.
- `.env.example` — every var documented. None carries `NEXT_PUBLIC_`.

### Why not let the browser write to Firestore directly
Rules can check a document's *shape*. They cannot normalise a phone number,
canonicalise a project type against a list, apply a rate limit, or guarantee
`emailVerified` is false. The brief requires server-side validation, and that
means a server.

### Bug found and fixed during testing
`originAllowed()` hardcoded `https://${host}`, so a same-origin POST over
http got 403 — which would have broken any http deployment and `next start`
locally. Now it trusts `x-forwarded-proto` when the proxy sends one and
accepts either scheme for our own host when it doesn't. Cross-site origins
are still rejected.

### Verified
- **45/45 unit tests** on the validation layer (compiled standalone, run in
  Node): client cannot set `emailVerified`/`verificationStatus`/`createdAt`;
  email lowercased; phone punctuation stripped, `00` → `+`, **no country code
  invented**; unknown project type → `Other` with the visitor's words kept in
  `projectInterest`; unknown `source` not echoed back; CRLF stripped (email
  header injection); null bytes, zero-width and RTL-override characters
  removed; `<script>` stored verbatim and escaped only at output; CSV formula
  neutralised; lengths truncated; no unexpected key reaches the lead.
- **Route, over real HTTP:** GET → 405, `text/plain` → 415, cross-site origin
  → 403, malformed JSON → 400, array body → 400, 9 KB body → 413, every
  invalid field → 422 with per-field messages, 6th request in the window →
  429 with `Retry-After: 600`, no credentials → 503 `storage_unavailable`.
- **No secret in the client bundle:** `.next/static` contains zero matches for
  `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `RATE_LIMIT_SALT`,
  `firebase-admin`, `BEGIN PRIVATE KEY`, `service_account`.
- **Widget:** posts exactly the nine allowed keys (and never `emailVerified`);
  SENDING state locks the button and hides BACK; a failed send keeps the
  review open and shows *"Couldn't send just now. Please email
  info@oxvidsystems.com."* — it never shows a false confirmation. Site
  regression clean on 1440 / 834 / 390.

### Before this can accept a real lead
1. `npm install` (picks up `firebase-admin`).
2. Create the Firebase project, generate a service-account key, fill
   `.env.local` from `.env.example`.
3. `firebase deploy --only firestore:rules` — **an un-deployed rules file
   protects nothing.**
4. Enable a Firestore TTL policy on `rate_limits.expiresAt`.
5. Deploy to a Node host. `output: export` cannot serve a dynamic route — the
   screenshot pipeline in `~/build` temporarily moves `src/app/api` aside for
   its export build; the real project keeps it.

### Still outstanding
Every lead is written with `emailVerified: false` and
`verificationStatus: "pending"`, exactly as this step requires. The OTP /
verification-link flow, and the Experience section, are the remaining work.

---

## STEP 12 — Real email verification

A lead is now only a **verified lead** once a six-digit code sent to the
address comes back to us. Syntax checking is still there, but it decides
nothing on its own.

### Flow
`POST /api/leads` → pending lead + code emailed → `POST /api/leads/verify`
→ `emailVerified: true`, `verificationStatus: "verified"`.
`POST /api/leads/resend` covers both **resend** and **change email**.

### Files
- `src/lib/leads/verification.ts` — codes and policy, pure and testable.
- `src/lib/leads/mailer.ts` — Resend over plain `fetch` (no SDK, no new
  dependency) plus a dev outbox for local testing.
- `src/lib/leads/api-guards.ts` — origin/content-type/size/JSON checks,
  shared by all three routes. Three copies of an origin check is three
  chances for one to drift and become the way in.
- `src/app/api/leads/{route,verify/route,resend/route}.ts`
- `firebase.json` — so `firebase deploy --only firestore:rules` knows where
  the rules are.

### Decisions worth knowing
- **HMAC with a secret pepper, not a plain hash.** A 6-digit code has a
  million values; a bare SHA-256 of it is enumerable in under a second by
  anyone holding the database. The digest is keyed with
  `VERIFICATION_PEPPER`, which lives only in the environment. The app
  **refuses to issue codes** without it rather than falling back to an
  unkeyed hash that would look identical in every test and be worthless the
  day the database leaked.
- The digest binds the **verification id** into the HMAC input, so a digest
  lifted from one record cannot be replayed against another.
- `crypto.randomInt` for the code, `timingSafeEqual` for the comparison. A
  byte-by-byte `===` leaks through timing how many leading digits were
  right, which turns a million-guess space into about sixty.
- **The plaintext code exists in two places only:** in memory on its way to
  the mailer, and in the recipient's inbox. Never in Firestore, never in a
  response, never in a log.
- The verify check runs **inside a Firestore transaction**. Without one, two
  simultaneous guesses both read `attempts: 4` and both write `5`, and the
  limit quietly becomes "5 per parallel request".
- An **unknown verification id answers exactly like an expired one** (410).
  Distinguishing them would let someone enumerate live ids.
- A **resend invalidates** the previous code rather than adding a second
  valid one. Changing the address resets the attempt counter (those failures
  were against a different inbox) but **not** the resend counter, or
  "change email" would be an unlimited way around the cap.
- Pending leads are still written to `leads`, carrying `emailVerified:
  false` / `verificationStatus: "pending"`. Discarding them would lose every
  honest enquiry from someone who fills the form and gets distracted. They
  can never read as qualified: the status says otherwise, and a failed or
  expired verification marks the lead `failed` / `expired`.
- The dev outbox **throws if `NODE_ENV=production`**. It writes live codes to
  disk — fine on a laptop, unacceptable on a server.
- No copy claims Alex is a person or an AI.

### Limits
10-minute expiry · 5 wrong attempts · 3 resends · 60-second resend cooldown ·
5 starts per 10 min per requester **and** per email address · verify and
resend attempts separately rate-limited per requester.

### Verified
- **33/33 unit tests** on `verification.ts`: pepper required and length-checked;
  codes uniformly random and 6 digits; plaintext absent from the stored
  record; digest bound to the id and to the pepper; right code verifies;
  wrong/short/empty rejected; single use enforced; expiry beats a correct
  code; locked after 5 attempts and the **right code is refused once locked**;
  resend invalidates the old code, resets attempts, increments resends,
  honours cooldown and cap.
- **46/46 route tests** against the real handlers: pending lead written
  unverified, code reaches the inbox and is **not** in the response, hashed
  not stored plain; invalid syntax stores nothing; wrong code reports
  attempts left and leaves the lead unverified; correct code flips
  `emailVerified`/`verificationStatus` and stamps `verifiedAt`; reuse → 409;
  expired → 410 and the lead marked `expired`; attempt exhaustion → 429 and
  marked `failed`; resend cooldown → 429, then a new code works and the old
  one does not; change email normalises, moves the lead, refuses an invalid
  address, and verifies on the new one; unknown id → 410; rate limits on
  start and verify; content-type/origin/handle guards on both new routes.
- **Widget UI**, every server answer stubbed: exact brief copy on arrival,
  VERIFY disabled under six digits, non-digits stripped, wrong code shows
  attempts left with **no false success**, expired disables the field,
  change-email updates the address and re-enables, 60-second resend
  countdown, and the success screen only ever after a 200. Zero overflow,
  zero console errors, desktop and mobile.

**Note on the emulator:** the Firestore emulator jar cannot be downloaded in
either sandbox (egress allowlist), so the route tests run against an
in-memory Firestore double in a scratch directory that is not part of the
app. It exercises the routes' own decisions; the cryptography is covered
separately by the unit tests above. Re-run the flow against a real Firestore
once credentials exist — see the go-live checklist.

### Added to the go-live checklist
`VERIFICATION_PEPPER` (openssl rand -hex 32), `RESEND_API_KEY`,
`LEAD_FROM_EMAIL` with a verified sender domain, and a Firestore TTL policy
on `verifications.expiresAtTs` as well as `rate_limits.expiresAt`.

### Still outstanding
The Experience section.

---

## STEP 13 — Complete the lead pipeline

The chain now runs end to end: visitor → chat → questions → email →
verification → **saved verified lead** → owner notified.

### No dashboard was built, on purpose
The brief allowed either "add a lead view to the existing admin" or "if none
exists, don't build an unnecessarily complex one — implement a secure data
structure that can be integrated later". There is no admin system, so the
second path was taken. An admin UI needs authentication, sessions and a login
page, and every one of those is a new way to leak the entire lead table.
Building that speculatively would add risk, not value.

What exists instead:
- **`src/lib/leads/query.ts`** — a small, typed, server-only query surface:
  `listVerifiedLeads`, `listLeadsByStatus`, `getLead`,
  `listUnnotifiedVerifiedLeads`. It is exactly what a lead view would call,
  so when one is wanted the UI is the only new thing.
- **`firestore.indexes.json`** — the composite indexes those queries need,
  deployed with `firebase deploy --only firestore:indexes`.
- A **`qualified: true`** boolean written only by the verification
  transaction. It sits alongside `verificationStatus` deliberately: a status
  field grows values over time (expired, failed, bounced…) and every future
  query would have to remember which count. A boolean cannot rot that way,
  and it makes the Firestore console filter one click. It is *absent* on a
  pending lead rather than `false`, so an un-promoted lead can never match.

**How Abdul sees leads today, with no code shipped:** the notification email,
or Firestore console → `leads` → filter `qualified == true`, sort
`verifiedAt` desc.

### Owner notification — `src/lib/leads/notify.ts`
Sent to `info@oxvidsystems.com` (overridable via `LEAD_NOTIFY_EMAIL`) **only
on successful verification**. Notifying on the pending write would fill the
inbox with typos, abandoned forms and bot noise and make the notification
worthless as a signal.

- **Reply-to is the lead**, so hitting reply reaches them directly.
- Carries every field the brief listed plus the document id as a reference.
- **Cannot carry a verification code or verification id.** Neither is in
  `Lead`, and the function takes nothing else — the type system is the guard,
  not a reviewer's memory. (The code is already consumed by then, but "spent"
  is not a reason to put a credential into an inbox that gets forwarded,
  archived and searched.)
- Spam signals are surfaced so a flagged lead can be eyeballed before reply.
- **Best-effort, after the transaction.** The visitor has already proved they
  own the address; a mail provider having a bad minute must not undo that. A
  failure is logged, leaves `ownerNotifiedAt` unset, and the lead therefore
  turns up in `listUnnotifiedVerifiedLeads()` — the retry list.

### Verified
- **49/49 full-pipeline tests**, one visitor walked end to end: chat answers
  accepted; verification email sent to the visitor; **owner not told about an
  unverified lead**; lead pending and not qualified; code accepted; then every
  field the brief listed asserted on the saved record (name, verified email,
  phone, project type + the visitor's own words, goal, additional message,
  created at, source, verification status), plus `qualified` and `verifiedAt`.
  `listVerifiedLeads` returns it and the pending list does not.
  Owner notification: exactly one, to `info@oxvidsystems.com`, reply-to the
  lead, correct subject, every field present — and **no code, no verification
  id, no pepper, no code hash, no credential** anywhere in it.
  A deliberately broken mailer leaves the lead verified and un-notified, in
  the retry list. Ordering is newest-verification-first. A lead that exhausts
  its attempts is marked `failed`, never appears as verified, and the owner is
  never told about it.
- **13/13 Step-12 regression** after the change: reuse still 409 (and does not
  double-notify), expired still 410 and never qualified, unknown id still 410,
  wrong code still reports attempts left, resend cooldown/reissue/old-code-dead
  all unchanged, change-email still normalises and verifies.
- Client bundle still contains zero matches for `FIREBASE_PRIVATE_KEY`,
  `VERIFICATION_PEPPER`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`,
  `firebase-admin`, `BEGIN PRIVATE KEY`.
- Site regression clean on 1440 / 834 / 390 — all six sections, no overflow,
  no console errors, closed chat panel still out of the tab order,
  reduced-motion still fine.

Same caveat as Step 12: the Firestore emulator jar cannot be downloaded in
either sandbox, so route-level tests run against an in-memory Firestore double
in a scratch directory that is not part of the app.

### Still outstanding
The Experience section.

---

## STEP 14 — Premium chat widget polish

Visual and behavioural only. **No backend logic was touched** — the routes,
validation, verification and notification are byte-identical to Step 13.

The governing idea for the pass: this is an OXVID component that happens to be
a chat, not a chat widget with OXVID colours painted on. So — no bouncing, no
pulsing badge, no "we're online" dot, no cartoon avatar. Motion is short and
uses the same easing tokens as the rest of the site.

### Motion
- **Opening.** The panel grows from its own bottom-right corner
  (`transform-origin`), so the launcher and the panel read as one object
  rather than a card sliding in from nowhere.
- **Message timing** is now length-aware — `typingTimeFor()`, floored at 420ms
  and capped at 1100ms. A fixed beat made the one-line questions feel laboured
  and the four-line welcome feel like it teleported.
- **Typing indicator** is a travelling wave of opacity that touches the accent
  at its peak, not three bouncing balls. Same information, without the toy.
- **Quick replies** stagger 40ms apart, so the row assembles left to right.
- **Composer swaps** crossfade (`chat-composer-body`, keyed on which control
  set is showing) so the panel's bottom edge stops snapping between heights.
  The key is deliberately not per-keystroke, which would flicker.
- **Wrong code** shakes the field once. Two shakes is a tantrum; one is a
  correction.
- **Success** is the one flourish in the component, because it is the one
  moment the visitor is pleased: the tick draws itself and a soft accent glow
  expands once behind it.

### Surfaces
- A 2px brand gradient hairline along the top of the panel — one accent, one
  pixel: enough to place it, not enough to shout.
- Deeper, softer panel shadow on desktop; the mobile sheet stays flush.
- Code field takes an accent border and a faint accent wash at six digits, and
  the VERIFY button switches from ink to `accent-teal-dark` — the field says
  it is ready before the button does.
- Attempts remaining moved to a small pill on the "SENT TO" row.
- Panel height uses **`dvh`**, not `vh`: mobile browsers count the collapsing
  address bar in `vh`, which cuts the composer off.

### Keeping off the reader's content
`useLauncherTuck()` slides the launcher away for two reasons, neither of them
a timer:
1. **They are scrolling down.** A fixed button parked bottom-right sits on the
   page for the whole visit, and on a phone that corner is where text ends up.
   It returns the moment they stop or scroll up.
2. **They are in the Contact section**, which already carries every phone
   number and address. A floating "let's talk" on top of it is noise arguing
   with the page.

It translates rather than hiding, so it can never blink.

### Accessibility
- Focus **returns to the launcher** on Escape, Minimise and Close. Without it
  a keyboard user is dropped at the top of the document and has to tab the
  whole page again.
- A `sr-only` `role="status"` line announces progress in words ("Question 3 of
  6", "Verifying sara@…", "Email verified"). The progress bar itself is
  `aria-hidden` — six coloured slivers say nothing out loud.
- `aria-modal="false"` (it is non-modal; a focus trap would be wrong),
  `aria-describedby` wired to the status line.
- Every animation above is off — not faster, off — under
  `prefers-reduced-motion`.

### Bug found and fixed during this pass
Adding the screen-reader status line gave the panel a **second `aria-live`
region**, and the preview driver selected the transcript with
`panel.querySelector('[aria-live="polite"]')` — which silently started
matching the status paragraph instead. The whole preview widget stopped
rendering. The transcript now carries a named `data-chat-log` hook, which
cannot be stolen that way. (The React component was unaffected; it uses a
ref.)

### Verified — desktop, tablet, mobile, small mobile
1440×900 · 834×1112 · 390×844 · **320×568**, every one of them:
launcher inside the viewport, tucks while scrolling down, returns when
scrolling stops, hidden over Contact; panel fits width and height; composer
reachable with the transcript scrolling above it; six chips staggered and
inside; code field flips to its filled state at six digits and the button
takes the accent; wrong code shakes once with the attempts pill and the alert;
success tick fully drawn; focus returns to the launcher on Escape; zero
horizontal overflow; zero console errors. Reduced motion: every animation
reports `none` and the conversation still renders. Site regression clean —
all six sections, closed panel still out of the tab order.

### Still outstanding
The Experience section.

---

## STEP 15 — Global motion polish

No content or layout was redesigned. This was a pass over the motion system
itself, and it started by writing down what was actually there.

### What the audit found
- **Two smoothing constants that disagreed.** The Hero used `0.035`, the Work
  gallery `0.02`, and *both* comments claimed "0.945^60" (which is 0.0343).
  Two pinned sections settled at different rates while the code insisted they
  matched.
- **A 90px blur, animated forever.** The Hero's ambient glow was a solid disc
  under `blur-[90px]` with a 12s infinite drift — a full-surface Gaussian pass
  re-run every frame, on every slide, for the whole visit. Comfortably the
  most expensive thing on the page.
- **Up to 8px of blur on gallery cards**, written as a fresh string 60 times a
  second, per card.
- **±52° card rotation** — a coverflow turning its neighbours nearly edge-on.
- **A perpetual 360° spin and a 2.6s scale pulse** on the hero graphic, plus
  Tailwind's `animate-ping` ring on two "available" badges.
- **`will-change: transform, opacity, filter` on all fourteen cards,
  permanently** — asking the browser to hold a separate raster for each one
  for the entire visit.
- **400ms hover transitions** in 21 places. `--duration-base` was doing double
  duty as both "component changes state" and "pointer feedback".

### The timing scale now has jobs, not just numbers
```
instant  100ms  a value snapping
fast     180ms  POINTER FEEDBACK — hover and focus (was 400ms)
base     400ms  a component changing state on its own
slow     620ms  content arriving on scroll (was 700ms)
cinematic 900ms the few large reveals (was 1200ms)
```
`src/lib/motion.ts` is new and holds the one scroll-smoothing constant,
`scrollEase()`, and a single `prefersReducedMotion()` — several modules had
been re-typing the same media-query string, and one typo in any of them would
have silently disabled a guard.

### What was cut
- Both hero glows: solid disc + `blur()` → a radial gradient that is already
  soft. Same look, one paint instead of a filter pass per frame.
- `.gallery-glow` (58px) and `.gallery-floor` (12px) blurs: same swap.
- Card blur capped 8px → **2.4px**, held off until a card is properly
  off-centre, dropped entirely past |a| > 2.2 where opacity has it covered,
  and quantised to 0.4px so the value changes a handful of times per card
  instead of 60 times a second.
- Deck panel blur 3px → 2px, quantised to 0.5px. It is applied to a
  full-viewport element, so every pixel of it counts.
- Card rotation ±52° → **±34°**; cursor tilt ±9°/±6° → ±5°/±3.5°.
- `hero-orbit-spin` and `hero-core-pulse` deleted outright, keyframes and all.
- `animate-ping` removed from both status badges — the label already says the
  thing.
- `will-change` removed from `.gallery-card`; the cards carry `translate3d`
  and are composited regardless.
- Gallery culling moved from |a| > 4.2 to **3.6**, where opacity already
  reaches zero.

`hero-drift` (20s, was 12s) and `hero-twinkle` (9s, was 5s) survive — both are
transform/opacity only, and now cheap.

### Measured, not eyeballed
rAF gap timing while scripted-scrolling each pinned section, headless Chromium,
software rasterisation (so absolute numbers are pessimistic; the ranking is
what matters).

| desktop, median frame gap | before | after |
|---|---|---|
| Work gallery | 49.9ms | **33.3ms** |
| Work gallery, worst frame | 183ms | **117ms** |
| Hero pin, worst frame | 150ms | **100ms** |
| Expertise deck, worst frame | 100ms | **67ms** |
| Contact | 16.7ms | 16.7ms |

Mobile gallery went from 8 dropped frames per pass to 1–3.

An isolating run (`[data-card] img { visibility: hidden }`) put the gallery at
33ms with images hidden versus 50ms with them — so the remaining cost is
**rasterising seven large screenshots in a 3D scene**, not the motion maths.
The screenshot pipeline builds with `images: { unoptimized: true }`, which
serves 1440px JPEGs into 605px cards; production runs the Next image
optimiser, so this figure is inflated roughly five-fold against the real site.

### Asserted from the live page, not the source
`--duration-fast .18s` · `--duration-base .4s` · `--duration-slow .62s` ·
`--duration-cinematic .9s` · zero spin/pulse elements · remaining infinite
animations are exactly `hero-drift`, `hero-twinkle`, `chat-breathe` ·
max blur anywhere on the page **2.4px** · max card rotation **34°** · nav
active state tracks About → Expertise → Work → Contact · zero horizontal
overflow · zero console errors on desktop and mobile.

**Reduced motion:** hero unpinned, gallery `position: static`, **0** running
infinite animations, all six sections present, no errors. The chat's Step 14
behaviour is unchanged and re-verified.

The preview driver was aligned to the same constants, caps and quantisation,
so the artifact cannot drift from the app.

### Note on Experience
It was on the brief's list, but it is still the Step 03 placeholder — there is
no motion there to polish yet. It will inherit this system when it is built.

### Still outstanding
The Experience section.


---

## STEP 16 — MOBILE EXPERIENCE

The brief: focus only on mobile, do not simply shrink the desktop, and fix
horizontal overflow, broken sticky sections, clipped typography, inaccessible
buttons, chat-widget overlap, broken project previews and excessive animation.

### What the audit actually found

The site was already clean on the two things people usually check: **zero
horizontal overflow at 320 / 360 / 390 / 414 / 430, and all fourteen project
previews loading.** The faults were elsewhere, and they were found by
measuring the rendered page rather than by reading the source.

1. **A pinned slide cannot scroll, so anything past its fold is unreachable
   — not merely below it.** The Hero stacked a width-driven visual above the
   copy. At 320x568 that pushed the headline, the paragraph and the call to
   action off the bottom of the pinned slide entirely; at 360x740 it pushed
   the button off. Slides 2 and 3 were worse than slide 1 because their
   headlines are taller. This was the structural fault of the whole step.
2. **Eight tap targets under 44px**: the menu button (40x40), START A PROJECT
   (196x34), five contact links (20px tall) and the launcher itself (68x42).
3. **The chat launcher covered live controls.** At 320 it sat on the Hero's
   own CTA and, for the entire length of the Work pin, on that section's
   "view live site" button. A pinned section cannot be scrolled out from
   under a floating control, so the control has to yield.
4. **The closed mobile menu was still in the tab order** — `opacity: 0` with
   `pointer-events: none` leaves `visibility: visible`, so seven invisible
   links were keyboard-reachable before the page. Same failure the chat panel
   had in Step 14.
5. **The gallery card sat on top of its own section heading at 320.** The card
   is sized from its width and lifted by a proportional `6vh`; on a short
   screen "Completed Projects" ended at 134px and the card started at 124.
6. **The fixed mobile bar spilled its contents at 320** — the wordmark and the
   spelled-out section label both wrapped to two lines inside a 64px bar.
7. **The page was 21 viewports long**, largely because an editorial rhythm
   authored on a 1440px canvas put 8rem above and below every section.
8. **Seven perpetual animations** ran on phones (hero drift, sparkle field,
   launcher ring).
9. Project URLs truncated mid-domain in the mock browser chrome at 320/360;
   the Expertise chapters carried an 88px corner radius on a 342px card; the
   About "07" collided with "Years of experience."

### What changed

**Hero — the mobile composition now measures itself.** Below `lg` the slide is
a column where the copy plate takes exactly the room it needs and the visual
takes what is left (`flex-1 min-h-0`, height-driven, `h-full w-auto` on a 4:5
frame). It therefore shrinks rather than overflowing, and all three slides now
fit every phone from 320 up. The desktop two-column grid is untouched.

Short viewports (`max-height: 40rem and max-width: 40rem`, roughly an SE in
portrait) get three further concessions, because a height-driven frame is only
~170px wide there: the two credential pills step off the photograph they were
covering, the signature scales down with the frame, and the slide-3 lead card
— which holds its own type and so cannot scale — steps out entirely, letting
the copy and its full-width CTA centre in the slide. Every fact those elements
carried is stated elsewhere on the page.

**Launcher.** `min-height: 44px`, and a declarative yield: any region marked
`data-chat-clear` (Contact, Work) owns its own corner while on screen, and
`data-chat-clear-narrow` (the Hero) does so only below `lg`. The observer uses
`rootMargin: -25% 0px -25% 0px` rather than a threshold — **a threshold is a
ratio of the element, and the Work gallery is 4487px tall against a 568px
viewport, so it could never exceed 12.6% and `threshold: 0.15` never fired.**

**Mobile menu.** `visibility` is now transitioned (instantly in, delayed out so
the fade still plays) alongside `inert` and `aria-hidden`, so the closed menu
is gone from focus, from AT and from hit-testing.

**Gallery.** Card height and lift are both clamped against the real heading and
caption rooms, so the composition can never overlap its own heading or button.
The chrome bar shows the host on narrow screens and the full URL from `sm` up —
still the real URL either way, just no longer cut mid-domain.

**Rhythm.** `--spacing-section-*` is redefined under `lg` (8rem → 4.5rem etc.)
so one spacing language rescales rather than eight components each getting an
override. Contact, About and Expertise got matching internal tightening; the
Expertise corner radius scales with the card.

**Motion.** The hero's ambient drift and sparkle layers and the launcher's
breathing ring are off below `lg`. Zero perpetual animations on mobile.

### One thing that bit, and why the desktop guard exists

Restructuring the Hero for mobile dropped `w-full` from the visual wrapper. On
desktop `justify-self-end` makes a grid item shrink-to-fit, the frame inside
asks for `width: 100%` of it, that is circular — and **the desktop portrait
collapsed to zero width.** Nothing in the mobile screenshots showed it. It was
caught by the desktop regression block in `mobile_verify.py`, which is the
reason that block is there: a mobile step is exactly when desktop breaks
silently.

### Verification

`/tmp/site/mobile_verify.py` — 193 assertions, all passing, at 320x568,
360x740, 390x844, 414x844, 430x932, plus a desktop 1440 regression guard and a
reduced-motion pass. Per width it asserts: every hero slide's headline and CTA
reachable inside the pin and nothing cut off inside the frames; the launcher
tucked over Hero/Work/Contact and available and >=44px in About/Expertise/
Experience; no tap target under 44px; no clipped text; no horizontal overflow;
the closed menu unfocusable; zero perpetual animation; all previews loaded and
a real host in the chrome bar; the portrait and signature rendered and inside
the frame; the gallery card clear of both its heading and its live-site button;
the mobile bar holding its contents on one line; the chat panel fitting with
its composer reachable and the flow reaching verification; and no console
errors. The desktop guard asserts the two-column hero, the large portrait, both
credential pills, an auto-width CTA, the sidebar nav, the four-panel pinned
deck and the launcher's unchanged desktop behaviour.

### Known and accepted
A floating launcher will pass over body text while the reader is stopped — that
is inherent to the pattern. Every case where it covered a *control* or a pinned
composition is fixed; it tucks while scrolling and yields to Hero, Work and
Contact entirely.

### Still outstanding
The Experience section.


---

## STEP 17 — PERFORMANCE + SECURITY AUDIT

Both halves were audited by measuring the running site, not by reading the
source. Two of the biggest findings would have been invisible to a read.

### PERFORMANCE — what was actually wrong

**1. Two 60fps loops ran for the entire visit.** The Hero and the Work gallery
each scheduled the next animation frame from inside the frame, unconditionally.
Measured, parked on the Contact section with nothing moving and no input:

    360 requestAnimationFrame callbacks and 360 getBoundingClientRect calls
    every three seconds, forever — plus 26ms of script per 3s of idle.

Fourteen gallery cards were being re-styled sixty times a second while the
reader was thousands of pixels away from them. `runWhileVisible()` in
lib/motion.ts now drives both loops from an IntersectionObserver with a
one-viewport margin, so they are warm on approach and stopped otherwise.
After: **0 callbacks, 0 geometry reads, 0ms of script.**

**2. The Expertise deck thrashed layout on every phone.** Below `lg` the deck
is not applied at all — the chapters flow normally — but `compute()` still ran
on every scroll, read two bounding rects per panel, and then wrote empty
strings over every inline style. Write-then-read, every frame, for no visible
effect. It was attributed by patching `getBoundingClientRect` to record its
callers, which put 364 of the 483 calls in one `forEach`.

| 60-step scroll of the Hero | layouts before | after |
|---|---|---|
| 390px | 254 (39ms) | **14 (2ms)** |
| 1440px | 33 (6ms) | 35 (4ms) |
| 390px, reduced motion | 5 | 2 |

The 390-vs-1440 gap was the tell: the cost was not mobile emulation (390 wide
with `isMobile` off measured the same 259) and it vanished under reduced
motion, which is what pointed at motion code taking a width-gated path.

Mobile Work-gallery frame gaps went from a Step-15 median of 33.3ms to
**16.7ms with 0 dropped frames out of 109** — a locked 60.

**3. Three below-the-fold screenshots were preloaded on first paint.**
`priority={index < 3}` on the gallery images emitted `<link rel=preload>` for
three 1440px screenshots of a section five viewports down, competing with the
portrait that IS the LCP element. The comment justifying it claimed lazy
loading is unreliable inside a preserve-3d scene; measured, it is not — all
fourteen load on approach and none before. Now `loading="eager"` on the first
card only (so the centred card is never blank on arrival) and lazy for the
rest: **3 previews fetched before reaching Work → 1.**

**4. The scroll rail animated a layout property.** `height: N%` with
`transition-[height]`, rewritten on every scroll event, for the whole visit.
Now `scaleY` with `transform-origin: top` — identical result, compositor only.

**5. Fonts came from Google on the critical path.** A render-blocking
stylesheet on a third-party origin: DNS, TLS and a round trip before a glyph
could even be requested, then a second hop to fonts.gstatic.com. It also sent
every visitor's IP and referrer to Google on every page view and forced any
CSP to whitelist two external origins.

The seven faces the codebase actually uses are now served from /public/fonts,
same origin, 96 KB of woff2 total, cached immutable for a year, with the two
that paint first preloaded. **The Google URL was asking for ten faces —
Archivo 900, IBM Plex Mono 500 and IBM Plex Mono 600 were being fetched for
nobody.** The files are the latin subsets from the Fontsource distributions of
the upstream OFL families; npm was used to fetch them and then removed, so
this added no runtime dependency. Licences sit beside them in public/fonts.

A caveat on the load numbers: this sandbox cannot reach fonts.googleapis.com,
so the "before" DCL of ~300ms was dominated by a failed connection and is not
what a real visitor saw. The honest claim is structural — three third-party
requests on the critical path became zero — not a specific millisecond win.

**6.** `use-parallax.ts` was dead code (imported nowhere, so it shipped
nothing) and is moved to `_to_delete/`.

### SECURITY — what was actually wrong

The existing lead pipeline held up well under probing: 54 assertions against
the real route handlers, all passing. What it did NOT have was anything at the
HTTP layer.

**1. No security headers at all.** No CSP, no framing policy, nothing. Now set
in next.config.mjs for every response: `Content-Security-Policy`,
`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
`Permissions-Policy`, `Strict-Transport-Security`, `X-DNS-Prefetch-Control`,
and `poweredByHeader: false`. API responses get `no-store`; /fonts gets
`immutable`.

**On the script policy, honestly.** The strongest policy is
`'nonce-…' 'strict-dynamic'`. It was built, with middleware minting a nonce —
and then measured, which is the only reason it is not shipped: with the home
page STATIC, Next served prebuilt HTML and **none of the nine script tags
carried the nonce**, so under `strict-dynamic` every one would have been
blocked and the site would have been dead. Forcing the page dynamic fixed it
(9 of 9 nonced, both inline RSC payload scripts included) at the cost of a
server render — on Firebase Hosting, a function invocation — for every single
page view of a page with nothing per-request to say.

So the page stays static and `script-src` carries `'unsafe-inline'`. What that
gives up is real: an injected `<script>` would run. What it does not give up
is the containment around it — `connect-src 'self'` and an `img-src` with no
remote host mean such a script has nowhere to send what it steals,
`form-action 'self'` means it cannot repoint a submission, `base-uri 'self'`
means it cannot silently redirect every relative URL including the ones the
chat widget posts to, and `frame-ancestors 'none'` means the page cannot be
framed and clickjacked at all. The site also renders no user-supplied HTML
anywhere. The trade is recorded in the go-live checklist for the client.

**2. The change-email path was missing a limit its sibling has.**
/api/leads limits per address as well as per IP, so that "one requester cannot
use many IPs to bombard one inbox". /api/leads/resend also sends a code to an
arbitrary address — and had only the per-IP limit. Added. An asymmetry like
that, where one route carries a defence and its sibling does not, is what ends
up being the way in.

**3. The internal design-token QA page was publicly crawlable.**
/design-system had no robots directive and there was no robots.txt. It now
carries `robots: { index: false }` and robots.txt disallows it and /api/.

### What the probe confirmed was already right

Run against the real handlers with an in-memory Firestore double (`~/rt`,
never part of the app): GET is 405; a wrong content-type is 415; a
cross-origin POST is 403; an oversized body is 413 (checked against actual
bytes, not the declared length); malformed and array bodies are 400. A client
posting `emailVerified: true, verificationStatus: "verified", qualified: true,
id: "pwned"` is stored as pending, unverified, unqualified, with its id
ignored. No response carries a code, a code hash or a lead id; the stored
record holds a 64-char HMAC and no plaintext. A wrong code returns attempts
left, an unknown verification id answers identically to an expired one (so ids
cannot be enumerated), five wrong guesses burn the code, and a
`{"$ne": null}` code does not crash anything. Rate limits engage per IP and
per address and carry Retry-After. Hostile input is accepted and cleaned
rather than rejected: control and bidi characters stripped, CRLF collapsed so
a name cannot inject a mail header, NUL removed — and markup stored verbatim,
because escaping belongs at output, not at rest. The client bundle contains no
key, no service account, no pepper, no salt, and no firebase-admin. There are
no `dangerouslySetInnerHTML`, `innerHTML` or `eval` sinks anywhere, and both
`target="_blank"` links carry `rel="noopener noreferrer"`. The dev outbox
refuses to run in production — confirmed by it throwing when the probe was
first pointed at a production build.

### One regression this caught

Gating the Hero's launcher-tuck at `lg` (Step 16) meant the chat launcher was
unavailable for the whole Hero on **every tablet** — the Step 14 suite found
it by timing out trying to click a control with `pointer-events: none`. The
collision it avoids only exists below `sm`, where the CTA goes full width. The
gate is now `sm`, and mobile_verify.py has a tablet block so it stays that way.

### Verification
- `~/rt/probe.mjs` — 54 security assertions against the real route handlers.
- `/tmp/site/mobile_verify.py` — 197 assertions across five phone widths, a
  tablet, a desktop regression guard and reduced motion.
- `/tmp/site/polish_test.py` — the chat widget end to end at four viewports.
- `/tmp/site/motion_test.py`, `perf_audit.py`, `idle.py`, `thrash2.py`,
  `attribute.py` — the measurements quoted above.

### Still outstanding
The Experience section.


---

## STEP 18 — FINAL CREATIVE DIRECTOR REVIEW

Reviewed as a jury would: from the rendered site, at desktop and phone,
across the opening seconds and every section. Six things were wrong. Four of
them were only visible because the review was done on screenshots and
measurements rather than on the source.

### The weakest moment: the first five seconds did nothing

Screenshots at 300ms and at 5,000ms were **pixel-identical**. Every other
section on the site reveals as it enters; the one screen every visitor sees
simply appeared, fully formed, and then sat there. For a portfolio whose
entire argument is craft, the first five seconds were the only five seconds
making no argument at all.

The Hero now composes itself over about a second: the eyebrow, then the
headline lines wiping up out of their own clipped bounds, the sub-line and
call to action rising behind them, the portrait frame clipping in downward
alongside, and the two credential pills settling last. `both` on every
animation holds the from-state through the delay, so nothing flashes at full
opacity and then animates. Measured through the arrival: at 260ms the eyebrow
is at 0.88 and the frame 44% revealed; at 450ms the sub-line is at 0.53 and
the frame at 95%; everything is settled by 1,000ms. Under
`prefers-reduced-motion` it is all present and static at 120ms.

### The site was measurably too dark

The brand rule is explicit — light theme first. Sampling the rendered page
every half-screen: **23 of 38 screens were dark. 61%.** And the Hero itself
turned dark 450px in, because slides 2 and 3 were both dark, so the tonal arc
read as light-then-dark-then-dark rather than as a progression.

Slide 2 is now the second LIGHT beat, one step deeper in paper than the
first. The contrast moved inside the composition instead: the agent card is a
dark inset on a light ground, exactly as the portrait frame is on slide 1 —
which also made that slide stronger, not just lighter.

Dark share is now **55%**, and more importantly the rhythm reads as
deliberate movements: light (Hero opening) → dark (Hero close) → eleven
straight light screens (About, Expertise) → dark (the Work stage) → light
(Experience) → dark (the Contact close). The Work gallery stays dark on
purpose: it is a stage for fourteen bright screenshots, and on a light ground
they would disappear into it.

### The stacking deck was showing two headlines at once

A covered chapter stayed legible through the one rising over it — "Custom Web
Development" ghosting through "Professional Content Writing". Deepening the
dim made it **worse**, which is what gave the cause away: the deck was dimming
with `opacity`, and a translucent panel in a stack shows the panel behind it.

The card now stays fully opaque and its CONTENT recedes instead. Nothing shows
through, and the crisp card edges actually strengthen the deck read.

### Three more

**The site's most important action was its quietest element.** "START A
PROJECT →" was 14px mono with an underline, on a screen carrying a 112px
headline. It is now a solid paper plate on the dark ground — the same
vocabulary the gallery's "view live site" already uses, not a new one.

**Project descriptions were cut mid-word.** A two-line CSS clamp produced
"…cabinetry, countertops, flooring and outdoo.." on screen. A clamp is right
for text you cannot predict; this text is written and known, so it is now cut
where a person would cut it — at a sentence, or failing that at a clause
boundary. A bare word boundary was not enough: it ended one description on
"and a two-time Michelin", which reads as a claim someone forgot to finish.

**The Hero's slider arrows were stray marks in the margins.** Pushed to the
bottom corners with `justify-between`, the left one landed underneath the
fixed email address in the nav furniture and the right one out by the chat
launcher. Gathered into one centred cluster with the scrubber, at the site's
own 44px circular arrow treatment, they read as the control they are.

### What was judged good and left alone

The Work gallery is not cards and does not need redesigning — a pinned 3D
coverflow of real screenshots in real browser chrome, each carrying its own
real URL. Contact's "LET'S BUILD / WHAT'S NEXT." is the strongest typographic
moment on the site. The USA office reads legitimately: a proper label, the
full address, phone and studio inbox, presented as an address and nothing
more — no invented email, no map, no claims. The chat widget is composed, not
a support bubble. About tells the story with the real portrait, the real
signature and the four real disciplines.

### One thing named rather than changed

The desktop icon dock is the element most likely to read as generic to a
juror — six outline icons where the rest of the site speaks in numbered
sections. It is left exactly as it is because it is **client-confirmed**
(2026-08-28): icon-only, white pill, matching a reference dock the client
supplied. Overriding a decision the client made on their own reference is not
a review finding, so it is recorded here instead.

### Final state

- 197 layout/behaviour assertions across five phone widths, a tablet, a
  desktop regression guard and reduced motion — all passing.
- 56 security assertions against the real route handlers — all passing.
- Chat widget end to end at four viewports, plus reduced motion.
- Motion: zero perpetual animation on mobile, zero dropped frames in the
  mobile gallery and deck, no overflow, no console errors.
- Idle: still 0 rAF callbacks and 0 geometry reads with the page parked.

### Still outstanding
The Experience section — the only section never built. It is a labelled
placeholder, and the site reads as complete without it, but it is the one
remaining piece of work.


---

## STEP 18a — HERO PILLS SLICED (first diagnosis, WRONG)

**Superseded by 18b below.** The short-window overflow described here is real
and the height cap is kept, but it was NOT the cause of what the client
reported. The real cause is in 18b. Left in place because the wrong diagnosis
is the useful part of the record.

### The original (partial) diagnosis


Client report (with a screenshot): "Hero section me Top and Bottom small boxes
cut ho gye han" — both credential pills cut off, top and bottom.

**It was a desktop fault, not a mobile one, and only in a SHORT window.**

Step 16 made the portrait frame height-driven below `lg`, because a pinned
slide cannot scroll and a width-driven 4:5 frame pushed the copy off the
bottom of a phone. Desktop was left width-driven — and never tested short. In
a wide but short window the identical fault appears from the other side: at
1440x620 the frame wants 500x625 inside a 620px viewport, so the frame and the
two pills that sit proud of it overflow the pinned slide, which has
`overflow-hidden`, and the pills are sliced flat.

Reproduced by sweeping 19 widths x 9 heights: clipped at 1280x560,
1440x560/620/680 and 1600x560/620/680/740. Every phone and tablet size was
clean, which is why five earlier steps of testing never saw it — the suites
test narrow-and-tall, and this needs wide-and-short.

**Fix:** `.hero-portrait-frame { max-height: calc(100vh - 10rem) }` above
`lg`. The budget covers the slide's own 64px top and 40px bottom padding plus
the 16px each pill stands proud, with room spare. The portrait is
`object-cover object-top`, so a capped frame simply holds head and shoulders
instead of the full length — the right thing to show when there is no room for
the rest.

After: **no clipping at any of the 171 size combinations**, and normal windows
are untouched — 1440x900 still 500x625, 1920x1080 still 609x761.

### A note on the test that lied

The first re-run of the sweep reported "no clipping found" for both the site
and the preview. Both static servers had died, every navigation was throwing,
and the scan was swallowing exceptions — so a total failure to load looked
exactly like a pass. The scan now prints the error instead of skipping, which
is how the still-broken preview build was caught a moment later.


---

## STEP 18b — THE ACTUAL CAUSE: MY OWN ARRIVAL ANIMATION

The client reported the pills cut, I "fixed" it, and they were still cut. The
second report was right and my verification was wrong.

**The cause was the Step 18 arrival.** The portrait wipe is:

```css
@keyframes hero-frame { from { clip-path: inset(0 0 100% 0) } to { clip-path: inset(0 0 0 0) } }
.hero-intro-frame { animation: hero-frame 1100ms var(--ease-out-expo) 120ms both; }
```

`animation-fill-mode: both` means **the final keyframe persists for the life
of the page**. So the frame permanently carried `clip-path: inset(0 0 0 0)` —
clipped to its own border box, forever. The two credential pills sit 16px
OUTSIDE that box by design, so their outer edge was sliced off **at every
size, on every device**, from the moment Step 18 shipped. Not a short-window
edge case at all.

**Fix:** the wipe moved off the frame and onto the card inside it, which
already has `overflow-hidden` and therefore loses nothing by being clipped.
The frame stays unclipped, which is exactly what the pills need. The arrival
looks identical.

### Why the first fix "passed" — the lesson

The check asked *"is the pill inside the slide?"*. It was. It never asked
*"does anything clip the pill?"* — and the thing clipping it was the pill's
own parent, via a property (`clip-path`) that the containment check does not
look at. A test that verifies a proxy for the thing you care about will
happily pass while the thing you care about is broken.

`mobile_verify.py` now walks **every ancestor that establishes a clipping
context** — `overflow` in any axis, or a `clip-path` — and compares rects. It
would have caught this on the first pass. 202 assertions now, up from 197.

Two other testing faults from this round, both worth remembering:

- A sweep reported "no clipping found" while both static servers were down.
  Every navigation was throwing and the loop was swallowing exceptions, so a
  total failure to load was indistinguishable from a pass. The sweep now
  prints the error.
- A preview rebuilt from a stale export was measured as if it were the new
  build. Always rebuild `/tmp/realsite` from the new `out/` before measuring
  the preview.
