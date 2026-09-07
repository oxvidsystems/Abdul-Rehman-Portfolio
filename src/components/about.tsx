"use client";

import Image from "next/image";
import { NAV_ITEMS } from "@/lib/nav-items";
import { SERVICES } from "@/lib/services";
import { useReveal } from "@/lib/use-reveal";

/**
 * STEP 05 — About + "7 years of experience" only. A short editorial
 * storytelling sequence, not a biography: a static left column (the
 * section marker, pinned while the right column scrolls past it, per
 * the brief's "static-left / dynamic-right" instruction) and a dynamic
 * right column of three scroll-revealed beats — a large typographic
 * "07", a portrait detail + signature paired with the four real
 * disciplines, then one short pull-quote statement.
 *
 * Every fact here is one already confirmed for this project (7 years,
 * OXVID Systems, the four real service disciplines). No invented
 * history, clients, awards or metrics. Services and Work are
 * deliberately NOT built here — that's a later step.
 */

const ABOUT_ITEM = NAV_ITEMS.find((item) => item.id === "about")!;

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-16 bg-paper-50 px-6 py-section-md lg:scroll-mt-0 lg:px-12 lg:py-section-lg"
    >
      <div className="mx-auto grid w-full max-w-[104rem] gap-8 lg:grid-cols-[minmax(120px,180px)_minmax(0,1fr)] lg:gap-16">
        {/* ---------- STATIC LEFT: pinned section marker ---------- */}
        <div className="lg:sticky lg:top-40 lg:h-fit">
          <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-teal-dark">
            <span className="h-1.5 w-1.5 shrink-0 bg-accent-teal-dark" aria-hidden />
            {ABOUT_ITEM.num}
          </p>
          <h2 className="mt-4 text-h2 font-semibold tracking-tight text-ink-900">About</h2>
          <span
            aria-hidden
            className="mt-6 hidden h-px w-12 bg-ink-200 lg:block"
          />
        </div>

        {/* ---------- DYNAMIC RIGHT: storytelling sequence ---------- */}
        <div className="flex flex-col gap-12 lg:gap-24">
          <NumberBeat />
          <PortraitBeat />
          <StatementBeat />
          <MethodBeat />
        </div>
      </div>
    </section>
  );
}

function NumberBeat() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={revealed ? "animate-reveal-up" : "opacity-0"}>
      <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
        SEVEN YEARS — WEB, AUTOMATION & BRAND
      </p>

      <div className="mt-5 flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-8 sm:gap-y-2">
        <span className="font-display text-[clamp(4.5rem,3rem+14vw,11rem)] font-extrabold leading-[0.82] tracking-tight text-ink-900">
          07
        </span>
        <span className="text-h2 font-semibold leading-tight tracking-tight text-ink-500 sm:mb-1 lg:mb-3">
          Years of
          <br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>
          experience.
        </span>
      </div>

      <span aria-hidden className="mt-8 block h-px w-full bg-paper-300" />
    </div>
  );
}

function PortraitBeat() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-12 lg:gap-16 ${
        revealed ? "animate-reveal-scale" : "opacity-0"
      }`}
    >
      <div className="relative w-full max-w-[260px] overflow-hidden rounded-tl-[72px] rounded-tr-md rounded-br-md rounded-bl-md shadow-lg">
        <Image
          src="/images/abdul-rehman-about.png"
          alt="Abdul Rehman, founder of OXVID Systems — portrait detail"
          width={520}
          height={570}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
          FOUNDER, OXVID SYSTEMS
        </p>
        <p
          className="mt-2 text-5xl leading-none text-ink-900 lg:text-6xl"
          style={{ fontFamily: "var(--font-signature)" }}
        >
          Abdul Rehman
        </p>

        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {SERVICES.map((d) => (
            <li key={d.num} className="flex items-baseline gap-3">
              <span className="font-mono text-micro text-accent-teal">{d.num}</span>
              <span className="text-small font-medium leading-snug text-ink-700">
                {d.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatementBeat() {
  const { ref, revealed } = useReveal<HTMLQuoteElement>();
  return (
    <blockquote
      ref={ref}
      className={`max-w-3xl border-l-2 border-accent-teal pl-6 lg:pl-8 ${
        revealed ? "animate-reveal-up" : "opacity-0"
      }`}
    >
      <p className="text-h3 font-medium leading-snug tracking-tight text-ink-700">
        Seven years designing and engineering premium web platforms, AI-driven
        automation and brand identities under OXVID Systems — for real clients
        running real businesses.
      </p>
    </blockquote>
  );
}

/**
 * New beat: names the actual working method (AI-paired development with
 * Claude) as the through-line that makes the rest of this section's claims
 * possible — one founder, seven years, real client work. Kept short and
 * personal here; the full case (with tool credentials and a link to Work)
 * lives in its own dedicated section right after Expertise.
 */
function MethodBeat() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={revealed ? "animate-reveal-up" : "opacity-0"}>
      <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
        HOW I ACTUALLY BUILD
      </p>
      <p className="mt-4 max-w-2xl text-h3 font-medium leading-snug tracking-tight text-ink-700">
        The method behind those seven years has changed: today I design and
        ship production software by pairing directly with Claude &mdash;
        Anthropic&rsquo;s AI &mdash; across both frontend and backend.
        It&rsquo;s not a shortcut; it&rsquo;s the specific skill that lets one
        founder deliver at the pace of a small team.
      </p>
    </div>
  );
}
