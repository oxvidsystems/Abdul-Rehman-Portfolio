/**
 * Large service artwork for the Expertise chapters.
 *
 * Drawn from scratch as inline SVG rather than embedding the client's
 * supplied reference images: those are phone screenshots of social
 * posts (status bar, Boost/Share chrome) and contain placeholder brand
 * mock-ups such as "AVANTÉ SOLUTIONS" — putting those on a real
 * portfolio would read as fabricated client work. These pieces borrow
 * the references' *visual language* (isometric device framing, workflow
 * nodes, checklist motifs) in the OXVID palette instead.
 *
 * Everything is stroked/filled with `currentColor` plus an `accent`
 * colour passed by the parent, so one artwork works on both the light
 * and dark chapter panels.
 */

type ArtProps = { className?: string };

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 01 — Custom Web Development: a browser frame, code column and the responsive device trio. */
export function WebArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* code column */}
      <g {...STROKE} opacity="0.5">
        <rect x="14" y="86" width="120" height="196" rx="6" />
        <path d="M30 108h58M30 124h84M30 140h44M30 156h72M30 172h52M30 188h88M30 204h40M30 220h66M30 236h50M30 252h78" />
      </g>

      {/* main browser window */}
      <g {...STROKE}>
        <rect x="150" y="58" width="252" height="196" rx="8" />
        <path d="M150 86h252" />
        <circle cx="166" cy="72" r="3.5" />
        <circle cx="180" cy="72" r="3.5" />
        <circle cx="194" cy="72" r="3.5" />
      </g>

      {/* wireframe content inside the window */}
      <g {...STROKE} opacity="0.75">
        <path d="M170 108h74M170 124h108M170 140h60" />
        <rect x="170" y="160" width="66" height="20" rx="10" />
      </g>

      {/* globe / network motif, echoing the reference art */}
      <g stroke="var(--art-accent)" fill="none" strokeWidth="1.1" opacity="0.9">
        <circle cx="336" cy="150" r="46" />
        <ellipse cx="336" cy="150" rx="46" ry="18" />
        <ellipse cx="336" cy="150" rx="18" ry="46" />
        <path d="M292 138h88M292 162h88" />
      </g>
      <g fill="var(--art-accent)">
        <circle cx="336" cy="104" r="3" />
        <circle cx="379" cy="141" r="2.5" />
        <circle cx="303" cy="168" r="2.5" />
        <circle cx="352" cy="188" r="2.5" />
      </g>

      {/* phone */}
      <g {...STROKE}>
        <rect x="418" y="120" width="72" height="134" rx="10" />
        <path d="M418 142h72" />
        <path d="M434 162h40M434 176h30" opacity="0.75" />
        <rect x="434" y="196" width="40" height="14" rx="7" opacity="0.75" />
      </g>

      {/* desk line */}
      <path d="M8 282h504" {...STROKE} opacity="0.35" />
    </svg>
  );
}

/** 02 — Professional Content Writing: a document, checklist and pen nib. */
export function ContentArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* back sheet */}
      <g {...STROKE} opacity="0.4">
        <rect x="52" y="58" width="196" height="238" rx="8" />
      </g>

      {/* main sheet */}
      <g {...STROKE}>
        <rect x="86" y="42" width="212" height="254" rx="8" fill="none" />
        <path d="M116 84h132M116 106h152M116 128h96" />
      </g>

      {/* big glyph */}
      <text
        x="116"
        y="204"
        fontFamily="var(--font-display, sans-serif)"
        fontSize="76"
        fontWeight="800"
        fill="var(--art-accent)"
        opacity="0.9"
      >
        T
      </text>
      <g {...STROKE} opacity="0.75">
        <path d="M182 176h96M182 196h80M182 216h96M182 236h56" />
      </g>

      {/* checklist card */}
      <g {...STROKE}>
        <rect x="326" y="86" width="164" height="150" rx="8" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path
            d={`M344 ${116 + i * 32} l7 7 13 -14`}
            fill="none"
            stroke="var(--art-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M376 ${120 + i * 32} h${[86, 66, 78, 54][i]}`}
            {...STROKE}
            opacity="0.75"
          />
        </g>
      ))}

      {/* pen nib */}
      <g {...STROKE}>
        <path d="M360 300l104-72 16 22-104 72-22 6z" />
        <path d="M374 306l10 14" opacity="0.7" />
      </g>
      <path d="M8 322h504" {...STROKE} opacity="0.35" />
    </svg>
  );
}

/** 03 — AI Agents & Automation: a workflow node graph, in the spirit of an n8n canvas. */
export function AutomationArt({ className }: ArtProps) {
  const node = (x: number, y: number, w = 78, h = 46) => (
    <rect x={x} y={y} width={w} height={h} rx="8" {...STROKE} />
  );
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* canvas */}
      <rect x="12" y="30" width="496" height="300" rx="12" {...STROKE} opacity="0.35" />

      {/* connectors */}
      <g stroke="var(--art-accent)" fill="none" strokeWidth="1.25" strokeDasharray="4 6" opacity="0.85">
        <path d="M108 110h44" />
        <path d="M230 110h40" />
        <path d="M270 110c26 0 26 96 52 96" />
        <path d="M270 110c26 0 26 -46 52 -46" />
        <path d="M400 64h40" />
        <path d="M400 206h40" />
        <path d="M152 110v96h-44" />
      </g>

      {/* trigger */}
      {node(30, 87, 78, 46)}
      <path d="M60 100l-8 14h10l-6 12" stroke="var(--art-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="52" y="150" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="var(--font-mono, monospace)">TRIGGER</text>

      {/* agent (dominant node) */}
      <rect x="152" y="84" width="78" height="52" rx="10" fill="var(--art-accent)" opacity="0.16" />
      {node(152, 84, 78, 52)}
      <g stroke="var(--art-accent)" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="176" y="100" width="30" height="22" rx="6" />
        <circle cx="185" cy="111" r="1.6" fill="var(--art-accent)" stroke="none" />
        <circle cx="197" cy="111" r="1.6" fill="var(--art-accent)" stroke="none" />
        <path d="M191 100v-7M186 93h10" />
      </g>
      <text x="163" y="152" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="var(--font-mono, monospace)">AI AGENT</text>

      {/* outputs */}
      {node(322, 42, 78, 44)}
      <path d="M340 58h42M340 68h28" {...STROKE} opacity="0.7" />
      {node(322, 184, 78, 44)}
      <path d="M340 200h42M340 210h28" {...STROKE} opacity="0.7" />
      {node(30, 184, 78, 44)}
      <path d="M48 200h42M48 210h28" {...STROKE} opacity="0.7" />

      {/* result chips */}
      <g {...STROKE} opacity="0.8">
        <rect x="440" y="42" width="62" height="44" rx="8" />
        <rect x="440" y="184" width="62" height="44" rx="8" />
      </g>
      <g fill="var(--art-accent)">
        <circle cx="471" cy="64" r="4" />
        <circle cx="471" cy="206" r="4" />
      </g>

      {/* status row */}
      <g fill="currentColor" opacity="0.55" fontSize="10" fontFamily="var(--font-mono, monospace)">
        <text x="30" y="300">ACTIVE</text>
        <text x="120" y="300">200+ INTEGRATIONS</text>
        <text x="320" y="300">24/7</text>
      </g>
      <circle cx="22" cy="296" r="3.5" fill="var(--art-accent)" />
    </svg>
  );
}

/** 02 — Claude & Anthropic AI Development: a core "agent" node paired with
 *  the four disciplines that sit around it (Agent SDK, MCP, multi-agent
 *  systems, full-stack). The centre glyph is a generic six-point spark —
 *  a common "AI/assistant" motif, not any company's actual logo mark. */
export function ClaudeArt({ className }: ArtProps) {
  const satellites = [
    { x: 74, y: 74, label: "AGENT SDK" },
    { x: 74, y: 224, label: "MULTI-AGENT" },
    { x: 366, y: 74, label: "MCP" },
    { x: 366, y: 224, label: "FULL-STACK" },
  ];
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* canvas */}
      <rect x="12" y="30" width="496" height="300" rx="12" {...STROKE} opacity="0.35" />

      {/* connectors from the core out to each discipline */}
      <g stroke="var(--art-accent)" fill="none" strokeWidth="1.25" strokeDasharray="4 6" opacity="0.85">
        {satellites.map((n) => (
          <path key={n.label} d={`M260 180 L${n.x + 40} ${n.y + 26}`} />
        ))}
      </g>

      {/* the core */}
      <rect x="216" y="136" width="88" height="88" rx="20" fill="var(--art-accent)" opacity="0.14" />
      <rect x="216" y="136" width="88" height="88" rx="20" {...STROKE} />
      <g stroke="var(--art-accent)" strokeWidth="2" strokeLinecap="round">
        <path d="M260 156v48M236 180h48" />
        <path d="M243 163l34 34M277 163l-34 34" />
      </g>
      <text x="238" y="242" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="var(--font-mono, monospace)">
        CLAUDE
      </text>

      {/* the four disciplines */}
      {satellites.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width="80" height="52" rx="10" {...STROKE} />
          <circle cx={n.x + 40} cy={n.y + 20} r="4" fill="var(--art-accent)" />
          <text
            x={n.x + 40}
            y={n.y + 42}
            fontSize="8.5"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.65"
            fontFamily="var(--font-mono, monospace)"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* status row */}
      <g fill="currentColor" opacity="0.55" fontSize="10" fontFamily="var(--font-mono, monospace)">
        <text x="30" y="300">AI-PAIRED</text>
        <text x="150" y="300">FRONTEND + BACKEND</text>
        <text x="360" y="300">SHIPPED LIVE</text>
      </g>
      <circle cx="22" cy="296" r="3.5" fill="var(--art-accent)" />
    </svg>
  );
}

/** 04 — Brand Identity & Creative Design: a construction-grid mark with applied collateral. */
export function BrandArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* construction grid */}
      <g {...STROKE} opacity="0.3">
        <circle cx="150" cy="150" r="96" />
        <circle cx="150" cy="150" r="64" />
        <path d="M54 150h192M150 54v192" />
        <path d="M82 82l136 136M218 82L82 218" />
      </g>

      {/* the mark itself */}
      <path
        d="M150 96l52 92h-104z"
        fill="var(--art-accent)"
        opacity="0.9"
      />
      <path d="M150 130l26 46h-52z" fill="var(--chapter-bg, #ffffff)" />

      {/* corner handles */}
      <g fill="none" stroke="var(--art-accent)" strokeWidth="1.25">
        <rect x="96" y="90" width="8" height="8" />
        <rect x="196" y="90" width="8" height="8" />
        <rect x="96" y="184" width="8" height="8" />
        <rect x="196" y="184" width="8" height="8" />
      </g>

      {/* collateral: card, letterhead, swatches */}
      <g {...STROKE}>
        <rect x="292" y="60" width="130" height="80" rx="6" />
        <path d="M310 96h44M310 110h64" opacity="0.7" />
        <rect x="292" y="160" width="130" height="140" rx="6" />
        <path d="M312 190h90M312 206h80M312 222h94M312 238h64" opacity="0.6" />
      </g>
      <path d="M310 78l14 -12 14 12z" fill="var(--art-accent)" opacity="0.9" />

      {/* palette swatches */}
      <g>
        <rect x="440" y="60" width="52" height="52" rx="8" fill="var(--art-accent)" opacity="0.9" />
        <rect x="440" y="124" width="52" height="52" rx="8" fill="var(--art-accent)" opacity="0.5" />
        <rect x="440" y="188" width="52" height="52" rx="8" fill="currentColor" opacity="0.22" />
        <rect x="440" y="252" width="52" height="52" rx="8" {...STROKE} />
      </g>
    </svg>
  );
}

/** 05 — Complete SEO Solutions: a ranking chart under a magnifying glass, with backlink nodes for off-page. */
export function SeoArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true">
      {/* the page being ranked */}
      <g {...STROKE} opacity="0.4">
        <rect x="40" y="46" width="192" height="252" rx="8" />
      </g>
      <g {...STROKE}>
        <rect x="66" y="30" width="192" height="252" rx="8" fill="none" />
        <path d="M90 66h140M90 86h110" opacity="0.7" />
      </g>

      {/* on-page checklist */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path
            d={`M90 ${126 + i * 30} l7 7 13 -14`}
            fill="none"
            stroke="var(--art-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d={`M122 ${130 + i * 30} h${[96, 76, 88, 64][i]}`} {...STROKE} opacity="0.75" />
        </g>
      ))}

      {/* off-page: backlink nodes reaching the page from outside */}
      <g {...STROKE} opacity="0.55" strokeDasharray="3 5">
        <path d="M18 40 L66 84" />
        <path d="M10 210 L66 200" />
        <path d="M30 300 L90 268" />
      </g>
      <g fill="var(--art-accent)">
        <circle cx="18" cy="40" r="7" />
        <circle cx="10" cy="210" r="7" />
        <circle cx="30" cy="300" r="7" />
      </g>

      {/* ranking growth chart */}
      <g {...STROKE}>
        <rect x="300" y="150" width="188" height="146" rx="8" />
      </g>
      <g>
        <rect x="322" y="248" width="24" height="30" rx="3" fill="currentColor" opacity="0.22" />
        <rect x="358" y="226" width="24" height="52" rx="3" fill="currentColor" opacity="0.35" />
        <rect x="394" y="198" width="24" height="80" rx="3" fill="var(--art-accent)" opacity="0.55" />
        <rect x="430" y="168" width="24" height="110" rx="3" fill="var(--art-accent)" opacity="0.9" />
      </g>
      <path
        d="M326 258 L370 232 L406 206 L446 176"
        fill="none"
        stroke="var(--art-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M436 176h14v14" fill="none" stroke="var(--art-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* magnifying glass, search over the page */}
      <g {...STROKE}>
        <circle cx="230" cy="180" r="58" />
        <path d="M272 222l40 40" strokeWidth="2.5" />
      </g>
      <circle cx="230" cy="180" r="58" fill="var(--art-accent)" opacity="0.08" />

      <path d="M8 322h504" {...STROKE} opacity="0.35" />
    </svg>
  );
}

export const SERVICE_ART = {
  web: WebArt,
  claude: ClaudeArt,
  content: ContentArt,
  automation: AutomationArt,
  brand: BrandArt,
  seo: SeoArt,
};
