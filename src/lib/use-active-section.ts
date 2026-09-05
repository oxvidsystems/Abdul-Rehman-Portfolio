"use client";

import { useEffect, useState } from "react";
import { NAV_ITEMS } from "./nav-items";

/**
 * Tracks which section id is currently "active" by watching a thin
 * horizontal band near the vertical center of the viewport — whichever
 * section's boundary is inside that band wins. Used to highlight the
 * matching nav item on both desktop and mobile.
 */
export function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
