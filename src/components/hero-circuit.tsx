import type { SVGProps } from "react";

/**
 * Hand-authored decorative "circuit trace" motif for the Hero's dark
 * geometric panel — a few right-angle traces and node points, drawn
 * from scratch (not extracted from the OXVID logo file). Purely
 * decorative: aria-hidden, currentColor throughout so callers set the
 * tone via className/style.
 */
export function HeroCircuit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 60 H96 V12" />
      <path d="M12 120 H60 V180 H140" />
      <path d="M140 180 V260 H228" />
      <path d="M228 260 V308" />
      <path d="M96 12 H228 V96 H308" />
      <path d="M60 180 V228 H12" />
      <circle cx="12" cy="60" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="96" cy="12" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="140" cy="180" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="228" cy="260" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="228" cy="96" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="308" cy="96" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="228" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="228" cy="308" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
