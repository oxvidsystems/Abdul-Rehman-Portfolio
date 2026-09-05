/**
 * STEP 15 — the one place motion constants live.
 *
 * Before this file the Hero and the Work gallery each carried their own
 * scroll-smoothing constant — 0.035 and 0.02 — and BOTH comments claimed
 * "0.945^60". Only one of them was right (0.945^60 ≈ 0.0343), so the two
 * pinned sections settled at visibly different rates while the code insisted
 * they matched. Two numbers that are meant to agree should be one number.
 *
 * Everything else about timing lives in globals.css as design tokens. This
 * file is only for values JavaScript needs.
 */

/**
 * Time constant for scroll-following easing.
 *
 * Used as `rendered += (target - rendered) * (1 - SCROLL_SMOOTH_BASE ** dt)`.
 * The `** dt` is what makes it frame-rate independent: a per-frame lerp runs
 * at double speed on a 120Hz display and crawls when the tab is throttled,
 * which is how a "smooth" scroll effect ends up feeling different on every
 * machine.
 *
 * 0.0343 reproduces ~5.5% per frame at 60fps — quick enough to feel attached
 * to the scroll, slow enough that it glides rather than snaps.
 */
export const SCROLL_SMOOTH_BASE = 0.0343;

/** Longest frame the easing will integrate, so a stall doesn't jump. */
export const MAX_FRAME_S = 0.064;

/** `1 - base^dt`, clamped. The only easing maths any section should do. */
export function scrollEase(deltaSeconds: number): number {
  const dt = Math.min(MAX_FRAME_S, Math.max(0.001, deltaSeconds));
  return 1 - Math.pow(SCROLL_SMOOTH_BASE, dt);
}

/**
 * One reader for the motion preference. Several modules were each calling
 * `matchMedia` with the same string; one typo in any of them would have
 * silently disabled a guard.
 *
 * This is the one-shot form. The two hooks that need to REACT to the setting
 * changing mid-session keep their own MediaQueryList so they can listen.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * STEP 17 — run a per-frame loop ONLY while its section is on or near screen.
 *
 * Both scroll-driven sections used to schedule the next frame unconditionally
 * from inside the frame, which meant the Hero and the Work gallery each ran a
 * 60fps loop for the entire visit. Measured, parked on the Contact section
 * with nothing moving and no input: 360 requestAnimationFrame callbacks and
 * 360 getBoundingClientRect calls every three seconds, forever — two full
 * loops recomputing geometry for sections thousands of pixels away, and on a
 * phone that is battery spent to produce nothing.
 *
 * The rootMargin is a full viewport in each direction so the loop is already
 * warm before the section arrives; there is no first-frame jump.
 *
 * Returns a teardown that both cancels the frame and disconnects the observer.
 */
export function runWhileVisible(
  target: Element,
  frame: (now: number) => void,
  options?: { rootMargin?: string; onStart?: () => void }
): () => void {
  let raf = 0;
  let running = false;

  const tick = (now: number) => {
    frame(now);
    if (running) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    options?.onStart?.();
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { rootMargin: options?.rootMargin ?? "100% 0px 100% 0px", threshold: 0 }
  );
  io.observe(target);

  // One frame now, so the section is correctly composed even if it happens to
  // be off-screen at mount (a deep link, a restored scroll position).
  frame(performance.now());

  return () => {
    io.disconnect();
    stop();
  };
}
