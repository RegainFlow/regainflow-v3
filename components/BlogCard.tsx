import Image from "next/image";
import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import {
  isLoopbackImage,
  postDate,
  postDateShort,
  type BlogPostSummary,
} from "@/lib/content/blog";
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
        <div className="rf-case-cover rf-blog-cover mb-5">
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

/** A round author avatar. Decorative: the name always sits beside it. */
function Avatar({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <span className="rf-avatar">
      <Image src={src} alt="" fill sizes="24px" />
    </span>
  );
}

/**
 * The byline line of a row or featured post: avatar, name, then the short
 * date and topic in the mono register (`16 Sep, 2026 / Production AI`).
 * `readFirst` swaps the topic for "Read first" on a topic page, where the
 * heading already names the topic.
 */
function RowByline({
  post,
  readFirst = false,
  showTopic = true,
}: {
  post: BlogPostSummary;
  readFirst?: boolean;
  showTopic?: boolean;
}) {
  const topic = topicBySlug(post.topic);
  const author = resolveAuthor(post.author);
  const tag = readFirst ? "Read first" : showTopic ? topic?.name : undefined;

  return (
    <p className="rf-row-byline">
      <Avatar src={author.image} />
      <span className="rf-row-author">{author.name}</span>
      <span className="rf-utility">
        <time dateTime={post.published}>{postDateShort(post.published)}</time>
        {tag ? (
          <>
            <span className="rf-row-sep" aria-hidden="true">
              /
            </span>
            <span className="text-rf-flow-soft">{tag}</span>
          </>
        ) : null}
      </span>
    </p>
  );
}

/**
 * A post as a row: every list on the blog (index, topic, author, archive
 * pages). Profound-style: byline with avatar, then the title and a short
 * excerpt, rows separated by space alone.
 */
export function BlogRow({
  post,
  surface,
  readFirst = false,
  showTopic = true,
}: {
  post: BlogPostSummary;
  surface: Surface;
  /** The topic's pillar, listed first on its topic page. */
  readFirst?: boolean;
  /** Off on a topic page, where every row shares the topic. */
  showTopic?: boolean;
}) {
  return (
    <Link
      href={`/insights/blog/${post.slug}`}
      className="rf-blog-row"
      data-rf-event={RF_EVENTS.blogPostOpened}
      data-rf-post={post.slug}
      data-rf-surface={surface}
    >
      <RowByline post={post} readFirst={readFirst} showTopic={showTopic} />
      <h3 className="rf-h3 rf-blog-row-title">{post.title}</h3>
      <p className="rf-body rf-blog-row-excerpt">{post.summary}</p>
    </Link>
  );
}

/**
 * A featured post: image, then the byline, title and excerpt. Up to two sit
 * side by side at the top of the index.
 */
export function BlogFeatured({
  post,
  priority = false,
}: {
  post: BlogPostSummary;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/insights/blog/${post.slug}`}
      className="rf-blog-featured"
      data-rf-event={RF_EVENTS.blogPostOpened}
      data-rf-post={post.slug}
      data-rf-surface="blog_featured"
    >
      {post.cover ? (
        <div className="rf-case-cover rf-blog-cover">
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 600px, 100vw"
            unoptimized={isLoopbackImage(post.cover)}
          />
        </div>
      ) : null}
      <RowByline post={post} />
      <h3 className="rf-blog-featured-title">{post.title}</h3>
      <p className="rf-body rf-blog-row-excerpt">{post.summary}</p>
    </Link>
  );
}
