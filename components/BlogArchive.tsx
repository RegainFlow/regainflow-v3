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
 * Topic chips — the blog's only taxonomy navigation. Three curated clusters
 * rather than a tag cloud, because the research is blunt that a tag cloud is
 * decoration and a thin tag archive is an SEO liability.
 */
export function TopicChips({ current }: { current?: string }) {
  return (
    <nav aria-label="Blog topics">
      <ul className="rf-topic-chips">
        <li>
          <Link
            href="/insights/blog"
            className="rf-topic-chip"
            aria-current={current ? undefined : "page"}
          >
            All posts
          </Link>
        </li>
        {BLOG_TOPICS.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/insights/blog/topics/${topic.slug}`}
              className="rf-topic-chip"
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
 * The "Latest" list with sequential, crawlable pagination: every page is a
 * real URL with a self-referencing canonical, linked with plain `<a href>`, as
 * Google's pagination guidance asks. Links render only when there is more than
 * one page.
 */
export function PostList({
  posts,
  page,
  total,
}: {
  posts: BlogPostSummary[];
  page: number;
  total: number;
}) {
  const pages = pageCount(total);
  const href = (n: number) => (n === 1 ? "/insights/blog" : `/insights/blog/page/${n}`);

  return (
    <>
      <ol className="rf-post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogRow post={post} surface="blog_index" />
          </li>
        ))}
      </ol>

      {pages > 1 ? (
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
