import Image from "next/image";
import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import { postDate, type BlogPostSummary } from "@/lib/content/blog";
import { resolveAuthor } from "@/lib/content/blog-authors";
import { topicBySlug } from "@/lib/content/blog-topics";

type Surface = "blog_index" | "blog_featured" | "blog_topic" | "blog_author" | "insights" | "related";

/**
 * A post as a card: the featured row on the index, the `/insights` band, and
 * "Keep reading". The whole card is the link, matching `ReportCard`.
 *
 * The title and deck carry the information scent; the cover is optional and
 * most posts will not have one. The card closes up rather than leaving a frame.
 */
export default function BlogCard({
  post,
  surface,
  priority = false,
}: {
  post: BlogPostSummary;
  surface: Surface;
  /** Loads the cover eagerly. Set on the first card near the top of a page. */
  priority?: boolean;
}) {
  const topic = topicBySlug(post.topic);
  const author = resolveAuthor(post.author);

  return (
    <Link
      href={`/insights/blog/${post.slug}`}
      className="rf-card"
      data-rf-event={RF_EVENTS.blogPostOpened}
      data-rf-post={post.slug}
      data-rf-surface={surface}
    >
      {/* Covers only in the featured row, where every card has one. Mixed
          covers in "Keep reading" left the row ragged. */}
      {post.cover && surface === "blog_featured" ? (
        <div className="rf-case-cover mb-5">
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 90vw"
          />
        </div>
      ) : null}

      <p className="rf-utility text-rf-flow-soft">{topic?.name ?? "Blog"}</p>

      <h3 className="rf-h3 mt-3">{post.title}</h3>

      <p className="rf-body mt-4">{post.summary}</p>

      {/* Surname only: the full name with a date and read time wrapped onto
          a third line at card width. */}
      <div className="mt-auto border-t border-rf-hairline pt-5">
        <p className="rf-utility">
          {author.member ? author.name.split(" ").at(-1) : author.name} ·{" "}
          {postDate(post.published)} · {post.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}

/**
 * A post as a row: the "Latest" list on the index, topic hubs and author pages.
 * Denser than a card on purpose — the research favours scannable lists over
 * thumbnail grids for text-first blogs, where the title is the scent.
 */
export function BlogRow({ post, surface }: { post: BlogPostSummary; surface: Surface }) {
  const topic = topicBySlug(post.topic);
  const author = resolveAuthor(post.author);

  return (
    <Link
      href={`/insights/blog/${post.slug}`}
      className="rf-post-row"
      data-rf-event={RF_EVENTS.blogPostOpened}
      data-rf-post={post.slug}
      data-rf-surface={surface}
    >
      <p className="rf-utility rf-post-row-meta">
        <time dateTime={post.published}>{postDate(post.published)}</time>
        <span className="text-rf-flow-soft">{topic?.name ?? "Blog"}</span>
      </p>
      <div>
        <h3 className="rf-h3 rf-post-row-title">{post.title}</h3>
        <p className="rf-body mt-2 max-w-[62ch]">{post.summary}</p>
        <p className="rf-utility mt-3">
          {author.name} · {post.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
