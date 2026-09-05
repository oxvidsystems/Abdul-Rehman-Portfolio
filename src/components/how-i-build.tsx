"use client";

import { NAV_ITEMS } from "@/lib/nav-items";
import { useReveal } from "@/lib/use-reveal";

/**
 * "How I Build" — a short editorial statement between Expertise and Work
 * naming the actual practice behind every line of code on this site:
 * AI-paired development with Claude.
 *
 * This is deliberately NOT a claim that the site (or the work in it) is
 * "AI-generated" — the brief explicitly rules that feeling out. The point
 * made here is the opposite one: Abdul Rehman still architects, directs
 * and reviews every layer; Claude accelerates the build. The fourteen
 * live projects linked from Work are the proof this produces real,
 * shipped, client-owned software rather than generic output.
 *
 * The five credentials below are pulled verbatim from the "AI & Automation"
 * skill family in lib/journey.ts (the client's own wording) — this section
 * gives that existing, already-real skill set the spotlight the client
 * asked for, rather than inventing new terms.
 *
 * The benefits bar reuses Journey's own `.cr-figs`/`.cr-fig` dark stat-bar
 * styling (same component language as the Career Roadmap's figures row)
 * instead of inventing a new "card" pattern, per the brief's own rule
 * against basic/generic cards. Every claim in it is one already made
 * elsewhere on the site (the AI Agent Solutions in Work are built for
 * always-on, instant-reply operation) — nothing new is asserted here.
 */

const ITEM = NAV_ITEMS.find((item) => item.id === "how-i-build")!;

const CREDENTIALS = [
  "Claude",
  "Claude Agent SDK & Anthropic Ecosystem",
  "MCP Server Development",
  "Multi-Agent System Design",
  "AI Automation & Workflow Orchestration",
];

type BenefitIcon = "clock" | "chat" | "bolt" | "shield";

const BENEFITS: { icon: BenefitIcon; value: string; label: string; tint: string }[] = [
  { icon: "clock", value: "24/7", label: "Agents that work around the clock", tint: "#5ec9b6" },
  { icon: "chat", value: "Instant", label: "Chat agents reply in seconds, not hours", tint: "#7fa9dd" },
  { icon: "bolt", value: "Faster", label: "Production software shipped at pace", tint: "#6cc182" },
  { icon: "shield", value: "Reliable", label: "Same quality bar, every layer", tint: "#5cc0d4" },
];

const BENEFIT_ICONS: Record<BenefitIcon, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.25 2" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v11H9.5L5 20.5V16.5H4Z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L11 21l8-10.5h-6L13 3Z" />,
  shield: (
    <>
      <path d="M12 3.5 19 6.5v5.3c0 4.4-3 7.6-7 8.7-4-1.1-7-4.3-7-8.7V6.5Z" />
      <path d="M9 12l2.2 2.2L15.5 9.6" />
    </>
  ),
};

function BenefitGlyph({ icon }: { icon: BenefitIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {BENEFIT_ICONS[icon]}
    </svg>
  );
}

export function HowIBuild() {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section
      id="how-i-build"
      className="hib-glow relative scroll-mt-16 bg-paper-0 px-6 py-section-md lg:scroll-mt-0 lg:px-12 lg:py-section-lg"
    >
      <div className="relative mx-auto grid w-full max-w-[104rem] gap-8 lg:grid-cols-[minmax(150px,230px)_minmax(0,1fr)] lg:gap-16">
        {/* ---------- STATIC LEFT ---------- */}
        <div className="lg:sticky lg:top-40 lg:h-fit">
          <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-teal-dark">
            <span className="h-1.5 w-1.5 shrink-0 bg-accent-teal-dark" aria-hidden />
            {ITEM.num}
          </p>
          <h2 className="mt-4 text-h2 font-semibold tracking-tight text-ink-900">
            How I Build
          </h2>
          <p className="mt-4 max-w-[16rem] text-small leading-normal text-ink-500">
            The workflow behind every line of code on this site.
          </p>
        </div>

        {/* ---------- DYNAMIC RIGHT ---------- */}
        <div ref={ref} className={`max-w-3xl border-l-2 border-accent-teal pl-6 lg:pl-10 ${revealed ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="font-mono text-micro tracking-widest text-accent-teal-dark">
            AI-PAIRED DEVELOPMENT — MY CORE STRENGTH
          </p>

          <h3 className="mt-5 font-display text-h2 font-extrabold leading-snug tracking-tight text-ink-900 lg:text-h1">
            I build by working directly with Claude — not around it.
          </h3>

          <p className="mt-6 max-w-2xl text-small leading-relaxed text-ink-600 lg:text-body">
            Frontend, backend and automation all run through the same
            workflow: I architect and direct, Claude accelerates the build,
            and together we ship production software faster without
            lowering the bar. It isn&rsquo;t a shortcut or a template
            generator &mdash; it&rsquo;s a practiced skill, the same as any
            other on this site, and it&rsquo;s how every one of the fourteen
            live projects below actually got built.
          </p>

          {/* what it actually delivers — the client-facing payoff of the
              method above, not a new claim: see the AI Agent Solutions in
              Work for these same always-on / instant-reply agents live. */}
          <div className="cr-figs mt-8">
            {BENEFITS.map((b) => (
              <div key={b.label} className="cr-fig" style={{ "--cr-mark": b.tint } as React.CSSProperties}>
                <BenefitGlyph icon={b.icon} />
                <b>{b.value}</b>
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="inline-flex items-center rounded-full border border-accent-teal/30 bg-accent-teal/[0.06] px-4 py-2 font-mono text-micro tracking-wide text-accent-teal-dark"
              >
                {c}
              </li>
            ))}
          </ul>

          <a
            href="#work"
            className="mt-10 inline-flex items-center gap-2 font-mono text-small font-semibold tracking-widest text-accent-teal-dark underline decoration-1 underline-offset-4 transition-colors duration-fast hover:text-ink-950"
          >
            SEE THE SHIPPED WORK ↓
          </a>
        </div>
      </div>
    </section>
  );
}
