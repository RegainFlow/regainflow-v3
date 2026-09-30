/**
 * The blog's topic clusters.
 *
 * Three, each mapped to something RegainFlow sells, and each with a hub page at
 * `/insights/blog/topics/[slug]` that leads with its pillar post. That is the
 * architecture `docs/blogs_seo/blog_seo.md` asks for: one comprehensive pillar
 * per core topic, cluster posts for distinct sub-intents, links both ways.
 *
 * Deliberately few, and deliberately not tags. A cluster with one post is a
 * thin archive; add a fourth only when there are posts to fill it. The `intro`
 * is what makes a hub worth indexing rather than a bare list, so each one says
 * something the others do not.
 *
 * Import-free, like the other `lib/content` modules, so client components can
 * read it.
 */

export interface BlogTopic {
  slug: string;
  name: string;
  /** One line, for chips and cards. */
  hint: string;
  /** Two or three sentences at the top of the hub page. */
  intro: string;
}

export const BLOG_TOPICS: BlogTopic[] = [
  {
    slug: "production-ai",
    name: "Production AI",
    hint: "Getting from a working pilot to a system people run",
    intro:
      "Most AI work does not fail in the lab. It stalls between the demo and the day an operations team owns it. These posts are about that gap: ownership, failure handling, enablement, and the engineering nobody puts in the pitch.",
  },
  {
    slug: "retrieval-and-data",
    name: "Retrieval & Data",
    hint: "RAG, evaluation, and the document pipelines underneath",
    intro:
      "A retrieval system is only as good as what survives ingestion. These posts cover how we evaluate document processing, retrieval and answers on real technical material, and what changes when a knowledge assistant starts taking actions.",
  },
  {
    slug: "public-sector-ai",
    name: "Public-Sector AI",
    hint: "Procurement, readiness, and governance for agencies",
    intro:
      "Public agencies buy and run AI under constraints a startup never sees: procurement law, records retention, public scrutiny, and staff who already have full-time jobs. These posts are written for the people inside those constraints.",
  },
];

export function topicBySlug(slug: string): BlogTopic | undefined {
  return BLOG_TOPICS.find((topic) => topic.slug === slug);
}
