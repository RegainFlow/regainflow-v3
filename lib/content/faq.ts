/**
 * The questions a buyer actually asks, answered in their own terms.
 *
 * Written answer-first on purpose: retrieval is chunk-level, so an answer that
 * arrives in the first sentence survives being lifted out of the page, and one
 * that builds to a conclusion does not. Every claim here restates something
 * already committed to elsewhere in `lib/content/*` — this module adds phrasing,
 * not new promises.
 *
 * Rendered visibly on `/llm-info` and emitted as `FAQPage` from the same array,
 * because structured data that disagrees with the visible page is a rich-result
 * violation rather than a shortcut.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "What does RegainFlow do?",
    answer:
      "RegainFlow is an AI transformation partner that takes AI work from opportunity to production system. The engagement runs in three stages: Discover finds the AI work worth funding and stops the work that is not, Implement builds and ships the production system rather than a prototype you have to finish, and Scale builds the operating layer that keeps it running and then transfers it to your team.",
  },
  {
    question: "Who does RegainFlow work with?",
    answer:
      "Aerospace and industrial engineering organizations, and federal contractors carrying AI, data, and modernization scope. The common thread is environments that do not hand you clean data, a clear brief, or spare time — complex enterprise settings where the obstacle is rarely the model itself.",
  },
  {
    question: "How does an engagement start?",
    answer:
      "With a free assessment. It is a working conversation about what you are trying to move into production, what is already in flight, and where the real obstacle sits. There is no cost and no obligation, and you leave with an honest read on what is worth doing first — yours to keep and act on, including without us.",
  },
  {
    question: "What does it cost to start?",
    answer:
      "Nothing. The first assessment is free, carries no obligation, and involves no sales decks. Scope, price, and success measures belong to a specific engagement and are agreed there — quoting them before we have seen the problem would be promising something we cannot yet know.",
  },
  {
    question: "How is RegainFlow different from a typical AI consultancy?",
    answer:
      "The same senior operators assess the portfolio, write the code, and run it in production — there is no handoff between the person who promised the work and the person who owes it. The focus is deliberately on the layer most AI work skips: retrieval, data quality, evaluation, observability, and cost control, which is what separates a demo from a system your business runs on Monday.",
  },
  {
    question: "Can our team take over the system afterwards?",
    answer:
      "Yes, and it is designed for that from the start. Documentation, runbooks, and portability are built in, so a handoff is a decision rather than a rescue. You can continue together, scale down, or transfer cleanly — dependency is treated as a failure mode, not a business model.",
  },
  {
    question: "Where is RegainFlow based?",
    answer:
      "Orlando, Florida, serving organizations across the United States. Work is done inside your repositories, your review process, and your delivery rhythm rather than at arm's length.",
  },
];
