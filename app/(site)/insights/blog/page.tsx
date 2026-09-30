import type { Metadata } from "next";
import Link from "next/link";

import { PAGE_SIZE, PostList, TopicChips } from "@/components/BlogArchive";
import { BlogFeatured } from "@/components/BlogCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import { getPosts } from "@/lib/blog.server";
import { FEATURED_SLOTS } from "@/lib/content/blog";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Posts by RegainFlow's engineers on production AI, retrieval and data, and AI in the public sector, from work in government, aerospace and regulated enterprise.",
  path: "/insights/blog",
  feed: true,
});

/** Read per request, like the reports — publishing is flipping a row. */
export const dynamic = "force-dynamic";

/**
 * The blog index, after Profound's (tryprofound.com/blog):
 *
 * - a plain "Blog" header with one line under it and the RSS link;
 * - up to two featured posts, side by side;
 * - topic pills, each its own URL, then every post newest first as rows
 *   separated by space alone: one way to browse;
 * - the newsletter panel at the end.
 *
 * Earlier versions had a Topics band plus a "Latest" list (two ways to browse
 * the same posts) and a hairline between every block; both read as confusing
 * and rigid. The page sits in `.rf-soft`, the blog-scoped softer shape.
 *
 * A static segment beside `insights/[slug]`, as `reports` is. Static segments
 * resolve first, so `blog` is a slug no case study can use — and under it,
 * `topics`, `authors` and `page` are slugs no post can use.
 */
export default async function BlogPage() {
  // Degrades to `[]` on a Supabase failure and lands in the empty state.
  const posts = await getPosts();
  const featured = posts.filter((post) => post.featured).slice(0, FEATURED_SLOTS);

  return (
    <div className="rf-soft">
      <PageHeader
        open
        eyebrow="Insights"
        title="Blog"
        lead="Posts by the RegainFlow engineers, from work in government, aerospace and regulated enterprise."
        meta={
          <p className="mt-5">
            <a href="/insights/blog/feed.xml" className="rf-nav-link rf-utility">
              RSS feed
            </a>
          </p>
        }
      />

      {posts.length === 0 ? (
        <section className="rf-section">
          <div className="rf-shell rf-band">
            <div className="max-w-[52ch]">
              <h2 className="rf-h3">The first post is being written.</h2>
              <p className="rf-body mt-4">
                Nothing is published here yet. The reports and case studies are
                the better read in the meantime.
              </p>
              <p className="mt-8">
                <Link href="/insights" className="rf-nav-link">
                  All insights &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="rf-section rf-section-open" aria-labelledby="featured">
              <div className="rf-shell rf-blog-featured-wrap">
                <h2 id="featured" className="rf-eyebrow">
                  Featured
                </h2>
                <ul className="rf-blog-featured-grid mt-6">
                  {featured.map((post, i) => (
                    <li key={post.slug}>
                      <DitherReveal delay={i * 90}>
                        <BlogFeatured post={post} priority={i === 0} />
                      </DitherReveal>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <section className="rf-section rf-section-open" aria-labelledby="all-posts">
            <div className="rf-shell rf-blog-archive">
              <h2 id="all-posts" className="rf-h2">
                All posts
              </h2>
              <div className="mt-6">
                <TopicChips available={[...new Set(posts.map((post) => post.topic))]} />
              </div>
              <div className="mt-10">
                <PostList
                  posts={posts.slice(0, PAGE_SIZE)}
                  page={1}
                  total={posts.length}
                />
              </div>
            </div>
          </section>

          <section className="rf-section rf-section-open" aria-label="Newsletter">
            <div className="rf-shell rf-blog-newsletter-wrap">
              <div className="rf-blog-newsletter">
                <NewsletterSignup source="blog_index" layout="split" />
              </div>
            </div>
          </section>
        </>
      )}

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd("Blog", "/insights/blog", {
              name: "Insights",
              path: "/insights",
            }),
          ),
        }}
      />
    </div>
  );
}
