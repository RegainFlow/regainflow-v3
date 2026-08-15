/**
 * RegainFlow's own engagements.
 *
 * Two rules govern every entry here, and they are the reason the copy reads the
 * way it does:
 *
 * 1. **Nothing is named without written client approval.** No company,
 *    customer, internal platform, program, or project name appears — only the
 *    industry or environment the work ran in. These three are anonymized
 *    pending approval; when it arrives, the name is a copy edit, not a
 *    restructure.
 * 2. **No metric until we can defend it.** There are no figures on these
 *    studies, and that is deliberate rather than an omission waiting to be
 *    filled. A number goes here only once we can explain how it was measured
 *    and hold that explanation up in a procurement conversation. Until then the
 *    engineering challenge, our exact role, what we built, and the production
 *    outcome are the stronger proof — a plausible invented figure is worse than
 *    no figure, and a real figure we cannot source is not much better.
 *
 * This module previously held twelve studies from the founders' pre-RegainFlow
 * careers. They were removed rather than relabelled: presented on this site
 * they read as RegainFlow delivery, which is not what they were. That
 * experience now appears where it belongs — as one supporting credibility line
 * in the founder bios on `/company`.
 *
 * The six narrative fields are the same on every study and render in the order
 * they are declared in the interface. Keep them parallel: a reader comparing
 * two studies is comparing the same six answers.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  /** Industry or environment. Leads the card and the OG eyebrow. */
  industry: string;
  /** One executive-legible line. The only body copy on the card. */
  summary: string;
  /** Rendered as visible chips on the card and used as JSON-LD `keywords`. */
  capabilityTags: string[];
  /** Where the work started: the organization's situation, in their terms. */
  context: string;
  /** What made it hard. The constraints a reader should recognise. */
  constraints: string;
  /** Our exact scope. Says plainly what we did and did not own. */
  role: string;
  /** What we engineered. One line each, concrete. */
  engineered: string[];
  /** What the work produced. */
  outcome: string;
  /** What changed as a result, or where it goes next. */
  next: string;
  /**
   * `IndustryGroup` slugs this study is proof for. The reverse index — an
   * industry page picks and orders its own studies through `IndustryGroup.proof`.
   *
   * Absent where the engagement's sector is not one of the four groups, which
   * is a real state and not an oversight.
   */
  industries?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ai-engineering-enablement",
    title: "AI Engineering Enablement for a Consulting Organization",
    industry: "Professional Services",
    summary:
      "Two tailored workshops on how the traditional SDLC is changing for AI-assisted development, and how delivery teams apply that shift to the projects already on their desks.",
    capabilityTags: [
      "AI-assisted development",
      "SDLC design",
      "Engineering enablement",
      "Technical workshops",
    ],
    context:
      "A consulting organization whose delivery teams were adopting AI-assisted development on their own, project by project, with no shared account of what changes about the way software gets planned, reviewed, and shipped when a substantial share of it is written with AI assistance.",
    constraints:
      "The teams were not starting from zero and were not idle. Anything we taught had to apply to work already in flight rather than to a greenfield exercise, and it had to hold up against a delivery process the organization had good reasons for — review gates, estimation practice, and client commitments that do not pause for a new tool.",
    role:
      "RegainFlow designed and delivered the enablement directly. We scoped the material against how these teams actually work, built both sessions, and ran them. This was an enablement engagement, not a delivery one: we did not take ownership of any of the organization's client projects.",
    engineered: [
      "Two workshops, each tailored to the organization's own delivery process rather than delivered from a standard deck.",
      "A working account of how the traditional SDLC shifts under AI-assisted development — where the effort moves, which stages compress, and which review steps get more important rather than less.",
      "Applied exercises tied to the teams' active projects, so the approach was tested against real work in the room.",
    ],
    outcome:
      "Delivery teams came away with a shared vocabulary for AI-assisted development and a concrete way to apply it to the projects they were already running, in place of the per-team improvisation they started with.",
    next:
      "The material is built to be re-run and extended as the practice matures, and as the organization's own delivery standards catch up with what its teams are doing.",
  },
  {
    slug: "government-energy-rag-platform",
    title: "Government Energy RAG Platform",
    industry: "Government & Energy",
    summary:
      "Technical leadership on an internal knowledge assistant for a government energy organization — document ingestion, retrieval architecture, and the path from answering questions to running multi-step work.",
    capabilityTags: [
      "Retrieval-augmented generation",
      "Document ingestion",
      "Elastic retrieval",
      "Azure and .NET",
      "Agentic workflows",
    ],
    context:
      "A government energy organization building an internal knowledge assistant over its own document estate, so that staff could get answers out of material that previously had to be found and read.",
    constraints:
      "A government environment, on an Azure and .NET stack the organization already ran and had to keep running. The architecture had to fit the platform and the operating practices in place rather than arrive as something adjacent to them, and the retrieval had to hold up against real documents rather than a curated sample.",
    role:
      "RegainFlow provided technical leadership on the platform. We led the architecture for document ingestion and Elastic-based retrieval and stayed close to the engineering as it was built, working inside the organization's stack and delivery process.",
    engineered: [
      "A document ingestion path that takes the organization's own material into a form retrieval can actually use.",
      "An Elastic-based retrieval architecture sized to the corpus and to the questions being asked of it.",
      "An assistant built on the Azure and .NET platform already in place, so it is operated by the team that operates everything else.",
    ],
    outcome:
      "An internal knowledge assistant in the organization's own environment, answering questions from its document estate on infrastructure its team already knows how to run.",
    next:
      "The system is evolving from single-turn question answering toward multi-step agentic workflows — moving from answering a question to carrying out the work the answer implies.",
    industries: ["federal-state-local"],
  },
  {
    slug: "aerospace-rag-evaluation",
    title: "Aerospace Manufacturing RAG Evaluation and Delivery",
    industry: "Aerospace Manufacturing",
    summary:
      "Led the evaluation harness and document-processing comparison behind a retrieval system, introduced Docling, and helped the delivery team reach a critical milestone.",
    capabilityTags: [
      "Evaluation harness",
      "Document processing",
      "Docling",
      "Data-quality pipeline",
      "Hybrid retrieval",
    ],
    context:
      "An aerospace manufacturing retrieval program where the quality of the answers depended on how well complex technical documents survived processing — and where nobody could yet say, with evidence, which processing approach was doing that best.",
    constraints:
      "A live delivery effort working to a critical milestone, so the evaluation had to inform decisions on the schedule the team was already on rather than run beside it. The documents were the hard part: technical manufacturing material whose structure carries meaning that a naive extraction discards.",
    role:
      "RegainFlow led the evaluation harness and the document-processing comparison, and advised on the data-quality pipeline and the hybrid retrieval architecture. We worked alongside the client's delivery team rather than in place of it, and helped them hit the milestone.",
    engineered: [
      "An evaluation harness that made document-processing and retrieval quality a measured result rather than an opinion.",
      "A structured comparison of document-processing approaches, run against the program's own material.",
      "The introduction of Docling into the processing pipeline, on the evidence the comparison produced.",
      "Architectural guidance on the data-quality pipeline and on hybrid retrieval.",
    ],
    outcome:
      "The team could show which processing approach performed better and why, and made its architecture decisions on measured evidence. The critical milestone was met.",
    next:
      "The harness outlasts the engagement: it is the mechanism that tells the team whether the next change to processing or retrieval helped or hurt.",
    industries: ["defense-aerospace"],
  },
];

/**
 * Every study that counts as proof for an industry group, in `proof` order.
 *
 * Driven by `IndustryGroup.proof` rather than by the `industries` array on each
 * study, because the industry page decides which studies lead it and in what
 * order. `industries` is the reverse index, so the relationship stays declared
 * on both sides and a study added without a home is visible.
 *
 * Returns an empty array for a group with no proof, which is a real state now
 * rather than a bug — see the note in `lib/content/industries.ts`.
 */
export function studiesForIndustry(proof: string[]): CaseStudy[] {
  return proof
    .map((slug) => CASE_STUDIES.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => study !== undefined);
}
