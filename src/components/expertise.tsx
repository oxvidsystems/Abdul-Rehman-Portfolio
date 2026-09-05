"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { SERVICES, type Service } from "@/lib/services";
import { SERVICE_ART } from "./service-artwork";

/**
 * STEP 06 — Expertise. Six chapters, not cards.
 *
 * The pinned-and-overlapping "stacking deck" this section used to run
 * (each chapter sticking over the last, the previous one scaling back
 * and dimming) put the still-visible top edge of the outgoing chapter
 * on screen for the whole time the incoming one was sliding up to
 * cover it — reported back as "the back cards show at the top" and
 * asked to be removed outright, not just tuned down. There's no
 * version of a covering-overlap transition that hides that seam, so
 * the deck mechanic is gone: chapters simply flow one after another
 * on every breakpoint now, the same plain flow this section already
 * used below `lg` and under `prefers-reduced-motion`.
 *
 * The left rail's "which chapter is active" highlight still works —
 * driven by IntersectionObserver instead of the old scroll/rAF pass,
 * since nothing needs a per-frame transform anymore.
 *
 * All copy comes from `lib/services.ts`, transcribed from the client's
 * own reference images — nothing invented.
 */

const EXPERTISE_ITEM = NAV_ITEMS.find((item) => item.id === "expertise")!;

export function Expertise() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = stackRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-panel]"));
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The panel closest to the vertical centre of the viewport wins.
        let best = -1;
        let bestDistance = Infinity;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = panels.indexOf(entry.target as HTMLElement);
          const mid = entry.boundingClientRect.top + entry.boundingClientRect.height / 2;
          const distance = Math.abs(mid - window.innerHeight / 2);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        if (best !== -1) setActive(best);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="expertise"
      className="relative scroll-mt-16 bg-paper-100 px-6 py-section-md lg:scroll-mt-0 lg:px-12 lg:py-section-lg"
    >
      <div className="mx-auto grid w-full max-w-[104rem] gap-8 lg:grid-cols-[minmax(150px,230px)_minmax(0,1fr)] lg:gap-16">
        {/* ---------- STATIC LEFT: pinned context rail ---------- */}
        <div className="lg:sticky lg:top-40 lg:h-fit">
          <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-teal-dark">
            <span className="h-1.5 w-1.5 shrink-0 bg-accent-teal-dark" aria-hidden />
            {EXPERTISE_ITEM.num}
          </p>
          <h2 className="mt-4 text-h2 font-semibold tracking-tight text-ink-900">
            Expertise
          </h2>
          <p className="mt-4 max-w-[16rem] text-small leading-normal text-ink-500">
            Six disciplines, delivered end to end under OXVID Systems.
          </p>

          {/* which chapter is dominant right now */}
          <ol className="mt-10 hidden lg:block">
            {SERVICES.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.num} className="border-t border-paper-300 last:border-b">
                  <div className="flex items-baseline gap-3 py-3">
                    <span
                      className={`font-mono text-micro transition-colors duration-base ${
                        isActive ? "text-accent-teal-dark" : "text-ink-300"
                      }`}
                    >
                      {s.num}
                    </span>
                    <span
                      className={`text-small leading-snug transition-colors duration-base ${
                        isActive ? "font-semibold text-ink-900" : "text-ink-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---------- DYNAMIC RIGHT: the chapters, in plain flow ---------- */}
        <div ref={stackRef} className="flex flex-col gap-8 lg:gap-10">
          {SERVICES.map((service) => (
            <div key={service.num} data-deck-panel="">
              <Chapter service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chapter({ service }: { service: Service }) {
  const Art = SERVICE_ART[service.art];
  const dark = service.tone === "dark";

  return (
    <article
      className={`overflow-hidden rounded-tl-[44px] rounded-br-md rounded-tr-md rounded-bl-md px-6 py-8 shadow-lg sm:rounded-tl-[64px] sm:px-10 sm:py-11 lg:rounded-tl-[88px] lg:px-14 lg:py-14 ${
        dark ? "bg-ink-900 text-paper-0" : "bg-paper-0 text-ink-900"
      }`}
      style={
        {
          "--art-accent": dark ? "var(--color-accent-mint)" : "var(--color-accent-teal)",
          "--chapter-bg": dark ? "var(--color-ink-900)" : "var(--color-paper-0)",
        } as React.CSSProperties
      }
    >
      {/* The deck recedes a covered chapter by fading THIS, not the card —
          see the note in lib/use-stacking-deck.ts. The card behind stays
          hidden because the card in front stays opaque. */}
      <div
        className="grid gap-7 transition-opacity duration-instant lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12"
        style={{ opacity: "var(--deck-dim, 1)" }}
      >
        {/* ---- copy ---- */}
        <div>
          <p
            className={`font-mono text-micro tracking-widest ${
              dark ? "text-accent-mint" : "text-accent-teal-dark"
            }`}
          >
            {service.num} — SERVICE
          </p>

          <h3 className="mt-4 font-display text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] font-extrabold leading-[1.05] tracking-tight">
            {service.title}
          </h3>

          <p
            className={`mt-4 max-w-md text-body leading-normal ${
              dark ? "text-ink-200" : "text-ink-500"
            }`}
          >
            {service.tagline}
          </p>

          <p
            className={`mt-4 max-w-md text-small leading-normal ${
              dark ? "text-ink-300" : "text-ink-500"
            }`}
          >
            {service.body}
          </p>

          <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <CheckIcon
                  className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${
                    dark ? "text-accent-mint" : "text-accent-teal"
                  }`}
                />
                <span
                  className={`text-small leading-snug ${
                    dark ? "text-paper-0" : "text-ink-700"
                  }`}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- artwork ---- */}
        <div className="lg:justify-self-end">
          <div
            data-deck-parallax=""
            className={`overflow-hidden rounded-sm ${
              dark ? "text-paper-0/70" : "text-ink-900/60"
            }`}
          >
            <Art className="h-auto w-full" />
          </div>

          <ul
            className={`mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t pt-5 font-mono text-[10px] tracking-widest ${
              dark ? "border-ink-700 text-ink-200" : "border-paper-200 text-ink-400"
            }`}
          >
            {service.pillars.map((p) => (
              <li key={p}>{p.toUpperCase()}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m4 12 6 6L20 6" />
    </svg>
  );
}
