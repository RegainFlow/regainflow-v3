/**
 * Selected enterprise AI and platform experience.
 *
 * Two rules govern every entry here, and they are the reason the copy reads the
 * way it does:
 *
 * 1. Nothing is named. No company, customer, internal platform, program, or
 *    project name appears — only the industry or environment the work ran in.
 * 2. **No figure unless it was published or confirmed.** Every number in
 *    `metrics` was published on the previous RegainFlow site and cleared by that
 *    site's own anonymization worksheets, which are in `regainflow-website` git
 *    history under `app/features/projects/data/prompts/` (deleted in `6d71afe`
 *    and `0077888`). Those worksheets are the source of record for what may
 *    appear here. A plausible invented figure is still worse than no figure.
 *
 * Three figures the worksheets held back as identifying, which must not appear
 * on this site: `300+ tables / 100+ interfaces`, the `90 → 3 day cycle time`,
 * and `6K+ daily active users` (the previous site published `5K+` in its place).
 *
 * `atAGlance` carries engagement scope — environment, volumes, stack, method.
 * It describes what the work was, never what it returned, so it is not governed
 * by rule 2. `outcomes` states what changed, one line each.
 *
 * Cards carry the executive summary and the first metric; `challenge`,
 * `solution`, `capabilities`, `atAGlance`, `outcomes`, and `technologies` are
 * detail-page only.
 */

export type CaseStudyGroup =
  | "Enterprise AI & Knowledge Systems"
  | "Platform Modernization & Interoperability"
  | "Analytics & Digital Engineering";

/** Display order for the grouped listing. */
export const GROUPS: CaseStudyGroup[] = [
  "Enterprise AI & Knowledge Systems",
  "Platform Modernization & Interoperability",
  "Analytics & Digital Engineering",
];

/**
 * Stable identifiers for the three groups, for anything outside the page that
 * has to survive a copy edit — currently the `group` property on
 * `case_study_opened`.
 *
 * The display strings above are headings and will be reworded eventually.
 * Sending one as an analytics value would silently split every historical
 * breakdown at the moment it changed, and the split would look like a drop in
 * interest rather than a rename. These keys are not displayed anywhere, so they
 * never need to change.
 */
export const GROUP_KEYS: Record<CaseStudyGroup, string> = {
  "Enterprise AI & Knowledge Systems": "enterprise-ai",
  "Platform Modernization & Interoperability": "platform-modernization",
  "Analytics & Digital Engineering": "analytics-engineering",
};

/** One headline figure. `value` is the number; `label` says what it counts. */
export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** Industry or environment. Leads the card. */
  industry: string;
  /** One executive-legible line. The only body copy on the card. */
  summary: string;
  group: CaseStudyGroup;
  /** Published or confirmed only. Never synthesized. The card shows the first. */
  metrics?: CaseStudyMetric[];
  challenge: string;
  solution: string;
  capabilities: string[];
  /** Engagement scope. Describes the work, not its return. */
  atAGlance?: { label: string; value: string }[];
  /** What changed. One line each, concrete. */
  outcomes?: string[];
  impact: string;
  /** Named only where the stack itself is the point. */
  technologies?: string;
  /** `IndustryGroup` slugs this study is proof for. */
  industries?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "workforce-data-validation-platform",
    title: "Enterprise Workforce Data Validation Platform",
    industry: "Aerospace & Defense",
    summary:
      "A manual, hard-to-audit payroll validation process became a scalable platform that checks workforce data automatically and shows its work.",
    group: "Platform Modernization & Interoperability",
    metrics: [
      { value: "$8M", label: "Estimated annual savings" },
      { value: "12 FTEs", label: "Of manual review removed" },
    ],
    challenge:
      "A legacy workforce and payroll validation process relied heavily on manual comparisons, disconnected data sources, and difficult-to-maintain business rules. The process was time-consuming, difficult to audit, and unable to scale across the enterprise.",
    solution:
      "Led the modernization of the legacy system into a scalable workforce data validation platform with a modern user interface, APIs, automated ingestion pipelines, centralized validation rules, PostgreSQL persistence, and integrations with enterprise workforce systems.",
    capabilities: [
      "Automated workforce and payroll data validation",
      "Configurable business rules",
      "Enterprise API integrations",
      "Data ingestion and transformation pipelines",
      "Metrics, monitoring, and audit reporting",
      "AI-assisted rule-generation proof of concept",
    ],
    atAGlance: [
      {
        label: "Environment",
        value: "Enterprise payroll, finance, and HR systems of record",
      },
      { label: "Scope", value: "A legacy validation process rebuilt as a platform" },
      {
        label: "Systems reconciled",
        value: "Payroll, general ledger, time entry, and HRIS",
      },
      { label: "Persistence", value: "PostgreSQL, with rules held centrally" },
    ],
    outcomes: [
      "Manual cross-system comparison replaced by automated validation runs.",
      "Every check leaves an audit record, so a finding traces back to the rule that raised it.",
      "Validation rules live in one configurable place instead of across scripts and spreadsheets.",
    ],
    impact:
      "Reduced manual validation effort, improved auditability, and generated an estimated $8 million in annual operational savings.",
    industries: ["government-administration", "defense-manufacturing"],
  },
  {
    slug: "agentic-knowledge-assistant",
    title: "Agentic Enterprise Knowledge Assistant",
    industry: "Aerospace & Defense",
    summary:
      "Search could find documents but could not answer questions. This system answers them, holds context, and refuses to invent what it cannot support.",
    group: "Enterprise AI & Knowledge Systems",
    metrics: [{ value: "3×", label: "Faster answers" }],
    challenge:
      "Traditional enterprise search could locate documents but could not reliably answer complex questions, maintain conversational context, evaluate retrieved information, or prevent unsupported responses.",
    solution:
      "Built an agentic retrieval-augmented generation system that coordinated query rewriting, document retrieval, document grading, reranking, response generation, conversational history, and hallucination detection.",
    capabilities: [
      "Agentic workflows",
      "Hybrid keyword and vector retrieval",
      "Query rewriting",
      "Document grading and reranking",
      "Conversational memory",
      "Grounded response generation",
      "Hallucination detection",
      "Retrieval and response evaluations",
    ],
    atAGlance: [
      { label: "Environment", value: "Enterprise policy and documentation corpus" },
      { label: "Retrieval", value: "Hybrid keyword and vector, with reranking" },
      { label: "Guardrail", value: "Hallucination detection on every response" },
      { label: "Evaluation", value: "Retrieval and response evals, run as a pipeline" },
    ],
    outcomes: [
      "Questions get an answer rather than a list of documents to read.",
      "Context holds across follow-up questions in the same conversation.",
      "A response retrieval cannot support is refused instead of guessed.",
    ],
    impact:
      "Improved the accuracy and usability of enterprise question answering while providing a governed foundation for secure AI assistance.",
    industries: ["public-safety", "government-administration"],
  },
  {
    slug: "enterprise-search-modernization",
    title: "Enterprise Search Modernization",
    industry: "Aerospace & Engineering",
    summary:
      "Keyword-only search across more than a million records was rebuilt so employees find what they mean, not only what they typed.",
    group: "Enterprise AI & Knowledge Systems",
    metrics: [
      { value: "1M+", label: "Records searchable" },
      { value: "5K+", label: "Daily users" },
    ],
    challenge:
      "Employees struggled to locate relevant information across more than one million records using traditional keyword-only search.",
    solution:
      "Modernized the search architecture using Elasticsearch, hierarchical document processing, BM25 keyword search, dense and sparse vector retrieval, Reciprocal Rank Fusion, semantic reranking, and relevance evaluation.",
    capabilities: [
      "Search across more than one million records",
      "Keyword and semantic retrieval",
      "Dense and sparse vector search",
      "Reciprocal Rank Fusion",
      "Semantic reranking",
      "Hierarchical document chunking",
      "Search-quality evaluations",
    ],
    atAGlance: [
      { label: "Environment", value: "Enterprise technical and engineering record" },
      { label: "Corpus", value: "More than one million records" },
      {
        label: "Retrieval",
        value: "BM25, dense and sparse vectors, Reciprocal Rank Fusion",
      },
      { label: "Platform", value: "Elasticsearch" },
    ],
    outcomes: [
      "Employees find records by meaning, not only by the words they typed.",
      "Hierarchical chunking keeps a result's surrounding context attached to it.",
      "Relevance is scored against a fixed evaluation set, so a change can be shown to help.",
    ],
    impact:
      "Improved the relevance of enterprise search results and enabled users to discover information that was difficult to locate through traditional keyword matching.",
    industries: ["defense-manufacturing", "government-administration"],
  },
  {
    slug: "secure-internal-paas",
    title: "Secure Internal Platform-as-a-Service",
    industry: "Regulated Enterprise & Defense",
    summary:
      "Every team was rebuilding the same infrastructure, pipelines, and security controls. One secure platform now provides them once.",
    group: "Platform Modernization & Interoperability",
    metrics: [
      { value: "10×", label: "Faster environment setup" },
      { value: "Days → minutes", label: "Provisioning time" },
    ],
    challenge:
      "Engineering teams repeatedly rebuilt application infrastructure, deployment pipelines, security configurations, and operational tooling for each new application.",
    solution:
      "Helped develop a secure internal platform-as-a-service that standardized application deployment, infrastructure provisioning, container orchestration, configuration, security controls, and observability.",
    capabilities: [
      "Kubernetes-based application hosting",
      "Infrastructure as code",
      "Automated environment provisioning",
      "Standardized deployment pipelines",
      "Security and compliance controls",
      "Logging, monitoring, and observability",
      "Reusable developer platform services",
    ],
    atAGlance: [
      { label: "Environment", value: "Regulated enterprise and defense engineering" },
      { label: "Provisioning", value: "Self-service, from a request form" },
      { label: "Stack", value: "Kubernetes, OpenShift, Terraform, Ansible" },
      {
        label: "Scope",
        value: "Infrastructure, pipelines, security controls, observability",
      },
    ],
    outcomes: [
      "Teams request an environment instead of building one.",
      "Security configuration and observability arrive with the environment rather than after it.",
      "One deployment path across teams, so a new application starts from a known-good baseline.",
    ],
    technologies:
      "Kubernetes, OpenShift, Terraform, Ansible, containerized services, and automated CI/CD workflows.",
    impact:
      "Reduced repeated infrastructure work, improved deployment consistency, and accelerated the delivery of secure enterprise applications.",
    industries: [
      "infrastructure-utilities",
      "defense-manufacturing",
      "government-administration",
    ],
  },
  {
    slug: "operational-anomaly-detection",
    title: "AI-Driven Operational Anomaly Detection",
    industry: "Utilities & Grid Operations",
    summary:
      "Operators were reading infrastructure telemetry by hand. Models now establish what normal looks like on each asset and surface what departs from it.",
    group: "Analytics & Digital Engineering",
    metrics: [
      { value: "80%", label: "Less manual review" },
      { value: "5K+", label: "Live sensor streams" },
    ],
    challenge:
      "Thousands of live sensor streams from distributed infrastructure made it difficult for operators to identify abnormal equipment behavior, emerging faults, and slow performance drift through manual review alone.",
    solution:
      "Developed machine-learning and analytical workflows that established expected behavior per asset, processed historical and live telemetry, detected deviations, and surfaced anomalies to a live operations dashboard.",
    capabilities: [
      "Time-series and telemetry processing",
      "Per-asset baseline behavior modeling",
      "Automated anomaly detection",
      "Trend and deviation analysis",
      "Live operator dashboards",
      "Repeatable model-evaluation workflows",
    ],
    atAGlance: [
      { label: "Environment", value: "Distributed infrastructure telemetry" },
      { label: "Volume", value: "More than five thousand live sensor streams" },
      { label: "Method", value: "Per-asset baseline modeling and deviation detection" },
      { label: "Delivery", value: "Live dashboards for the operator on shift" },
    ],
    outcomes: [
      "Operators review exceptions instead of streams.",
      "Each asset carries its own baseline, so a normal reading on one is not assumed normal on another.",
      "Model evaluation is repeatable, so drift shows up as a number rather than a complaint.",
    ],
    impact:
      "Cut the volume of telemetry requiring manual inspection by roughly eighty percent and helped operators reach developing faults earlier.",
    industries: ["infrastructure-utilities", "public-safety"],
  },
  {
    slug: "digital-engineering-simulation",
    title: "Digital Engineering & Simulation Workflow Modernization",
    industry: "Aerospace & Defense",
    summary:
      "Specialized engineering and simulation work stopped depending on manual data movement between disconnected tools.",
    group: "Analytics & Digital Engineering",
    metrics: [{ value: "35%", label: "Performance gain" }],
    challenge:
      "Specialized engineering and simulation workflows depended on fragmented tools, manual data movement, and disconnected technical processes.",
    solution:
      "Modernized the workflow through integrated data services, automation, modern application interfaces, and reusable engineering components.",
    capabilities: [
      "Engineering workflow integration",
      "Automated data movement",
      "Modern full-stack application development",
      "Centralized technical data access",
      "Reusable services and APIs",
      "Improved workflow traceability",
    ],
    atAGlance: [
      { label: "Environment", value: "Engineering and simulation toolchain" },
      { label: "Scope", value: "Front end and delivery pipeline both modernized" },
      { label: "Integration", value: "Automated movement between previously separate tools" },
      { label: "Reuse", value: "Shared services and APIs across workflows" },
    ],
    outcomes: [
      "Data moves between tools without someone carrying a file across every morning.",
      "The application is measurably faster to use under the same workload.",
      "Releases ship on a pipeline instead of a coordinated manual push.",
    ],
    impact:
      "Reduced workflow fragmentation and made specialized engineering processes easier to operate, maintain, and scale.",
    industries: ["defense-manufacturing", "infrastructure-utilities"],
  },
  {
    slug: "market-competitive-intelligence",
    title: "AI-Powered Market & Competitive Intelligence",
    industry: "Aerospace & Strategic Intelligence",
    summary:
      "Analysts tracking competitors, technologies, and market movement got one place to search, summarize, and connect fragmented sources.",
    group: "Enterprise AI & Knowledge Systems",
    metrics: [{ value: "4×", label: "Faster cost analysis" }],
    challenge:
      "Analysts needed to identify trends, competitors, technologies, and market developments across large amounts of fragmented internal and external information.",
    solution:
      "Developed an AI-powered intelligence capability that collected, indexed, searched, summarized, and connected information from multiple sources.",
    capabilities: [
      "Multi-source information ingestion",
      "Semantic and keyword search",
      "Automated summarization",
      "Entity and topic discovery",
      "Trend identification",
      "Source-linked AI responses",
      "Analyst-focused knowledge exploration",
    ],
    atAGlance: [
      { label: "Environment", value: "Internal cost data and external market sources" },
      { label: "Scope", value: "Ingestion, indexing, search, and summarization" },
      { label: "Output", value: "Itemized cost breakdowns and source-linked summaries" },
      { label: "Audience", value: "Analysts and the decision-makers they brief" },
    ],
    outcomes: [
      "One search surface across sources that previously required separate tools.",
      "Every AI response carries the source it drew from.",
      "Cost analysis that took a week of assembly runs in a fraction of it.",
    ],
    impact:
      "Reduced the time required to research strategic topics and helped decision-makers convert unstructured information into actionable intelligence.",
    industries: ["defense-manufacturing", "government-administration"],
  },
  {
    slug: "secure-government-document-intelligence",
    title: "Secure Government Document Intelligence System",
    industry: "Government & National Security",
    summary:
      "Reliable answers from complex document collections, with every answer traceable to its source and access controls holding at every level.",
    group: "Enterprise AI & Knowledge Systems",
    metrics: [{ value: "2×", label: "Faster information access" }],
    challenge:
      "Users needed to retrieve reliable answers from large collections of complex documents while maintaining strict access controls, source traceability, and document-level security.",
    solution:
      "Built a secure document-intelligence and retrieval platform using advanced document extraction, structure-aware chunking, table summarization, hybrid retrieval, semantic reranking, multi-agent workflows, and automated evaluations.",
    capabilities: [
      "Complex document extraction",
      "Header-aware and hierarchical chunking",
      "Table understanding and summarization",
      "Hybrid keyword and vector retrieval",
      "Semantic reranking",
      "Multi-agent workflows",
      "Citation and source traceability",
      "Document-, field-, and index-level security",
      "Multi-tenant architecture",
      "Automated retrieval evaluations",
    ],
    atAGlance: [
      { label: "Environment", value: "Government document collections under access control" },
      { label: "Extraction", value: "Structure-aware, including tables" },
      {
        label: "Security",
        value: "Document, field, and index level, with multi-tenancy",
      },
      { label: "Traceability", value: "Citation on every answer" },
    ],
    outcomes: [
      "An answer can be checked against the page it came from.",
      "Access controls hold inside retrieval, so a result never leaks past a permission.",
      "Tables are summarized rather than flattened, so numeric content stays answerable.",
    ],
    impact:
      "Created a scalable and governed foundation for enterprise knowledge retrieval while improving access to information contained in complex government documents.",
    industries: ["public-safety", "government-administration"],
  },
  {
    slug: "manufacturing-knowledge-intelligence",
    title: "Manufacturing & Engineering Knowledge Intelligence",
    industry: "Aerospace Manufacturing",
    summary:
      "Engineers got a dependable way to locate and interpret information buried across manufacturing and technical documentation.",
    group: "Enterprise AI & Knowledge Systems",
    metrics: [{ value: "5×", label: "Indexing throughput" }],
    challenge:
      "Engineers needed a reliable way to locate and interpret information across complex manufacturing, technical, and engineering documentation.",
    solution:
      "Developed an enterprise knowledge-intelligence capability combining document ingestion, structured extraction, hybrid retrieval, semantic reranking, grounded generation, and evaluation pipelines.",
    capabilities: [
      "Manufacturing document ingestion",
      "Technical document processing",
      "Hybrid enterprise retrieval",
      "Semantic reranking",
      "Grounded AI assistance",
      "Source traceability",
      "Retrieval-quality evaluations",
      "Secure enterprise deployment",
    ],
    atAGlance: [
      { label: "Environment", value: "Manufacturing and technical documentation" },
      { label: "Pipeline", value: "Conversion, OCR, summarization, and indexing" },
      { label: "Retrieval", value: "Hybrid, with semantic reranking" },
      { label: "Evaluation", value: "Retrieval quality measured, not assumed" },
    ],
    outcomes: [
      "Documents that previously required manual reading are indexed and answerable.",
      "Ingestion keeps pace with the document library rather than falling behind it.",
      "Every generated answer points back to the manufacturing record behind it.",
    ],
    impact:
      "Improved access to manufacturing and engineering knowledge while creating a foundation for reliable AI-assisted technical workflows.",
    industries: ["defense-manufacturing"],
  },
  {
    slug: "records-normalization",
    title: "Records Intake & Normalization Platform",
    industry: "Records & Data Operations",
    summary:
      "Departments were hand-cleaning inconsistent spreadsheets before anything downstream could read them. An intake platform now normalizes them on upload.",
    group: "Platform Modernization & Interoperability",
    metrics: [{ value: "90%", label: "Manual cleanup removed" }],
    challenge:
      "Departments submitted records as non-standard spreadsheets in whatever shape their own process produced. Every submission was reconciled by hand before a downstream system could ingest it, and no two departments formatted the same field the same way.",
    solution:
      "Built an upload and normalization platform that accepted non-standard spreadsheets, mapped and validated them against a defined schema, reported errors back to the submitter, and populated a central repository that downstream systems could read directly.",
    capabilities: [
      "Non-standard spreadsheet intake",
      "Schema mapping and validation",
      "Automated data normalization",
      "Submission-level error reporting",
      "Central repository persistence",
      "Downstream system integration",
    ],
    atAGlance: [
      { label: "Environment", value: "Multi-department record submission" },
      { label: "Intake", value: "Non-standard spreadsheets, as submitted" },
      { label: "Validation", value: "Mapped against a defined schema on upload" },
      { label: "Persistence", value: "One central SQL repository" },
    ],
    outcomes: [
      "Submitters see their own errors instead of a downstream team finding them later.",
      "Downstream systems read one consistent format.",
      "Normalization rules live in the platform rather than in each department's habits.",
    ],
    technologies: "Angular, .NET, and SQL Server.",
    impact:
      "Removed roughly ninety percent of the manual cleanup between a submission and a usable record, and gave every downstream system one format to read.",
    industries: ["government-administration", "public-safety"],
  },
  {
    slug: "vendor-risk-scorecard",
    title: "Vendor Risk & Performance Scorecard",
    industry: "Procurement & Risk Management",
    summary:
      "Vendor risk, performance, and quality were assessed in separate reviews. One scorecard platform now evaluates them together.",
    group: "Analytics & Digital Engineering",
    metrics: [{ value: "70%", label: "Faster vendor assessment" }],
    challenge:
      "Vendor risk, performance history, and quality findings lived in separate reviews owned by separate teams. Assembling a single view of a vendor took days, and two reviewers could reach different conclusions from the same record.",
    solution:
      "Built a centralized scorecard platform that scored vendors against defined risk, performance, and quality factors, held the evaluation history in one place, and produced a consistent assessment any reviewer could reproduce.",
    capabilities: [
      "Vendor risk and opportunity scoring",
      "Performance factor tracking",
      "Centralized quality assurance records",
      "Reproducible evaluation criteria",
      "Assessment history and audit trail",
      "Reviewer dashboards",
    ],
    atAGlance: [
      { label: "Environment", value: "Vendor evaluation and quality assurance" },
      { label: "Scope", value: "Risk, opportunity, performance, and quality in one score" },
      { label: "Consistency", value: "Defined criteria, reproducible by any reviewer" },
      { label: "Record", value: "Full assessment history retained" },
    ],
    outcomes: [
      "One vendor view assembled from what used to be several separate reviews.",
      "Two reviewers working the same record reach the same score.",
      "Assessment history is queryable, so a pattern across vendors is visible.",
    ],
    technologies: "Angular, .NET, and SQL Server.",
    impact:
      "Cut vendor assessment time by roughly seventy percent and made evaluations consistent enough to compare across reviewers and across time.",
    industries: ["government-administration"],
  },
  {
    slug: "security-testing-automation",
    title: "Automated Security Assessment Platform",
    industry: "Security & Compliance",
    summary:
      "Repeatable security checks were run by hand each cycle. An automation platform now runs them and produces the report.",
    group: "Platform Modernization & Interoperability",
    metrics: [{ value: "5×", label: "Faster assessments" }],
    challenge:
      "Repeatable security checks were executed manually every assessment cycle. The work was slow, the coverage varied with whoever ran it, and the reporting was assembled by hand afterwards.",
    solution:
      "Built automation and reporting tooling that ran vulnerability assessment workflows on a schedule, captured results consistently, and generated the assessment report as an output of the run rather than a separate task.",
    capabilities: [
      "Automated vulnerability assessment workflows",
      "Scheduled and repeatable test runs",
      "Consistent result capture",
      "Generated assessment reporting",
      "Coverage tracking across cycles",
      "Lower per-assessment cost",
    ],
    atAGlance: [
      { label: "Environment", value: "Recurring security assessment cycles" },
      { label: "Execution", value: "Scheduled automated runs" },
      { label: "Output", value: "The report is produced by the run" },
      { label: "Coverage", value: "Consistent between cycles and between operators" },
    ],
    outcomes: [
      "Assessment coverage no longer depends on who ran it.",
      "Reporting is an output of the run rather than a week of assembly.",
      "Running a check more often costs time that is already automated.",
    ],
    impact:
      "Reduced the time and cost of each assessment cycle by roughly five times and made coverage consistent between runs.",
    industries: [
      "government-administration",
      "public-safety",
      "defense-manufacturing",
    ],
  },
];

/** Restated from published totals. RegainFlow's own, not the studies above. */
export const HEADLINE_FIGURES = [
  { value: "$5M+", label: "Estimated value created" },
  { value: "5,000+", label: "Hours of work reduced" },
  { value: "18+", label: "Client transformations delivered" },
];

/**
 * The three shown up front on `/insights`. The rest sit in the disclosure.
 *
 * One from each `CaseStudyGroup`, and that constraint is the point rather than
 * a tidy coincidence. These three are the first thing a visitor reads, so they
 * have to demonstrate range — governed retrieval, platform modernization,
 * applied ML — not three variations of document search. `industry` leads every
 * card, so the row also reads as three different environments.
 *
 * Keep it at three, and keep one per group. Adding a fourth from a group that
 * is already represented is how this becomes the six-card wall it replaced.
 */
export const FEATURED_SLUGS = [
  "secure-government-document-intelligence",
  "workforce-data-validation-platform",
  "operational-anomaly-detection",
];

/**
 * The two shown on the home proof strip.
 *
 * Both are public sector now, because the homepage sells to counties and states
 * and a visitor who reads two aerospace cards there has already decided we are
 * not for them. Two different groups and two different industries, since
 * `industry` leads the card and a matched pair reading the same line looks like
 * one study printed twice. The aerospace and defense record is still one click
 * away on `/insights`, which is where it does its job.
 */
export const HOME_SLUGS = [
  "secure-government-document-intelligence",
  "operational-anomaly-detection",
];

export function studiesInGroup(group: CaseStudyGroup, slugs?: string[]) {
  const pool = slugs
    ? CASE_STUDIES.filter((study) => slugs.includes(study.slug))
    : CASE_STUDIES;
  return pool.filter((study) => study.group === group);
}

/**
 * Every study that counts as proof for an industry group, in `proof` order.
 *
 * Driven by `IndustryGroup.proof` rather than by the `industries` array on each
 * study, because the industry page decides which three studies lead it and in
 * what order. `industries` is the reverse index, for anything that starts from a
 * study — currently nothing, but it keeps the relationship declared on both
 * sides so a study added without a home is visible.
 */
export function studiesForIndustry(proof: string[]): CaseStudy[] {
  return proof
    .map((slug) => CASE_STUDIES.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => study !== undefined);
}
