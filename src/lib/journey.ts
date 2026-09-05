/**
 * STEP 19 — "Career Roadmap": the content of the Experience section.
 *
 * Dates, titles and organisations are exactly as the client supplied them and
 * are never reformatted or re-sorted here. Both lists run chronologically, so
 * the timelines read left to right toward the present.
 */

/** Keys into the icon set in components/journey.tsx. */
export type JourneyIcon =
  | "cap"
  | "mast"
  | "net"
  | "code"
  | "win"
  | "case"
  | "cal"
  | "grid"
  | "stack";

export type Milestone = {
  when: string;
  title: string;
  org: string;
  icon: JourneyIcon;
  /** [chip background, icon] — see the TINTS note below. */
  tint: [string, string];
};

/**
 * The node colours.
 *
 * Not a rainbow: education sits apart in a single warm amber, and the career
 * runs a cool-to-warm ramp — slate blue, steel cyan, sea green, green — that
 * lands on OXVID's own teal at the current role. The colour therefore carries
 * the same message the timeline does, which is that this is a progression
 * toward one place, and the eye finishes where the story does.
 *
 * No purple anywhere: the brief rules out the purple "AI" palette, and these
 * are all held at a similar lightness so none of them shouts over the others.
 * The current role is the exception, and deliberately so: it is the only solid
 * disc, in accent-teal-dark, which is both the emphatic end of the ramp and
 * the only value that gives its white glyph the 3:1 a meaningful graphic needs
 * (#30a696 measured 2.99:1; #1f7a6e measures 5.16:1).
 */

/**
 * RETAINED, NOT RENDERED. The client asked for education to come out of the
 * Career Roadmap; the data is verified and stays here so putting it back is a
 * one-line change in journey.tsx rather than a re-transcription. The matching
 * "3 Academic milestones" figure came out of FIGURES below at the same time —
 * a count of schooling with no schooling on the page is an orphan.
 */
export const EDUCATION: Milestone[] = [
  {
    when: "2004 — 2006",
    title: "Matric (Computer Science)",
    org: "Govt. M C High School, Okara",
    icon: "cap",
    tint: ["#fbf0dd", "#a2731d"],
  },
  {
    when: "2009",
    title: "FSc (Pre-Engineering)",
    org: "Govt. Boys College, Okara",
    icon: "cap",
    tint: ["#fbf0dd", "#a2731d"],
  },
  {
    when: "2011 — 2013",
    title: "BSc Computer Science",
    org: "University of Punjab, Lahore",
    icon: "cap",
    tint: ["#fbf0dd", "#a2731d"],
  },
];

/** Each role carries the mark for the work it actually was — a signal mast for
 *  radio-network monitoring, a topology for network administration, brackets
 *  for the full-stack year, a browser for the frontend years, a case for
 *  running the studio — so the row reads before the words do. */
export const CAREER: Milestone[] = [
  {
    when: "Aug 2012 — Dec 2014",
    title: "OMCR Engineer",
    org: "Mobilink MSc, Lahore",
    icon: "mast",
    tint: ["#e7eef8", "#315f92"],
  },
  {
    when: "Mar 2017 — Nov 2020",
    title: "Network Administrator",
    org: "MaxTel Pvt. Ltd, Okara",
    icon: "net",
    tint: ["#e1eff2", "#1d6d7e"],
  },
  {
    when: "Jan 2021 — Feb 2022",
    title: "Full Stack Developer Intern",
    org: "Nextage Technologies",
    icon: "code",
    tint: ["#e4f1ec", "#2a7a63"],
  },
  {
    when: "Feb 2022 — Oct 2023",
    title: "Frontend Developer",
    org: "Speridian Technologies, Lahore",
    icon: "win",
    tint: ["#e8f3e8", "#35864c"],
  },
  {
    when: "Oct 2023 — Present",
    title: "Founder & Lead Developer",
    org: "OXVID Systems",
    icon: "case",
    tint: ["#1f7a6e", "#ffffff"],
  },
];

/**
 * Core skills, in the client's own wording — nothing here is reworded,
 * expanded or invented.
 *
 * They are grouped rather than listed flat because eleven equal lines is a
 * wall a reader skips; three named families can be taken in at a glance, and
 * the grouping itself says something a list cannot — that this is an organised
 * practice rather than a pile of tools. The families are uneven (4 / 5 / 2)
 * and left that way: the honest shape of the work beats a balanced column.
 *
 * Each family's accent is lifted straight from the timeline nodes overhead —
 * the slate of the first role, the brand teal of the current one, the amber of
 * the education run — so the band reads as part of this section rather than a
 * new palette. The amber is the one adjustment: the node's #a2731d measures
 * 4.02:1 on paper, under the 4.5:1 small TEXT needs, so the label uses its
 * darker cousin at 5.29:1. Slate is 6.32:1 and teal 4.94:1 as they stand.
 */
export type SkillFamily = {
  name: string;
  /** Label and marker colour — see the note above on why these three. */
  tint: string;
  skills: string[];
};

export const SKILL_FAMILIES: SkillFamily[] = [
  {
    name: "Development",
    tint: "#315f92",
    skills: [
      "Web Development (React, Vite, TypeScript)",
      "WordPress & Elementor Development",
      "Database Design (SQL, Sheets, NoSQL)",
      "API Integration & Connectivity",
    ],
  },
  {
    name: "AI & Automation",
    tint: "#1f7a6e",
    skills: [
      "AI Automation & Workflow Orchestration",
      "Multi-Agent System Design",
      "Claude Agent SDK & Anthropic Ecosystem",
      "MCP Server Development",
      "n8n Workflow Automation",
    ],
  },
  {
    name: "Design & Growth",
    tint: "#8a6115",
    skills: ["Brand Identity & UI/UX Design", "SEO & Content Optimization"],
  },
];

/**
 * Visual-emphasis-only lookup — no skill wording above is changed, added
 * to or reworded for this. It just tells journey.tsx which three of the
 * client's own already-listed skills to render with the "core strength"
 * treatment, per the client's explicit request to make AI-paired
 * development (Claude / Anthropic tooling) visibly his standout skill
 * rather than one equal-weight bullet among eleven.
 */
export const CORE_STRENGTH_SKILLS = new Set<string>([
  "Claude Agent SDK & Anthropic Ecosystem",
  "MCP Server Development",
  "Multi-Agent System Design",
]);

export type Figure = {
  icon: JourneyIcon;
  value: string;
  label: string;
  /** brightened for the dark bar — the muted values go grey on ink */
  tint: string;
};

/**
 * Every figure here is countable from data already on this site or supplied by
 * the client. Nothing is estimated and nothing is rounded up with a "+".
 *
 *   2012 — the start of CAREER[0], above.
 *      5 — CAREER.length.
 *     14 — projects in lib/projects.ts that have a live url. If a project is
 *          added there, update this number with it.
 *     11 — the core-skills list the client supplied.
 *
 * The reference this section was built from carried "12+ years" and "50+
 * projects". Neither could be verified: the site states seven years elsewhere,
 * and the Work section lists fourteen live projects, so a visitor could check
 * "50+" and catch it. Both are still open questions with the client — if they
 * confirm real numbers, they belong here.
 */
export const FIGURES: Figure[] = [
  { icon: "cal", value: "2012", label: "First professional role", tint: "#7fa9dd" },
  { icon: "case", value: "5", label: "Professional roles", tint: "#5ec9b6" },
  { icon: "grid", value: "14", label: "Live projects delivered", tint: "#6cc182" },
  { icon: "stack", value: "11", label: "Core technologies", tint: "#5cc0d4" },
];
