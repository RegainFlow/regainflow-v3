/**
 * The free assessment.
 *
 * It is the only thing on this site we give away, so the page says so three
 * times and in plain words. Nothing here commits to a duration, a deliverable
 * count, or a number — the point is to make the first step obviously free and
 * obviously low-risk, not to pre-sell what comes after it.
 */

/** The claim, said three ways. Rendered like the headline figures. */
export const ASSESSMENT_PROOF = [
  { value: "$0", label: "What it costs" },
  { value: "None", label: "Obligation after" },
  { value: "Zero", label: "Sales decks involved" },
];

export interface AssessmentStep {
  index: string;
  name: string;
  detail: string;
}

export const ASSESSMENT_STEPS: AssessmentStep[] = [
  {
    index: "01",
    name: "What you bring",
    detail:
      "Whatever you already have — a stalled pilot, an initiative that has not started, a modernization program someone handed you, or just the suspicion that AI should be doing more here than it is.",
  },
  {
    index: "02",
    name: "What we look at",
    detail:
      "Where the work actually gets stuck: the data you can reach, the systems it has to pass through, the review steps nobody has counted, and the gap between what a demo proved and what production needs.",
  },
  {
    index: "03",
    name: "What you walk away with",
    detail:
      "Our honest read on what is worth doing first, what we would leave alone, and what it would genuinely take. Yours to keep and to act on, including without us.",
  },
  {
    index: "04",
    name: "What happens next",
    detail:
      "Only what you decide. If a pilot makes sense we will scope one together. If it does not, we will say so — telling you there is nothing here worth funding is a real outcome of this conversation.",
  },
];

export const ASSESSMENT_CTA = "Book the free assessment";
