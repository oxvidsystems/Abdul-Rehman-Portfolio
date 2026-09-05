/**
 * Per-agent "device frame" mockups — hand-built HTML/CSS interfaces standing
 * in for a screenshot, one per agent type (browser form, CRM dashboard, chat
 * widget, calendar, phone/WhatsApp, timeline, invoice, reporting dashboard).
 *
 * Every name, message and number in here is a generic placeholder
 * (example.com emails, initials-only avatars, round sample numbers) — none
 * of it is a real client, conversation or figure. That is deliberate: these
 * agents run privately inside each client's own tools (see lib/ai-agents.ts),
 * so there is no real screenshot that could honestly stand here. This is an
 * illustration of how the agent behaves, built to look like the real
 * interface it lives in, not a claim that it IS one.
 *
 * The five dashboard-style mockups (Lead Qualification, Appointment
 * Booking, Follow-Up, Quote & Invoice, Business Reporting) share a
 * DashChrome shell — browser address bar + a thin icon sidebar — so they
 * read as an actually-opened piece of software rather than a floating
 * card. Lead Capture keeps its bare browser chrome (it's a public website
 * page, not an internal tool, so a sidebar would be dishonest) and
 * WhatsApp keeps its phone frame (it never lives in a browser tab).
 */

function Dot({ className = "" }: { className?: string }) {
  return <span className={`h-2 w-2 rounded-full ${className}`} />;
}

type NavKey = "grid" | "users" | "calendar" | "chart" | "invoice" | "clock";

function NavIcon({ k }: { k: NavKey }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (k) {
    case "grid":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <rect {...common} x={1.5} y={1.5} width={5.5} height={5.5} rx={1} />
          <rect {...common} x={9} y={1.5} width={5.5} height={5.5} rx={1} />
          <rect {...common} x={1.5} y={9} width={5.5} height={5.5} rx={1} />
          <rect {...common} x={9} y={9} width={5.5} height={5.5} rx={1} />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <circle {...common} cx={8} cy={5.4} r={2.4} />
          <path {...common} d="M2.8 14c.6-3 2.6-4.6 5.2-4.6s4.6 1.6 5.2 4.6" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <rect {...common} x={1.5} y={2.8} width={13} height={11.4} rx={1.3} />
          <path {...common} d="M1.5 6.4h13M4.6 1.4v2.6M11.4 1.4v2.6" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <path {...common} d="M2 14V2M2 14h12" />
          <path {...common} d="M4.6 14V8.4M8 14V5M11.4 14V9.8" strokeWidth={2} />
        </svg>
      );
    case "invoice":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <rect {...common} x={3} y={1.5} width={10} height={13} rx={1.2} />
          <path {...common} d="M5.4 5.2h5.2M5.4 8h5.2M5.4 10.8h3" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 16 16" width="15" height="15">
          <circle {...common} cx={8} cy={8} r={6.3} />
          <path {...common} d="M8 4.6V8l2.6 1.6" />
        </svg>
      );
    default:
      return null;
  }
}

/** Shared browser chrome + thin icon sidebar for the internal-tool
 *  mockups — the visual grammar that makes "a real CRM is open" read
 *  clearly, per the reference this was built against. */
function DashChrome({
  url,
  icons,
  active,
  children,
}: {
  url: string;
  icons: NavKey[];
  active: number;
  children: React.ReactNode;
}) {
  return (
    <div className="agent-frame agent-frame-browser agent-frame-wide">
      <div className="agent-frame-chrome">
        <Dot className="bg-[#e0645c]" />
        <Dot className="bg-[#e0b45c]" />
        <Dot className="bg-[#5cb85c]" />
        <span className="agent-frame-url">{url}</span>
      </div>
      <div className="agent-frame-dash">
        <div className="agent-frame-dash-nav">
          {icons.map((k, i) => (
            <span key={k} className={i === active ? "is-active" : ""}>
              <NavIcon k={k} />
            </span>
          ))}
        </div>
        <div className="agent-frame-dash-body">{children}</div>
      </div>
    </div>
  );
}

export function LeadCaptureMockup() {
  return (
    <div className="agent-frame agent-frame-browser">
      <div className="agent-frame-chrome">
        <Dot className="bg-[#e0645c]" />
        <Dot className="bg-[#e0b45c]" />
        <Dot className="bg-[#5cb85c]" />
        <span className="agent-frame-url">oxvidsystems.com/quote</span>
      </div>
      <div className="agent-frame-body">
        <div className="am-form">
          <p className="am-form-title">Get a quote</p>
          <div className="am-field">
            <span>Full name</span>
            <div className="am-input">Ahmed R.</div>
          </div>
          <div className="am-field">
            <span>Email</span>
            <div className="am-input">ahmed@example.com</div>
          </div>
          <div className="am-field">
            <span>What do you need?</span>
            <div className="am-input am-input-tall">New kitchen cabinets, 3 units</div>
          </div>
          <div className="am-submit">Send enquiry</div>
        </div>
        <div className="am-toast">
          <span className="am-toast-tick">✓</span>
          <div>
            <p className="am-toast-title">New lead captured</p>
            <p className="am-toast-sub">Added to CRM · replied in 4s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadQualificationMockup() {
  return (
    <DashChrome url="app.oxvidsystems.com/crm/leads" icons={["grid", "users", "chart"]} active={1}>
      <div className="am-crm-head">
        <span className="am-avatar">SK</span>
        <div>
          <p className="am-crm-name">Sara K.</p>
          <p className="am-crm-sub">Interior design — enquiry via Instagram</p>
        </div>
        <span className="am-tag am-tag-hot">HOT LEAD</span>
      </div>
      <div className="am-crm-grid">
        <div className="am-crm-cell">
          <span>Budget</span>
          <strong>$8,000&ndash;12,000</strong>
        </div>
        <div className="am-crm-cell">
          <span>Timeline</span>
          <strong>Within 30 days</strong>
        </div>
        <div className="am-crm-cell">
          <span>Intent</span>
          <strong>Ready to book</strong>
        </div>
      </div>
      <div className="am-score">
        <div className="am-score-row">
          <span>Lead score</span>
          <strong>82 / 100</strong>
        </div>
        <div className="am-score-track">
          <span className="am-score-fill" style={{ width: "82%" }} />
        </div>
      </div>
    </DashChrome>
  );
}

export function CustomerSupportMockup() {
  return (
    <div className="agent-frame agent-frame-widget">
      <div className="am-chat-head">
        <span className="am-avatar am-avatar-sm">AI</span>
        <div>
          <p className="am-chat-name">Support</p>
          <p className="am-chat-status">
            <Dot className="bg-accent-mint" /> Online — replies instantly
          </p>
        </div>
      </div>
      <div className="am-chat-body">
        <div className="am-bubble am-bubble-in">Do you deliver on weekends?</div>
        <div className="am-bubble am-bubble-out">
          Yes — weekend delivery is available in your area. Want me to check a
          time for you?
        </div>
        <div className="am-typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export function AppointmentBookingMockup() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <DashChrome url="app.oxvidsystems.com/calendar" icons={["grid", "calendar", "clock"]} active={1}>
      <div className="am-cal-head">
        <p>October 2026</p>
      </div>
      <div className="am-cal-grid">
        {days.map((d) => (
          <span key={d} className={d === 16 ? "am-cal-day am-cal-active" : "am-cal-day"}>
            {d}
          </span>
        ))}
      </div>
      <div className="am-slots">
        <span className="am-slot am-slot-taken">09:00</span>
        <span className="am-slot am-slot-selected">10:00</span>
        <span className="am-slot">11:30</span>
        <span className="am-slot">14:00</span>
      </div>
      <div className="am-toast am-toast-static">
        <span className="am-toast-tick">✓</span>
        <div>
          <p className="am-toast-title">Booked — Thu 16, 10:00 AM</p>
          <p className="am-toast-sub">Confirmation sent automatically</p>
        </div>
      </div>
    </DashChrome>
  );
}

export function WhatsAppMockup() {
  return (
    <div className="agent-frame agent-frame-phone">
      <div className="am-wa-head">
        <span className="am-avatar am-avatar-sm am-avatar-wa">B</span>
        <div>
          <p className="am-wa-name">Business Support</p>
          <p className="am-wa-status">online</p>
        </div>
      </div>
      <div className="am-wa-body">
        <div className="am-wa-bubble am-wa-in">
          Is this available in size M?
          <span className="am-wa-time">10:02</span>
        </div>
        <div className="am-wa-bubble am-wa-out">
          Yes, size M is in stock ✅ Want me to reserve one for you?
          <span className="am-wa-time">10:02 ✓✓</span>
        </div>
        <div className="am-wa-bubble am-wa-in">
          Yes please!
          <span className="am-wa-time">10:03</span>
        </div>
        <div className="am-wa-bubble am-wa-out">
          Reserved for 24 hours — here&rsquo;s your pickup code: <b>OX-4821</b>
          <span className="am-wa-time">10:03 ✓✓</span>
        </div>
      </div>
    </div>
  );
}

export function FollowUpMockup() {
  const items = [
    { d: "Day 1", t: "Enquiry received", done: true },
    { d: "Day 2", t: "Reminder sent — no reply", done: true },
    { d: "Day 4", t: "Follow-up sent", done: true },
    { d: "Day 5", t: "Replied — handed to sales", done: false },
  ];
  return (
    <DashChrome url="app.oxvidsystems.com/sequences" icons={["grid", "users", "clock"]} active={2}>
      <p className="am-form-title">Follow-up sequence</p>
      <div className="am-timeline">
        {items.map((it) => (
          <div className="am-timeline-row" key={it.d}>
            <span className={it.done ? "am-timeline-dot am-timeline-done" : "am-timeline-dot"} />
            <div>
              <p className="am-timeline-d">{it.d}</p>
              <p className="am-timeline-t">{it.t}</p>
            </div>
          </div>
        ))}
      </div>
    </DashChrome>
  );
}

export function QuoteInvoiceMockup() {
  return (
    <DashChrome url="app.oxvidsystems.com/invoices" icons={["grid", "invoice", "chart"]} active={1}>
      <div className="am-inv-head">
        <div>
          <p className="am-inv-num">INVOICE #0148</p>
          <p className="am-inv-sub">Issued automatically on quote acceptance</p>
        </div>
        <span className="am-tag am-tag-paid">PAID</span>
      </div>
      <div className="am-inv-lines">
        <div className="am-inv-line">
          <span>Website redesign — homepage &amp; 4 pages</span>
          <strong>$1,200</strong>
        </div>
        <div className="am-inv-line">
          <span>Hosting setup (12 months)</span>
          <strong>$180</strong>
        </div>
      </div>
      <div className="am-inv-total">
        <span>Total</span>
        <strong>$1,380</strong>
      </div>
    </DashChrome>
  );
}

/** Small radial gauge — the same "circular % readout" the reference
 *  dashboard uses for its headline stat, re-skinned in OXVID's own teal
 *  rather than the reference's blue/purple so the section stays on the
 *  site's own palette. */
function DonutGauge({ pct, label }: { pct: number; label: string }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="am-gauge">
      <svg viewBox="0 0 60 60" width="60" height="60">
        <circle cx={30} cy={30} r={r} fill="none" stroke="var(--color-paper-200)" strokeWidth={6} />
        <circle
          cx={30}
          cy={30}
          r={r}
          fill="none"
          stroke="var(--color-accent-teal)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 30 30)"
        />
        <text x={30} y={34} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-ink-900)">
          {pct}%
        </text>
      </svg>
      <span>{label}</span>
    </div>
  );
}

export function BusinessReportingMockup() {
  const bars = [38, 62, 44, 80, 56, 70, 90];
  return (
    <DashChrome url="app.oxvidsystems.com/reports" icons={["grid", "chart", "users"]} active={1}>
      <div className="am-kpis am-kpis-gauge">
        <DonutGauge pct={100} label="Response rate" />
        <div className="am-kpi">
          <span>Leads this week</span>
          <strong>34</strong>
        </div>
        <div className="am-kpi">
          <span>Bookings</span>
          <strong>11</strong>
        </div>
      </div>
      <div className="am-chart">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </DashChrome>
  );
}
