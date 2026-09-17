import type { Metadata } from "next";
import Link from "next/link";

/**
 * Privacy Policy — a plain-language account of what this site actually
 * does with the information submitted through the contact form and the
 * chat widget. Every claim here is checked against the real code, not
 * boilerplate: no cookies, no analytics/tracking scripts, and no
 * database exist in this project — submissions go straight to a
 * private Google Sheet via an Apps Script webhook. If that changes,
 * this page (and only this page) needs to change with it.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — OXVID Systems",
  description:
    "How Abdul Rehman / OXVID Systems collects, uses and stores information submitted through this website's contact form and chat widget.",
};

const LAST_UPDATED = "September 17, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-paper-50">
      <header className="border-b border-ink-100 bg-paper-0">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="font-mono text-micro tracking-widest text-ink-500 transition-colors hover:text-accent-teal-dark"
          >
            ← BACK TO PORTFOLIO
          </Link>
          <span className="font-mono text-micro tracking-widest text-ink-900">
            OXVID SYSTEMS
          </span>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
        <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
          LEGAL
        </p>
        <h1 className="mt-4 text-display-2 font-semibold tracking-tight text-ink-900">
          Privacy Policy
        </h1>
        <p className="mt-4 text-small text-ink-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-12 flex flex-col gap-10 text-body leading-normal text-ink-700">
          <Section title="Who this covers">
            <p>
              This policy explains what happens to the information you share
              through this website, run by Abdul Rehman under the name OXVID
              Systems. It covers the contact form and the chat widget on
              this site. It does not cover the separate live client
              projects linked from the Work section — those are run by
              their own owners, on their own infrastructure.
            </p>
          </Section>

          <Section title="What we collect">
            <p>
              When you submit the contact form or the chat widget, we
              collect only what you type in: your name, email address,
              phone number, the type of project you&apos;re enquiring
              about, and a short project goal or message.
            </p>
            <p className="mt-4">
              Alongside that, the submission automatically records the
              time, which page you were on, the referring page (if any),
              and a couple of basic technical signals used only to filter
              out spam. Nothing is tracked across your visit beyond the
              single moment you submit the form.
            </p>
          </Section>

          <Section title="What we don't do">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                No cookies, and no analytics or tracking scripts run on
                this site — there genuinely aren&apos;t any in the code.
              </li>
              <li>
                We never sell, rent or share your information with third
                parties or advertisers.
              </li>
              <li>
                We don&apos;t use your email or phone number for marketing
                unless you separately ask us to.
              </li>
            </ul>
          </Section>

          <Section title="How we use it">
            <p>
              Your enquiry is used for exactly one thing: to read it,
              understand what you need, and reply to you — by email,
              phone or WhatsApp, whichever you gave us. The automatically
              recorded technical details exist only to catch spam and bot
              submissions before they reach that inbox.
            </p>
          </Section>

          <Section title="Where it's stored">
            <p>
              Submissions are written directly to a private Google Sheet
              that only Abdul Rehman can access — there is no separate
              database behind this site. The website itself is hosted on
              Vercel. Nothing is copied anywhere beyond that sheet.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              Enquiries are kept for as long as reasonably useful for
              following up on your project. You can ask for your entry to
              be deleted at any time — see Contact below — and it will be
              removed from the sheet.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can ask, at any time, to see what information we hold
              about you, have it corrected, or have it deleted entirely.
              Email the address below and it will be handled directly —
              there is no automated system to route it through.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This site is a professional portfolio and isn&apos;t
              directed at children. We don&apos;t knowingly collect
              information from anyone under 18.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If what&apos;s collected or how it&apos;s used changes, this
              page will be updated and the date at the top will change
              with it. There is no mailing list to notify — check back
              here for the latest version.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy, or a request to access or
              delete your data:
            </p>
            <div className="mt-4 flex flex-col gap-1 font-mono text-small text-ink-900">
              <span>Abdul Rehman — OXVID Systems</span>
              <a
                href="mailto:m.abdulrehman111@gmail.com"
                className="w-fit text-accent-teal-dark hover:underline"
              >
                m.abdulrehman111@gmail.com
              </a>
              <a
                href="mailto:info@oxvidsystems.com"
                className="w-fit text-accent-teal-dark hover:underline"
              >
                info@oxvidsystems.com
              </a>
              <span>+92-322-1690030</span>
            </div>
          </Section>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-h3 font-semibold tracking-tight text-ink-900">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
