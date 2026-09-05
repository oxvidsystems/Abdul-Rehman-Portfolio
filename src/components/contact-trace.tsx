import type { SVGProps } from "react";

/**
 * Compact hand-authored "signal routing" motif for the Contact
 * section — the subtle technical graphic the brief asks for.
 *
 * Deliberately NOT stretched across the layout: an earlier version
 * spanned the full width with preserveAspectRatio="none" and ended up
 * drawing right-angles straight through the contact details. This one
 * keeps its own aspect ratio and lives in the empty plate beside the
 * primary CTA, where it can't collide with anything readable.
 *
 * Drawn from scratch — nothing traced from the OXVID logo file.
 * currentColor throughout; the dash-draw animation lives in
 * globals.css (`.contact-trace`).
 */
export function ContactTrace(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 300 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      {...props}
    >
      <path pathLength={1} className="trace-main" d="M0 32 H72 V96 H196 V16 H300" />
      <path pathLength={1} className="trace-main" d="M0 138 H128 V96" />
      <path pathLength={1} className="trace-branch" d="M196 96 V152 H300" />
      <path pathLength={1} className="trace-branch" d="M72 32 V4" />
      <circle cx="72" cy="96" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="128" cy="96" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="196" cy="96" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="196" cy="16" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="72" cy="4" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
