"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Generic scroll-reveal hook: returns a ref to attach to any element
 * and a boolean that flips to `true` the first time that element
 * scrolls into view (then stops observing — a one-shot reveal, not a
 * repeating in/out toggle). Pair with the shared `--animate-reveal-up`
 * / `--animate-reveal-scale` tokens from globals.css, e.g.:
 *
 *   const { ref, revealed } = useReveal<HTMLDivElement>();
 *   <div ref={ref} className={revealed ? "animate-reveal-up" : "opacity-0"}>
 *
 * Respects `prefers-reduced-motion`: content is marked revealed
 * immediately (no observer, no animation) rather than staying hidden.
 */
export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
