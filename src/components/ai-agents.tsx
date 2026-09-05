"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import { MAX_FRAME_S, runWhileVisible, scrollEase } from "@/lib/motion";
import { AI_AGENT_CATEGORY, AI_AGENTS, AI_AGENT_COUNT, type AiAgent } from "@/lib/ai-agents";
import { useReveal } from "@/lib/use-reveal";
import {
  LeadCaptureMockup,
  LeadQualificationMockup,
  CustomerSupportMockup,
  AppointmentBookingMockup,
  WhatsAppMockup,
  FollowUpMockup,
  QuoteInvoiceMockup,
  BusinessReportingMockup,
} from "./agent-mockups";

const MOCKUPS: Record<string, ComponentType> = {
  "lead-capture": LeadCaptureMockup,
  "lead-qualification": LeadQualificationMockup,
  "customer-support": CustomerSupportMockup,
  "appointment-booking": AppointmentBookingMockup,
  "whatsapp-agent": WhatsAppMockup,
  "follow-up": FollowUpMockup,
  "quote-invoice": QuoteInvoiceMockup,
  "business-reporting": BusinessReportingMockup,
};

/** Extra dwell (in viewport-heights) after the last agent settles, before
 *  the deck unpins — same reasoning as the Hero's OUTRO_SCREENS: without
 *  it the final agent is scrolling away the instant it finishes arriving. */
const OUTRO_SCREENS = 1;
const STAGE_SCREENS = AI_AGENT_COUNT - 1 + OUTRO_SCREENS + 1;

/**
 * "AI Agent Solutions" — a capability showcase inside the same Work
 * section as Completed Projects, one pinned scroll-driven slide per agent:
 * a layered mockup on the left (the same honest device-frame illustration
 * as before, now shown as a shallow 3-layer stack for depth), the agent's
 * story on the right — category + solution number, title, description,
 * three metadata facts, a feature checklist and a "Book a Demo" link into
 * the site's real contact section.
 *
 * Why a mockup and not a photo or a real screenshot: see the doc comment
 * on AI_AGENTS in lib/ai-agents.ts. Each agent runs privately inside one
 * client's own WhatsApp number, CRM or inbox, so there is no public
 * screenshot that could honestly be shown here. Each mockup instead
 * depicts, with a generic placeholder conversation, the real kind of
 * interface that agent type lives in (see agent-mockups.tsx) — a browser
 * frame only for the one agent (Lead Capture) that genuinely lives on a
 * website; the rest keep their own honest device shape (CRM panel, phone,
 * chat widget) rather than being forced into a fake browser window.
 */
/**
 * The pinned curtain below is desktop-only by design, matching the same
 * rule this codebase already applies to Expertise/Work's stacking decks
 * (see the doc comment on useStackingDeck in lib/use-stacking-deck.ts):
 * below `lg` there isn't room to also fit a title, description, three
 * metadata boxes, six feature pills and a CTA into one fixed-height
 * pinned screen without clipping something off the bottom, so mobile and
 * tablet get the plain flowing list instead — not a smaller version of
 * the same trick, an intentionally different, simpler layout.
 */
export function AIAgents() {
  const head = useReveal<HTMLDivElement>();
  const [usePinnedDeck, setUsePinnedDeck] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUsePinnedDeck(desktop.matches && !motion.matches);
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      id="automation"
      className="ai-agents mx-auto mt-20 w-full max-w-[104rem] scroll-mt-16 lg:mt-28 lg:scroll-mt-0"
    >
      <div ref={head.ref} className={head.revealed ? "animate-reveal-up" : "opacity-0"}>
        <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-teal-dark">
          <span className="h-1.5 w-1.5 shrink-0 bg-accent-teal-dark" aria-hidden />
          AI AGENT SOLUTIONS
        </p>
        <h3 className="mt-3 font-display text-h2 font-extrabold tracking-tight text-ink-900">
          Automations that work while your business keeps moving.
        </h3>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-ink-500">
          Custom AI agents designed, built and delivered around real business
          workflows. Each one lives privately inside a client&rsquo;s own
          tools — WhatsApp, CRM, inbox, calendar — so there&rsquo;s no public
          link to show for these by design. Scroll through how each one
          actually behaves.
        </p>
      </div>

      {usePinnedDeck ? <AgentDeck /> : <AgentList />}

      <div className="agent-cta-card mx-6 mt-10 px-6 py-16 text-center sm:px-10 sm:py-20 lg:mx-12 lg:mt-16 lg:px-16 lg:py-24">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <p className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-teal-dark">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal-dark" aria-hidden />
            BUILT TO ORDER, NOT DEMOED
          </p>
          <h4 className="mt-5 font-display text-h2 font-extrabold leading-snug tracking-tight text-ink-950 lg:text-h1">
            Have a workflow like one of these in mind?
          </h4>
          <p className="mt-5 max-w-lg text-small leading-relaxed text-ink-500 lg:text-body">
            Every agent above is built to order for one business&rsquo;s own
            tools — none of them are public demos.
          </p>

          <a
            href="#contact"
            className="group mt-9 inline-flex items-center gap-4 rounded-full bg-ink-950 py-2 pl-8 pr-2 shadow-sm transition-all duration-fast hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal-dark"
          >
            <span className="font-mono text-small font-semibold tracking-widest text-paper-0">
              START A PROJECT
            </span>
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-0 text-ink-950 transition-all duration-base ease-out-expo group-hover:rotate-45 group-hover:bg-accent-mint"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4M12 4H5.5M12 4V10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** `prefers-reduced-motion`: no pin, no curtain — a plain scrolling list,
 *  visual then content, matching the pinned deck's own stacking order. */
function AgentList() {
  return (
    <div className="mt-14 lg:mt-20">
      {AI_AGENTS.map((agent) => (
        <AgentRow key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

function AgentRow({ agent }: { agent: AiAgent }) {
  const row = useReveal<HTMLDivElement>({ threshold: 0.12 });
  return (
    <div
      ref={row.ref}
      className={`grid gap-10 border-t border-paper-300 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:py-16 ${
        row.revealed ? "animate-reveal-up" : "opacity-0"
      }`}
    >
      <div className="agent-visual">
        <AgentVisual agent={agent} />
      </div>
      <AgentContent agent={agent} />
    </div>
  );
}

/** Left side: the same mockup shown three times in one CSS-grid cell —
 *  back and mid layers desaturated, scaled down and nudged off at an
 *  angle for depth, front layer the real, legible interface — plus the
 *  agent's three qualitative capability chips floating on top. */
// Half of each mockup card's own fixed max-width (see .agent-frame,
// .agent-frame-wide and .agent-frame-phone in globals.css) — lets the
// floating stat chips hug the card's real edge regardless of how wide
// the surrounding visual column renders. Keep in sync with those rules.
const AGENT_FRAME_HALF_WIDTH: Record<string, number> = {
  "lead-capture": 230, // .agent-frame (460px)
  "lead-qualification": 250, // .agent-frame-wide (500px)
  "customer-support": 230, // .agent-frame (460px)
  "appointment-booking": 250, // .agent-frame-wide (500px)
  "whatsapp-agent": 150, // .agent-frame-phone (300px)
  "follow-up": 250, // .agent-frame-wide (500px)
  "quote-invoice": 250, // .agent-frame-wide (500px)
  "business-reporting": 250, // .agent-frame-wide (500px)
};

function AgentVisual({ agent }: { agent: AiAgent }) {
  const Mockup = MOCKUPS[agent.id];
  if (!Mockup) return null;
  const frameHalf = AGENT_FRAME_HALF_WIDTH[agent.id] ?? 230;
  const stackStyle = { "--agent-frame-half": `${frameHalf}px` } as CSSProperties;
  return (
    <div className="agent-visual-stack" style={stackStyle}>
      <span className="agent-num-bg" aria-hidden="true">
        {agent.num}
      </span>
      <div className="agent-layer agent-layer-back" aria-hidden="true">
        <Mockup />
      </div>
      <div className="agent-layer agent-layer-mid" aria-hidden="true">
        <Mockup />
      </div>
      <div className="agent-layer agent-layer-front">
        <Mockup />
        {agent.stats.map((stat, i) => (
          <span key={stat.label} className={`agent-stat agent-stat-${i}`}>
            <b>{stat.label}</b>
            {stat.value}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Right side: category + solution number, title, description, metadata,
 *  feature checklist, and a CTA into the site's real contact section. */
function AgentContent({ agent }: { agent: AiAgent }) {
  return (
    <div>
      <div className="agent-cat-row">
        <span className="agent-cat-pill">{AI_AGENT_CATEGORY}</span>
        <span className="agent-solution">{agent.solution}</span>
      </div>

      <h4 className="mt-5 font-display text-h3 font-bold leading-snug tracking-tight text-ink-900 lg:text-h2">
        {agent.title}
      </h4>
      <p className="mt-1.5 font-mono text-micro tracking-widest text-accent-teal-dark">
        {agent.shortLabel}
      </p>
      <span className="agent-underline" aria-hidden />

      <p className="max-w-md text-small leading-relaxed text-ink-500 lg:text-body">
        {agent.description}
      </p>

      <div className="agent-meta-grid mt-8">
        {agent.metadata.map((field) => (
          <div className="agent-meta-box" key={field.label}>
            <span className="agent-meta-icon">
              <MetaIcon label={field.label} />
            </span>
            <p className="agent-meta-label">{field.label}</p>
            <p className="agent-meta-value">{field.value}</p>
          </div>
        ))}
      </div>

      <ul className="agent-feature-list">
        {agent.features.map((feature) => (
          <li key={feature} className="agent-feature-pill">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="mt-9 inline-flex min-h-[46px] items-center gap-3 rounded-lg bg-ink-900 px-6 py-3 font-mono text-micro font-semibold tracking-widest text-paper-0 shadow-sm transition-all duration-fast hover:-translate-y-0.5 hover:bg-accent-teal-dark hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-teal"
      >
        <CalendarIcon className="h-4 w-4 text-accent-mint" />
        BOOK A DEMO
      </a>
    </div>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true" {...props}>
      <path
        d="M3 8.5l3 3 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <rect x={2} y={3.2} width={12} height={10.5} rx={1.6} fill="none" stroke="currentColor" strokeWidth={1.4} />
      <path d="M2 6.4h12M5 1.8v2.4M11 1.8v2.4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/** Small metadata-box icons — the three field labels are fixed across
 *  every agent (CATEGORY / PLATFORM / DEPLOYMENT), so this switches on
 *  the label rather than needing a per-agent icon key. */
function MetaIcon({ label }: { label: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (label === "CATEGORY") {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
        <path {...common} d="M2 2h5.5L14 8.5 8.5 14 2 7.5V2z" />
        <circle cx={5.2} cy={5.2} r={0.9} fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (label === "PLATFORM") {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
        <rect {...common} x={1.5} y={2.5} width={13} height={8.5} rx={1.2} />
        <path {...common} d="M5.5 14h5M8 11v3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path {...common} d="M4.5 12.5a3 3 0 0 1-.4-5.98A3.6 3.6 0 0 1 11 5.3a2.8 2.8 0 0 1 .6 5.53" />
    </svg>
  );
}

/** Right-edge progress rail — the deck itself only mounts at `lg` and
 *  above (see the doc comment on AIAgents), so there is no narrower
 *  breakpoint left needing a different rail shape here. */
function AgentDots({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="agent-rail" role="tablist" aria-label="Choose an agent">
      {AI_AGENTS.map((agent, i) => (
        <button
          key={agent.id}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`${agent.num} — ${agent.title}`}
          title={agent.title}
          className={i === active ? "agent-rail-dot is-active" : "agent-rail-dot"}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

/** The pinned, scroll-driven curtain — same mechanic as the Hero's
 *  PinnedSlider (continuous scroll→position mapping, eased toward it,
 *  settle-to-nearest on idle), generalised to 8 slides and paired with a
 *  right-edge progress rail (desktop) / bottom dot row (mobile). */
function AgentDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const goToRef = useRef<((index: number) => void) | null>(null);
  const goTo = (index: number) => goToRef.current?.(index);

  useEffect(() => {
    const el = containerRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;

    const panels = Array.from(stage.querySelectorAll<HTMLElement>("[data-agent-slide]"));
    if (panels.length === 0) return;

    let pos = 0;
    let rendered = 0;
    let lastFrame = performance.now();
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastActive = -1;

    const readPos = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      pos = Math.min(panels.length - 1, scrolled / window.innerHeight);
    };

    const tick = () => {
      readPos();
      const now = performance.now();
      const dt = Math.min(MAX_FRAME_S, Math.max(0.001, (now - lastFrame) / 1000));
      lastFrame = now;

      rendered += (pos - rendered) * scrollEase(dt);
      if (Math.abs(pos - rendered) < 0.0006) rendered = pos;

      // A scroll-linked crossfade rather than a horizontal slide: each
      // panel fades/scales/lifts in as `rendered` approaches its index and
      // fades back out past it, so the incoming agent's visual and copy
      // arrive together as a soft dissolve instead of a hard curtain pull.
      panels.forEach((panel, i) => {
        const d = i - rendered;
        const ad = Math.min(Math.abs(d), 1);
        panel.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 1.4));
        panel.style.transform = `translateY(${d * 36}px) scale(${1 - ad * 0.08})`;
        panel.style.filter = ad > 0.02 ? `blur(${ad * 10}px)` : "none";
        panel.style.zIndex = String(Math.round((1 - ad) * 100));
      });

      const nearest = Math.min(panels.length - 1, Math.max(0, Math.round(rendered)));
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }
    };

    const scheduleSettle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const nearest = Math.min(panels.length - 1, Math.max(0, Math.round(pos)));
        if (Math.abs(pos - nearest) > 0.01) goToIndex(nearest);
      }, 160);
    };

    const goToIndex = (index: number) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const clamped = Math.min(panels.length - 1, Math.max(0, index));
      window.scrollTo({ top: top + clamped * window.innerHeight, behavior: "smooth" });
    };
    goToRef.current = goToIndex;

    window.addEventListener("scroll", scheduleSettle, { passive: true });
    const stopLoop = runWhileVisible(el, () => tick(), {
      onStart: () => {
        lastFrame = performance.now();
      },
    });

    return () => {
      stopLoop();
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", scheduleSettle);
      goToRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mt-14 lg:mt-20"
      style={{ height: `${STAGE_SCREENS * 100}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden bg-paper-50">
        {AI_AGENTS.map((agent, i) => (
          <div
            key={agent.id}
            data-agent-slide=""
            aria-hidden={i !== active}
            className={`absolute inset-0 flex h-full w-full flex-col justify-center gap-8 px-6 pb-16 pt-24 will-change-transform lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:px-0 lg:pb-0 lg:pt-0 lg:pr-16 ${
              i === active ? "" : "pointer-events-none"
            }`}
            style={
              i === active
                ? { opacity: 1, transform: "translateY(0) scale(1)", zIndex: 100 }
                : { opacity: 0, transform: `translateY(${(i - active) * 36}px) scale(0.92)`, zIndex: 0 }
            }
          >
            <div className="agent-visual min-h-0 flex-1 lg:flex-none">
              <AgentVisual agent={agent} />
            </div>
            <AgentContent agent={agent} />
          </div>
        ))}

        <AgentDots active={active} onSelect={goTo} />
      </div>
    </div>
  );
}
