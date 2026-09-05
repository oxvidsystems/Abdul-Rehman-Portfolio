"use client";

import type { ComponentType, SVGProps } from "react";
import { NAV_ITEMS, PILL_ITEM_SIZE } from "@/lib/nav-items";
import { useActiveSection } from "@/lib/use-active-section";
import {
  BriefcaseIcon,
  ClockIcon,
  HomeIcon,
  InfoIcon,
  LayersIcon,
  MailIcon,
  TerminalIcon,
} from "./icons";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  about: InfoIcon,
  expertise: LayersIcon,
  "how-i-build": TerminalIcon,
  work: BriefcaseIcon,
  experience: ClockIcon,
  contact: MailIcon,
};

/** Gap (px) between pill items — must match the `gap-1` below, since
 *  the sliding highlight's transform is computed from it. */
const PILL_ITEM_GAP = 4;

/**
 * Floating icon-dock navigation for desktop (lg+) — a vertically
 * centered WHITE pill fixed to the left edge, not a full-height
 * sidebar. Client-confirmed (2026-08-28) that the pill stays white/
 * light rather than the earlier dark `ink-950` treatment, matching a
 * reference dock they supplied.
 *
 * Icon-only by design (same reference): each item still carries an
 * `aria-label` and a native `title` tooltip, so removing the visible
 * text label costs nothing for screen readers or discoverability.
 *
 * Hidden below `lg`; the mobile takeover menu handles small screens.
 * Pill width/offset must stay compatible with the `lg:pl-40` clearance
 * given to <main> in site-shell.tsx.
 */
export function DesktopNav() {
  const activeId = useActiveSection();
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.id === activeId)
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul
          className="relative flex flex-col items-center gap-1 rounded-full border border-paper-200 bg-paper-0 px-2 py-3"
          style={{ boxShadow: "0 20px 50px rgba(12, 23, 21, 0.14), 0 2px 8px rgba(12, 23, 21, 0.05)" }}
        >
          {/* sliding active highlight — a soft teal tint, not a solid fill */}
          <span
            aria-hidden
            className="absolute left-2 top-3 rounded-full bg-accent-teal/15 transition-transform duration-base ease-out-expo"
            style={{
              width: PILL_ITEM_SIZE,
              height: PILL_ITEM_SIZE,
              transform: `translateY(${activeIndex * (PILL_ITEM_SIZE + PILL_ITEM_GAP)}px)`,
            }}
          />
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            const Icon = ICONS[item.id];
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className="group relative flex items-center justify-center rounded-full"
                  style={{ width: PILL_ITEM_SIZE, height: PILL_ITEM_SIZE }}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors duration-fast ${
                      isActive
                        ? "text-accent-teal-dark"
                        : "text-paper-400 group-hover:text-ink-500"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

    </>
  );
}
