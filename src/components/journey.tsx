"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  CAREER,
  CORE_STRENGTH_SKILLS,
  FIGURES,
  SKILL_FAMILIES,
  type JourneyIcon,
  type Milestone,
} from "@/lib/journey";
import { prefersReducedMotion } from "@/lib/motion";
import { NAV_ITEMS } from "@/lib/nav-items";

/**
 * STEP 19 — "Career Roadmap", the Experience section.
 *
 * Section marker and heading on the left with the portrait framed beneath it,
 * two horizontal timelines on the right, and a bar of countable figures under
 * those. It replaces the scroll-drawn road: it says the same thing in a quarter
 * of the height without pinning the page for three viewports.
 *
 * The heading follows the same pattern as About and Expertise — numbered
 * marker, then an h2 at the shared scale — so this section is not a special
 * case in the page's rhythm. The portrait's frame is the Hero's: the same
 * oversized top-left radius, the same soft glow behind it.
 *
 * The portrait is Abdul Rehman's real photograph. It is the same single file
 * the Hero uses — the tighter crop and the darker grade are done in CSS, not by
 * exporting a second copy, so there is one portrait on this site and it can
 * never fall out of sync with itself.
 *
 * Motion is one IntersectionObserver and a short per-block stagger. Nothing
 * runs on scroll, so this section costs nothing once it has arrived.
 */

/** The section number comes from the one nav list, so it stays right if the
 *  order of sections ever changes. */
const ITEM = NAV_ITEMS.find((item) => item.id === "experience")!;

const ICONS: Record<JourneyIcon, React.ReactNode> = {
  cap: (
    <>
      <path d="M2.6 8.6 12 4.4l9.4 4.2L12 12.8 2.6 8.6Z" />
      <path d="M6.6 10.4v4.6c0 1.5 2.4 2.7 5.4 2.7s5.4-1.2 5.4-2.7v-4.6" />
      <path d="M21.1 8.8v4.9" />
    </>
  ),
  mast: (
    <>
      <path d="M12 10.6v9.2" />
      <path d="M8.6 19.8h6.8" />
      <path d="M8.2 8.4a5.4 5.4 0 0 1 7.6 0" />
      <path d="M5.4 5.6a9.4 9.4 0 0 1 13.2 0" />
      <circle cx="12" cy="10.4" r="1.5" />
    </>
  ),
  net: (
    <>
      <rect x="9.2" y="3.4" width="5.6" height="4.6" rx="1" />
      <rect x="2.6" y="16" width="5.4" height="4.6" rx="1" />
      <rect x="16" y="16" width="5.4" height="4.6" rx="1" />
      <path d="M12 8v3.6" />
      <path d="M5.3 16v-2.5h13.4V16" />
    </>
  ),
  code: (
    <>
      <path d="M8.6 8.4 4.4 12l4.2 3.6" />
      <path d="M15.4 8.4 19.6 12l-4.2 3.6" />
      <path d="M13.4 5.8 10.6 18.2" />
    </>
  ),
  win: (
    <>
      <rect x="3" y="4.6" width="18" height="14.8" rx="1.7" />
      <path d="M3 9.2h18" />
      <path d="M6.4 6.9h.01" />
      <path d="M9 6.9h.01" />
    </>
  ),
  case: (
    <>
      <rect x="3" y="7.6" width="18" height="11.8" rx="1.6" />
      <path d="M9.1 7.6V6.2a1.7 1.7 0 0 1 1.7-1.7h2.4a1.7 1.7 0 0 1 1.7 1.7v1.4" />
      <path d="M3 12.4h18" />
    </>
  ),
  cal: (
    <>
      <rect x="3.4" y="5.2" width="17.2" height="15.4" rx="1.8" />
      <path d="M3.4 10h17.2" />
      <path d="M8.2 3.4v3.4" />
      <path d="M15.8 3.4v3.4" />
    </>
  ),
  grid: (
    <>
      <rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.4" />
      <rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.4" />
      <rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.4" />
      <rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.4" />
    </>
  ),
  stack: (
    <>
      <path d="M12 3.4 21 8l-9 4.6L3 8l9-4.6Z" />
      <path d="M3 12.4 12 17l9-4.6" />
      <path d="M3 16.6 12 21.2l9-4.6" />
    </>
  ),
};

function Glyph({ name }: { name: JourneyIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function Stop({ m, now }: { m: Milestone; now?: boolean }) {
  return (
    <li className={`cr-stop cr-rv${now ? " cr-now" : ""}`}>
      <span
        className="cr-node"
        style={
          {
            "--cr-chip": m.tint[0],
            "--cr-mark": m.tint[1],
          } as React.CSSProperties
        }
      >
        <Glyph name={m.icon} />
      </span>
      <div className="cr-txt">
        <p className="cr-title">
          {m.title}
          {now ? <span className="cr-tag">Now</span> : null}
        </p>
        <p className="cr-org">{m.org}</p>
        <p className="cr-when">{m.when}</p>
      </div>
    </li>
  );
}

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".cr-rv"));

    if (prefersReducedMotion()) {
      for (const n of items) n.classList.add("cr-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const target = e.target as HTMLElement;
          const siblings = Array.from(target.parentElement?.children ?? []);
          target.style.transitionDelay = `${Math.min(siblings.indexOf(target) * 70, 420)}ms`;
          target.classList.add("cr-in");
          io.unobserve(target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    for (const n of items) io.observe(n);
    return () => io.disconnect();
  }, []);

  // `data-chat-clear`: the figures bar runs into the bottom-right corner,
  // exactly where the chat launcher parks. Same tuck the Work and Contact
  // sections already declare.
  return (
    <section
      ref={root}
      id="experience"
      className="cr scroll-mt-16 bg-paper-50 px-6 py-section-md lg:scroll-mt-0 lg:px-12 lg:py-section-lg"
      aria-label="Career roadmap"
      data-chat-clear=""
    >
      <div className="cr-frame">
        {/* ---------- the section title: its own row, left column ---------- */}
        <div className="cr-title">
          <p className="cr-kicker">
            <span aria-hidden />
            {ITEM.num}
            <i aria-hidden>·</i>
            My Journey
          </p>
          <h2 className="cr-h">
            Career Roadmap<i>.</i>
          </h2>
          <p className="cr-lede">
            The roles that got me here, and what I build with today.
          </p>
        </div>

        {/* ---------- row two: the portrait, level with the timeline ---------- */}
        <figure className="cr-shot">
          <span className="cr-glow" aria-hidden />
          <div className="cr-plate">
              <Image
                src="/images/abdul-rehman-fulllength.jpg"
                alt="Abdul Rehman, founder of OXVID Systems"
                fill
                sizes="(min-width: 1024px) 24rem, 20rem"
                className="cr-img"
              />
              <span className="cr-veil" aria-hidden />
              <svg className="cr-circuit" viewBox="0 0 260 150" aria-hidden="true">
                <path d="M0 118h44l16-16h40l14 14h46" />
                <path d="M0 96h28l18-18h52" />
                <path d="M0 140h70l18-18h64l14 14h52" />
                <path d="M98 78v-22h44" />
                <circle cx="160" cy="116" r="3" />
                <circle cx="98" cy="56" r="3" />
                <circle cx="218" cy="136" r="3" />
              </svg>
          </div>
        </figure>

        {/* ---------- right: the career, and what it is made of ---------- */}
        <div className="cr-stage">
          <section className="cr-job">
            <h3 className="cr-chapter">Experience</h3>
            <div className="cr-tl">
              <span className="cr-rule" />
              <ol className="cr-stops">
                {CAREER.map((m, i) => (
                  <Stop key={m.title} m={m} now={i === CAREER.length - 1} />
                ))}
              </ol>
            </div>
          </section>

          <div className="cr-divider" />

          {/* What the career above is actually made of. It sat full width
              beneath both columns while Education was still here; with that
              gone the right column ended 278px (1440) to 496px (1920) above
              the portrait, so it comes back up to fill the column it was
              always about. Nothing wraps: auto-fit sizes these columns from
              the longest skill, and the stage gives it two roomy ones. */}
          <section className="cr-skills">
            <h3 className="cr-chapter">Core Skills</h3>
            <div className="cr-fams">
              {SKILL_FAMILIES.map((f) => (
                <div
                  key={f.name}
                  className="cr-fam cr-rv"
                  style={{ "--cr-mark": f.tint } as React.CSSProperties}
                >
                  <h4 className="cr-fam-h">{f.name}</h4>
                  {f.name === "AI & Automation" && (
                    <p className="cr-fam-strength">
                      Where AI-paired development — my core strength — lives
                    </p>
                  )}
                  <ul className="cr-fam-list">
                    {f.skills.map((skill) => (
                      <li
                        key={skill}
                        className={
                          CORE_STRENGTH_SKILLS.has(skill) ? "cr-fam-core" : undefined
                        }
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---------- full width beneath both columns ---------- */}
        <div className="cr-tail">
          <div className="cr-figs">
            {FIGURES.map((f) => (
              <div
                key={f.label}
                className="cr-fig cr-rv"
                style={{ "--cr-mark": f.tint } as React.CSSProperties}
              >
                <Glyph name={f.icon} />
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
