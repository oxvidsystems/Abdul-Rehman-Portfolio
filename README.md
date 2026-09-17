# OXVID Systems — Abdul Rehman Portfolio

Abdul Rehman's personal portfolio website, built under his brand **OXVID Systems**. A premium, editorial, cinematic single-page experience showcasing 7 years of professional web development, automation, and brand/content work — with a built-in AI-style lead-generation chat widget.

**Live site:** [ab-rehman-portfolio.vercel.app](https://ab-rehman-portfolio.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Backend / data:** a Google Sheet, written to via a small Apps Script webhook
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

Copy `.env.example` to `.env.local` and fill in `LEADS_SHEET_WEBHOOK_URL` before running the lead-capture flow locally (see "Lead Capture / Chat Widget" below for how to get that URL).

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

A short, friendly, quick-reply-driven chat widget collects name, email, phone, project type, and a brief project goal. Both the widget and the contact form validate on the client and again on the server, and every submission is rate-limited per IP and per email address.

Submissions land as rows in a Google Sheet — there is no database and no email-ownership (OTP) verification step; a syntactically valid email is accepted as-is. To set the sheet up:

1. Create a Google Sheet.
2. **Extensions -> Apps Script**, delete the placeholder code, and paste:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       new Date(),
       data.timestamp || "",
       data.name || "",
       data.email || "",
       data.phone || "",
       data.projectType || "",
       data.projectInterest || "",
       data.projectGoal || "",
       data.additionalMessage || "",
       data.source || "",
       data.page || "",
       data.referrer || "",
       data.spamSignals || ""
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy -> New deployment -> Web app.** Execute as **Me**, Who has access: **Anyone**. Deploy, then copy the Web App URL it gives you.
4. Add it to Vercel as `LEADS_SHEET_WEBHOOK_URL` (Settings -> Environment Variables -> Production) and redeploy.

Treat that URL as sensitive — anyone who has it can add rows to the sheet.

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
