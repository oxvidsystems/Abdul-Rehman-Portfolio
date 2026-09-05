/**
 * The real OXVID service disciplines — single source of truth for BOTH
 * the About section's short discipline list and the Expertise section's
 * full chapters, so the numbering can never drift between them (it did
 * once: About briefly listed them in a different order than the brief's
 * canonical order).
 *
 * The original five (now six, see below) are exactly as specified in the
 * project brief. That copy is transcribed from the client's own supplied
 * service reference images — nothing in those five is invented. The
 * reference images themselves are phone screenshots of social posts
 * (status bar, Boost/Share chrome, and placeholder brand mock-ups like
 * "AVANTÉ SOLUTIONS"), so they're used as the *source of the wording*
 * only; the on-page artwork is drawn from scratch in the OXVID visual
 * language rather than embedding those screenshots, which would put
 * fabricated client branding on a real portfolio.
 *
 * "Claude & Anthropic AI Development" (num 02) is the one entry NOT from
 * those reference images — added 2026-09-05 at the client's own explicit
 * request, to name his Claude/Anthropic-ecosystem expertise as its own
 * discipline rather than folding it into "AI Agents & Automation" (which
 * stays focused on the client-facing automation product: WhatsApp, CRM,
 * workflows). Its claims are the same standard as everywhere else on the
 * site: real, checkable skills, no invented clients or metrics.
 */

export type Service = {
  num: string;
  /** Short label — used by About's discipline list and the Expertise rail. */
  label: string;
  /** Headline as shown on the Expertise chapter. */
  title: string;
  /** Short line from the reference art. */
  tagline: string;
  /** One-paragraph description. */
  body: string;
  /** Deliverables checklist. */
  features: string[];
  /** The four supporting pillars shown as small stats. */
  pillars: string[];
  /** Which artwork component to render. */
  art: "web" | "claude" | "content" | "automation" | "brand" | "seo";
  /** Dark chapters are used sparingly — light stays dominant. */
  tone: "light" | "dark";
};

export const SERVICES: Service[] = [
  {
    num: "01",
    label: "Custom Web Development",
    title: "Custom Web Development",
    tagline: "Building fast, secure & responsive websites tailored to your business.",
    body: "Professional website development tailored to your business needs. We build fast, secure, and fully responsive websites using WordPress, Elementor, and React.",
    features: [
      "Business Websites",
      "E-commerce Stores",
      "Portfolio & Landing Pages",
      "Mobile Responsive Design",
      "Speed Optimization",
    ],
    pillars: ["Fast Performance", "Secure Code", "Responsive Design", "SEO Friendly"],
    art: "web",
    tone: "light",
  },
  {
    num: "02",
    label: "Claude & Anthropic AI Development",
    title: "Claude & Anthropic AI Development",
    tagline: "Build with Claude. Ship faster. Without cutting corners.",
    body: "Hands-on expertise across Anthropic's Claude ecosystem — Claude Agent SDK, MCP servers and full multi-agent systems — used to design, build and ship everything on this site, including the AI agent solutions in Work, frontend and backend both.",
    features: [
      "Claude Agent SDK Development",
      "MCP (Model Context Protocol) Servers",
      "Multi-Agent System Design",
      "AI-Paired Full-Stack Development",
      "Custom Claude-Powered Tools & Agents",
    ],
    pillars: ["Claude Agent SDK", "MCP Protocol", "Multi-Agent Systems", "AI-Paired Development"],
    art: "claude",
    tone: "light",
  },
  {
    num: "03",
    label: "Professional Content Writing",
    title: "Professional Content Writing",
    tagline: "Words that connect. Content that converts.",
    body: "High-quality content writing services tailored for websites, marketing, and business growth. We create clear, engaging, and professional content designed to attract customers and improve online presence.",
    features: [
      "Website Content",
      "Landing Page Copy",
      "SEO Content Writing",
      "Product & Service Descriptions",
      "Marketing & Promotional Content",
    ],
    pillars: ["SEO Focused", "Engaging Content", "Original & Quality", "Better Results"],
    art: "content",
    tone: "light",
  },
  {
    num: "04",
    label: "AI Agents & Automation",
    title: "AI Agents & Automation",
    tagline: "Automate workflows. Save time. Scale smarter with AI agents.",
    body: "Automate your business processes and save time with smart automation systems. We create efficient workflows to manage leads, customers, and daily operations.",
    features: [
      "WhatsApp Automation",
      "CRM Integration",
      "Lead Management Systems",
      "Workflow Automation",
      "Email & Notification Systems",
    ],
    pillars: ["AI Agents", "Workflow Automation", "200+ Integrations", "Reliable & Secure"],
    art: "automation",
    // The one deliberately dark chapter — the section's "signature
    // contrast" moment, and the discipline whose own reference art is
    // the most technical. Light stays dominant across the other three.
    tone: "dark",
  },
  {
    num: "05",
    label: "Brand Identity & Creative Design",
    title: "Brand Identity & Creative Design",
    tagline: "Build a brand that stands out. Create trust. Inspire loyalty.",
    body: "Build a strong and professional brand identity for your business. We create modern branding solutions that help businesses stand out and build trust online.",
    features: [
      "Logo Design",
      "Brand Guidelines",
      "Social Media Branding",
      "Business Visual Identity",
      "Modern & Professional Design Style",
    ],
    pillars: ["Unique Branding", "Build Trust", "Consistent Identity", "Long-Term Value"],
    art: "brand",
    tone: "light",
  },
  {
    num: "06",
    label: "Complete SEO Solutions",
    title: "Complete SEO Solutions",
    tagline: "Rank higher. Get found. Grow organically.",
    body: "End-to-end search engine optimization to improve your website's visibility and rankings. We handle both on-page and off-page SEO so the right customers can find your business on Google.",
    features: [
      "On-Page SEO (titles, meta tags, headings, content optimization)",
      "Off-Page SEO & Quality Link Building",
      "Keyword Research & Strategy",
      "Technical SEO & Site Speed Audits",
      "Local SEO & Google Business Profile Optimization",
      "Monthly Rank Tracking & Reports",
    ],
    pillars: ["Higher Rankings", "Organic Traffic Growth", "On-Page & Off-Page", "Data-Driven Strategy"],
    art: "seo",
    tone: "light",
  },
];
