/**
 * Internal design-tokens preview / QA page for STEP 02.
 * Not a public site section — renders every token defined in
 * globals.css (@theme) through real Tailwind utility classes so we
 * can visually verify the whole system in one place before any
 * section (Hero, Projects, Chat, etc.) is built on top of it.
 *
 * STEP 17: it is an internal tool on a public route with no crawl
 * directive, so a search engine would have indexed the portfolio's
 * internals alongside the portfolio. It is kept (it is genuinely useful
 * for QA) but told not to be indexed, and robots.txt disallows it too.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const paper = ["paper-0", "paper-50", "paper-100", "paper-200", "paper-300", "paper-400"];
const ink = [
  "ink-950",
  "ink-900",
  "ink-800",
  "ink-700",
  "ink-600",
  "ink-500",
  "ink-400",
  "ink-300",
  "ink-200",
  "ink-100",
];
const accent = [
  "accent-mint",
  "accent-cyan",
  "accent-teal",
  "accent-teal-dark",
  "accent-green",
  "accent-green-dark",
];

const typeScale: { label: string; className: string }[] = [
  { label: "display-1", className: "text-display-1" },
  { label: "display-2", className: "text-display-2" },
  { label: "h1", className: "text-h1" },
  { label: "h2", className: "text-h2" },
  { label: "h3", className: "text-h3" },
  { label: "body-lg", className: "text-body-lg" },
  { label: "body", className: "text-body" },
  { label: "small", className: "text-small" },
  { label: "micro", className: "text-micro" },
];

const spacingScale = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
];

const sectionSpacing = ["section-sm", "section-md", "section-lg"];

const radii = ["none", "xs", "sm", "md", "pill"];

const shadows = ["xs", "sm", "md", "lg", "accent-glow"];

const easings = [
  { label: "out-expo", cls: "ease-out-expo" },
  { label: "in-out-cubic", cls: "ease-in-out-cubic" },
  { label: "out-quart", cls: "ease-out-quart" },
  { label: "spring", cls: "ease-spring" },
];

const durations = [
  { label: "instant · 100ms", cls: "duration-instant" },
  { label: "fast · 200ms", cls: "duration-fast" },
  { label: "base · 400ms", cls: "duration-base" },
  { label: "slow · 700ms", cls: "duration-slow" },
  { label: "cinematic · 1200ms", cls: "duration-cinematic" },
];

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-baseline gap-4 border-b border-ink-200 pb-4">
      <span className="font-mono text-micro tracking-widest text-accent-teal">{n}</span>
      <h2 className="text-h2 font-semibold tracking-tight text-ink-900">{children}</h2>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-[1400px] bg-paper-50 px-6 py-section-md text-ink-900 sm:px-10">
      <header className="mb-section-md">
        <p className="font-mono text-micro tracking-widest uppercase text-accent-teal">
          Internal · QA
        </p>
        <h1 className="text-display-2 font-semibold tracking-tight">Design System</h1>
        <p className="mt-4 max-w-2xl text-body-lg text-ink-500">
          Every color, type size, spacing step, radius, shadow and motion token
          available to every future section of this site. 70% light / 30%
          green-teal-cyan family (dark brand surface + accents together).
        </p>
      </header>

      {/* COLOR */}
      <section className="mb-section-lg">
        <SectionTitle n="01">Color</SectionTitle>

        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Paper — light surfaces (~70%)
        </p>
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {paper.map((c) => (
            <div key={c} className="overflow-hidden border border-ink-200">
              <div className={`h-20 bg-${c}`} />
              <p className="p-2 font-mono text-micro text-ink-500">{c}</p>
            </div>
          ))}
        </div>

        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Ink — OXVID dark green (~30% combined with accent below)
        </p>
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ink.map((c) => (
            <div key={c} className="overflow-hidden border border-ink-200">
              <div className={`h-20 bg-${c}`} />
              <p className="p-2 font-mono text-micro text-ink-500">{c}</p>
            </div>
          ))}
        </div>

        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Accent — green / teal / cyan (~30% combined with ink above)
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {accent.map((c) => (
            <div key={c} className="overflow-hidden border border-ink-200">
              <div className={`h-20 bg-${c}`} />
              <p className="p-2 font-mono text-micro text-ink-500">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="mb-section-lg">
        <SectionTitle n="02">Typography</SectionTitle>
        <div className="space-y-6">
          {typeScale.map((t) => (
            <div key={t.label} className="flex flex-col gap-1 border-b border-ink-100 pb-4">
              <span className="font-mono text-micro text-accent-teal">{t.label}</span>
              <span className={`${t.className} font-semibold tracking-tight text-ink-900`}>
                Abdul Rehman — OXVID Systems
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SPACING */}
      <section className="mb-section-lg">
        <SectionTitle n="03">Spacing</SectionTitle>
        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">Base scale</p>
        <div className="mb-10 space-y-2">
          {spacingScale.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-10 font-mono text-micro text-ink-500">{s}</span>
              <div className={`h-3 bg-accent-teal p-${s}`} />
            </div>
          ))}
        </div>
        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Named section rhythm
        </p>
        <div className="space-y-2">
          {sectionSpacing.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-28 font-mono text-micro text-ink-500">{s}</span>
              <div className={`h-3 bg-ink-700 p-${s}`} />
            </div>
          ))}
        </div>
      </section>

      {/* BORDERS */}
      <section className="mb-section-lg">
        <SectionTitle n="04">Borders</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {radii.map((r) => (
            <div key={r} className="flex flex-col items-center gap-2">
              <div className={`h-20 w-20 rounded-${r} border-2 border-ink-700 bg-paper-0`} />
              <span className="font-mono text-micro text-ink-500">rounded-{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHADOWS */}
      <section className="mb-section-lg">
        <SectionTitle n="05">Shadows</SectionTitle>
        <div className="grid grid-cols-2 gap-8 bg-paper-100 p-8 sm:grid-cols-5">
          {shadows.map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className={`h-20 w-20 bg-paper-0 shadow-${s}`} />
              <span className="font-mono text-micro text-ink-500">shadow-{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MOTION */}
      <section className="mb-section-lg">
        <SectionTitle n="06">Motion</SectionTitle>
        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Easing (hover each box)
        </p>
        <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {easings.map((e) => (
            <div key={e.label} className="group h-20 w-full border border-ink-200 bg-paper-0">
              <div
                className={`h-full w-1/4 bg-accent-teal ${e.cls} duration-slow group-hover:w-full`}
              />
              <span className="mt-2 block font-mono text-micro text-ink-500">{e.label}</span>
            </div>
          ))}
        </div>
        <p className="mb-4 text-small tracking-wide uppercase text-ink-500">
          Duration (hover each box)
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {durations.map((d) => (
            <div key={d.label} className="group h-20 w-full border border-ink-200 bg-paper-0">
              <div
                className={`h-full w-1/4 bg-accent-green ease-out-expo ${d.cls} group-hover:w-full`}
              />
              <span className="mt-2 block font-mono text-micro text-ink-500">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BREAKPOINTS */}
      <section>
        <SectionTitle n="07">Breakpoints</SectionTitle>
        <div className="border border-dashed border-accent-teal p-8 text-center">
          <p className="text-h3 font-semibold text-ink-900">
            Current breakpoint:
            <span className="ml-2 xs:hidden">
              base (&lt;375px)
            </span>
            <span className="ml-2 hidden xs:inline sm:hidden text-accent-teal">xs (375px+)</span>
            <span className="ml-2 hidden sm:inline md:hidden text-accent-teal">sm (640px+)</span>
            <span className="ml-2 hidden md:inline lg:hidden text-accent-teal">md (768px+)</span>
            <span className="ml-2 hidden lg:inline xl:hidden text-accent-teal">
              lg (1024px+) — left-nav layout begins
            </span>
            <span className="ml-2 hidden xl:inline 2xl:hidden text-accent-teal">xl (1280px+)</span>
            <span className="ml-2 hidden 2xl:inline 3xl:hidden text-accent-teal">
              2xl (1536px+)
            </span>
            <span className="ml-2 hidden 3xl:inline text-accent-teal">3xl (1920px+)</span>
          </p>
          <p className="mt-2 text-small text-ink-500">Resize the window to test.</p>
        </div>
      </section>
    </main>
  );
}
