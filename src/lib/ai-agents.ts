/**
 * AI Agents & Automation — a capability showcase, not a client-project
 * list like PROJECTS in projects.ts.
 *
 * Why this is a SEPARATE, differently-framed section rather than another
 * row in "Completed Projects": every entry in PROJECTS carries a real,
 * working, public URL a visitor can click and verify right now. An AI
 * agent is not that kind of deliverable — it lives inside a client's own
 * WhatsApp number, CRM, inbox or dashboard, so there is no public URL to
 * hand out, ever, for this category of work. `deployment`/`metadata`
 * below describe the real kind of system each agent runs in, honestly,
 * without inventing a client name, logo, testimonial or "live link" to
 * something that was never public.
 *
 * A note on the numbers that don't appear here: an earlier draft of this
 * section (matching a client-supplied reference) carried floating stat
 * boxes like "1,240+ leads captured" and "+38% response rate". Those are
 * measured-outcome numbers with no real client behind them to measure —
 * displaying them would misrepresent unbuilt/undelivered work as proven
 * results, which the project brief explicitly rules out ("never fabricate
 * ... unverified business outcomes/metrics"). Every `stats` value below is
 * a qualitative capability claim instead (Instant, 24/7, Automated) — true
 * of any correctly built agent of that kind, not a specific invented
 * measurement.
 */

export type AgentIconKey =
  | "form"
  | "capture"
  | "profile"
  | "score"
  | "chat-q"
  | "chat-check"
  | "calendar"
  | "calendar-check"
  | "whatsapp"
  | "double-tick"
  | "clock"
  | "send"
  | "invoice"
  | "cash"
  | "stack"
  | "chart";

export type MetaField = { label: string; value: string };
export type StatChip = { label: string; value: string };

export type AiAgent = {
  id: string;
  num: string;
  solution: string;
  title: string;
  shortLabel: string;
  description: string;
  metadata: [MetaField, MetaField, MetaField];
  features: string[];
  stats: [StatChip, StatChip, StatChip];
  leftIcon: AgentIconKey;
  rightIcon: AgentIconKey;
  /** Trigger → agent action → result, in three short phrases. */
  steps: [string, string, string];
  deployment: string;
};

export const AI_AGENT_CATEGORY = "AI AGENT";

export const AI_AGENTS: AiAgent[] = [
  {
    id: "lead-capture",
    num: "01",
    solution: "Solution #201",
    title: "Lead Capture Agent",
    shortLabel: "Lead Capture",
    description:
      "An AI-powered lead capture agent that engages website visitors, collects qualified contact details, understands their intent, and sends every lead directly into the right workflow.",
    metadata: [
      { label: "CATEGORY", value: "Lead Generation" },
      { label: "PLATFORM", value: "Web / WhatsApp" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "Instant visitor engagement",
      "Lead form automation",
      "Intent detection",
      "CRM synchronization",
      "24/7 lead capture",
      "Email verification",
    ],
    stats: [
      { label: "NEW LEADS", value: "Every enquiry" },
      { label: "RESPONSE TIME", value: "Instant" },
      { label: "CRM SYNC", value: "Automated" },
    ],
    leftIcon: "form",
    rightIcon: "capture",
    steps: [
      "Someone submits a website form, DM or ad enquiry",
      "Agent reads it, replies instantly and logs every field",
      "Lead lands in the CRM tagged and ready to work",
    ],
    deployment: "Website form → CRM",
  },
  {
    id: "lead-qualification",
    num: "02",
    solution: "Solution #202",
    title: "Lead Qualification Agent",
    shortLabel: "Lead Qualification",
    description:
      "An intelligent qualification agent that asks the right questions, understands customer requirements, scores prospects, and routes high-value opportunities to the sales team.",
    metadata: [
      { label: "CATEGORY", value: "Sales Automation" },
      { label: "PLATFORM", value: "Web / CRM" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "Lead scoring",
      "Smart qualification",
      "Intent analysis",
      "CRM routing",
      "Priority detection",
      "Sales notifications",
    ],
    stats: [
      { label: "SCORING", value: "AI-based" },
      { label: "LEAD RANKING", value: "Automatic" },
      { label: "ROUTING", value: "Automatic" },
    ],
    leftIcon: "profile",
    rightIcon: "score",
    steps: [
      "New lead enters the pipeline",
      "Agent asks budget, timeline and intent, then scores it",
      "Sales sees a ranked list — hot leads first",
    ],
    deployment: "CRM pipeline",
  },
  {
    id: "customer-support",
    num: "03",
    solution: "Solution #203",
    title: "Customer Support Agent",
    shortLabel: "Customer Support",
    description:
      "A 24/7 AI support agent that answers customer questions, understands conversations, resolves common issues, and escalates complex requests when human assistance is required.",
    metadata: [
      { label: "CATEGORY", value: "Customer Experience" },
      { label: "PLATFORM", value: "Web / Chat" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "24/7 support",
      "Knowledge base",
      "Smart responses",
      "Ticket creation",
      "Human escalation",
      "Conversation history",
    ],
    stats: [
      { label: "AVAILABILITY", value: "24/7" },
      { label: "RESPONSE TIME", value: "Instant" },
      { label: "ESCALATION", value: "Automatic" },
    ],
    leftIcon: "chat-q",
    rightIcon: "chat-check",
    steps: [
      "A visitor asks a common question, any hour",
      "Agent answers from the business's own FAQs and docs",
      "Anything it can't resolve is handed to a human, with context",
    ],
    deployment: "Live chat / inbox",
  },
  {
    id: "appointment-booking",
    num: "04",
    solution: "Solution #204",
    title: "Appointment Booking Agent",
    shortLabel: "Appointment Booking",
    description:
      "An AI booking agent that communicates with customers, understands their preferred schedule, checks availability, books appointments, and sends automatic confirmations and reminders.",
    metadata: [
      { label: "CATEGORY", value: "Scheduling Automation" },
      { label: "PLATFORM", value: "Web / WhatsApp" },
      { label: "DEPLOYMENT", value: "Cloud / Calendar API" },
    ],
    features: [
      "Calendar integration",
      "Appointment booking",
      "Availability detection",
      "Automatic reminders",
      "Rescheduling",
      "Confirmation messages",
    ],
    stats: [
      { label: "BOOKING", value: "Automated" },
      { label: "REMINDERS", value: "24/7" },
      { label: "CONFIRMATION", value: "Instant" },
    ],
    leftIcon: "calendar",
    rightIcon: "calendar-check",
    steps: [
      "Customer asks to book a time",
      "Agent checks the real calendar for an open slot",
      "Slot is booked and a confirmation goes out automatically",
    ],
    deployment: "Calendar sync",
  },
  {
    id: "whatsapp-agent",
    num: "05",
    solution: "Solution #205",
    title: "WhatsApp AI Agent",
    shortLabel: "WhatsApp Automation",
    description:
      "A conversational WhatsApp AI agent that handles customer conversations, answers questions, captures leads, provides updates, and triggers business workflows automatically.",
    metadata: [
      { label: "CATEGORY", value: "Conversational AI" },
      { label: "PLATFORM", value: "WhatsApp / Web" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "AI conversations",
      "Lead capture",
      "Customer support",
      "Automated replies",
      "Workflow triggers",
      "Human handoff",
    ],
    stats: [
      { label: "MESSAGES", value: "24/7" },
      { label: "RESPONSE", value: "Instant" },
      { label: "HANDOFF", value: "Smart" },
    ],
    leftIcon: "whatsapp",
    rightIcon: "double-tick",
    steps: [
      "A customer messages the business's WhatsApp number",
      "Agent replies in real time, in that same chat",
      "Qualified conversations are routed to the right person",
    ],
    deployment: "Private client WhatsApp number",
  },
  {
    id: "follow-up",
    num: "06",
    solution: "Solution #206",
    title: "Follow-Up Agent",
    shortLabel: "Lead Follow-Up",
    description:
      "An automated follow-up agent that keeps conversations alive, remembers previous interactions, sends personalized follow-ups, and helps businesses recover missed opportunities.",
    metadata: [
      { label: "CATEGORY", value: "Sales Automation" },
      { label: "PLATFORM", value: "Email / WhatsApp" },
      { label: "DEPLOYMENT", value: "Cloud / CRM" },
    ],
    features: [
      "Automatic follow-ups",
      "Personalized messages",
      "Lead re-engagement",
      "CRM tracking",
      "Smart timing",
      "Conversation memory",
    ],
    stats: [
      { label: "FOLLOW-UPS", value: "Automated" },
      { label: "TIMING", value: "Scheduled" },
      { label: "MISSED LEADS", value: "Re-engaged" },
    ],
    leftIcon: "clock",
    rightIcon: "send",
    steps: [
      "A lead goes quiet after the first reply",
      "Agent sends timed check-ins on a set schedule",
      "Sequence stops the moment they reply, or after the last step",
    ],
    deployment: "Email / WhatsApp sequence",
  },
  {
    id: "quote-invoice",
    num: "07",
    solution: "Solution #207",
    title: "Quote & Invoice Agent",
    shortLabel: "Finance Automation",
    description:
      "An AI-powered finance assistant that prepares quotations, generates invoices, follows up on pending payments, and keeps customers updated automatically.",
    metadata: [
      { label: "CATEGORY", value: "Business Automation" },
      { label: "PLATFORM", value: "Web / Email" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "Quote generation",
      "Invoice creation",
      "Payment follow-up",
      "Customer notifications",
      "Document automation",
      "Record synchronization",
    ],
    stats: [
      { label: "QUOTES", value: "Auto-generated" },
      { label: "INVOICES", value: "Automated" },
      { label: "FOLLOW-UP", value: "Scheduled" },
    ],
    leftIcon: "invoice",
    rightIcon: "cash",
    steps: [
      "A quote is accepted",
      "Agent generates the invoice and sends it",
      "Unpaid invoices get an automatic payment reminder",
    ],
    deployment: "Invoicing tool",
  },
  {
    id: "business-reporting",
    num: "08",
    solution: "Solution #208",
    title: "Business Reporting Agent",
    shortLabel: "Business Intelligence",
    description:
      "An AI reporting agent that collects business data, analyzes performance, generates reports, identifies important trends, and delivers actionable insights automatically.",
    metadata: [
      { label: "CATEGORY", value: "Business Intelligence" },
      { label: "PLATFORM", value: "Web / Dashboard" },
      { label: "DEPLOYMENT", value: "Cloud / API" },
    ],
    features: [
      "Automated reports",
      "Data analysis",
      "KPI monitoring",
      "Trend detection",
      "Daily summaries",
      "Management insights",
    ],
    stats: [
      { label: "REPORTS", value: "Daily" },
      { label: "DATA SOURCES", value: "Connected tools" },
      { label: "INSIGHTS", value: "AI-generated" },
    ],
    leftIcon: "stack",
    rightIcon: "chart",
    steps: [
      "Reporting day arrives (daily, weekly or monthly)",
      "Agent pulls the numbers from every connected tool",
      "Owner gets one plain-language summary, not a spreadsheet",
    ],
    deployment: "Owner's dashboard",
  },
];

export const AI_AGENT_COUNT = AI_AGENTS.length;
