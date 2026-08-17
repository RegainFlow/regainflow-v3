import type { IconName } from "@/components/Icon";

/**
 * Company content. Mission and vision are taken from the RegainFlow model
 * canvas; the principle detail lines are RegainFlow-authored framing, pending
 * commercial review.
 *
 * `IconName` is a type-only import, so this module still ships no runtime
 * dependency on the component layer — see `components/Icon.tsx` for why the
 * icon is a name here rather than a component.
 */

export const MISSION =
  "RegainFlow helps organizations move at the speed of their ambition.";

export const MISSION_DETAIL =
  "We focus AI investment on measurable business outcomes, deploy senior operators to execute, and build the secure production capabilities organizations need to scale.";

export const VISION =
  "To be the most trusted AI engineering and transformation partner for public agencies and complex organizations — known for turning fragmented AI ambition into secure, scalable systems their own teams can operate.";

export interface TeamMember {
  name: string;
  role: string;
  /**
   * One line. Deliberately short: `peopleJsonLd()` emits it as the `Person`
   * node's `description`, where a three-paragraph biography is noise. The long
   * form goes in `detail`.
   */
  bio: string;
  /**
   * The full account, a paragraph per element. Rendered on `/company#about`
   * and `/llm-info#people`.
   *
   * Optional, and that is load-bearing rather than laziness — it lets one
   * founder's entry be expanded without leaving the other looking unfinished,
   * and lets the second land later with no layout work.
   */
  detail?: string[];
  /**
   * Short mono chips — rank, service, where they are. Rendered with `.rf-mech`.
   * Facts, not claims: anything here has to be something the person stated.
   */
  credentials?: string[];
  /** Replace the placeholder at this path with a real photograph. */
  image: string;
  /**
   * Public profile URL, emitted as `sameAs` on the `Person` node. Left unset
   * until the real URL is known: an unverifiable profile link weakens the
   * entity claim it is supposed to strengthen.
   */
  profile?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Leonardo J. Ramirez",
    role: "Co-founder & CEO",
    bio: "Staff full-stack engineer and AI/ML technical lead before he was a founder. Builds AI systems inside environments that do not hand you clean data, a clear brief, or spare time — law enforcement, aerospace, defense, and complex enterprise.",
    detail: [
      "An Army officer before he was an engineer, which is most of how he reads an unfamiliar organization quickly. He served to Captain across three specialties — Engineer, then Signal supporting Space and Missile Defense, then Cyber Warfare running defensive operations at the national level.",
      "Outside the work he tracks where technology is heading rather than where it is, writes and publishes what he learns, and mentors engineers from first job through principal. The instinct is entrepreneurial: find the problem worth solving, then find the way through that nobody has tried yet.",
    ],
    credentials: ["Captain, U.S. Army"],
    image: "/brand/team/leo.png",
    profile: "https://www.linkedin.com/in/leonardo-j-ramirez/",
  },
  {
    name: "William J. Baltus",
    role: "Co-founder & CTO",
    bio: "Engineering leadership across data, platform, and applied AI. Focused on the layer most AI work skips: making a deployed system dependable, observable, and affordable enough to keep.",
    detail: [
      "A software engineer by training and by temperament, working the part of the problem that decides whether a system survives contact with production — the data path, the platform underneath it, and the instrumentation that tells you the truth about both. Most AI work treats that as someone else's job afterwards. He treats it as the design.",
      "Continues to work at the research edge of robotics and machine learning, which keeps the architecture decisions honest: what is actually ready to deploy, what is a paper, and what will cost more to operate than it returns.",
    ],
    credentials: ["B.E. Software Engineering, Stevens Institute"],
    image: "/brand/team/will.jpg",
    profile: "https://www.linkedin.com/in/william-baltus/",
  },
];

/**
 * What clients are actually buying, beyond the deliverable.
 *
 * Three parallel principles, not three steps — there is no order here, and the
 * `01/02/03` these used to carry implied one. They take icons instead; see
 * `docs/DESIGN.md` for when each treatment applies.
 */
export const PRINCIPLES: {
  icon: IconName;
  title: string;
  detail: string;
}[] = [
  {
    icon: "workflow",
    title: "Strategy through production",
    detail:
      "The people who frame the opportunity stay accountable for what ships.",
  },
  {
    icon: "team",
    title: "Embedded collaboration without hidden handoffs",
    detail:
      "We work inside your repositories, your review process, and your delivery rhythm.",
  },
  {
    // The site already says "hand you the keys" in `STAGES`; this is that
    // sentence's mark.
    icon: "keys",
    title:
      "Flexible ownership: continue together, scale down, or transfer cleanly",
    detail:
      "Documentation, runbooks, and working sessions make a handoff a decision rather than a rescue.",
  },
];

/**
 * The manifesto. Written as commitments, because that is what they are.
 *
 * It also carries the company's core values, which are these, as stated:
 *
 * 1. Carrying our clients' values, virtues, and vision.
 * 2. Always learning and striving to innovate.
 * 3. Never exploiting a single human being — we all deserve what we are worth.
 * 4. Leading by example and paying it forward.
 *
 * They are folded into the list rather than published beside it as a second
 * panel of abstract nouns. A value that is not stated as something you would
 * refuse to do is decoration, and this site's register is a flat claim followed
 * by the reasoning that earns it. Entries 04, 06, and 07 are where the four
 * land; the delivery commitments still open and close the list.
 */
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
    claim: "We carry your values, not just your requirements.",
    detail:
      "A system inherits the judgment of whoever built it. We learn what your organization protects — its mission, its standards, the things it will not trade away — and build those in, rather than handing back something technically correct and culturally foreign.",
  },
  {
    claim: "We measure what we claimed we would.",
    detail:
      "Numbers are agreed before a pilot starts, not selected after it ends. Where we cannot measure the return, we say so rather than imply one.",
  },
  {
    claim: "Standing still is a decision.",
    detail:
      "We track where the technology is heading, not only where it is this quarter. New stacks get learned and then adopted or ruled out on evidence — so what we recommend is what the problem needs, not the last thing we happened to be good at.",
  },
  {
    claim: "Nobody gets used.",
    detail:
      "Not our people, not yours, not a subcontractor two layers down. Paid what the work is worth, credited where it was earned, and taught what we know — the engineers we mentor are supposed to outgrow needing us.",
  },
  {
    claim: "You should be able to leave.",
    detail:
      "Documentation, runbooks, and portability are built in from the start. Dependency is a failure mode, not a business model.",
  },
];
