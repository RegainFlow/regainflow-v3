/**
 * The industries we sell into, grouped.
 *
 * Order is the positioning, not decoration: public safety leads and defense
 * closes, because the firm sells to counties and states now and the aerospace
 * and defense record is what makes that credible rather than the other way
 * round. `INDUSTRY_NAMES` preserves that order for the hero marquee.
 *
 * Four groups rather than thirteen sector routes. The sectors are named inside
 * their group page, which is where a reader looking for "corrections" finds the
 * word. Individual sector routes can land later where one earns the traffic;
 * shipping thirteen pages up front would mean nine of them leaning on
 * transferable capability with no case study behind them.
 *
 * `proof` is the constraint that keeps this honest. Every group cites at least
 * two studies from `lib/content/case-studies.ts`, and a group that cannot is a
 * group we are not ready to claim — which is why banking, insurance, pharma,
 * and healthcare are still absent.
 */

/** A named sector. Rendered as a card inside its group page and in the marquee. */
export interface Industry {
  name: string;
  /** One line. What we would actually be working on there. */
  detail: string;
}

export interface IndustryGroup {
  slug: string;
  name: string;
  /** One line. Nav hint and listing-card subtitle. Names their job, not ours. */
  hint: string;
  /** Page lead. Two sentences. */
  lead: string;
  /** Where the work gets stuck here. Lines a reader recognises themselves in. */
  stalls: string[];
  /** What we install, keyed to `LAYERS[].index` so the four layers stay the spine. */
  installs: { layer: string; detail: string }[];
  /** Case study slugs that count as proof here. Never fewer than two. */
  proof: string[];
  /** Sector-specific free-assessment hook. */
  assessmentHook: string;
  industries: Industry[];
}

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  {
    slug: "public-safety",
    name: "Public Safety",
    hint: "Law enforcement, fire & EMS, corrections, dispatch",
    lead: "Public safety agencies generate more record than anyone has time to read — CAD logs, incident reports, body camera transcripts, inspection histories. We build the systems that make that record searchable and answerable, and we build them so every answer traces back to the document it came from.",
    stalls: [
      "A records request lands with a ten-day clock and the search runs on a field nobody standardized.",
      "Every shift writes reports into one system and reads intelligence out of another, and the two never reconcile.",
      "A vendor demo answered questions beautifully and could not say which document it read.",
      "CAD and RMS both hold the address history, and they disagree.",
    ],
    installs: [
      {
        layer: "L1",
        detail:
          "Retrieval that cites the report, the page, and the date, so an answer survives review.",
      },
      {
        layer: "L2",
        detail:
          "One index across CAD, RMS, and the document archive, with access that follows the clearance a person already holds.",
      },
      {
        layer: "L3",
        detail:
          "Search inside the system the shift already has open, not a second tab nobody logs into.",
      },
      {
        layer: "L4",
        detail:
          "Deployment inside your boundary, with logging that shows who asked what and when.",
      },
    ],
    proof: [
      "secure-government-document-intelligence",
      "agentic-knowledge-assistant",
      "operational-anomaly-detection",
    ],
    assessmentHook:
      "Bring us one records backlog or one report workflow. We will tell you what could be automated, what should not be, and what it would take.",
    industries: [
      {
        name: "Law Enforcement",
        detail: "Records, case files, intelligence, and public records requests.",
      },
      {
        name: "Fire & EMS",
        detail: "Incident reporting, inspection history, and response analytics.",
      },
      {
        name: "Corrections",
        detail:
          "Classification records, grievance tracking, and facility reporting.",
      },
      {
        name: "Dispatch & 911",
        detail: "CAD data, call volume patterns, and after-action review.",
      },
    ],
  },
  {
    slug: "infrastructure-utilities",
    name: "Infrastructure & Utilities",
    hint: "Power, water and wastewater, public works",
    lead: "Utilities and public works run on telemetry that arrives faster than anyone can watch it, and on asset records split between three systems and a filing cabinet. We built the monitoring for a grid operator, and the same approach fits a treatment plant, a lift station, or a fleet.",
    stalls: [
      "Thousands of sensor streams arrive every minute and an operator reads a fraction of them.",
      "A pump fails and its maintenance history is in a spreadsheet nobody has opened since the last person retired.",
      "The historian holds ten years of data and no one has ever asked it a question.",
      "A consent decree needs a quarterly report and the numbers are assembled by hand every time.",
    ],
    installs: [
      {
        layer: "L1",
        detail:
          "Models that learn what normal looks like on your equipment, then flag the departures worth a call-out.",
      },
      {
        layer: "L2",
        detail:
          "Telemetry, work orders, and asset history in one place, so a fault and its maintenance record arrive together.",
      },
      {
        layer: "L3",
        detail:
          "Alerts that reach the operator on shift, in the tool they already watch.",
      },
      {
        layer: "L4",
        detail:
          "Monitoring that runs on your infrastructure and holds up once the load is real.",
      },
    ],
    proof: [
      "operational-anomaly-detection",
      "secure-internal-paas",
      "digital-engineering-simulation",
    ],
    assessmentHook:
      "Point us at one asset class and its telemetry. We will tell you what a model could catch, what it would miss, and what the data has to look like first.",
    industries: [
      {
        name: "Utilities & Grid",
        detail: "Sensor telemetry, outage patterns, and asset condition.",
      },
      {
        name: "Water & Wastewater",
        detail:
          "Treatment monitoring, compliance reporting, and lift station health.",
      },
      {
        name: "Public Works & Transportation",
        detail: "Fleet, signals, permits, and maintenance history.",
      },
    ],
  },
  {
    slug: "government-administration",
    name: "Government & Administration",
    hint: "County and state agencies, records, risk",
    lead: "County and state departments carry modernization scope on top of the job they already have. We take one of those programs end to end, from the assessment through the build to the handoff, so it does not become another system that needs a champion to survive.",
    stalls: [
      "A grant has a spend deadline and the scope was written before anyone looked at the data.",
      "Payroll, finance, and HR each hold a version of the same employee, and reconciliation is a person.",
      "Every department normalizes vendor spreadsheets its own way, so nothing rolls up.",
      "A system passed procurement and cannot produce the audit trail the auditor asks for.",
    ],
    installs: [
      {
        layer: "L1",
        detail:
          "Assistants that answer policy and procedure questions from your documents, with the citation attached.",
      },
      {
        layer: "L2",
        detail:
          "Ingestion and reconciliation across the systems of record, with the rules written down instead of remembered.",
      },
      {
        layer: "L3",
        detail:
          "The work landing in the tools staff already use, so adoption is not a training program.",
      },
      {
        layer: "L4",
        detail:
          "Cost, access, and audit logging built in from the first deploy, not added after the first finding.",
      },
    ],
    proof: [
      "workforce-data-validation-platform",
      "records-normalization",
      "vendor-risk-scorecard",
    ],
    assessmentHook:
      "Bring us the program you were handed. We will tell you what is fundable, what is not, and what the first ninety days should produce.",
    industries: [
      {
        name: "County & Local Government",
        detail: "Payroll, finance, HR, and the systems between them.",
      },
      {
        name: "State Agencies",
        detail:
          "Program data, case management, and multi-department reporting.",
      },
      {
        name: "Permitting & Records",
        detail: "Intake, normalization, retention, and public access.",
      },
      {
        name: "Risk Management",
        detail: "Vendor risk, claims history, and compliance evidence.",
      },
    ],
  },
  {
    slug: "defense-manufacturing",
    name: "Defense & Advanced Manufacturing",
    hint: "Aerospace, defense, federal contractors",
    lead: "This is where the two of us spent our careers before RegainFlow: enterprise knowledge systems, secure platforms, and engineering workflows inside organizations that audit everything. The case studies on this site are that work.",
    stalls: [
      "A million technical documents and a search that only matches the words someone typed.",
      "Every team rebuilds the same pipeline, the same security controls, and the same deployment path.",
      "The engineering workflow depends on someone moving a file between two tools every morning.",
      "A retrieval system is in production and nobody can say whether its answers got better or worse this quarter.",
    ],
    installs: [
      {
        layer: "L1",
        detail:
          "Hybrid retrieval and grounded generation, with evaluations that tell you when quality moves.",
      },
      {
        layer: "L2",
        detail:
          "Structure-aware extraction over technical documents, with document- and field-level access holding.",
      },
      {
        layer: "L3",
        detail:
          "Applications and APIs that fit the engineering process instead of replacing it.",
      },
      {
        layer: "L4",
        detail:
          "Kubernetes, infrastructure as code, and one standardized deployment path, so teams stop rebuilding it.",
      },
    ],
    proof: [
      "manufacturing-knowledge-intelligence",
      "secure-internal-paas",
      "market-competitive-intelligence",
    ],
    assessmentHook:
      "Bring us a stalled pilot or a program someone handed you. We will give you our read on what is worth funding and what we would leave alone.",
    industries: [
      {
        name: "Aerospace Manufacturing",
        detail:
          "Technical documentation, manufacturing knowledge, and engineering workflow.",
      },
      {
        name: "Defense & Federal Contractors",
        detail: "Secure platforms, program data, and competitive intelligence.",
      },
    ],
  },
];

/**
 * Every sector name in group order, for the hero marquee.
 *
 * Flattened here rather than in the component so the marquee cannot fall out of
 * step with the pages, and so the order stays the positioning rather than
 * whatever a `.map()` happened to produce.
 */
export const INDUSTRY_NAMES: string[] = INDUSTRY_GROUPS.flatMap((group) =>
  group.industries.map((industry) => industry.name),
);

/** Which group a sector name belongs to, for linking the marquee. */
export const GROUP_BY_INDUSTRY: Record<string, IndustryGroup> =
  Object.fromEntries(
    INDUSTRY_GROUPS.flatMap((group) =>
      group.industries.map((industry) => [industry.name, group] as const),
    ),
  );

export function groupBySlug(slug: string): IndustryGroup | undefined {
  return INDUSTRY_GROUPS.find((group) => group.slug === slug);
}
