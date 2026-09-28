/**
 * gov.regainflow.com — company data and past performance, as data.
 *
 * Written for a contracting officer, so it holds facts and nothing else: no
 * positioning, no taglines, no claims a reader cannot check. The capability
 * statement is not restated here — the page shows the PDF itself
 * (`GOV_CAPABILITY_PDF`).
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

/**
 * Socioeconomic status, as a contracting officer searches for it.
 *
 * **`certification` stays empty until a certificate exists.** Being
 * veteran-owned is not the same as being SBA-certified: VOSB and SDVOSB are
 * certified through SBA VetCert, and a misstated certification or status in a
 * federal context carries penalties (15 U.S.C. 632(w)). There is also no SBA
 * "minority-owned" certification — the federal routes are SDB (represented in
 * SAM.gov) and SBA 8(a); an MBE comes from NMSDC or a state. Name the real
 * program and issuer here, or leave it out.
 */
export interface Classification {
  label: string;
  abbreviation?: string;
  /** e.g. `SBA VetCert`. Rendered as "Certified: …" only when set. */
  certification?: string;
}

export const BUSINESS_CLASSIFICATIONS: Classification[] = [
  { label: "Veteran-Owned Small Business", abbreviation: "VOSB" },
  { label: "Minority-Owned Small Business" },
];

export interface Code {
  code: string;
  title: string;
}

/** In the capability statement's order. The first is the primary NAICS. */
export const NAICS_CODES: Code[] = [
  { code: "541511", title: "Custom Computer Programming Services" },
  { code: "541512", title: "Computer Systems Design Services" },
  { code: "541519", title: "Other Computer Related Services" },
  {
    code: "518210",
    title: "Computing Infrastructure Providers, Data Processing, Web Hosting, and Related Services",
  },
  { code: "541330", title: "Engineering Services" },
  { code: "541690", title: "Other Scientific and Technical Consulting Services" },
  {
    code: "541715",
    title:
      "Research and Development in the Physical, Engineering, and Life Sciences (except Nanotechnology and Biotechnology)",
  },
  { code: "541611", title: "Administrative Management and General Management Consulting Services" },
  { code: "541990", title: "All Other Professional, Scientific, and Technical Services" },
];

/** Product and Service Codes, official titles, in the capability statement's order. */
export const PSC_CODES: Code[] = [
  {
    code: "DA01",
    title: "IT and Telecom – Business Application / Application Development Support Services (Labor)",
  },
  { code: "DF01", title: "IT and Telecom – IT Management Support Services (Labor)" },
  {
    code: "DH01",
    title: "IT and Telecom – Platform Support Services: Database, Mainframe, Middleware (Labor)",
  },
  { code: "DJ01", title: "IT and Telecom – Security and Compliance Support Services (Labor)" },
  { code: "R425", title: "Support – Professional: Engineering / Technical" },
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
 * A customer or employer mark on a transparent ground, in its own colours.
 *
 * Never recoloured: most brand guidelines forbid it, and a monochrome mark on
 * Void reads as a design choice we made with someone else's trademark. The
 * cost is that the darker marks (Lockheed Martin, U.S. Army) read weakly in
 * dark mode — accepted, in exchange for no white tiles. Every file must have a
 * transparent background; MSTS's was keyed out of the white-ground original.
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
  msts: { src: "/brand/clients/msts.png", width: 398, height: 124 },
  prattWhitney: { src: "/brand/clients/pratt-whitney.svg", width: 290, height: 72 },
  lockheedMartin: { src: "/brand/clients/lockheed-martin.svg", width: 2132, height: 322 },
  usArmy: { src: "/brand/clients/us-army.svg", width: 378, height: 90 },
} satisfies Record<string, Logo>;

/* --- Past performance ---------------------------------------------------- */

/**
 * One scope of work within an engagement. The copy is the owner's, verbatim:
 * `summary` is the capability-sheet one-liner (and the only text when the page
 * is printed), `detail` the expanded website version behind "Full description".
 */
export interface Segment {
  /** Names the scope when a card holds more than one, e.g. `Savant & AI Hub`. */
  label?: string;
  summary: string;
  detail: string[];
}

/**
 * One customer card. Most hold a single unlabelled segment; a customer with
 * several programs gets one card segmented by program, as the capability
 * statement does, rather than the same logo twice.
 */
export interface PastPerformance {
  /** As a contracting officer would look it up, e.g. `Lockheed Martin Space`. */
  customer: string;
  /** The program or capability, e.g. `AI Search & Flight Software`. */
  program: string;
  logo?: Logo;
  /** Officer specialties and the like. Omitted rather than guessed. */
  role?: string;
  segments: Segment[];
  draft?: boolean;
}

export const PAST_PERFORMANCE: PastPerformance[] = [
  {
    customer: "Mission Support and Test Services (MSTS)",
    program: "Enterprise AI Knowledge Platform",
    logo: LOGOS.msts,
    segments: [
      {
        summary:
          "Architecting and delivering a secure, on-premises RAG platform for enterprise knowledge retrieval, self-hosted inference, and automated evaluation.",
        detail: [
          "RegainFlow leads solution architecture and technical delivery for a secure, on-premises AI knowledge platform supporting MSTS. The solution spans the full RAG lifecycle—from document ingestion and retrieval through self-hosted LLM inference, application integration, and production deployment.",
          "Scope includes .NET integration, cybersecurity hardening, retrieval and response evaluation, response-time and usage metrics, user feedback loops, and automated evaluation against baseline question-and-answer sets. We also lead customer demonstrations and Agile planning while working directly with stakeholders and business process analysts to validate business value and translate operational needs into production capabilities.",
        ],
      },
    ],
  },
  {
    customer: "Lockheed Martin Space",
    program: "AI Search & Flight Software",
    logo: LOGOS.lockheedMartin,
    segments: [
      {
        label: "Savant & AI Hub",
        summary:
          "Architected enterprise RAG, search, and agentic AI platforms supporting 1M+ records, secure self-hosted AI, and deployment in sensitive and air-gapped environments.",
        detail: [
          "Designed and delivered enterprise AI search, RAG, and agentic AI capabilities across Lockheed Martin Space. Work progressed from Savant, an enterprise search and RAG platform supporting 1M+ records, to architecture of the Space division’s centralized AI Hub for governed, reusable agent workflows. Developed self-hosted AI capabilities, hybrid retrieval and reranking, MCP and A2A integrations, granular access controls, and a document ingestion pipeline processing 16,000+ documents per hour. Solutions were designed for sensitive environments, including classified and air-gapped deployments.",
        ],
      },
      {
        label: "Mustang / LM400 Space Bus",
        summary:
          "Developed and verified Class B flight software for the LM400 space bus, including spacecraft power diagnostics and automated load-shedding capabilities.",
        detail: [
          "Developed and verified Class B flight software supporting Lockheed Martin’s LM400 space bus. Work included spacecraft power diagnostics and load-shedding functionality, object-oriented development in C++ and Python on NASA cFS, and rigorous unit, integration, and hardware-in-the-loop testing. Supported system modeling and design in Cameo through Critical Design Review while delivering within an Agile spacecraft software program.",
        ],
      },
    ],
  },
  {
    customer: "Pratt & Whitney",
    program: "Enterprise AI & Engineering Knowledge",
    logo: LOGOS.prattWhitney,
    segments: [
      {
        summary:
          "Architecting enterprise RAG and AI capabilities that transform complex aerospace engineering documentation into trusted, searchable knowledge for engineering and business workflows.",
        detail: [
          "Supporting the architecture and development of enterprise AI and RAG capabilities that transform complex aerospace engineering documentation and enterprise data into trusted, searchable knowledge. The solution supports engineering and business workflows through document intelligence, hybrid lexical and semantic retrieval, reranking, grounded generation, and source traceability.",
          "Work spans the full RAG lifecycle, from ingestion and structured extraction through retrieval and response generation, with evaluation methodologies measuring retrieval relevance and answer quality. The platform is designed around production enterprise requirements including secure deployment, access controls, observability, repeatable ingestion, and integration with existing engineering workflows.",
        ],
      },
    ],
  },
  {
    customer: "U.S. Army",
    program: "Engineering, Communications & Cyber Operations",
    logo: LOGOS.usArmy,
    role: "Engineer Officer | Signal Officer | Cyber Warfare Officer",
    segments: [
      {
        summary:
          "Led engineering, secure communications, and cybersecurity capabilities supporting mission-critical Army operations and space/missile-defense environments.",
        detail: [
          "Led engineering, secure communications, and cybersecurity capabilities supporting mission-critical Army operations and space/missile-defense environments. Engineering responsibilities included project planning, cost estimation, feasibility analysis, technical documentation, design development, and BIM-supported infrastructure projects.",
          "Managed classified and unclassified communications supporting a 500-Soldier organization, including tactical satellite communications, command-and-control systems, and more than 50 connected mission platforms. Later led and developed cyber personnel, provided technical mentorship and cybersecurity training, and supported allied partners in implementing cybersecurity concepts and practices.",
        ],
      },
    ],
  },
];

/** The one gate on draft content. Development shows it; nothing else does. */
export function isVisible(item: { draft?: boolean }): boolean {
  return !item.draft || process.env.NODE_ENV === "development";
}
