import Link from "next/link";

import { BlogRow } from "@/components/BlogCard";
import type { BlogPostSummary } from "@/lib/content/blog";
import { BLOG_TOPICS } from "@/lib/content/blog-topics";

/** Posts per archive page. The first page also carries the featured row. */
export const PAGE_SIZE = 12;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/**
 * Topic pills: the blog's one piece of taxonomy navigation, the way Profound
 * browses its blog. Each pill is its own URL (the index, or a topic hub), so
 * filtering is crawlable and needs no JavaScript. Three curated topics rather
 * than a tag cloud: a thin tag archive is an SEO liability.
 */
export function TopicChips({
  current,
  available,
}: {
  current?: string;
  /** Topic slugs that have published posts. A pill to an empty topic would
   *  lead to an empty page, so those are left out until a post lands. */
  available?: string[];
}) {
  const topics = available
    ? BLOG_TOPICS.filter((topic) => available.includes(topic.slug))
    : BLOG_TOPICS;

  return (
    <nav aria-label="Blog topics">
      <ul className="rf-pills">
        <li>
          <Link
            href="/insights/blog"
            className="rf-pill"
            aria-current={current ? undefined : "page"}
          >
            All posts
          </Link>
        </li>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/insights/blog/topics/${topic.slug}`}
              className="rf-pill"
              aria-current={current === topic.slug ? "page" : undefined}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Every post, newest first, as rows separated by space alone, with sequential,
 * crawlable pagination: every page is a real URL with a self-referencing
 * canonical, linked with plain `<a href>`, as Google's pagination guidance
 * asks. Links render only when there is more than one page.
 */
export function PostList({
  posts,
  page,
  total,
  surface = "blog_index",
  showTopic = true,
  readFirst,
  paginate = true,
}: {
  posts: BlogPostSummary[];
  page: number;
  total: number;
  surface?: "blog_index" | "blog_topic" | "blog_author";
  /** Off on a topic page, where every row shares the topic. */
  showTopic?: boolean;
  /** The slug to mark "Read first": a topic's pillar. */
  readFirst?: string;
  /** Off where the list is already complete (topic and author pages): the
   *  pager's links belong to the index's chronology. */
  paginate?: boolean;
}) {
  const pages = pageCount(total);
  const href = (n: number) => (n === 1 ? "/insights/blog" : `/insights/blog/page/${n}`);

  return (
    <>
      <ol className="rf-blog-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogRow
              post={post}
              surface={surface}
              showTopic={showTopic}
              readFirst={post.slug === readFirst}
            />
          </li>
        ))}
      </ol>

      {paginate && pages > 1 ? (
        <nav className="rf-pager" aria-label="Pagination">
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className="rf-nav-link">
              &larr; Newer posts
            </Link>
          ) : (
            <span />
          )}
          <span className="rf-utility">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={href(page + 1)} rel="next" className="rf-nav-link">
              Older posts &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}
