/**
 * gov.regainflow.com — company data and past performance, as data.
 *
 * Written for a contracting officer, so it holds facts and nothing else: no
 * positioning, no taglines, no claims a reader cannot check. The capability
 * statement is not restated here — the page shows the PDF itself
 * (`GOV_CAPABILITY_PDF`). The past performance PDF is generated from the page
 * (`pnpm gov:pdf`), so the two cannot drift.
 *
 * ## Drafts
 *
 * Anything marked `draft: true` renders in development, visibly tagged, and
 * nowhere else. It is how an entry waiting on details — a period of
 * performance, a résumé line — can sit in the file without shipping a
 * placeholder to a contracting officer. `isVisible()` is the only gate; every
 * renderer goes through it.
 */

/**
 * `localStorage` key for a reader's light/dark choice. Here rather than in the
 * toggle because the layout's pre-paint script needs it too, and a constant
 * exported from a client module is not readable from a server one.
 */
export const GOV_THEME_KEY = "rf-gov-theme";

export const GOV_IDENTIFIERS = [
  { label: "UEI", value: "XD3FZFEHMCD7" },
  { label: "CAGE", value: "20BV9" },
] as const;

export const GOV_LOCATION = "Orlando, Florida";

export interface Code {
  code: string;
  title: string;
}

export const NAICS_CODES: Code[] = [
  { code: "541511", title: "Custom Computer Programming Services" },
  { code: "541512", title: "Computer Systems Design Services" },
  { code: "541519", title: "Other Computer Related Services" },
  { code: "541330", title: "Engineering Services" },
  { code: "541690", title: "Other Scientific and Technical Consulting" },
  { code: "541990", title: "All Other Professional and Technical Services" },
];

export interface PointOfContact {
  name: string;
  role: string;
  email: string;
}

export const POINTS_OF_CONTACT: PointOfContact[] = [
  {
    name: "Leonardo J. Ramirez",
    role: "CEO",
    email: "leonardo.j.ramirez@regainflow.com",
  },
  {
    name: "William J. Baltus",
    role: "CTO",
    email: "william.j.baltus@regainflow.com",
  },
];

/* --- Logos --------------------------------------------------------------- */

/**
 * A customer or employer mark, shown on a white tile in its own colours.
 *
 * Never recoloured: most brand guidelines forbid it, and a monochrome mark on
 * Void reads as a design choice we made with someone else's trademark. The
 * tile also keeps a JPEG with a white ground (MSTS) from looking pasted in.
 *
 * `width`/`height` are the file's intrinsic size, for the ratio only. Sources:
 * Lockheed Martin, Pratt & Whitney, and U.S. Army from Wikimedia Commons; MSTS
 * from nnss.gov. Showing one does not claim endorsement — see the caveat on
 * the past performance page before adding more.
 */
export interface Logo {
  src: string;
  width: number;
  height: number;
}

export const LOGOS = {
  msts: { src: "/brand/clients/msts.jpg", width: 398, height: 124 },
  prattWhitney: { src: "/brand/clients/pratt-whitney.svg", width: 290, height: 72 },
  lockheedMartin: { src: "/brand/clients/lockheed-martin.svg", width: 2132, height: 322 },
  usArmy: { src: "/brand/clients/us-army.svg", width: 378, height: 90 },
} satisfies Record<string, Logo>;

/* --- Past performance ---------------------------------------------------- */

export interface PastPerformance {
  /** The program or customer as a contracting officer would look it up. */
  customer: string;
  /** Spelled out, where `customer` is an acronym. */
  customerFull?: string;
  logo?: Logo;
  /** One line, the thing that was delivered. */
  title: string;
  /**
   * Who delivered it. `RegainFlow` for company contracts; a founder's name for
   * work they led before RegainFlow. Past performance here is the people's
   * record, so this is what keeps the two kinds honest side by side.
   */
  deliveredBy: string;
  /** `Subcontractor to …`, a rank, a position. Omitted rather than guessed. */
  role?: string;
  /** Free text, e.g. `Apr 2026 – Present`. Omitted rather than guessed. */
  period?: string;
  /** One paragraph: what the engagement is and RegainFlow's part in it. */
  overview: string;
  /** What we did, one line each. */
  work: string[];
  /** Rendered as `.rf-tag` chips. */
  capabilities: string[];
  /** NAICS codes from `NAICS_CODES` the work maps to. Omitted for service. */
  naics?: string[];
  draft?: boolean;
}

/**
 * One sentence, stating what the list contains. Company contracts and prior
 * individual experience sit in one list at the owner's direction; this line and
 * each entry's "Performed by" are what keep that distinction visible.
 */
export const PAST_PERFORMANCE_NOTE =
  "Includes RegainFlow subcontracts and prior experience of RegainFlow principals. Each entry identifies who performed the work.";

export const PAST_PERFORMANCE: PastPerformance[] = [
  {
    customer: "MSTS",
    customerFull: "Mission Support and Test Services",
    logo: LOGOS.msts,
    deliveredBy: "RegainFlow",
    title: "Secure, on-premises AI knowledge platform",
    role: "Subcontractor to Link Technologies",
    period: "Apr 2026 – Present",
    overview:
      "RegainFlow leads solution architecture and technical delivery. The work spans the full retrieval-augmented generation lifecycle, from document ingestion and retrieval through self-hosted LLM inference, application integration, and production deployment.",
    work: [
      "Architected the document ingestion pipeline, retrieval layer, and self-hosted LLM inference on on-premises servers.",
      "Integrated the platform with the customer's .NET applications and hardened it to their cybersecurity requirements.",
      "Built the measurement layer: response time, question classification, user feedback loops, and automated evaluation against a baseline question-and-answer set using an LLM as judge.",
      "Lead Agile delivery, including PI planning and customer demonstrations.",
      "Validate business value with customer stakeholders and business process analysts, translating operational needs into production capability.",
    ],
    capabilities: [
      "Retrieval-augmented generation",
      "Self-hosted LLM inference",
      "On-premises deployment",
      ".NET integration",
      "Security hardening",
      "Automated evaluation",
      "Agile / PI planning",
    ],
    naics: ["541511", "541512", "541690"],
  },
  {
    customer: "Pratt & Whitney",
    logo: LOGOS.prattWhitney,
    deliveredBy: "RegainFlow",
    title: "Enterprise AI and retrieval-augmented generation",
    role: "Subcontractor to Innovien Solutions",
    // TODO(gov): period of performance and scope detail.
    overview:
      "Delivery supporting an aerospace manufacturing environment.",
    work: [],
    capabilities: ["Retrieval-augmented generation", "Enterprise AI"],
    naics: ["541511", "541512"],
  },
  {
    customer: "Lockheed Martin",
    logo: LOGOS.lockheedMartin,
    title: "Mustang LM 400 bus: diagnostics and load shed",
    deliveredBy: "William J. Baltus, CTO",
    // TODO(gov): title and period, from the résumé.
    overview:
      "Detects power discrepancies in any component or switch on the bus.",
    work: [
      "Built the diagnostics and load-shed logic for power discrepancies across components and switches.",
      "Stringent unit testing with GMock across object-oriented Python and C++.",
      "Modeled and designed the system in Cameo for the critical design review (CDR).",
    ],
    capabilities: ["C++", "Python", "GMock", "Cameo / MBSE", "Critical design review"],
    naics: ["541330", "541511"],
  },
  {
    customer: "U.S. Army",
    logo: LOGOS.usArmy,
    title: "Engineer, Signal, and Cyber Warfare officer",
    deliveredBy: "Leonardo J. Ramirez, CEO",
    role: "Captain",
    overview:
      "Served to Captain across three specialties.",
    work: [
      "Engineer officer.",
      "Signal officer supporting Space and Missile Defense.",
      "Cyber Warfare officer running defensive cyber operations at the national level.",
    ],
    capabilities: ["Defensive cyber operations", "Space and missile defense", "Signal", "Leadership"],
  },
];

/** The one gate on draft content. Development shows it; nothing else does. */
export function isVisible(item: { draft?: boolean }): boolean {
  return !item.draft || process.env.NODE_ENV === "development";
}
