"use client";

import { useEffect, useState } from "react";

/**
 * Slim fixed progress rail pinned to the very left edge of the
 * viewport (in front of everything, including the nav) reflecting
 * how far the visitor has scrolled through the whole page. Present
 * on every breakpoint — it's the one persistent motion cue Step 03
 * asks for.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-full w-[3px] bg-paper-300"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/*
        Step 17: this was `height: N%` with `transition-[height]`, rewritten
        on every scroll event. `height` is a layout property, so the rail was
        asking the browser to lay out on every frame of every scroll for the
        entire visit. `scaleY` on a full-height bar draws the identical
        result on the compositor and never touches layout.
      */}
      <div
        className="h-full w-full origin-top bg-accent-teal transition-transform duration-fast ease-out-quart"
        style={{ transform: `scaleY(${progress / 100})` }}
      />
    </div>
  );
}
