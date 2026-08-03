/**
 * Selected enterprise AI and platform experience.
 *
 * Three rules govern every entry here, and they are the reason the copy reads
 * the way it does:
 *
 * 1. Nothing is named. No company, customer, internal platform, program, or
 *    project name appears — only the industry or environment the work ran in.
 * 2. These are anonymized examples of enterprise work completed by the
 *    founders. They are not all direct RegainFlow client engagements, and
 *    `EXPERIENCE_DISCLAIMER` says so anywhere a study is shown.
 * 3. `metric` is present only where a figure was confirmed. Two of the twelve
 *    have one. The other ten carry no number rather than a soft one, because a
 *    plausible invented figure is worse than no figure at all.
 *
 * Cards carry the executive summary; `challenge`, `solution`, `capabilities`,
 * and `technologies` are detail-page only.
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

export interface CaseStudy {
  slug: string;
  title: string;
  /** Industry or environment. Leads the card. */
  industry: string;
  /** One executive-legible line. The only body copy on the card. */
  summary: string;
  group: CaseStudyGroup;
  /** Only where confirmed. Never synthesized. */
  metric?: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  impact: string;
  /** Named only where the stack itself is the point. */
  technologies?: string;
}

/**
 * Shown beside every case study, on the listing and on each detail page — a
 * study reached directly from search has to carry the same qualification the
 * listing does. Worded without "below" for exactly that reason: on a study page
 * there is nothing below it.
 */
export const EXPERIENCE_DISCLAIMER =
  "Anonymized examples of enterprise work completed by the founders. Not every project was a direct RegainFlow client engagement.";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "workforce-data-validation-platform",
    title: "Enterprise Workforce Data Validation Platform",
    industry: "Aerospace & Defense",
    summary:
      "A manual, hard-to-audit payroll validation process became a scalable platform that checks workforce data automatically and shows its work.",
    group: "Platform Modernization & Interoperability",
    metric: "$8M estimated annual savings",
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
    impact:
      "Reduced manual validation effort, improved auditability, and generated an estimated $8 million in annual operational savings.",
  },
  {
    slug: "document-intelligence-platform",
    title: "AI-Powered Document Intelligence Platform",
    industry: "Aerospace & Engineering",
    summary:
      "Large collections of complex enterprise documents became searchable, summarized, and usable by people who are not document specialists.",
    group: "Enterprise AI & Knowledge Systems",
    challenge:
      "Employees needed a faster way to process, summarize, search, and understand large collections of complex enterprise documents distributed across multiple repositories.",
    solution:
      "Developed an AI-powered knowledge-processing platform that combined document ingestion, text extraction, language models, visual document understanding, summarization, metadata enrichment, and enterprise search.",
    capabilities: [
      "Multi-format document ingestion",
      "Automated document summarization",
      "Visual-language model processing",
      "Metadata extraction and enrichment",
      "Searchable enterprise knowledge",
      "Integration with existing enterprise applications",
    ],
    impact:
      "Made complex technical information more accessible to nontechnical users and established the foundation for more advanced enterprise AI and retrieval capabilities.",
  },
  {
    slug: "agentic-knowledge-assistant",
    title: "Agentic Enterprise Knowledge Assistant",
    industry: "Aerospace & Defense",
    summary:
      "Search could find documents but could not answer questions. This system answers them, holds context, and refuses to invent what it cannot support.",
    group: "Enterprise AI & Knowledge Systems",
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
    impact:
      "Improved the accuracy and usability of enterprise question answering while providing a governed foundation for secure AI assistance.",
  },
  {
    slug: "enterprise-search-modernization",
    title: "Enterprise Search Modernization",
    industry: "Aerospace & Engineering",
    summary:
      "Keyword-only search across more than a million records was rebuilt so employees find what they mean, not only what they typed.",
    group: "Enterprise AI & Knowledge Systems",
    metric: "1M+ records searchable",
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
    impact:
      "Improved the relevance of enterprise search results and enabled users to discover information that was difficult to locate through traditional keyword matching.",
  },
  {
    slug: "workforce-systems-interoperability",
    title: "Workforce Systems Interoperability Platform",
    industry: "Aerospace & Defense",
    summary:
      "Workforce, payroll, and human-capital systems stopped being wired together one pair at a time and started sharing one set of contracts.",
    group: "Platform Modernization & Interoperability",
    challenge:
      "Workforce, payroll, and human-capital systems operated through fragmented interfaces, inconsistent data structures, and manually coordinated workflows.",
    solution:
      "Designed an interoperability layer that connected workforce applications through standardized APIs, shared data contracts, validation services, automated ingestion, and reusable integration components.",
    capabilities: [
      "Standardized enterprise APIs",
      "Shared workforce data contracts",
      "Cross-system data validation",
      "Automated data synchronization",
      "Reusable integration services",
      "Centralized error handling and observability",
    ],
    impact:
      "Reduced integration complexity, improved data consistency, and made it easier to introduce new workforce applications without creating additional point-to-point connections.",
  },
  {
    slug: "secure-internal-paas",
    title: "Secure Internal Platform-as-a-Service",
    industry: "Regulated Enterprise & Defense",
    summary:
      "Every team was rebuilding the same infrastructure, pipelines, and security controls. One secure platform now provides them once.",
    group: "Platform Modernization & Interoperability",
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
    technologies:
      "Kubernetes, OpenShift, Terraform, Ansible, containerized services, and automated CI/CD workflows.",
    impact:
      "Reduced repeated infrastructure work, improved deployment consistency, and accelerated the delivery of secure enterprise applications.",
  },
  {
    slug: "operational-anomaly-detection",
    title: "AI-Driven Operational Anomaly Detection",
    industry: "Aerospace & Mission Operations",
    summary:
      "Analysts were reading operational and telemetry data by hand. Models now establish what normal looks like and surface what departs from it.",
    group: "Analytics & Digital Engineering",
    challenge:
      "Large volumes of operational and telemetry data made it difficult for analysts to identify abnormal behavior, emerging risks, and subtle performance changes through manual review alone.",
    solution:
      "Developed machine-learning and analytical workflows that established expected behavior, processed historical and operational data, detected deviations, and surfaced anomalies for analyst review.",
    capabilities: [
      "Time-series and operational data processing",
      "Baseline behavior modeling",
      "Automated anomaly detection",
      "Trend and deviation analysis",
      "Analyst-focused visualization",
      "Repeatable model-evaluation workflows",
    ],
    impact:
      "Helped analysts identify unusual operational behavior earlier and reduced the amount of data requiring manual inspection.",
  },
  {
    slug: "digital-engineering-simulation",
    title: "Digital Engineering & Simulation Workflow Modernization",
    industry: "Aerospace & Defense",
    summary:
      "Specialized engineering and simulation work stopped depending on manual data movement between disconnected tools.",
    group: "Analytics & Digital Engineering",
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
    impact:
      "Reduced workflow fragmentation and made specialized engineering processes easier to operate, maintain, and scale.",
  },
  {
    slug: "enterprise-workflow-acceleration",
    title: "Enterprise Workflow Acceleration Platform",
    industry: "Large-Scale Enterprise Operations",
    summary:
      "A process that made employees hop between disconnected systems and retype the same information became one automated workflow.",
    group: "Platform Modernization & Interoperability",
    challenge:
      "A complex operational workflow required employees to move between disconnected systems, manually coordinate process steps, and repeatedly enter or transform information.",
    solution:
      "Built a modern workflow platform that combined automation, application services, reusable APIs, data processing, and a simplified user experience.",
    capabilities: [
      "End-to-end workflow automation",
      "Modern user interfaces",
      "API-driven system integration",
      "Automated data transformation",
      "Process-status visibility",
      "Reusable enterprise services",
    ],
    impact:
      "Reduced manual handoffs, simplified complex workflows, and created a more maintainable foundation for future process automation.",
  },
  {
    slug: "market-competitive-intelligence",
    title: "AI-Powered Market & Competitive Intelligence",
    industry: "Aerospace & Strategic Intelligence",
    summary:
      "Analysts tracking competitors, technologies, and market movement got one place to search, summarize, and connect fragmented sources.",
    group: "Enterprise AI & Knowledge Systems",
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
    impact:
      "Reduced the time required to research strategic topics and helped decision-makers convert unstructured information into actionable intelligence.",
  },
  {
    slug: "secure-government-document-intelligence",
    title: "Secure Government Document Intelligence System",
    industry: "Government & National Security",
    summary:
      "Reliable answers from complex document collections, with every answer traceable to its source and access controls holding at every level.",
    group: "Enterprise AI & Knowledge Systems",
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
    impact:
      "Created a scalable and governed foundation for enterprise knowledge retrieval while improving access to information contained in complex government documents.",
  },
  {
    slug: "manufacturing-knowledge-intelligence",
    title: "Manufacturing & Engineering Knowledge Intelligence",
    industry: "Aerospace Manufacturing",
    summary:
      "Engineers got a dependable way to locate and interpret information buried across manufacturing and technical documentation.",
    group: "Enterprise AI & Knowledge Systems",
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
    impact:
      "Improved access to manufacturing and engineering knowledge while creating a foundation for reliable AI-assisted technical workflows.",
  },
];

/** Restated from published totals. RegainFlow's own, not the studies above. */
export const HEADLINE_FIGURES = [
  { value: "$5M+", label: "Estimated value created" },
  { value: "5,000+", label: "Hours of work reduced" },
  { value: "18+", label: "Client transformations delivered" },
];

/** The six shown up front on `/insights`. The rest sit in the disclosure. */
export const FEATURED_SLUGS = [
  "workforce-data-validation-platform",
  "agentic-knowledge-assistant",
  "enterprise-search-modernization",
  "secure-internal-paas",
  "secure-government-document-intelligence",
  "manufacturing-knowledge-intelligence",
];

/**
 * The two shown on the home proof strip — one platform, one AI, and two
 * different industries, because `industry` leads the card and a matched pair
 * both reading "Aerospace & Defense" looks like one study printed twice.
 */
export const HOME_SLUGS = [
  "workforce-data-validation-platform",
  "secure-government-document-intelligence",
];

export function studiesInGroup(group: CaseStudyGroup, slugs?: string[]) {
  const pool = slugs
    ? CASE_STUDIES.filter((study) => slugs.includes(study.slug))
    : CASE_STUDIES;
  return pool.filter((study) => study.group === group);
}
