import type { AgentIconKey } from "@/lib/ai-agents";

/**
 * Shared mini-illustration for an AI Agents card: [trigger icon] —
 * dashed line — [agent core] — dashed line — [result icon], the same
 * "input → agent → output" visual grammar as the Expertise section's
 * AutomationArt, scaled down to card size and re-skinned per agent
 * with a different pair of icons.
 *
 * Deliberately a hand-drawn technical diagram, not a screenshot or a
 * stock UI mock — nothing here claims to be a capture of a real
 * screen, because none of these agents has a public one to capture.
 */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeOpacity: 0.35,
} as const;

function Icon({ k, size = 22 }: { k: AgentIconKey; size?: number }) {
  const s = size;
  const common = {
    stroke: "var(--art-accent)",
    strokeWidth: 1.6,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (k) {
    case "form":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={3} />
          <path d={`M${-s / 2 + 4} ${-s / 2 + 6}h${s - 8}M${-s / 2 + 4} ${0}h${s - 8}M${-s / 2 + 4} ${s / 2 - 6}h${s - 14}`} />
        </g>
      );
    case "capture":
      return (
        <g {...common}>
          <circle cx={0} cy={-2} r={s * 0.22} />
          <path d={`M${-s * 0.32} ${s * 0.34}c0 -${s * 0.3} ${s * 0.64} -${s * 0.3} ${s * 0.64} 0`} />
          <path d={`M${s * 0.28} ${-s * 0.34}l${s * 0.16} 0 0 ${s * 0.16}`} />
        </g>
      );
    case "profile":
      return (
        <g {...common}>
          <circle cx={0} cy={-s * 0.18} r={s * 0.2} />
          <path d={`M${-s * 0.3} ${s * 0.36}c0 -${s * 0.32} ${s * 0.6} -${s * 0.32} ${s * 0.6} 0`} />
        </g>
      );
    case "score":
      return (
        <g {...common}>
          <path d={`M${-s / 2} ${s * 0.1}a${s / 2} ${s / 2} 0 0 1 ${s} 0`} />
          <path d={`M0 ${s * 0.1}l${s * 0.22} -${s * 0.28}`} />
          <circle cx={0} cy={s * 0.1} r={1.6} fill="var(--art-accent)" stroke="none" />
        </g>
      );
    case "chat-q":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s * 0.36} width={s} height={s * 0.62} rx={s * 0.18} />
          <path d={`M${-s * 0.1} ${s * 0.26}l${-s * 0.14} ${s * 0.2}v${-s * 0.2}`} />
          <text x={-3} y={0} fontSize={s * 0.42} fill="var(--art-accent)" stroke="none" fontFamily="var(--font-mono, monospace)">?</text>
        </g>
      );
    case "chat-check":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s * 0.36} width={s} height={s * 0.62} rx={s * 0.18} />
          <path d={`M${-s * 0.1} ${s * 0.26}l${-s * 0.14} ${s * 0.2}v${-s * 0.2}`} />
          <path d={`M${-s * 0.18} -${s * 0.05}l${s * 0.12} ${s * 0.14} ${s * 0.24} -${s * 0.28}`} />
        </g>
      );
    case "calendar":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s * 0.4} width={s} height={s * 0.8} rx={3} />
          <path d={`M${-s / 2} ${-s * 0.14}h${s}`} />
          <path d={`M${-s * 0.2} ${-s * 0.5}v${s * 0.2}M${s * 0.2} ${-s * 0.5}v${s * 0.2}`} />
        </g>
      );
    case "calendar-check":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s * 0.4} width={s} height={s * 0.8} rx={3} />
          <path d={`M${-s / 2} ${-s * 0.14}h${s}`} />
          <path d={`M${-s * 0.22} ${s * 0.08}l${s * 0.14} ${s * 0.16} ${s * 0.28} -${s * 0.32}`} />
        </g>
      );
    case "whatsapp":
      return (
        <g {...common}>
          <path
            d={`M0 ${-s / 2}a${s / 2} ${s / 2} 0 1 0 ${s * 0.42} ${s * 0.82}l${s * 0.18} ${s * 0.06} -${s * 0.06} -${s * 0.18}A${s / 2} ${s / 2} 0 0 0 0 ${-s / 2}z`}
          />
          <path d={`M${-s * 0.16} -${s * 0.04}c${s * 0.1} ${s * 0.2} ${s * 0.24} ${s * 0.14} ${s * 0.3} ${s * 0.04}`} />
        </g>
      );
    case "double-tick":
      return (
        <g {...common}>
          <path d={`M${-s * 0.42} 0l${s * 0.14} ${s * 0.16} ${s * 0.26} -${s * 0.3}`} stroke="var(--art-accent)" />
          <path d={`M${-s * 0.14} 0l${s * 0.14} ${s * 0.16} ${s * 0.26} -${s * 0.3}`} />
        </g>
      );
    case "clock":
      return (
        <g {...common}>
          <circle cx={0} cy={0} r={s * 0.42} />
          <path d={`M0 -${s * 0.22}v${s * 0.24}l${s * 0.16} ${s * 0.1}`} />
        </g>
      );
    case "send":
      return (
        <g {...common}>
          <path d={`M${-s * 0.45} ${-s * 0.3}l${s * 0.9} ${s * 0.3} -${s * 0.9} ${s * 0.3} ${s * 0.2} -${s * 0.3}z`} />
        </g>
      );
    case "invoice":
      return (
        <g {...common}>
          <rect x={-s * 0.34} y={-s / 2} width={s * 0.68} height={s} rx={3} />
          <path d={`M${-s * 0.2} ${-s * 0.2}h${s * 0.4}M${-s * 0.2} 0h${s * 0.4}M${-s * 0.2} ${s * 0.2}h${s * 0.22}`} />
        </g>
      );
    case "cash":
      return (
        <g {...common}>
          <rect x={-s / 2} y={-s * 0.3} width={s} height={s * 0.6} rx={4} />
          <circle cx={0} cy={0} r={s * 0.14} />
        </g>
      );
    case "stack":
      return (
        <g {...common}>
          <rect x={-s * 0.4} y={-s * 0.34} width={s * 0.8} height={s * 0.2} rx={2} />
          <rect x={-s * 0.4} y={-s * 0.06} width={s * 0.8} height={s * 0.2} rx={2} />
          <rect x={-s * 0.4} y={s * 0.22} width={s * 0.8} height={s * 0.2} rx={2} />
        </g>
      );
    case "chart":
      return (
        <g {...common}>
          <path d={`M${-s * 0.42} ${s * 0.4}v-${s * 0.8}M${-s * 0.42} ${s * 0.4}h${s * 0.84}`} />
          <path d={`M${-s * 0.28} ${s * 0.4}v-${s * 0.34}M${-s * 0.02} ${s * 0.4}v-${s * 0.56}M${s * 0.24} ${s * 0.4}v-${s * 0.2}`} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
}

export function AgentFlowArt({
  leftIcon,
  rightIcon,
  className,
}: {
  leftIcon: AgentIconKey;
  rightIcon: AgentIconKey;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 260 120" className={className} aria-hidden="true">
      {/* connectors */}
      <g stroke="var(--art-accent)" strokeOpacity="0.85" strokeWidth="1.25" strokeDasharray="3 5" fill="none">
        <path d="M56 60h34" />
        <path d="M170 60h34" />
      </g>

      {/* trigger node */}
      <rect x="14" y="34" width="42" height="52" rx="9" {...STROKE} />
      <g transform="translate(35 60)">
        <Icon k={leftIcon} />
      </g>

      {/* agent core (same for every card — this is literally "the agent") */}
      <rect x="94" y="24" width="72" height="72" rx="12" fill="var(--art-accent)" opacity="0.14" />
      <rect x="94" y="24" width="72" height="72" rx="12" {...STROKE} strokeOpacity="0.55" />
      <g stroke="var(--art-accent)" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="118" y="46" width="24" height="18" rx="5" />
        <circle cx="126" cy="55" r="1.5" fill="var(--art-accent)" stroke="none" />
        <circle cx="136" cy="55" r="1.5" fill="var(--art-accent)" stroke="none" />
        <path d="M130 46v-6M126 40h8" />
      </g>

      {/* result node */}
      <rect x="204" y="34" width="42" height="52" rx="9" {...STROKE} />
      <g transform="translate(225 60)">
        <Icon k={rightIcon} />
      </g>
    </svg>
  );
}
