"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared "stacking panel deck" scroll behaviour.
 *
 * Both Expertise and Work use the pattern the brief describes: a column
 * of sticky panels where each new one rises up and overlaps the last,
 * the previous visibly moves backward (scale + dim + a touch of blur),
 * and the newest becomes dominant. Extracted here when the second
 * consumer arrived so the scroll maths lives in exactly one place —
 * an earlier note in CLAUDE.md flagged that duplicating it was a
 * liability.
 *
 * Contract for the markup:
 *   - attach `ref` to the element that contains the panels
 *   - give every panel `data-deck-panel`
 *   - optionally give a child `data-deck-parallax` to get counter-drift
 *
 * Returns the index of the currently dominant panel, for rails/counters.
 *
 * Desktop-only by design: stacking four (let alone ten) panels into a
 * phone width reduces each to a sliver, so below `lg` the effect is not
 * applied at all and the panels are expected to flow normally.
 * `prefers-reduced-motion` gets the same plain flow.
 */
export function useStackingDeck<T extends HTMLElement>(options?: {
  /** How much a fully covered panel shrinks. Default 0.06 (→ scale .94). */
  scaleBy?: number;
  /** How much a fully covered panel's CONTENT dims. Default 0.45. */
  dimBy?: number;
  /**
   * Max blur in px on a fully covered panel. Default 2 (was 3 before the
   * Step 15 motion pass — a covered panel is already scaled down and dimmed,
   * so the blur only has to suggest depth, and this one is applied to a
   * full-viewport element where every pixel of it costs).
   */
  blurBy?: number;
  /** Parallax travel in px for `data-deck-parallax` children. Default 42. */
  parallaxBy?: number;
}) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(0);

  const scaleBy = options?.scaleBy ?? 0.06;
  const dimBy = options?.dimBy ?? 0.45;
  const blurBy = options?.blurBy ?? 2;
  const parallaxBy = options?.parallaxBy ?? 42;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-deck-panel]")
    );
    if (panels.length === 0) return;

    const parallaxEls = panels.map((p) =>
      p.querySelector<HTMLElement>("[data-deck-parallax]")
    );

    /** Last blur written per panel, so an unchanged value is never re-set. */
    const lastBlur = new Array<number>(panels.length).fill(-1);

    const desktop = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;

    const clearStyles = () => {
      panels.forEach((p, i) => {
        p.style.transform = "";
        p.style.removeProperty("--deck-dim");
        p.style.filter = "";
        lastBlur[i] = -1;
      });
      parallaxEls.forEach((el) => {
        if (el) el.style.transform = "";
      });
    };

    /** True while the last pass left inline styles on the panels. */
    let dirty = false;

    const compute = () => {
      ticking = false;
      const enabled = desktop.matches && !motion.matches;

      // Step 17. Below `lg` the deck is not applied at all — the panels flow
      // normally — but this function still ran on every scroll, read two
      // bounding rects per panel and then wrote empty strings over every
      // inline style. Write-then-read, every frame, for no visible effect:
      // measured at 254 layouts per scroll on a 390px viewport against 33 on
      // a 1440px one, and 5 under reduced motion. Now a disabled deck clears
      // its styles exactly once and then costs nothing at all.
      if (!enabled) {
        if (dirty) {
          clearStyles();
          dirty = false;
        }
        return;
      }
      dirty = true;

      const vh = window.innerHeight;

      // The dominant panel is the FIRST one its successor hasn't mostly
      // covered yet. Assigning without stopping would always leave the
      // final panel winning, since it has no successor to cover it.
      let dominant = panels.length - 1;
      let found = false;

      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        const next = panels[i + 1];
        const covered = next
          ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh))
          : 0;

        if (!found && covered < 0.5) {
          dominant = i;
          found = true;
        }

        // transform is compositor-only, so writing it every frame is free.
        // `filter` is not: it re-rasterises the whole panel. Quantising to
        // 0.5px means the browser does that a handful of times per panel
        // instead of on every one of 60 frames a second.
        panel.style.transform = `scale(${1 - covered * scaleBy})`;

        // Step 18. This used to be `panel.style.opacity`. A translucent
        // panel in a STACK shows the panel behind it: two service headlines
        // were legible in the same place at once, "Custom Web Development"
        // ghosting through "Professional Content Writing". Deepening the dim
        // made it worse, which is what gave the cause away.
        //
        // The card now stays fully opaque and its CONTENT recedes instead —
        // the chapter reads as behind, and nothing shows through it.
        panel.style.setProperty("--deck-dim", `${1 - covered * dimBy}`);
        const soft = Math.round((covered * blurBy) / 0.5) * 0.5;
        if (lastBlur[i] !== soft) {
          lastBlur[i] = soft;
          panel.style.filter = soft === 0 ? "none" : `blur(${soft}px)`;
        }

        const px = parallaxEls[i];
        if (px) {
          const progress = (vh - rect.top) / (vh + rect.height);
          px.style.transform = `translate3d(0, ${(0.5 - progress) * parallaxBy}px, 0)`;
        }
      });

      // Only ever changes when the dominant chapter changes; React bails out
      // of an identical value, but not calling it at all is cheaper still.
      setActive((current) => (current === dominant ? current : dominant));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
    };
  }, [scaleBy, dimBy, blurBy, parallaxBy]);

  return { ref, active };
}
