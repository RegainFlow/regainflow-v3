/**
 * Company content. Mission and vision are taken from the RegainFlow model
 * canvas; the principle detail lines are RegainFlow-authored framing, pending
 * commercial review.
 */

export const MISSION =
  "RegainFlow helps organizations move at the speed of their ambition.";

export const MISSION_DETAIL =
  "We focus AI investment on measurable business outcomes, deploy senior operators to execute, and build the secure production capabilities organizations need to scale.";

export const VISION =
  "To be the most trusted AI transformation partner for enterprise and government — known for turning fragmented AI ambition into secure, scalable systems that create measurable competitive advantage.";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Replace the placeholder at this path with a real photograph. */
  image: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Leonardo J. Ramirez",
    role: "co-founder & CEO",
    bio: "Builds AI systems inside environments that do not hand you clean data, a clear brief, or spare time — aerospace, defense, and complex enterprise. Works from the opportunity through to the thing running in production.",
    image: "/brand/team/leo.png",
  },
  {
    name: "William J. Baltus",
    role: "Co-founder & CTO",
    bio: "Engineering leadership across data, platform, and applied AI. Focused on the layer most AI work skips: making a deployed system dependable, observable, and affordable enough to keep.",
    image: "/brand/team/will.svg",
  },
];

/** What clients are actually buying, beyond the deliverable. */
export const PRINCIPLES = [
  {
    index: "01",
    title: "Strategy through production",
    detail:
      "The people who frame the opportunity stay accountable for what ships.",
  },
  {
    index: "02",
    title: "Embedded collaboration without hidden handoffs",
    detail:
      "We work inside your repositories, your review process, and your delivery rhythm.",
  },
  {
    index: "03",
    title:
      "Flexible ownership: continue together, scale down, or transfer cleanly",
    detail:
      "Documentation, runbooks, and working sessions make a handoff a decision rather than a rescue.",
  },
];

/** The manifesto. Written as commitments, because that is what they are. */
export const MANIFESTO = [
  {
    claim: "A pilot is not a result.",
    detail:
      "Demos are cheap and plentiful. The work that matters is everything between a thing that impresses a room and a thing your business runs on Monday.",
  },
  {
    claim: "The boring layer is where the value is.",
    detail:
      "Retrieval, data quality, evaluation, observability, cost control. The market is chasing what is entertaining. We build what holds.",
  },
  {
    claim: "Senior operators, not layers.",
    detail:
      "The same people assess the portfolio, write the code, and run it in production. No handoff between the person who promised it and the person who owes it.",
  },
  {
    claim: "We measure what we claimed we would.",
    detail:
      "Numbers are agreed before a pilot starts, not selected after it ends. Where we cannot measure the return, we say so rather than imply one.",
  },
  {
    claim: "You should be able to leave.",
    detail:
      "Documentation, runbooks, and portability are built in from the start. Dependency is a failure mode, not a business model.",
  },
];
