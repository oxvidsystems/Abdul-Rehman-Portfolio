"use client";

import Link from "next/link";
import { ContactForm } from "./contact-form";
import { ContactTrace } from "./contact-trace";
import {
  CONTACT_DESTINATIONS,
  PRIMARY_ENQUIRY_HREF,
  type ContactDestination,
} from "@/lib/contact";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useReveal } from "@/lib/use-reveal";
import { openResumeModal } from "./resume-modal";

/**
 * STEP 09 — Contact + USA office.
 *
 * A full-bleed OXVID-dark closing section. Two contact destinations
 * (Pakistan/general and the USA office) are presented as two stations
 * on one routed line — distinct blocks, visibly wired to each other,
 * which is the literal truth of the arrangement rather than decoration.
 *
 * Honesty constraints held here:
 *  · no invented USA-specific email — the USA block publishes the same
 *    studio inbox, exactly as supplied;
 *  · no map, no coordinates, no "find us" imagery — the address is
 *    printed as an address and nothing more;
 *  · no availability, response-time or client claims.
 *
 * The chat widget is NOT part of this step.
 */

const CONTACT_ITEM = NAV_ITEMS.find((item) => item.id === "contact")!;

export function Contact() {
  const headline = useReveal<HTMLDivElement>();
  const route = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const sign = useReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      // This section publishes every phone number and address there is; the
      // floating chat launcher steps aside while it is on screen.
      data-chat-clear=""
      className="relative scroll-mt-16 overflow-hidden bg-ink-900 px-6 py-section-md lg:-ml-40 lg:w-[calc(100%+10rem)] lg:scroll-mt-0 lg:py-section-lg lg:pl-40 lg:pr-12"
    >
      {/* ---------- ground: brand glow + technical grid ---------- */}
      <span aria-hidden className="contact-ground" />

      <div className="relative mx-auto w-full max-w-[104rem]">
        {/* ---------- section marker ---------- */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-mint">
              <span className="h-1.5 w-1.5 shrink-0 bg-accent-mint" aria-hidden />
              {CONTACT_ITEM.num}
            </p>
            <h2 className="mt-4 text-h2 font-semibold tracking-tight text-paper-0">
              Contact
            </h2>
          </div>
          <p className="font-mono text-micro tracking-widest text-paper-0">
            OXVID SYSTEMS &nbsp;·&nbsp; PAKISTAN / USA
          </p>
        </div>

        {/* ---------- the ask ---------- */}
        {/* Headline on the left, enquiry form on the right. The headline
            block itself is untouched — it is the same h3, the same mailto
            plate and the same routing graphic, now sharing a row. */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(400px,44%)] lg:items-center lg:gap-16">
        <div
          ref={headline.ref}
          className={`mt-10 lg:mt-0 ${headline.revealed ? "animate-reveal-up" : "opacity-0"}`}
        >
          <h3 className="font-display text-[clamp(2.5rem,1rem+5.2vw,7rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-paper-0">
            <span className="block">Let&rsquo;s build</span>
            <span className="block lg:pl-[12%]">
              what&rsquo;s next<span className="text-accent-teal">.</span>
            </span>
          </h3>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-10 lg:mt-14">
            <a
              href={PRIMARY_ENQUIRY_HREF}
              // Step 18: the single most important action on the site was
              // its quietest element — 14px mono with an underline, on a
              // screen carrying a 112px headline. It now has the same
              // presence as the gallery's "view live site": a solid plate
              // in paper on the dark ground. Same vocabulary the site
              // already uses, not a new one.
              className="group inline-flex min-h-[52px] items-center gap-4 rounded-lg bg-paper-0 px-8 py-4 font-mono text-small font-semibold tracking-widest text-ink-950 shadow-sm transition-all duration-fast hover:-translate-y-0.5 hover:bg-accent-mint hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal"
            >
              START A PROJECT
              <span
                aria-hidden
                className="transition-transform duration-base ease-out-expo group-hover:translate-x-2"
              >
                &rarr;
              </span>
            </a>

            {/* subtle technical graphic — sits in the empty plate beside the
                CTA, never over anything that has to be read */}
            <div
              aria-hidden
              className={`contact-trace hidden w-[260px] text-ink-600 lg:block ${
                headline.revealed ? "is-in" : ""
              }`}
            >
              <ContactTrace className="h-auto w-full" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openResumeModal}
              className="inline-flex min-h-[48px] items-center gap-3 rounded-lg border border-paper-0/25 px-6 py-3 font-mono text-small font-semibold tracking-widest text-paper-0 transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-mint hover:text-accent-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal"
            >
              VIEW RESUME
            </button>
          </div>
        </div>

        <ContactForm />
        </div>

        {/* ---------- the two destinations, wired together ---------- */}
        <div
          ref={route.ref}
          className={`relative mt-14 lg:mt-32 ${route.revealed ? "animate-reveal-up" : "opacity-0"}`}
        >
          {/* Bracket wiring the two stations together. Its right edge is
              calc(50% + 2rem) — exactly where the second grid column
              starts under `lg:grid-cols-2 lg:gap-16` — so the legs land
              on the two nodes rather than near them. Desktop only: once
              the blocks stack, a left-to-right link describes a
              relationship the layout no longer has. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 left-0 hidden h-8 w-[calc(50%+2rem)] lg:block"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-ink-950" />
            <span className="absolute left-0 top-0 h-full w-px bg-ink-950" />
            <span className="absolute right-0 top-0 h-full w-px bg-ink-950" />
          </div>

          <span aria-hidden className="block h-px w-full bg-ink-950" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {CONTACT_DESTINATIONS.map((destination, i) => (
              <Destination
                key={destination.id}
                destination={destination}
                divided={i > 0}
              />
            ))}
          </div>
        </div>

        {/* ---------- signature ---------- */}
        <div
          ref={sign.ref}
          className={`mt-14 flex flex-col gap-8 border-t border-ink-950 pt-10 sm:flex-row sm:items-end sm:justify-between lg:mt-28 ${
            sign.revealed ? "animate-reveal-up" : "opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            <p className="max-w-sm text-small leading-normal text-paper-0/80">
              Every project runs through one person end to end — brief, build
              and handover.
            </p>

            <Link
              href="/privacy-policy"
              className="w-fit font-mono text-micro tracking-widest text-paper-0/50 transition-colors hover:text-accent-mint"
            >
              PRIVACY POLICY
            </Link>
          </div>

          <div className="sm:text-right">
            <p
              className="text-5xl leading-none text-paper-0 lg:text-6xl"
              style={{ fontFamily: "var(--font-signature)" }}
            >
              Abdul Rehman
            </p>
            <p className="mt-3 font-mono text-micro tracking-widest text-paper-0">
              FOUNDER &nbsp;·&nbsp; OXVID SYSTEMS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Destination({
  destination,
  divided,
}: {
  destination: ContactDestination;
  divided: boolean;
}) {
  return (
    <div
      className={`relative pt-10 ${
        divided ? "border-t border-ink-950 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-10" : ""
      }`}
    >
      {/* station node on the rail above */}
      <span
        aria-hidden
        className="absolute -top-[3px] left-0 h-[5px] w-[5px] bg-accent-teal lg:left-auto lg:right-auto"
        style={divided ? { left: "-3px" } : undefined}
      />

      <div className="flex items-baseline gap-4">
        <span className="font-mono text-micro tracking-widest text-paper-0">
          {destination.code}
        </span>
        <p className="font-mono text-micro tracking-widest text-paper-0">
          {destination.eyebrow.toUpperCase()}
        </p>
      </div>

      <p className="mt-5 text-h2 font-semibold leading-snug tracking-tight text-paper-0">
        {destination.name}
      </p>

      <dl className="mt-7 flex flex-col gap-6">
        {destination.channels.map((channel) => (
          <div
            key={`${channel.kind}-${channel.display}`}
            className="grid gap-1 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="pt-[3px] font-mono text-micro tracking-widest text-paper-0/90">
              {channel.label.toUpperCase()}
            </dt>
            <dd className="min-w-0">
              {channel.href ? (
                <a
                  href={channel.href}
                  // A 20px-tall text link is a desktop affordance. Padding
                  // the box to 44px makes it a thumb target without changing
                  // how it looks; the negative margin keeps the list rhythm.
                  className="-my-2.5 inline-flex min-h-[44px] items-center break-words py-2.5 text-body-lg text-paper-0 underline decoration-ink-600 decoration-1 underline-offset-[6px] transition-colors duration-fast hover:decoration-accent-mint hover:text-accent-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal"
                  style={
                    channel.kind === "phone"
                      ? { fontVariantNumeric: "tabular-nums" }
                      : undefined
                  }
                >
                  {channel.display}
                </a>
              ) : (
                <p className="whitespace-pre-line text-body-lg leading-snug text-paper-0">
                  {channel.display}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
