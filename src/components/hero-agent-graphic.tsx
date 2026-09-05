/**
 * Conceptual "AI agent" visual for the Automation slide of the Hero
 * slider — a hand-drawn orbit/core graphic (orbiting nodes around a
 * pulsing core with a checkmark), not a screenshot of any real
 * product. Kept abstract and on-brand on purpose: OXVID doesn't have
 * a specific shipped "AI agent" product to depict, so this stays
 * illustrative rather than claiming a fabricated one.
 */
export function HeroAgentGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
    >
      <g
        className="origin-center"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle
          cx="200"
          cy="200"
          r="146"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="200" cy="54" r="7" fill="currentColor" />
        <circle cx="346" cy="200" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="200" cy="346" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="54" cy="200" r="7" fill="currentColor" />
      </g>

      <line x1="200" y1="200" x2="200" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="200" x2="54" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      <circle cx="200" cy="200" r="96" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />

      <g
        className="origin-center"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="200" r="58" fill="currentColor" opacity="0.16" />
        <circle cx="200" cy="200" r="38" fill="currentColor" />
        <path
          d="M182 200 l12 12 24 -26"
          stroke="var(--color-ink-950)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
