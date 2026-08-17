import type { IconName } from "@/components/Icon";

/**
 * The free assessment.
 *
 * It is the only thing on this site we give away, and it is a real
 * mini-engagement rather than a free first conversation. That distinction is
 * the whole point of this module: "the first conversation is free" invites the
 * reading that this is a sales call with no cost attached. What is on offer is
 * qualification, a working assessment, a written report, and a follow-up
 * session where one is needed to validate the recommendation.
 *
 * ## One list, not two
 *
 * This used to hold `ASSESSMENT_PROMISE` (four phases: qualification, working
 * assessment, written report, follow-up) *and* `ASSESSMENT_STEPS` (four steps:
 * what you bring, what we look at, what you walk away with, what happens next).
 * They were the same four phases written from two angles, which is why the
 * section rendered two lists both numbered 01–04 and read as twice the process
 * it actually is.
 *
 * They are one list now, and the merge fixed a copy problem as well as a layout
 * one: "What you bring" as a heading tells a reader nothing about what happens,
 * where "Qualification call" does. The old framing survives inside each
 * `detail`, which is where it always belonged.
 *
 * ## What this module does and does not promise
 *
 * An earlier version stated that nothing here commits to a duration, a
 * deliverable count, or a number. That is deliberately no longer true — the
 * written report is a committed deliverable and the four phases are a committed
 * sequence, because a reader deciding whether to book needs to know what
 * arrives. What is still avoided is the other direction: nothing here implies
 * an unlimited free audit, which is why phase 04 is scoped to validating the
 * recommendation rather than offered open-endedly.
 *
 * `IconName` is the only import, and it is a type-only import — this module
 * still ships no runtime dependency on the component layer. See
 * `components/Icon.tsx` for why the icon is a string here rather than a
 * component.
 */

/**
 * The claim, said three ways.
 *
 * `$0` now leads `AssessmentReport` as the price mark, so `FreeAssessment` no
 * longer renders this trio — the panel says the same thing with the deliverable
 * attached. Retained because `AssessmentCallout` and `app/llms.txt/route.ts`
 * still read it, and because "no obligation" and "no sales decks" are answers
 * to objections the price alone does not address.
 */
export const ASSESSMENT_PROOF = [
  { value: "$0", label: "What it costs" },
  { value: "None", label: "Obligation after" },
  { value: "Zero", label: "Sales decks involved" },
];

export interface ReportSection {
  label: string;
  icon: IconName;
}

/**
 * What the written report covers — the answer to "what am I actually getting",
 * and the reason `AssessmentReport` exists to render it as a document.
 *
 * These six carry icons where the rest of the site's lists do not, and they are
 * the strongest case for them anywhere here: six genuinely distinct categories,
 * no order between them, each one a thing rather than an argument.
 */
export const ASSESSMENT_REPORT_CONTENTS: ReportSection[] = [
  { label: "Highest-value opportunity", icon: "opportunity" },
  { label: "Current blockers and readiness gaps", icon: "hardHat" },
  { label: "Data and system dependencies", icon: "dependencies" },
  { label: "Security and compliance mandates", icon: "security" },
  { label: "Recommended next step", icon: "nextStep" },
  { label: "A path forward, with or without RegainFlow", icon: "path" },
];

/** The document itself, named and priced. Rendered by `AssessmentReport`. */
export const REPORT_NAME = "Opportunity report";
export const REPORT_PRICE = "$0";
export const REPORT_TERMS = "Yours to keep · No obligation";

export interface AssessmentPhase {
  /** A real sequence, so it keeps its number. See `docs/DESIGN.md`. */
  index: string;
  /** What happens, not what it means for you. The detail carries that. */
  name: string;
  detail: string;
}

export const ASSESSMENT_PHASES: AssessmentPhase[] = [
  {
    index: "01",
    name: "Qualification call",
    detail:
      "Thirty minutes, and it is qualification rather than the assessment itself. Bring whatever you already have — a stalled pilot, an initiative that has not started, a modernization program someone handed you, or just the suspicion that AI should be doing more here than it is.",
  },
  {
    index: "02",
    name: "Working assessment",
    detail:
      "We look at where the work actually gets stuck: the data you can reach, the systems it depends on and who owns them, the security requirements and compliance mandates it has to clear, the review steps nobody has counted, and the gap between what a demo proved and what production needs.",
  },
  {
    index: "03",
    name: "Written report",
    detail:
      "A short opportunity report — our honest read on what is worth doing first, what we would leave alone, and what it would genuinely take. Yours to keep and to act on, with or without us.",
  },
  {
    index: "04",
    name: "Follow-up, if needed",
    detail:
      "If a focused audit or scoping session is needed to validate the recommendation, we include it at no cost. If the work is worth funding we will scope it together, and if it is not we will say so — telling you there is nothing here worth funding is a real outcome of this engagement.",
  },
];

export const ASSESSMENT_CTA = "Book the free assessment";
