"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MAX_FRAME_S, prefersReducedMotion, runWhileVisible, scrollEase } from "@/lib/motion";
import { HeroAgentGraphic } from "./hero-agent-graphic";
import { openResumeModal } from "./resume-modal";

/**
 * STEP 04 (revision 2) — pinned, scroll-driven 3-slide Hero.
 *
 * Same pinned-scroll mechanic as before (3 viewport-heights of scroll
 * room, `sticky` pin, slide swap driven by scroll position, no
 * `preventDefault` so native scroll/accessibility keep working,
 * `prefers-reduced-motion` gets a plain stacked fallback) — this pass
 * only changes what each slide says and shows, per client feedback:
 *
 *  - Slide 1 leads with Abdul Rehman's name (not an abstract word),
 *    light background, portrait in a redesigned asymmetric frame.
 *  - Slide 2 is explicitly about automation/AI agents, mid-dark
 *    background, with a conceptual (not fabricated-product) agent
 *    graphic in place of a plain stat numeral.
 *  - Slide 3 is a customer-attraction / lead invitation moment, dark
 *    background, styled like a compact "start a conversation" card
 *    instead of a bare stat numeral.
 *
 * All copy stays grounded in confirmed facts only (7 years, OXVID
 * Systems, the four real service disciplines, the 10 real project
 * URLs) — nothing fabricated (no invented product name, client, or
 * metric).
 */

type Theme = "light" | "mid" | "dark";

type Slide = {
  key: string;
  theme: Theme;
  eyebrow: string;
  headline: string[];
  /** When set, the headline loops through these instead of the static
   *  `headline` lines — same entrance animation, then a clean crossfade
   *  cycle. `headline[0]` still ships as the real first-paint text (SEO,
   *  no-JS, reduced-motion). */
  headlineLoop?: string[];
  subLine: string;
  cta: { label: string; href: string };
  visual: "portrait" | "agent" | "lead";
};

const SLIDES: Slide[] = [
  {
    key: "intro",
    theme: "light",
    eyebrow: "HELLO, I'M",
    headline: ["Abdul Rehman"],
    headlineLoop: ["Abdul Rehman", "Web Developer", "AI & Automation", "Builds With Claude"],
    subLine:
      "Founder of OXVID Systems — I design and build premium web, automation & brand experiences.",
    cta: { label: "View selected work", href: "#work" },
    visual: "portrait",
  },
  {
    key: "automation",
    theme: "mid",
    eyebrow: "AUTOMATION & AI",
    headline: ["AI Agents."],
    subLine:
      "Custom AI agents and workflow automation that cut manual work and keep your business running around the clock.",
    cta: { label: "See how it works", href: "#automation" },
    visual: "agent",
  },
  {
    key: "work",
    theme: "dark",
    eyebrow: "LET'S BUILD",
    headline: ["Let's Build", "Yours."],
    subLine:
      "10 live projects shipped across web, automation & branding — from first message to launch, fast.",
    cta: { label: "Start a project", href: "#contact" },
    visual: "lead",
  },
];

const SLIDE_COUNT = SLIDES.length;

/**
 * Extra viewport-heights of pinned scroll AFTER the last slide has
 * finished arriving, during which it simply sits there fully visible
 * before the Hero unpins and the page moves on to About.
 *
 * Without this the pinned range was exactly (SLIDE_COUNT - 1) screens,
 * so slide 3 reached its resting position at the precise instant the
 * sticky container released — it was scrolling away before it had ever
 * been seen settled (and, because the glide is deliberately slow, often
 * before it had even finished animating). Reported by the client as
 * "3rd slider theek se load nahi hota".
 */
const OUTRO_SCREENS = 1;

/** Total height reserved for the pinned Hero, in viewport-heights:
 *  one screen per transition + the outro dwell + the screen the pin
 *  itself occupies. */
const STAGE_SCREENS = SLIDE_COUNT - 1 + OUTRO_SCREENS + 1;

const THEME_STYLES: Record<
  Theme,
  {
    bg: string;
    ink: string;
    sub: string;
    eyebrow: string;
    dot: string;
    cta: string;
    ctaOutline: string;
    glow: string;
  }
> = {
  light: {
    bg: "bg-paper-50",
    ink: "text-ink-900",
    sub: "text-ink-500",
    eyebrow: "text-accent-teal-dark",
    dot: "bg-accent-teal-dark",
    cta: "bg-ink-900 text-paper-0 hover:bg-accent-teal-dark",
    ctaOutline: "border border-ink-900/25 text-ink-900 hover:border-accent-teal-dark hover:text-accent-teal-dark",
    glow: "rgba(48, 166, 150, 0.26)",
  },
  /*
    STEP 18. This was `bg-ink-700` — a dark slide, immediately after the
    light opening one and immediately before the dark closing one, so the
    Hero's tonal arc read as light-then-dark-then-dark and the page went
    dark 450px in. Measured across the whole page, 23 of 38 half-screens
    were dark: 61%, against a brand rule that says light-first.

    It is now the SECOND light beat, one step deeper in paper than the
    first so the arc still moves. The contrast lives inside the
    composition instead — the agent card is a dark inset on a light
    ground, exactly as the portrait frame is on slide 1.
  */
  mid: {
    bg: "bg-paper-100",
    ink: "text-ink-900",
    sub: "text-ink-500",
    eyebrow: "text-accent-teal-dark",
    dot: "bg-accent-teal-dark",
    cta: "bg-ink-900 text-paper-0 hover:bg-accent-teal-dark",
    ctaOutline: "border border-ink-900/25 text-ink-900 hover:border-accent-teal-dark hover:text-accent-teal-dark",
    glow: "rgba(48, 166, 150, 0.22)",
  },
  dark: {
    bg: "bg-ink-900",
    ink: "text-paper-0",
    sub: "text-ink-200",
    eyebrow: "text-accent-teal",
    dot: "bg-accent-teal",
    cta: "bg-paper-0 text-ink-900 hover:bg-accent-mint",
    ctaOutline: "border border-paper-0/25 text-paper-0 hover:border-accent-mint hover:text-accent-mint",
    glow: "rgba(48, 166, 150, 0.2)",
  },
};

export function HeroSlider() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      prefersReducedMotion()
    );
  }, []);

  if (reduceMotion) {
    return (
      <div id="home" className="scroll-mt-16 lg:scroll-mt-0">
        {SLIDES.map((slide) => (
          <SlidePanel key={slide.key} slide={slide} active style={{ position: "relative" }} className="min-h-screen" />
        ))}
      </div>
    );
  }

  return <PinnedSlider />;
}

function PinnedSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Holds the effect's scroll-to-slide function so the chrome buttons
  // (declared outside the effect) can call it without re-creating the
  // rAF loop on every render.
  const goToRef = useRef<((index: number) => void) | null>(null);
  const goTo = (index: number) => goToRef.current?.(index);

  useEffect(() => {
    const el = containerRef.current;
    const pin = pinRef.current;
    if (!el || !pin) return;

    const panels = Array.from(
      pin.querySelectorAll<HTMLElement>("[data-slide]")
    );
    if (panels.length === 0) return;

    // `pos` is a CONTINUOUS, linear function of scroll position across
    // the whole pinned range. An earlier version chopped the range into
    // equal thirds with a floor(), which read as a dead zone followed by
    // a sudden jump — the client reported slide 1→2 needing "more
    // scroll" than 2→3 even though the thirds were mathematically equal.
    //
    // `rendered` is what actually gets drawn and only ever eases a small
    // fraction of the way toward `pos` each frame. That deliberate lag is
    // what turns raw scroll input into the slow "curtain" glide, rather
    // than the slide snapping to wherever the trackpad currently is.
    let pos = 0;
    let rendered = 0;
    let lastFrame = performance.now();
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastActive = -1;

    // Frame-rate INDEPENDENT smoothing lives in lib/motion.ts now, shared
    // with the Work gallery — the two used to carry separate constants that
    // both claimed to be the same number.

    const readPos = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);

      // Exactly ONE viewport-height of scroll per slide transition, then
      // clamped — so every transition costs the same effort (the client's
      // earlier "1→2 needs more scroll than 2→3" complaint), and anything
      // scrolled beyond the last slide is absorbed as dwell time rather
      // than pushing the slider past its final state.
      pos = Math.min(panels.length - 1, scrolled / window.innerHeight);
    };

    const tick = () => {
      readPos();

      const now = performance.now();
      // Clamp dt so a backgrounded tab or a long main-thread block
      // doesn't produce one enormous jump on the next frame.
      const dt = Math.min(MAX_FRAME_S, Math.max(0.001, (now - lastFrame) / 1000));
      lastFrame = now;

      const prev = rendered;
      rendered += (pos - rendered) * scrollEase(dt);
      if (Math.abs(pos - rendered) < 0.0006) rendered = pos;

      // Subtle velocity-linked skew: the panel leans very slightly in
      // the direction of travel while moving, then settles dead upright
      // the moment it catches up. Small on purpose — silky, not gimmicky.
      // Velocity is per-second (divided by dt) so the lean matches the
      // motion at any refresh rate, same reasoning as the smoothing.
      const velocity = (rendered - prev) / dt;
      const skew = Math.max(-2.2, Math.min(2.2, velocity * -0.92));

      panels.forEach((panel, i) => {
        panel.style.transform = `translateX(${(i - rendered) * 100}%) skewX(${skew.toFixed(2)}deg)`;
      });

      const nearest = Math.min(
        panels.length - 1,
        Math.max(0, Math.round(rendered))
      );
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }
    };

    // Scrolling can stop anywhere mid-curtain now that the mapping is
    // continuous, which would otherwise strand the view half-way between
    // two slides. A short idle timer nudges it to the nearest slide once
    // scrolling actually stops; the motion itself stays continuous.
    const scheduleSettle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const nearest = Math.min(
          panels.length - 1,
          Math.max(0, Math.round(pos))
        );
        if (Math.abs(pos - nearest) > 0.01) goToIndex(nearest);
      }, 160);
    };

    const goToIndex = (index: number) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const clamped = Math.min(panels.length - 1, Math.max(0, index));
      // Mirrors readPos(): one viewport-height per slide.
      window.scrollTo({
        top: top + clamped * window.innerHeight,
        behavior: "smooth",
      });
    };

    goToRef.current = goToIndex;

    window.addEventListener("scroll", scheduleSettle, { passive: true });
    // Step 17: the loop now runs only while the Hero is on or near screen.
    // It used to re-schedule itself forever, so it was still recomputing
    // three panels sixty times a second while the reader was in Contact.
    const stopLoop = runWhileVisible(el, () => tick(), {
      onStart: () => {
        lastFrame = performance.now();
      },
    });

    return () => {
      stopLoop();
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", scheduleSettle);
      goToRef.current = null;
    };
  }, []);

  const activeTheme = SLIDES[active].theme;
  const chromeIsOnDark = activeTheme !== "light";

  return (
    <div
      ref={containerRef}
      id="home"
      // On a phone each slide's call to action is full width and sits at the
      // bottom of a pinned screen — the same corner the chat launcher floats
      // in. Measured: the launcher covered "View selected work" at 320 and at
      // 390. The launcher steps aside for the Hero on narrow screens and
      // arrives once the reader is into the page; desktop is unaffected.
      data-chat-clear-narrow=""
      className="relative scroll-mt-16 lg:-ml-40 lg:w-[calc(100%+10rem)] lg:scroll-mt-0"
      style={{ height: `${STAGE_SCREENS * 100}vh` }}
    >
      <div
        ref={pinRef}
        className={`sticky top-0 h-screen w-full overflow-hidden transition-colors duration-700 ${THEME_STYLES[activeTheme].bg}`}
      >
        {SLIDES.map((slide, i) => (
          <SlidePanel
            key={slide.key}
            slide={slide}
            active={i === active}
            // Only the first slide arrives, and only once. The others are
            // already composed by the time the reader scrolls to them.
            intro={i === 0}
            className="absolute inset-0"
            // No CSS transition here: the transform is rewritten every
            // animation frame by the rAF loop above, and a CSS transition
            // on top of that would re-trigger each frame and fight it.
            style={{ transform: `translateX(${i * 100}%)` }}
          />
        ))}

        {/* bottom chrome: progress scrubber + prev/next, shared across slides */}
        {/*
          Step 18: these were pushed to the two bottom corners with
          `justify-between`. The left one landed underneath the fixed email
          address in the nav furniture and the right one sat out near the
          chat launcher, so two deliberate controls read as stray marks in
          the margins. Gathered into one centred cluster they read as what
          they are — a slider control — and collide with nothing.
        */}
        <div className="hero-intro-chrome pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden items-center justify-center gap-6 lg:flex">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous slide"
            disabled={active === 0}
            className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-pill border transition-colors duration-fast disabled:pointer-events-none disabled:opacity-25 ${
              chromeIsOnDark
                ? "border-paper-0/20 text-paper-0/70 hover:border-accent-mint hover:text-accent-mint"
                : "border-ink-200 text-ink-400 hover:border-accent-teal-dark hover:text-accent-teal-dark"
            }`}
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </button>

          <div
            className={`pointer-events-none flex items-center gap-4 font-mono text-micro tracking-widest ${
              chromeIsOnDark ? "text-paper-0/70" : "text-ink-400"
            }`}
          >
            <span>0{active + 1}</span>
            <span className={`relative h-px w-40 ${chromeIsOnDark ? "bg-paper-0/25" : "bg-paper-300"}`}>
              <span
                className={`absolute inset-y-0 left-0 transition-all duration-700 ${THEME_STYLES[activeTheme].dot}`}
                style={{
                  width: `${((active + 1) / SLIDE_COUNT) * 100}%`,
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              />
            </span>
            <span>0{SLIDE_COUNT}</span>
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next slide"
            disabled={active === SLIDE_COUNT - 1}
            className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-pill border transition-colors duration-fast disabled:pointer-events-none disabled:opacity-25 ${
              chromeIsOnDark
                ? "border-paper-0/20 text-paper-0/70 hover:border-accent-mint hover:text-accent-mint"
                : "border-ink-200 text-ink-400 hover:border-accent-teal-dark hover:text-accent-teal-dark"
            }`}
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>

        {/* mobile: dots only (arrows/scrubber crowd too much on small screens) */}
        <div className="hero-intro-chrome pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2 lg:hidden">
          {SLIDES.map((slide, i) => (
            <span
              key={slide.key}
              className={`h-1.5 rounded-none transition-all duration-base ${
                i === active ? THEME_STYLES[activeTheme].dot : chromeIsOnDark ? "bg-paper-0/25" : "bg-paper-300"
              }`}
              style={{ width: i === active ? "20px" : "6px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loops the hero headline through a short list of roles/words — plays once
 * as plain text on first paint (SEO/no-JS/reduced-motion all get
 * `words[0]`, e.g. "Abdul Rehman"), then, once mounted and only while its
 * slide is on screen, crossfades to the next word every couple of seconds
 * and wraps around. Paused whenever the slide isn't `active` so it never
 * animates off-screen. A pure-CSS `prefers-reduced-motion` guard on the
 * animation itself (globals.css) backs up the JS gate.
 */
const HERO_ROLE_HOLD_MS = 2200;
const HERO_ROLE_TRANSITION_MS = 420;

function RoleRotator({ words, active }: { words: string[]; active: boolean }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [reduced] = useState(() =>
    typeof window === "undefined" ? false : prefersReducedMotion()
  );

  useEffect(() => {
    if (!active || reduced || words.length < 2) return;

    let cancelled = false;
    const timers: number[] = [];

    const scheduleNext = () => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setPhase("out");
          timers.push(
            window.setTimeout(() => {
              if (cancelled) return;
              setIndex((i) => (i + 1) % words.length);
              setPhase("in");
              scheduleNext();
            }, HERO_ROLE_TRANSITION_MS)
          );
        }, HERO_ROLE_HOLD_MS)
      );
    };
    scheduleNext();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [active, reduced, words.length]);

  if (reduced || words.length < 2) {
    return <span className="block">{words[0]}</span>;
  }

  return (
    <span className="hero-role-rotator block">
      <span
        key={index}
        className={`hero-role-word block ${phase === "out" ? "is-out" : "is-in"}`}
      >
        {words[index]}
      </span>
    </span>
  );
}

function SlidePanel({
  slide,
  active,
  intro,
  className,
  style,
}: {
  slide: Slide;
  active: boolean;
  /** Only the first slide plays the arrival, and only on first paint. */
  intro?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const t = THEME_STYLES[slide.theme];

  return (
    <div
      data-slide=""
      // NOTE: deliberately no `relative` here. The pinned path passes
      // `absolute inset-0` via className, and Tailwind emits `.relative`
      // *after* `.absolute`, so having both would make `relative` win --
      // which silently un-stacked the slides and pushed 2 and 3 off
      // screen. The reduced-motion path sets `position: relative`
      // inline (via `style`) instead, which beats both.
      className={`flex flex-col justify-center overflow-hidden px-6 pb-8 pt-20 lg:pb-10 lg:pl-40 lg:pr-12 lg:pt-16 will-change-transform ${t.bg} ${
        active ? "" : "pointer-events-none"
      } ${className ?? ""}`}
      style={style}
      aria-hidden={!active}
    >
      {/*
        Ambient studio light.

        This used to be a solid disc under `blur-[90px]`. A 90px blur on a
        620px element is a full-surface Gaussian pass, and the drift
        animation made the browser redo it every frame, on every slide, for
        the whole visit — comfortably the most expensive thing on the page.
        A radial gradient is already soft; it costs one paint and looks the
        same. The drift stays, because it is now nearly free, but slower.
      */}
      <div
        aria-hidden
        className="hero-ambient pointer-events-none absolute -right-[10%] -top-[15%] h-[45vw] w-[45vw] max-h-[620px] max-w-[620px] animate-[hero-drift_20s_ease-in-out_infinite_alternate] lg:h-[55vw] lg:w-[55vw]"
        style={{
          background: `radial-gradient(circle, ${t.glow} 0%, ${t.glow} 26%, transparent 70%)`,
        }}
      />

      {/* fine glitter/sparkle texture */}
      <div
        aria-hidden
        className="hero-ambient pointer-events-none absolute inset-0 animate-[hero-twinkle_9s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: [
            "radial-gradient(1.5px 1.5px at 12% 22%, currentColor, transparent 60%)",
            "radial-gradient(1.5px 1.5px at 24% 68%, currentColor, transparent 60%)",
            "radial-gradient(2px 2px at 38% 14%, currentColor, transparent 60%)",
            "radial-gradient(1.5px 1.5px at 58% 80%, currentColor, transparent 60%)",
            "radial-gradient(2px 2px at 70% 30%, currentColor, transparent 60%)",
            "radial-gradient(1.5px 1.5px at 84% 60%, currentColor, transparent 60%)",
            "radial-gradient(1.5px 1.5px at 92% 18%, currentColor, transparent 60%)",
          ].join(", "),
          color: slide.theme === "light" ? "var(--color-ink-900)" : "var(--color-paper-0)",
          opacity: slide.theme === "light" ? 0.16 : 0.4,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: slide.theme === "light" ? "var(--color-ink-900)" : "var(--color-paper-0)",
        }}
      />

      {/*
        MOBILE (Step 16) — the slide owns a fixed viewport and cannot be
        scrolled inside, so anything that does not fit is not "below the
        fold", it is unreachable. The desktop layout stacked a fixed-width
        visual above the copy: at 320x568 that pushed the headline, the
        paragraph and the call to action off the bottom of a pinned slide
        entirely, and at 360x740 it pushed the button off.

        So below `lg` the slide is a column that measures itself: the copy
        plate takes exactly the room it needs, and the visual takes what is
        left (`flex-1 min-h-0`, height-driven rather than width-driven).
        The composition therefore shrinks gracefully instead of overflowing,
        and the same three slides now fit every phone from 320 up. Desktop
        keeps its asymmetric two-column grid unchanged.
      */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[104rem] flex-col justify-center gap-6 sm:gap-8 lg:grid lg:h-auto lg:items-center lg:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="order-2 flex-none lg:order-1">
          <p
            className={`flex items-center gap-3 font-mono text-micro tracking-widest ${
              intro ? "hero-intro-eyebrow" : ""
            } ${t.eyebrow}`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 ${t.dot}`} aria-hidden />
            {slide.eyebrow}
          </p>

          <h1 className={`mt-4 font-display text-display-1 font-extrabold leading-[0.98] tracking-tight max-[21.5rem]:text-[2.35rem] lg:mt-6 lg:leading-tight ${t.ink}`}>
            {slide.headlineLoop ? (
              intro ? (
                <span className="hero-intro-clip">
                  <span className="hero-intro-line" style={{ animationDelay: "180ms" }}>
                    <RoleRotator words={slide.headlineLoop} active={active} />
                  </span>
                </span>
              ) : (
                <RoleRotator words={slide.headlineLoop} active={active} />
              )
            ) : (
              slide.headline.map((line, i) =>
                intro ? (
                  <span key={line} className="hero-intro-clip">
                    <span
                      className="hero-intro-line"
                      style={{ animationDelay: `${180 + i * 110}ms` }}
                    >
                      {line}
                    </span>
                  </span>
                ) : (
                  <span key={line} className="block">
                    {line}
                  </span>
                )
              )
            )}
          </h1>

          <p
            className={`mt-3 max-w-md text-small leading-normal sm:text-body lg:mt-5 lg:text-body ${
              intro ? "hero-intro-sub" : ""
            } ${t.sub}`}
          >
            {slide.subLine}
          </p>

          <div className={`mt-5 flex flex-wrap items-center gap-3 lg:mt-8 ${intro ? "hero-intro-cta" : ""}`}>
            <a
              href={slide.cta.href}
              tabIndex={active ? 0 : -1}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-7 py-4 text-small font-semibold uppercase tracking-wide shadow-sm transition-all duration-fast hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:justify-start ${t.cta}`}
            >
              {slide.cta.label}
              <ArrowIcon className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={openResumeModal}
              tabIndex={active ? 0 : -1}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-7 py-4 text-small font-semibold uppercase tracking-wide transition-all duration-fast hover:-translate-y-0.5 sm:w-auto sm:justify-start ${t.ctaOutline}`}
            >
              View resume
            </button>
          </div>
        </div>

        {/* Height-driven on mobile: `flex-1 min-h-0` lets this region give up
            room to the copy plate rather than push it off the slide.

            The portrait and the agent graphic scale to whatever they are
            given. The slide-3 card cannot: it holds its own type, and slide 3
            has the tallest headline, so on a 568px screen the card was handed
            172px and cut its own contents in half. Below that height the card
            steps out and the copy — which already carries the same invitation,
            with a full-width call to action under it — centres in the slide. */}
        <div
          className={`relative order-1 flex min-h-0 flex-1 items-center justify-center lg:order-2 lg:block lg:min-h-[auto] lg:w-full lg:flex-none lg:justify-self-end ${
            slide.visual === "lead" ? "hero-visual-lead" : ""
          }`}
        >
          <SlideVisual slide={slide} intro={intro} />
        </div>
      </div>
    </div>
  );
}

function SlideVisual({ slide, intro }: { slide: Slide; intro?: boolean }) {
  const t = THEME_STYLES[slide.theme];
  const frameRadius = "rounded-tl-[110px] rounded-tr-md rounded-br-md rounded-bl-md";

  return (
    /* `h-full w-auto` under `lg` makes the frame as tall as the space it was
       given and derives its width from the 4:5 ratio — the inverse of the
       desktop rule, and the reason the composition can never overflow a
       pinned slide. `max-w-[22rem]` still caps it on wide short screens. */
    <div
      // The arrival's wipe used to live HERE, and that was the bug behind
      // "top and bottom small boxes cut ho gye han". `hero-frame` ends on
      // `clip-path: inset(0 0 0 0)` and the animation is `both`, so the final
      // keyframe persists for the life of the page — permanently clipping
      // this element to its own box. The two credential pills sit 16px
      // OUTSIDE that box by design, so their outer edge was sliced off at
      // every size, on every device, from the moment Step 18 shipped.
      //
      // The wipe now runs on the card inside, which already has
      // `overflow-hidden` and so loses nothing by being clipped. This element
      // stays unclipped, which is what the pills need.
      className="hero-portrait-frame relative mx-auto aspect-[4/5] h-full max-h-full w-auto max-w-[22rem] lg:h-auto lg:w-full lg:max-w-none"
    >
      {/* Soft glow behind the frame — same swap as the ambient light above:
          a gradient instead of a 60px blur pass on every paint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[6%] opacity-70"
        style={{
          background: `radial-gradient(circle, ${t.glow} 0%, ${t.glow} 30%, transparent 72%)`,
        }}
      />

      {slide.visual === "portrait" && (
        <>
          <div
            className={`relative z-10 h-full w-full overflow-hidden shadow-lg ${frameRadius} ${
              intro ? "hero-intro-frame" : ""
            }`}
          >
            <Image
              src="/images/abdul-rehman-fulllength.jpg"
              alt="Abdul Rehman, founder of OXVID Systems"
              fill
              priority
              sizes="(min-width: 1024px) 34rem, 22rem"
              className="object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />

            {/* Stylized signature wordmark of his own name (client-requested
                design flourish — no real signature scan exists on file, see
                the --font-signature note in globals.css). */}
            <span
              className="hero-signature pointer-events-none absolute bottom-[9%] right-[7%] text-2xl text-paper-0/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-signature)" }}
            >
              Abdul Rehman
            </span>
          </div>

          <div className={`hero-credential absolute -top-3 right-[6%] z-20 flex max-w-[88%] items-center gap-2 rounded-pill bg-ink-900 px-3 py-2 text-paper-0 shadow-md sm:-top-4 sm:right-[8%] sm:px-4 sm:py-2.5 ${intro ? "hero-intro-pill" : ""}`}>
            {/* Step 15: this was Tailwind's ping ring expanding out of the dot,
                forever. It is the "live status" trope the brief rules out,
                and the label beside it already says the thing. A still dot
                says it just as well. */}
            <span className="inline-flex h-1.5 w-1.5 rounded-pill bg-accent-teal" />
            <span className="font-mono text-[10px] tracking-widest">AVAILABLE FOR PROJECTS</span>
          </div>

          <div className={`hero-credential absolute -bottom-3 left-[6%] z-20 max-w-[88%] rounded-pill bg-ink-900 px-3 py-2 font-mono text-[10px] tracking-widest text-paper-0 shadow-md sm:-bottom-4 sm:left-[8%] sm:px-4 sm:py-2.5 ${intro ? "hero-intro-pill" : ""}`}>
            7 YEARS · WEB & AUTOMATION
          </div>

          <SocialRail />
        </>
      )}

      {slide.visual === "agent" && (
        <div
          className={`relative z-10 flex h-full w-full items-center justify-center overflow-hidden bg-ink-900 shadow-lg ${frameRadius} ${
            intro ? "hero-intro-frame" : ""
          }`}
        >
          <HeroAgentGraphic className="h-[68%] w-[68%] text-accent-mint" />
          <span className="absolute bottom-[9%] left-0 right-0 text-center font-mono text-[11px] tracking-widest text-ink-100/80">
            AGENT STATUS · ACTIVE 24/7
          </span>
        </div>
      )}

      {slide.visual === "lead" && (
        <div
          className={`relative z-10 flex h-full w-full flex-col justify-center gap-3 overflow-hidden border border-paper-0/10 bg-ink-800/60 p-5 shadow-lg sm:gap-5 sm:p-8 lg:gap-6 lg:p-12 ${frameRadius} ${
            intro ? "hero-intro-frame" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Step 15: this was Tailwind's ping ring expanding out of the dot,
                forever. It is the "live status" trope the brief rules out,
                and the label beside it already says the thing. A still dot
                says it just as well. */}
            <span className="inline-flex h-1.5 w-1.5 rounded-pill bg-accent-teal" />
            <span className="font-mono text-[10px] tracking-widest text-accent-teal">OPEN FOR NEW PROJECTS</span>
          </div>

          <h3 className="font-display text-h3 font-bold leading-snug text-paper-0">Got a project in mind?</h3>

          {/* The frame is height-driven on mobile, and on a 568px screen this
              paragraph does not fit inside it — it was being cut off mid-word.
              The slide's own sub-line says the same thing on that screen, so
              the card keeps the signal and the disciplines and drops the
              sentence. */}
          <p className="hero-lead-copy max-w-[20rem] text-small leading-normal text-ink-200">
            Tell us what you&rsquo;re building — name, goal, budget range. We usually reply within a day.
          </p>

          <div className="flex flex-wrap gap-2">
            {["Web Development", "Automation", "Brand Identity", "Content"].map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-paper-0/20 px-2.5 py-1 font-mono text-[10px] tracking-wide text-paper-0 sm:px-3 sm:py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Vertical social rail — centred on the right edge of the hero portrait.
 * GitHub is the client's real profile (supplied 2026-09-05). Facebook,
 * Instagram and LinkedIn are still placeholders ("#") until those URLs are
 * supplied; swap them in SOCIAL_LINKS below once they're in hand.
 */
const SOCIAL_LINKS: { name: string; href: string; icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement }[] = [
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "LinkedIn", href: "#", icon: LinkedInIcon },
  { name: "GitHub", href: "https://github.com/oxvidsystems", icon: GitHubIcon },
];

function SocialRail() {
  return (
    <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2.5 sm:right-4 sm:gap-3">
      {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="flex h-8 w-8 items-center justify-center rounded-pill bg-ink-900/80 text-paper-0 shadow-md backdrop-blur-sm transition-colors duration-fast hover:bg-accent-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal sm:h-9 sm:w-9"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-8.1h2.72l.4-3.16h-3.12V7.72c0-.91.25-1.53 1.56-1.53h1.67V3.38C15.94 3.26 15 3.18 13.9 3.18c-2.3 0-3.87 1.4-3.87 3.98v2.58H7.3v3.16h2.73V21h3.47Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5Z" />
      <path d="M5.25 7c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
      <path d="M20.5 20.5h-3.38v-6.02c0-1.44-.03-3.28-2-3.28-2 0-2.31 1.56-2.31 3.18v6.12H9.44V8.5h3.25v1.64h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2v6.93Z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5c-5.52 0-10 4.48-10 10a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.2-3.37-1.2-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5.01 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12.5c0-5.52-4.48-10-10-10Z"
      />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
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
