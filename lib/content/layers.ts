export interface Layer {
  index: string;
  name: string;
  enables: string;
  mechanisms: string[];
}

/**
 * The four layers we engineer. Enabling lines are RegainFlow-authored framing,
 * pending commercial review.
 */
export const LAYERS: Layer[] = [
  {
    index: "L1",
    name: "AI & Intelligence",
    enables:
      "Systems that reason over your context and can be measured, not only demonstrated.",
    mechanisms: [
      "Agents",
      "RAG",
      "Applied ML",
      "Model integration",
      "Evaluation",
    ],
  },
  {
    index: "L2",
    name: "Data & Knowledge",
    enables:
      "The right information reaching the model, with quality and access you can defend.",
    mechanisms: ["Pipelines", "Retrieval", "Quality", "Access", "Governance"],
  },
  {
    index: "L3",
    name: "Product & Workflow",
    enables: "AI that lands inside the work people already do.",
    mechanisms: ["Applications", "Interfaces", "Integrations", "Automation"],
  },
  {
    index: "L4",
    name: "Platform & Operations",
    enables:
      "Systems that stay reliable, observable, and affordable once they carry real load.",
    mechanisms: [
      "Cloud",
      "Deployment",
      "Inference",
      "Observability",
      "MLOps / LLMOps",
      "Security",
      "Cost",
    ],
  },
];
