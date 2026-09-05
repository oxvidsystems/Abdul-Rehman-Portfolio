"use client";

import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Mobile/tablet navigation (below `lg`): a slim fixed top bar that
 * always shows the current section, plus a full-screen editorial
 * takeover menu — not a scaled-down copy of the desktop sidebar.
 * The dark green surface is used deliberately here as the one
 * "signature contrast" moment on mobile, per the brand rule.
 */
export function MobileNav() {
  const activeId = useActiveSection();
  const activeItem = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0];
  const [open, setOpen] = useState(false);

  // Lock body scroll while the takeover menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-ink-100 bg-paper-50 px-5 sm:px-6 lg:hidden">
        <p className="whitespace-nowrap text-body font-semibold tracking-tight text-ink-900">
          Abdul Rehman
        </p>

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/*
            At 320 the wordmark, a spelled-out section label and the menu
            button do not fit on one 64px bar: both texts wrapped to two
            lines and spilled out of it. Below 352px the label keeps the
            number and drops the word — the section name is one tap away in
            the menu, and the number is what the rest of the site indexes by.
          */}
          <span className="whitespace-nowrap font-mono text-micro tracking-widest text-accent-teal">
            {activeItem.num}
            <span className="hidden min-[22rem]:inline">
              {" "}· {activeItem.label.toUpperCase()}
            </span>
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative -mr-2 flex h-11 w-11 flex-none flex-col items-center justify-center gap-[6px]"
          >
            <span
              className={`h-[1.5px] w-6 bg-ink-900 transition-transform duration-base ease-out-expo ${
                open ? "translate-y-[3.75px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-ink-900 transition-transform duration-base ease-out-expo ${
                open ? "-translate-y-[3.75px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        data-mobile-menu=""
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-30 flex flex-col justify-center bg-ink-900 px-8 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          // `opacity: 0` alone leaves the subtree visible to focus, which is
          // how seven invisible links stayed in the tab order. `visibility`
          // is the property that actually removes them — transitioned with a
          // delay on the way out so the fade still plays, and instantly on
          // the way in. `inert` above covers assistive tech and clicks.
          visibility: open ? "visible" : "hidden",
          transitionProperty: "opacity, visibility",
          transitionDuration: "var(--duration-slow)",
          transitionTimingFunction: "var(--ease-out-expo)",
          transitionDelay: open ? "0ms, 0ms" : "0ms, var(--duration-slow)",
        }}
      >
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item, i) => {
            const isActive = item.id === activeId;
            return (
              <li
                key={item.id}
                className="border-b border-ink-700 py-4 transition-all duration-slow"
                style={{
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                  transform: open ? "translateY(0)" : "translateY(12px)",
                  opacity: open ? 1 : 0,
                }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4"
                >
                  <span
                    className={`font-mono text-small tracking-wide ${
                      isActive ? "text-accent-mint" : "text-ink-400"
                    }`}
                  >
                    {item.num}
                  </span>
                  <span
                    className={`text-display-2 tracking-tight ${
                      isActive ? "text-paper-0" : "text-ink-200"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="mailto:m.abdulrehman111@gmail.com"
          className="mt-10 text-small text-ink-300 transition-colors duration-fast hover:text-accent-mint"
        >
          m.abdulrehman111@gmail.com
        </a>
      </div>
    </>
  );
}
