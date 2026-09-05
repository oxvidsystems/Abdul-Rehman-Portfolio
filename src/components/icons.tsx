import type { SVGProps } from "react";

/**
 * Minimal hand-authored line icons (no icon library dependency —
 * keeps installs light). 24x24, 1.75 stroke, rounded caps/joins to
 * read as one consistent family. `currentColor` throughout so each
 * icon inherits its nav item's active/inactive text color.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9v10a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V19a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V9" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16 8.5 4.5 8.5-4.5" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.25" y="7.5" width="17.5" height="11.5" rx="1.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.25 12.75h17.5" />
    </svg>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.25" y="4.5" width="17.5" height="15" rx="2" />
      <path d="M7 9.5 10.5 12 7 14.5" />
      <path d="M12.5 14.5h4.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.25 2" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.25" y="5.5" width="17.5" height="13" rx="1.75" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

/**
 * Chat-launcher glyph: a solid speech bubble.
 *
 * Two earlier attempts were rejected — a bubble with a dot-trio (reads as a
 * loading state) and an outlined bubble with text lines (too quiet at 18px
 * against bold uppercase type). Solid is the universally recognised chat
 * mark and holds its weight at small sizes. It intentionally breaks the
 * nav's line-icon family: the launcher is a standalone CTA on a dark
 * button, not one of six icons that have to read as a set.
 *
 * The tail is stroked as well as filled purely so `stroke-linejoin: round`
 * blunts its point — cheaper than hand-authoring arc segments.
 */
export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="13" rx="3.6" />
      <path
        d="M8 14.4h4.9L8.6 19.7V14.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
