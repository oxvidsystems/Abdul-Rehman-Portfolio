"use client";

import { useEffect, useState } from "react";

/**
 * On-load "signature" intro — plays on every full page load. A slim
 * loading bar fills alongside the signature reveal, then everything
 * fades to the real page.
 *
 * Perf/UX guardrails ("manage load time on all devices"):
 *  - The bar/signature reveal is CSS-only (width + clip-path + opacity —
 *    all compositor/paint-cheap), equally smooth on a low-end phone and
 *    a desktop.
 *  - Real load time is respected, not faked: the overlay waits for the
 *    window `load` event (fonts/images/scripts settled) before it's
 *    allowed to finish, so a slow connection genuinely gets a longer bar
 *    instead of one that lies and finishes early.
 *  - A minimum (1.1s) stops it flashing uselessly on a fast load; a
 *    hard maximum (3s) guarantees it can never block a slow device for
 *    long — whichever finishes first past the minimum wins.
 *  - Skipped entirely under prefers-reduced-motion (a pure-CSS media
 *    query hides it immediately — see globals.css — so there's no
 *    JS-timing gap where it could flash for those users either).
 *
 * `visible` defaults to true so the overlay is part of the very first
 * paint (server-rendered, before hydration even runs) instead of
 * appearing only once an effect fires. Defaulting it to false was the
 * cause of the "site flashes, then the logo/loading covers it" bug:
 * the real page painted first (overlay absent), then hydration ran and
 * the effect switched it on top a moment later. Starting shown and
 * only ever turning it off removes that gap entirely.
 *
 * This used to guard against replaying with a module-level flag, on the
 * theory that Next's dev-mode double-invoked effects (React Strict
 * Mode) would otherwise flash it twice. That guard was the bug: Strict
 * Mode runs this effect, cleans it up, then runs it again on the SAME
 * component instance — it does not remount it. The flag let the first
 * (throwaway) run claim "already played" and block the second, real
 * run from ever starting its own completion timer, while the first
 * run's own timer got cancelled by its cleanup. Net result: the intro
 * appeared and then never went away. Letting every effect run manage
 * its own start-to-finish timers (each properly cancelled by its own
 * cleanup) fixes it — a harmless orphaned timer chain from the
 * throwaway dev-mode run does nothing, and the real run completes
 * normally, in both dev and production.
 */
const MIN_MS = 1100;
const MAX_MS = 3000;
const HOLD_MS = 200;
const FADE_MS = 450;

export function SignatureIntro() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"start" | "loading" | "complete" | "done">("start");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setPhase("loading"));

    let cancelled = false;
    const timers: number[] = [];
    const after = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const waitForLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") return resolve();
      window.addEventListener("load", () => resolve(), { once: true });
    });

    Promise.race([Promise.all([waitForLoad, after(MIN_MS)]), after(MAX_MS)]).then(async () => {
      if (cancelled) return;
      setPhase("complete");
      await after(HOLD_MS);
      if (cancelled) return;
      setPhase("done");
      await after(FADE_MS);
      if (cancelled) return;
      setVisible(false);
      document.body.style.overflow = prevOverflow;
    });

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="signature-intro fixed inset-0 z-[300] flex items-center justify-center bg-paper-50"
    >
      <div className="flex flex-col items-center gap-6 px-6 py-10">
        <span
          className="sig-text block text-[clamp(2.75rem,8vw,7rem)] leading-[1.35] text-ink-900"
          style={{ fontFamily: "var(--font-signature)" }}
        >
          Abdul Rehman
        </span>
        <span className="sig-kicker font-mono text-micro tracking-widest text-accent-teal-dark">
          FOUNDER &nbsp;·&nbsp; OXVID SYSTEMS
        </span>
        <div className="sig-bar">
          <div className="sig-bar-fill" data-phase={phase} />
        </div>
      </div>
    </div>
  );
}
