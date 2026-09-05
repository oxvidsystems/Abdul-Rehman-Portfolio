"use client";

import { useEffect, useRef } from "react";

/**
 * Stylish custom cursor: a small solid dot tracking the pointer exactly,
 * plus a soft brand-teal ring that eases toward it and grows over
 * interactive elements. Clean and minimal — no icon/shape, just a
 * refined dot + ring in the site's own accent colors.
 *
 * Desktop-only by construction:
 *  - `(pointer: fine)` gates it out on touch/coarse-pointer devices —
 *    there is no mouse to replace there, and a phantom cursor on mobile
 *    would just be a bug.
 *  - `prefers-reduced-motion` skips it too, leaving the native cursor.
 * All per-frame work is a single rAF-batched transform write (GPU
 * compositor only, no layout), so it costs nothing noticeable even on
 * modest laptops.
 */
const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, [role='button'], [data-cursor-hover]";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let rafId = 0;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const apply = () => {
      rafId = 0;
      const t = `translate3d(${lastX}px, ${lastY}px, 0) translate(-50%, -50%)`;
      if (dotRef.current) dotRef.current.style.transform = t;
      if (ringRef.current) ringRef.current.style.transform = t;
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const hovering = !!target?.closest(INTERACTIVE_SELECTOR);
      ringRef.current?.classList.toggle("is-hover", hovering);
    };

    const onLeaveDoc = () => {
      dotRef.current?.classList.add("is-hidden");
      ringRef.current?.classList.add("is-hidden");
    };
    const onEnterDoc = () => {
      dotRef.current?.classList.remove("is-hidden");
      ringRef.current?.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("mouseenter", onEnterDoc);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("mouseenter", onEnterDoc);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring is-hidden" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot is-hidden" aria-hidden="true" />
    </>
  );
}
