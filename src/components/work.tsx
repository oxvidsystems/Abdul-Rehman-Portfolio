"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { NAV_ITEMS } from "@/lib/nav-items";
import { PROJECTS, PROJECT_COUNT, type Project } from "@/lib/projects";
import { AIAgents } from "./ai-agents";

/**
 * STEP 20 — Work ("Completed Projects"), rebuilt to the client's reference:
 * the project's own screenshot full-bleed behind, a frosted detail card on
 * the left, round arrows bottom-left and a timed progress bar bottom-centre.
 *
 * It replaces the pinned 3D gallery. That version held the page for five and
 * a half viewports (7,110px) to show fourteen small cards; this one shows one
 * project at real size in a single stage, which is both what was asked for
 * and about 5,600px less scrolling.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHAT THE CARD SAYS, AND WHY IT IS NOT THE REFERENCE'S WORDS
 * ─────────────────────────────────────────────────────────────────────
 * The reference card reads: BUSINESS CHALLENGE, OUR SOLUTION, TECHNOLOGY
 * STACK, BUSINESS IMPACT, "View Full Case Study". Its content is invented
 * sample copy for a university that does not exist.
 *
 * The layout is matched exactly. The words are not, because for these
 * fourteen REAL, named, publicly reachable clients we hold none of that:
 *   · no brief, so no "business challenge";
 *   · no scope of work, and several of these run on turnkey platforms
 *     (BentoBox, a WordPress dental theme), so "our solution" would
 *     overclaim what was actually built;
 *   · no analytics, so "business impact" would be a fabricated result
 *     attributed to a real company — the one thing the brief forbids
 *     outright, and the one a visitor could disprove with a phone call;
 *   · no case studies exist, so "View Full Case Study" would be a dead end.
 *
 * Each slot is therefore filled from lib/projects.ts, every value of which
 * was read off the live site itself on 2026-08-28:
 *   client line   → title            (matches "UNIVERSITY")
 *   headline      → tagline          (the site's own hero line)
 *   overview      → description      (what the site actually is)
 *   technology    → technologies     (only what was observable; the row is
 *                                     dropped entirely when nothing was)
 *   live at       → hostname         (occupies the "business impact" slot —
 *                                     the one line here that a visitor can
 *                                     verify in a click, which is worth more
 *                                     to a prospect than an invented metric)
 *   the button    → the real url, opening the live site
 *
 * If the client supplies real challenge/impact copy per project, the rows
 * are already built: add the fields and map them here.
 *
 * ─────────────────────────────────────────────────────────────────────
 * AUTOPLAY
 * ─────────────────────────────────────────────────────────────────────
 * "Timebar" was the ask, so the bar fills over SLIDE_MS rather than showing
 * position, and the deck advances on its own. It stops when it should:
 * off-screen, hidden tab, pointer over the stage, keyboard focus inside it,
 * under prefers-reduced-motion, and permanently the moment a visitor works
 * the arrows or dots — at that point they are driving and it stays out of
 * the way. WCAG 2.2.2 asks for a way to stop moving content; hover, focus
 * and any manual navigation are all it, and the reduced-motion path never
 * starts it at all.
 *
 * Only the screenshots near the active slide are mounted. Fourteen 1440px
 * captures is 1.5MB, and stacking them for a crossfade would put every one
 * of them in the viewport at once — lazy loading cannot save you from that,
 * so the deck mounts a window of three and remembers what it has shown.
 */

const WORK_ITEM = NAV_ITEMS.find((item) => item.id === "work")!;
const SLIDE_MS = 7000;

export function Work() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(prefersReducedMotion()), []);
  if (reduced) return <WorkList />;
  return <WorkDeck />;
}

function WorkDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  // Every index whose screenshot has been mounted, so going back is instant.
  const [seen, setSeen] = useState<number[]>([0, 1]);
  // Set once the visitor takes over; autoplay never resumes after that.
  const [manual, setManual] = useState(false);
  const [running, setRunning] = useState(false);

  const go = useCallback((next: number, byHand = true) => {
    const i = (next + PROJECT_COUNT) % PROJECT_COUNT;
    if (byHand) setManual(true);
    setActive(i);
    setSeen((prev) =>
      prev.includes(i) && prev.includes((i + 1) % PROJECT_COUNT)
        ? prev
        : [...new Set([...prev, i, (i + 1) % PROJECT_COUNT, (i - 1 + PROJECT_COUNT) % PROJECT_COUNT])]
    );
  }, []);

  /* Run only while the stage is actually on screen and the tab is visible. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || manual) return;
    let onScreen = false;
    const sync = () => setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { threshold: 0.4 }
    );
    io.observe(stage);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [manual]);

  /* The bar is a CSS animation restarted on each slide, so the fill is the
     clock — one source of truth instead of a timer and a width that drift
     apart, and it pauses with the same `animation-play-state` the timer
     pauses with. */
  useEffect(() => {
    if (manual || !running) return;
    const id = window.setTimeout(() => go(active + 1, false), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [active, running, manual, go]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Longhands, not the `animation` shorthand. The shorthand resets every
    // sub-property it does not mention, including animation-play-state — so
    // setting it here quietly overrode the CSS `animation-play-state:
    // var(--pw-play)` with `running`, and the bar kept filling through a
    // hover that had already stopped the deck. Measured: 114px to 233px while
    // the counter sat still.
    bar.style.animationName = "none";
    void bar.offsetWidth; // reflow, so the restart actually restarts
    if (manual) {
      bar.style.animationName = "";
      bar.style.animationDuration = "";
      return;
    }
    bar.style.animationName = "pw-fill";
    bar.style.animationDuration = `${SLIDE_MS}ms`;
    bar.style.animationTimingFunction = "linear";
    bar.style.animationFillMode = "forwards";
  }, [active, manual]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  /* Swipe, without a library: a horizontal drag of more than 44px wins. */
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
  };

  const current = PROJECTS[active];
  const mounted = useMemo(() => new Set(seen), [seen]);

  return (
    <section
      id="work"
      className="pw scroll-mt-16 lg:-ml-40 lg:w-[calc(100%+10rem)] lg:scroll-mt-0"
      data-chat-clear=""
      aria-roledescription="carousel"
      aria-label="Work highlights"
    >
      <div className="pw-head">
        <p className="pw-kicker">
          <span aria-hidden />
          {WORK_ITEM.num}
          <i aria-hidden>—</i>Selected Work
        </p>
        <h2 className="pw-h2">Work Highlights</h2>
      </div>

      <div
        ref={stageRef}
        className="pw-stage"
        tabIndex={0}
        role="group"
        aria-label={`Project ${active + 1} of ${PROJECT_COUNT}: ${current.title}`}
        onKeyDown={onKey}
        onMouseEnter={() => setRunning(false)}
        onMouseLeave={() => !manual && setRunning(true)}
        onFocus={() => setRunning(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ ["--pw-play" as string]: running && !manual ? "running" : "paused" }}
      >
        {/* the real screenshot, full bleed */}
        {PROJECTS.map((project, i) =>
          mounted.has(i) ? (
            <div
              key={project.id}
              className={`pw-shot${i === active ? " pw-on" : ""}`}
              aria-hidden={i !== active}
            >
              <Image
                src={project.preview!.src}
                alt={project.preview!.alt}
                fill
                sizes="(min-width: 1024px) 94vw, 100vw"
                loading={i === 0 ? "eager" : "lazy"}
                className="pw-img"
              />
            </div>
          ) : null
        )}
        <span className="pw-scrim" aria-hidden />

        {/* sector, top right */}
        <span className="pw-pill">{sectorOf(current)}</span>

        {/* the detail card, left */}
        <article className="pw-card" key={current.id}>
          <p className="pw-client">{current.title}</p>

          <p className="pw-lbl">The project</p>
          <h3 className="pw-title">{current.tagline ?? hostnameOf(current.url)}</h3>

          {current.description && (
            <>
              <p className="pw-lbl">Overview</p>
              <p className="pw-body">{leadSentence(current.description)}</p>
            </>
          )}

          {current.technologies.length > 0 && (
            <>
              <p className="pw-lbl">Technology</p>
              <ul className="pw-chips">
                {current.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </>
          )}

          <p className="pw-lbl">Live at</p>
          <p className="pw-live">
            <ArrowIcon aria-hidden />
            {hostnameOf(current.url)}
          </p>

          <span className="pw-rule" aria-hidden />

          <a className="pw-cta" href={current.url} target="_blank" rel="noopener noreferrer">
            View Live Site
            <span className="pw-cta-o" aria-hidden>
              <ArrowIcon />
            </span>
          </a>
        </article>

        {/* arrows, bottom left */}
        <div className="pw-nav">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous project">
            <ChevronIcon className="pw-flip" />
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next project">
            <ChevronIcon />
          </button>
        </div>

        {/* the time bar, bottom centre */}
        <div className="pw-bar">
          <span className="pw-n">{current.number}</span>
          <span className="pw-track">
            <span
              ref={barRef}
              className="pw-fill"
              style={manual ? { width: `${((active + 1) / PROJECT_COUNT) * 100}%` } : undefined}
            />
            <span className="pw-jump" role="tablist" aria-label="Choose a project">
              {PROJECTS.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${project.number} — ${project.title}`}
                  title={project.title}
                  onClick={() => go(i)}
                />
              ))}
            </span>
          </span>
          <span className="pw-n">{String(PROJECT_COUNT).padStart(2, "0")}</span>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {`Project ${active + 1} of ${PROJECT_COUNT}: ${current.title}`}
      </p>

      <AIAgents />
    </section>
  );
}

/** "real-estate" → "Real Estate" */
function sectorOf(project: Project): string {
  const raw = project.category ?? "";
  if (!raw) return "Project";
  return raw
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** `prefers-reduced-motion`: no deck, no autoplay — a plain readable list. */
function WorkList() {
  return (
    <section
      id="work"
      className="scroll-mt-16 bg-paper-50 px-6 py-section-md lg:scroll-mt-0 lg:px-12"
    >
      <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
        {WORK_ITEM.num} — SELECTED WORK
      </p>
      <h2 className="mt-3 font-display text-h2 font-extrabold tracking-tight text-ink-900">
        Work Highlights
      </h2>
      <ul className="mt-10 max-w-3xl">
        {PROJECTS.map((project) => (
          <li key={project.id} className="border-t border-paper-300 py-6">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-micro text-accent-teal-dark">{project.number}</span>
              <div>
                <h3 className="font-display text-h3 font-bold text-ink-900">{project.title}</h3>
                <p className="mt-1.5 text-small leading-normal text-ink-600">
                  {project.description ?? "Project details to be added."}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-micro text-accent-teal-dark underline-offset-4 hover:underline"
                >
                  {hostnameOf(project.url)} →
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <AIAgents />
    </section>
  );
}

/**
 * The first complete thought, not the first N characters.
 *
 * The card is height-capped so the arrows and the bar always have their
 * corner, and measured against the real copy the longest overviews ran 154px
 * past that at a 1024px window. A CSS line-clamp would cut mid-word; these
 * descriptions are written and known, so they can be cut where a person
 * would cut them — on a sentence if one ends in range, otherwise on a clause,
 * because cutting on a bare word boundary once ended one of them on "and a
 * two-time Michelin", which reads as a claim someone forgot to finish. The
 * whole description is one click away on the live site.
 */
function leadSentence(text: string, max = 210): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max + 1);

  const stop = head.lastIndexOf(". ");
  if (stop > 60) return clean.slice(0, stop + 1);

  const clause = Math.max(head.lastIndexOf(", "), head.lastIndexOf(" — "), head.lastIndexOf("; "));
  if (clause > 60) return `${clean.slice(0, clause).replace(/[,;:—–-]\s*$/, "")}…`;

  const word = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, word > 40 ? word : max).replace(/[,;:—–-]\s*$/, "")}…`;
}

/** "https://www.vividdental.ca/" → "vividdental.ca" */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
