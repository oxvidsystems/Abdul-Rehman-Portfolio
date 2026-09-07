# OXVID Systems — Abdul Rehman Portfolio

Abdul Rehman's personal portfolio website, built under his brand **OXVID Systems**. A premium, editorial, cinematic single-page experience showcasing 7 years of professional web development, automation, and brand/content work — with a built-in AI-style lead-generation chat widget.

**Live site:** [oxvid-portfolio.vercel.app](https://oxvid-portfolio.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Backend / data:** Firebase (Firestore + Admin SDK) for lead storage
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
```

Copy `.env.example` to `.env.local` and fill in the required values (Firebase service account credentials, email/OTP provider keys, etc.) before running the lead-capture / chat-verification flow locally.

## Project Structure

```
src/
  app/            # Next.js App Router pages, layout, global styles
  components/     # Section components (hero slider, nav, journey, chat widget, etc.)
  lib/            # Shared hooks/utilities (nav items, active-section tracking, parallax, ...)
public/
  images/         # Optimized site assets actually used by the app
```

## Design Direction

- **Light theme first** — predominantly white/off-white surfaces with a distinct dark green/teal brand accent (not neutral grey), used as a deliberate contrast element rather than the base theme.
- **Layout:** fixed/floating left navigation with numbered sections and an active-state indicator; content scrolls on the right. Mobile is a dedicated redesign, not a scaled-down desktop layout.
- **Motion:** scroll-triggered reveals, pinned/sticky sections (including a pinned 3-slide scroll hero), parallax and stacking project panels — all respecting `prefers-reduced-motion`.
- **No template look:** no generic cards, glassmorphism, purple "AI" gradients, or stock portfolio patterns.

## Sections

`HOME` · `ABOUT` · `EXPERTISE` · `WORK` · `EXPERIENCE` · `CONTACT`

## Real Projects Featured

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

All previews link to real, working live sites — no fabricated screenshots, clients, or case studies.

## Services

01 Custom Web Development · 02 Professional Content Writing · 03 AI Agents & Automation · 04 Brand Identity & Creative Design

## Lead Capture / Chat Widget

A short, friendly, quick-reply-driven chat widget collects name, email, phone, project type, and a brief project goal. Emails are validated on both client and server and must pass real ownership verification (single-use, time-limited OTP / verification link) before a lead is marked **VERIFIED** — a syntactically valid but unverified email is never treated as a qualified lead. Verification requests and OTP attempts are rate-limited, and no secrets or API keys are exposed in frontend code.

## Contact

**Abdul Rehman** — Founder, OXVID Systems (7 years of experience)
- Phone: +92-322-1690030
- Email: m.abdulrehman111@gmail.com
- Business email: info@oxvidsystems.com

**OXVID Systems — USA Office**
182 Ridgeley Ave, Iselin, NJ 08830, USA
- Phone: +1 571 3761336
- Email: info@oxvidsystems.com

---

© Abdul Rehman / OXVID Systems. All rights reserved.
