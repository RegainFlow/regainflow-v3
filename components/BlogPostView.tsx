import Image from "next/image";
import Link from "next/link";

import AuthorBox from "@/components/AuthorBox";
import BlogCard from "@/components/BlogCard";
import BlogToc from "@/components/BlogToc";
import Crumbs from "@/components/Crumbs";
import ExploreWithAI from "@/components/ExploreWithAI";
import Findings from "@/components/Findings";
import Markdown from "@/components/Markdown";
import NewsletterSignup from "@/components/NewsletterSignup";
import PostCTA from "@/components/PostCTA";
import ReadDepth from "@/components/ReadDepth";
import ReadingModeToggle from "@/components/ReadingModeToggle";
import ShareButton from "@/components/ShareButton";
import { pickRelated } from "@/lib/blog.server";
import { buildToc } from "@/lib/blog-toc";
import {
  isLoopbackImage,
  postDate,
  type BlogPost,
  type BlogPostSummary,
} from "@/lib/content/blog";
import { resolveAuthor } from "@/lib/content/blog-authors";
import { READ_THEME_SCRIPT } from "@/lib/content/blog-reading";
import { topicBySlug } from "@/lib/content/blog-topics";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/** The TOC earns its space only on a post long enough to navigate. */
const TOC_MIN_SECTIONS = 3;

export const cardPath = (slug: string) => `/insights/blog/${slug}/card.png`;

/**
 * A blog post, laid out to `docs/blogs_seo/blog_ui_ux.md`.
 *
 * - **First screen:** title, deck, byline and dates, Explore with AI, then the
 *   numbered TL;DR —
 *   and the body starts inside the first viewport on a phone. No full-bleed
 *   hero: a cover, where there is one, sits *below* the takeaways.
 * - **Navigation:** a sticky TOC rail on desktop; an in-content "On this page"
 *   list on mobile, where a pinned collapsed bar goes unnoticed.
 * - **Onward paths:** the post's own CTA after its first section and again at
 *   the end, the newsletter signup, then three related reads, all above the
 *   footer.
 * - **Trust:** a real author with a page, visible published and updated dates
 *   that match the structured data, and cited sources.
 *
 * Shared by the live page and the draft preview, so what a reviewer approves
 * is the template that ships. `preview` adds a draft banner and drops the
 * structured data and analytics, which have no business on a noindex page.
 */
export default function BlogPostView({
  post,
  all,
  preview = false,
}: {
  post: BlogPost;
  /** Published posts, for "Keep reading". */
  all: BlogPostSummary[];
  preview?: boolean;
}) {
  const author = resolveAuthor(post.author);
  const topic = topicBySlug(post.topic);
  const related = pickRelated(post, all);
  const toc = buildToc(post.body);
  const hasSources = /^\[\^[^\]]+\]:/m.test(post.body);
  const tocEntries = hasSources
    ? [...toc, { id: "footnote-label", text: "Sources" }]
    : toc;
  const showToc = toc.length >= TOC_MIN_SECTIONS;
  const url = `${SITE_URL}/insights/blog/${post.slug}`;
  const crumbs = [
    { name: "Insights", path: "/insights" },
    { name: "Blog", path: "/insights/blog" },
    ...(topic ? [{ name: topic.name, path: `/insights/blog/topics/${topic.slug}` }] : []),
  ];

  return (
    <div className="rf-read rf-soft" data-theme="dark" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: READ_THEME_SCRIPT }} />

      {preview ? (
        <p className="rf-draft-banner rf-utility" role="status">
          Draft preview. Not published, not indexed, and not linked from anywhere.
        </p>
      ) : null}

      <article className="rf-article rf-post">
        <header className="rf-section rf-section-open">
          <div className="rf-shell rf-post-head">
            <Crumbs items={crumbs} />

            <h1 className="rf-h1 rf-post-title">{post.title}</h1>
            <p className="rf-post-deck">{post.summary}</p>

            <div className="rf-byline">
              {author.image ? (
                <span className="rf-byline-portrait">
                  <Image src={author.image} alt="" fill sizes="44px" />
                </span>
              ) : null}
              <div className="rf-byline-text">
                <p className="rf-byline-name">
                  {author.href ? (
                    <Link href={author.href} rel="author">
                      {author.name}
                    </Link>
                  ) : (
                    author.name
                  )}
                  {author.role ? (
                    <span className="rf-byline-role">{author.role}</span>
                  ) : null}
                </p>
                <p className="rf-utility rf-byline-dates">
                  <span>
                    Published{" "}
                    <time dateTime={post.published}>{postDate(post.published)}</time>
                  </span>
                  {post.updatedOn ? (
                    <span>
                      Updated{" "}
                      <time dateTime={post.updatedOn}>{postDate(post.updatedOn)}</time>
                    </span>
                  ) : null}
                  <span>{post.readingMinutes} min read</span>
                </p>
              </div>
              <div className="rf-byline-controls">
                <ReadingModeToggle />
                <ShareButton title={post.title} url={url} />
              </div>
              {preview ? null : <ExploreWithAI url={url} />}
            </div>
          </div>
        </header>

        <div className="rf-section">
          <div className={`rf-shell rf-post-layout${showToc ? " rf-post-layout-rail" : ""}`}>
            {showToc ? (
              <aside className="rf-post-rail">
                <BlogToc entries={tocEntries} />
              </aside>
            ) : null}

            <div className="rf-post-main">
              <Findings items={post.takeaways} />

              {/* Below lg, folded: open, the list pushed the first paragraph
                  more than two screens down on a phone. A native <details> in
                  the flow, not the pinned collapsed bar NN/g found nobody
                  notices, and its links are in the server output either way. */}
              {showToc ? (
                <details className="rf-toc-inline rf-disclosure">
                  <summary className="rf-disclosure-summary">
                    <span className="rf-disclosure-marker" aria-hidden="true" />
                    On this page ({tocEntries.length})
                  </summary>
                  <nav aria-label="On this page">
                    <ol>
                      {tocEntries.map((entry) => (
                        <li key={entry.id}>
                          <a href={`#${entry.id}`}>{entry.text}</a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              ) : null}

              {post.cover ? (
                <figure className="rf-figure rf-post-cover">
                  <div className="rf-case-cover rf-blog-cover">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? ""}
                      fill
                      priority
                      sizes="(min-width: 1024px) 704px, 100vw"
                      unoptimized={isLoopbackImage(post.cover)}
                    />
                  </div>
                  {post.coverCredit ? (
                    <figcaption>{post.coverCredit}</figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className="rf-body rf-prose">
                <Markdown
                  insertBefore={
                    toc[1]
                      ? {
                          id: toc[1].id,
                          node: <PostCTA cta={post.cta} placement="inline" />,
                        }
                      : undefined
                  }
                >
                  {post.body}
                </Markdown>
              </div>

              {post.tags.length > 0 ? (
                <ul className="rf-tags mt-12" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rf-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-12">
                <AuthorBox author={author} />
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="rf-section bg-rf-navy">
        <div className="rf-shell rf-band">
          <PostCTA cta={post.cta} placement="end" />
        </div>
      </section>

      <div className="rf-section">
        <div className="rf-shell rf-band-tight">
          <div className="max-w-[44rem]">
            <NewsletterSignup source={`blog_post:${post.slug}`} />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="rf-section" aria-labelledby="keep-reading">
          <div className="rf-shell rf-band">
            <h2 id="keep-reading" className="rf-eyebrow">
              Keep reading
            </h2>

            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug} className="h-full">
                  <BlogCard post={other} surface="related" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {preview ? null : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(
                breadcrumbJsonLd(post.title, `/insights/blog/${post.slug}`, crumbs),
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(
                blogPostingJsonLd(post, {
                  image: post.cover ?? cardPath(post.slug),
                  author: author.member,
                  topic,
                }),
              ),
            }}
          />
          <ReadDepth post={post.slug} readingMinutes={post.readingMinutes} />
        </>
      )}
    </div>
  );
}
