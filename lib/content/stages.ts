import type { StageModelId } from "@/components/stage-models/StageModel";

export type StageId = Extract<StageModelId, "discover" | "implement" | "scale">;

export interface Stage {
  id: StageId;
  index: string;
  name: string;
  promise: string;
  /** One line. Used on the home summary, where there is no room for `copy`. */
  summary: string;
  copy: string;
  listLabel: string;
  items: string[];
  transformation: string;
}

/**
 * The three services, shared by the home summary and the full `/services`
 * panels so the two can never drift.
 */
export const STAGES: Stage[] = [
  {
    id: "discover",
    index: "01",
    name: "Discover",
    promise: "Find the leverage",
    summary:
      "We find the AI work that is actually worth doing, and stop the work that isn't.",
    copy: "Assess the AI portfolio, operating model, active initiatives, talent, infrastructure, and business priorities. Stop or deprioritize low-value activity and define the measurable opportunity.",
    listLabel: "Outputs",
    items: [
      "AI portfolio and ROI direction",
      "Readiness and operating-model audit",
      "Use-case prioritization",
      "Solution architecture",
      "Delivery roadmap",
    ],
    transformation: "Uncertainty → focused delivery plan",
  },
  {
    id: "implement",
    index: "02",
    name: "Implement",
    promise: "Build the whole system",
    summary:
      "We build and ship the production system — not a prototype you have to finish.",
    copy: "Own qualified initiatives from architecture through engineering, integration, evaluation, deployment, and adoption. Build the model, data, application, platform, and workflow layers together.",
    listLabel: "Capabilities",
    items: [
      "GenAI and ML engineering",
      "Data and knowledge engineering",
      "Full-stack product and workflow engineering",
      "API and enterprise integration",
      "Cloud and platform engineering",
      "Evaluation, testing, and production deployment",
    ],
    transformation: "Delivery plan → working production system",
  },
  {
    id: "scale",
    index: "03",
    name: "Scale",
    promise: "Make it dependable—and yours",
    summary:
      "We build the operating layer that keeps it running, then hand you the keys.",
    copy: "Build the operating capabilities required to run AI reliably, improve it with evidence, control cost and risk, and keep ownership flexible.",
    listLabel: "Capabilities",
    items: [
      "Evaluation and quality systems",
      "Observability and operational visibility",
      "MLOps and LLMOps",
      "Inference performance and cost controls",
      "Security and governance",
      "Model and vendor portability",
      "Managed operation, knowledge transfer, or structured handoff",
    ],
    transformation: "Working system → dependable organizational capability",
  },
];

/**
 * The shape of the commitment, and deliberately only the shape. Scope, price,
 * and success measures belong to a specific engagement and are agreed there —
 * putting them on a marketing page would be promising something before we know
 * what we are looking at.
 */
export const ENGAGEMENT_PATH = [
  {
    step: "01",
    name: "Free assessment",
    detail:
      "A working conversation about what you are trying to move into production, what is already in flight, and where the real obstacle sits. No cost and no obligation.",
    output: "A clear read on what is worth doing",
  },
  // "First production workflow", not "Pilot". The manifesto opens with "A pilot
  // is not a result", so selling one as step two was the site contradicting
  // itself in two places a reader can hold at once. The rename is also the more
  // accurate description: this ships into the real environment.
  {
    step: "02",
    name: "First production workflow",
    detail:
      "Start with the highest-value feasible workflow, deploy it in the real environment, and measure whether it earns expansion. One team, defined sources, and a representative set of questions the system has to answer — scoped together before it starts.",
    output: "A working system in one workflow",
  },
  {
    step: "03",
    name: "Managed operations or transfer",
    detail:
      "Ongoing ownership of source synchronization, permissions, evaluation, freshness, usage, and the next workflows — for as long as it is useful. Scale it down or transfer it whenever you choose.",
    output: "A capability that keeps improving",
  },
];
