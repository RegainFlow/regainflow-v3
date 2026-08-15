/**
 * The free assessment.
 *
 * It is the only thing on this site we give away, and it is a real
 * mini-engagement rather than a free first conversation. That distinction is
 * the whole point of this module: the previous copy promised "the first
 * conversation is free", which a reader could reasonably hear as a sales call
 * with no cost attached. What is actually on offer is qualification, a working
 * assessment, a written report, and a follow-up session if one is needed to
 * validate the recommendation.
 *
 * This module used to state that nothing here commits to a duration, a
 * deliverable count, or a number. That is deliberately no longer true — the
 * written report is a committed deliverable and `ASSESSMENT_PROMISE` is a
 * committed sequence. What is still avoided is the other direction: nothing
 * here implies an unlimited free audit, which is why the follow-up in step 04
 * is scoped to validating the recommendation rather than offered open-endedly.
 */

/** The claim, said three ways. Rendered like the headline figures. */
export const ASSESSMENT_PROOF = [
  { value: "$0", label: "What it costs" },
  { value: "None", label: "Obligation after" },
  { value: "Zero", label: "Sales decks involved" },
];

/**
 * What the engagement actually is, in order.
 *
 * Distinct from `ASSESSMENT_STEPS` below and both are rendered: this is the
 * shape of the commitment — four phases, one of them a document — while the
 * steps answer what each phase asks of you and gives back. A reader deciding
 * whether to book wants the first; a reader who has decided wants the second.
 */
export const ASSESSMENT_PROMISE = [
  "Initial qualification and discovery conversation",
  "Deeper working assessment",
  "Short written opportunity report",
  "A focused follow-up audit or scoping session, if needed",
];

/**
 * What the written report covers.
 *
 * Rendered inside step 03 rather than as a block of its own. Step 03 is
 * literally "what you walk away with", which is where a reader wants the
 * report's contents — and a third enumerated list stacked in one section reads
 * as a specification rather than an offer.
 */
export const ASSESSMENT_REPORT_CONTENTS = [
  "Highest-value opportunity",
  "Current blockers and readiness gaps",
  "Data and system dependencies",
  "Security and compliance mandates",
  "Recommended next step",
  "A preliminary path forward, with or without RegainFlow",
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
      "Where the work actually gets stuck: the data you can reach, the systems it depends on and who owns them, the security requirements and compliance mandates it has to clear, the review steps nobody has counted, and the gap between what a demo proved and what production needs.",
  },
  {
    index: "03",
    name: "What you walk away with",
    detail:
      "A short written opportunity report — our honest read on what is worth doing first, what we would leave alone, and what it would genuinely take. Yours to keep and to act on, with or without us.",
  },
  {
    index: "04",
    name: "What happens next",
    detail:
      "Your call. If a focused follow-up audit or scoping session is needed to validate the recommendation, we include it at no cost. If the work is worth funding we will scope it together, and if it is not we will say so — telling you there is nothing here worth funding is a real outcome of this engagement.",
  },
];

export const ASSESSMENT_CTA = "Book the free assessment";

/**
 * Said under the CTA, because it is the misreading the offer invites. A booking
 * link next to the word "assessment" reads as though the call *is* the
 * assessment; it is the qualification conversation that starts one.
 */
export const ASSESSMENT_CALL_NOTE =
  "The 30-minute call is qualification, not the assessment itself.";
