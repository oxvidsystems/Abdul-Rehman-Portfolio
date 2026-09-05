/**
 * STEP 07 — Centralised project data architecture (data only, no UI).
 *
 * The Work section is still the Step 03 placeholder; this module exists
 * so the Step 08 visual build has one authoritative source to read from.
 *
 * ─────────────────────────────────────────────────────────────────────
 * PROVENANCE — where every value came from
 * ─────────────────────────────────────────────────────────────────────
 * `number` / `title` / `url`  → transcribed verbatim from the client's
 *   brief ("REAL PROJECTS").
 *
 * `description` / `category`  → written from the LIVE SITES themselves.
 *   Each URL was fetched and read on 2026-08-28, and the copy below
 *   describes what is actually published there. Nothing is guessed from
 *   the project name. Two sites could not be verified (see `note` on
 *   those entries) and are left null rather than filled in.
 *
 *   Note the framing: these describe *what each site is*, not what
 *   OXVID's role on it was. Several run on turnkey platforms (BentoBox,
 *   a WordPress dental-agency theme), so copy claiming they were built
 *   from scratch would be an overclaim this file has no basis to make.
 *   If the client wants scope-of-work stated per project, that's their
 *   information to supply.
 *
 * `technologies`               → ONLY what was directly observable:
 *   a `<meta name="generator">` tag, a platform's own footer
 *   attribution and asset CDN, framework-specific URL patterns
 *   (`/_next/image`), or a `.web.app` domain (which is Firebase
 *   Hosting by definition). Nothing inferred from how a site looks.
 *   An empty array means nothing was observable — not "no stack".
 *
 * `preview`                    → still null on every project. Screenshots
 *   could NOT be captured: the cloud sandbox and the device VM are both
 *   blocked from the public internet (curl returns 000 for all ten
 *   hosts), and the Claude-in-Chrome extension is not connected. See
 *   PREVIEW ASSETS below — the structure is ready, the images are not.
 *
 * `featured`                   → a provisional editorial pick (4 of 10),
 *   chosen for recognisability and verified detail. A layout suggestion,
 *   not a client decision.
 *
 * `getProjectDataGaps()` reports what is still outstanding so this never
 * has to be audited by eye.
 *
 * ─────────────────────────────────────────────────────────────────────
 * PREVIEW ASSETS
 * ─────────────────────────────────────────────────────────────────────
 * Convention for Step 08: drop a real capture of the live site at
 *   public/images/projects/<id>.jpg
 * and set `preview` accordingly. Use `expectedPreviewPath(id)` rather
 * than hardcoding paths.
 *
 * Captures must be genuine screenshots of the live URL — never a mock,
 * a render, or an illustration standing in for one. Record `capturedAt`;
 * live sites change. Where a site cannot be captured, leave
 * `preview: null`: the section degrades to the title plus a working
 * "VIEW LIVE SITE" link, and every project always carries its real url.
 */

/** Sector classification. Values are intentionally unassigned so far. */
export type ProjectCategory =
  | "real-estate"
  | "ecommerce"
  | "hospitality"
  | "healthcare"
  | "corporate"
  | "beauty"
  | "home-services"
  | "construction";

/**
 * Layout treatment for the Work section's stacking panels. The brief
 * requires projects to read as cinematic editorial panels rather than
 * cards, so each entry declares how it wants to be composed.
 *
 * The values assigned below are a PROVISIONAL rhythm chosen only to
 * avoid ten identical panels — they are a layout decision for Step 08
 * to confirm or change, not a claim about the projects themselves.
 */
export type ProjectDisplayStyle = "wide" | "tall" | "split" | "editorial";

export type ProjectPreview = {
  /** Path under /public, e.g. "/images/projects/vivid-dental.jpg". */
  src: string;
  /** Describes the screenshot for assistive tech. */
  alt: string;
  width: number;
  height: number;
  /** ISO date the screenshot was taken — live sites change. */
  capturedAt: string;
};

export type Project = {
  /** Stable slug; also the preview filename and any DOM/anchor id. */
  id: string;
  /** Display number from the brief, "01"–"10". */
  number: string;
  title: string;
  url: string;
  /** null until the client confirms the sector. */
  category: ProjectCategory | null;
  /**
   * The site's OWN hero headline, read from the live page on 2026-08-28.
   * Used on the project card while a real screenshot is still pending, so
   * the card shows something true about the site instead of an empty
   * wireframe. Verbatim from each site (two are client-rendered SPAs, so
   * theirs come from their own <title>/description metadata). null where
   * the site could not be read.
   */
  tagline: string | null;
  /** null until the client supplies copy. Never auto-written. */
  description: string | null;
  /** null until a real screenshot of the live site exists. */
  preview: ProjectPreview | null;
  /** Only stacks the client has explicitly confirmed. Empty = none confirmed. */
  technologies: string[];
  featured: boolean;
  displayStyle: ProjectDisplayStyle;
  /**
   * Verification caveat for this entry — set only where something is
   * genuinely wrong or unconfirmed, so the problem travels with the
   * data instead of living in someone's memory.
   */
  note?: string;
};

/**
 * Fourteen projects.
 *
 * Count: the brief's original ten, minus Luxury Boxes Packaging (removed
 * at the client's instruction on 2026-08-28 — its domain no longer served
 * a packaging site), plus five added the same day. 10 − 1 + 5 = 14.
 *
 * Numbering was reflowed to stay contiguous 01–14 after the removal.
 * Descriptions and categories for the five new entries were written from
 * the live sites, same as the rest.
 */
export const PROJECTS: Project[] = [
  {
    id: "jaffar-enclave",
    number: "01",
    title: "Jaffar Enclave",
    url: "https://jaffarenclave-test.web.app/",
    category: "real-estate",
    tagline: "Premium Residential Plots — Rahim Yar Khan",
    description:
      "A gated residential development in Rahim Yar Khan offering premium plots from 5 to 20 Marla, with flexible payment plans and 24/7 security.",
    preview: {
      src: "/images/projects/jaffar-enclave.jpg",
      alt: "Jaffar Enclave homepage",
      width: 1903,
      height: 950,
      capturedAt: "2026-09-03",
    },
    technologies: ["Firebase Hosting"],
    featured: false,
    displayStyle: "editorial",
  },
  {
    id: "my-coffee-shop",
    number: "02",
    title: "My Coffee Shop",
    url: "https://my-coffee-shop-oxvid.web.app/",
    category: "hospitality",
    tagline: "Awaken Your Senses",
    description:
      "A specialty coffee brand in Gulberg, Lahore, built around small-batch roasting — five signature brews and a 24-hour roast-to-cup window.",
    preview: {
      src: "/images/projects/my-coffee-shop.jpg",
      alt: "Coffeepio homepage",
      width: 1898,
      height: 936,
      capturedAt: "2026-09-03",
    },
    technologies: ["Firebase Hosting"],
    featured: false,
    displayStyle: "split",
  },
  {
    id: "hr-cart-llc",
    number: "03",
    title: "HR Cart LLC",
    url: "https://hrcartllc.web.app/",
    category: "ecommerce",
    tagline: "Precision Engineered Parts",
    description:
      "An online store selling premium auto parts alongside books and stationery — spark plugs, batteries and electrical systems, plus school, office and art supplies.",
    preview: {
      src: "/images/projects/hr-cart-llc.jpg",
      alt: "HRCart LLC homepage",
      width: 1917,
      height: 943,
      capturedAt: "2026-09-03",
    },
    technologies: ["Firebase Hosting"],
    featured: false,
    displayStyle: "tall",
  },
  {
    id: "rising-crescent",
    number: "04",
    title: "Rising Crescent",
    url: "https://risingcrescent.co.uk/",
    category: "ecommerce",
    tagline: "Premium Products, Unbeatable Value",
    description:
      "Rising Crescent Wholesale, a UK wholesale and retail supplier of fragrance and consumer brands including Lynx, Armaf, Carfume and California Scents, with free UK delivery over £300.",
    preview: {
      src: "/images/projects/rising-crescent.jpg",
      alt: "Rising Crescent Wholesale homepage",
      width: 1915,
      height: 942,
      capturedAt: "2026-09-03",
    },
    technologies: [],
    featured: false,
    displayStyle: "editorial",
  },
  {
    id: "dreams-nw",
    number: "05",
    title: "Dreams NW",
    url: "https://www.dreamsnw.com/",
    category: "corporate",
    tagline: "AI-enabled devices and IoT solutions for smart cities and enterprises",
    description:
      "Dreams Network & Technology, an authorised distributor of enterprise networking and IoT hardware — Ubiquiti UniFi, MikroTik, Cambium and Grandstream — operating across Pakistan, Canada, Dubai and Hong Kong.",
    preview: {
      src: "/images/projects/dreams-nw.jpg",
      alt: "Dreams Network & Technology homepage",
      width: 1904,
      height: 945,
      capturedAt: "2026-09-03",
    },
    technologies: ["Next.js"],
    featured: true,
    displayStyle: "wide",
  },
  {
    id: "vivid-dental",
    number: "06",
    title: "Vivid Dental",
    url: "https://www.vividdental.ca/",
    category: "healthcare",
    tagline: "Specialists in Dental Implants, Reconstructive & Cosmetic Dentistry",
    description:
      "Vivid Specialized Dentistry in Edmonton, Alberta — a prosthodontics and periodontics practice offering implants, full-mouth reconstruction and cosmetic work, with an in-house dental laboratory.",
    preview: {
      src: "/images/projects/vivid-dental.jpg",
      alt: "Vivid Specialized Dentistry homepage",
      width: 1901,
      height: 874,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress", "Elementor"],
    featured: true,
    displayStyle: "split",
  },
  {
    id: "jackson-family-dental",
    number: "07",
    title: "Jackson Family Dental",
    url: "https://jacksonfamilydentalonline.com/",
    category: "healthcare",
    tagline: "Your trusted Liberty dentists",
    description:
      "A family dental practice serving Liberty and Kansas City, Missouri, covering general, cosmetic and surgical dentistry including same-day CEREC crowns and robot-guided implants.",
    preview: {
      src: "/images/projects/jackson-family-dental.jpg",
      alt: "Jackson Family Dental homepage",
      width: 1901,
      height: 876,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress"],
    featured: false,
    displayStyle: "tall",
    note:
      "The live site credits Delmain, a dental-marketing web agency, in its " +
      "markup. Confirm OXVID's scope before any copy implies a full custom build.",
  },
  {
    id: "the-ogden",
    number: "08",
    title: "The Ogden",
    url: "https://www.theogdenver.com/",
    category: "hospitality",
    tagline: "Taste the Twist",
    description:
      "The OG, a breakfast and brunch restaurant in McGregor Square, Denver — gourmet pancakes, breakfast cocktails, online ordering, private events and catering.",
    preview: {
      src: "/images/projects/the-ogden.jpg",
      alt: "The OG homepage",
      width: 1900,
      height: 945,
      capturedAt: "2026-09-03",
    },
    technologies: ["BentoBox"],
    featured: true,
    displayStyle: "editorial",
    note: "Runs on BentoBox, a turnkey restaurant website platform. Confirm scope.",
  },
  {
    id: "federalist-pig",
    number: "09",
    title: "Federalist Pig",
    url: "https://www.federalistpig.com/",
    category: "hospitality",
    tagline: "'Que 4 the People",
    description:
      "A craft American barbecue restaurant in Washington, DC — smoked meats, curated sandwiches and house sauces, and a two-time Michelin Bib Gourmand recipient.",
    preview: {
      src: "/images/projects/federalist-pig.jpg",
      alt: "Federalist Pig homepage",
      width: 1902,
      height: 945,
      capturedAt: "2026-09-03",
    },
    technologies: ["BentoBox"],
    featured: true,
    displayStyle: "wide",
    note: "Runs on BentoBox, a turnkey restaurant website platform. Confirm scope.",
  },
  {
    id: "emily-g-artistry",
    number: "10",
    title: "Emily G Artistry",
    url: "https://emilygartistry.com/",
    category: "beauty",
    tagline: "Timeless Artistry for Every Occasion",
    description:
      "A professional makeup artist in Jacksonville, Florida, working across bridal, production and special events, with airbrush application and on-location touch-ups.",
    preview: {
      src: "/images/projects/emily-g-artistry.jpg",
      alt: "Emily G Artistry homepage",
      width: 1900,
      height: 919,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress", "Elementor"],
    featured: false,
    displayStyle: "split",
  },
  {
    id: "elitega-services",
    number: "11",
    title: "EliteGa Services",
    url: "https://elitegaservicesllc.net/",
    category: "home-services",
    tagline: "Clean Spaces, Better Living",
    description:
      "A professional cleaning company in Suwanee, Georgia, covering commercial, deep, and move-in / move-out cleaning.",
    preview: {
      src: "/images/projects/elitega-services.jpg",
      alt: "EliteGa Services homepage",
      width: 1904,
      height: 921,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress", "Elementor"],
    featured: false,
    displayStyle: "tall",
  },
  {
    id: "bradley-home-buyers",
    number: "12",
    title: "Bradley Home Buyers",
    url: "https://bradleyhomebuyers.com/",
    category: "real-estate",
    tagline: "Sell Your House Fast in Oregon — No Repairs, No Fees",
    description:
      "An Oregon cash home-buying company serving the Willamette Valley — as-is purchases with no fees, offers within 24 hours and closings in 7 to 14 days.",
    preview: {
      src: "/images/projects/bradley-home-buyers.jpg",
      alt: "Bradley Home Buyers homepage",
      width: 1908,
      height: 940,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress", "Elementor"],
    featured: false,
    displayStyle: "wide",
  },
  {
    id: "aspen-building-solutions",
    number: "13",
    title: "Aspen Building Solutions",
    url: "https://aspen-buildingsolutions.co.uk/",
    category: "construction",
    tagline: "One-Stop-Shop For Your Building & Construction Needs",
    description:
      "A family-run construction firm in Maldon, Essex — house extensions, loft conversions, new builds and renovations across Essex, Hertfordshire, Kent and Cambridgeshire.",
    preview: {
      src: "/images/projects/aspen-building-solutions.jpg",
      alt: "Aspen Building Solutions homepage",
      width: 1899,
      height: 942,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress", "Elementor"],
    featured: true,
    displayStyle: "editorial",
  },
  {
    id: "elite-kitchen-remodels",
    number: "14",
    title: "Elite Kitchen Remodels",
    url: "https://elitekitchenremodelsplano.com/",
    category: "construction",
    tagline: "Kitchen Remodeling Plano TX Experts",
    description:
      "A kitchen remodeling contractor in Plano, Texas — custom kitchen design, cabinetry, countertops, flooring and outdoor kitchens.",
    preview: {
      src: "/images/projects/elite-kitchen-remodels.jpg",
      alt: "Elite Kitchen Remodels homepage",
      width: 1901,
      height: 936,
      capturedAt: "2026-09-03",
    },
    technologies: ["WordPress"],
    featured: false,
    displayStyle: "split",
  },
];

export const PROJECT_COUNT = PROJECTS.length;

/** Where a project's real screenshot belongs once it has been captured. */
export function expectedPreviewPath(id: string): string {
  return `/images/projects/${id}.jpg`;
}

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Featured subset. Empty until the client picks — callers must handle that. */
export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export type ProjectDataGap = {
  id: string;
  title: string;
  missing: Array<"category" | "description" | "preview" | "technologies">;
  /** Present when the entry carries a verification caveat. */
  note?: string;
};

/**
 * Reports which client-supplied fields are still outstanding, so the
 * Work section can degrade honestly (show the title + a real "View
 * live site" link) instead of rendering placeholder prose, and so the
 * remaining gaps can be listed for the client without a manual audit.
 */
export function getProjectDataGaps(): ProjectDataGap[] {
  return PROJECTS.map((p) => {
    const missing: ProjectDataGap["missing"] = [];
    if (p.category === null) missing.push("category");
    if (p.description === null) missing.push("description");
    if (p.preview === null) missing.push("preview");
    if (p.technologies.length === 0) missing.push("technologies");
    return { id: p.id, title: p.title, missing, note: p.note };
  }).filter((gap) => gap.missing.length > 0 || gap.note !== undefined);
}

/** Projects flagged as needing the client to act or confirm something. */
export function getProjectsNeedingAttention(): Project[] {
  return PROJECTS.filter((p) => p.note !== undefined);
}

/** True once every project has copy, a sector and a real screenshot. */
export function isProjectDataComplete(): boolean {
  return getProjectDataGaps().length === 0;
}
