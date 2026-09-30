import type { Metadata } from "next";
import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import { PAGE_SIZE, PostList, TopicChips } from "@/components/BlogArchive";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import { getPosts } from "@/lib/blog.server";
import { BLOG_TOPICS } from "@/lib/content/blog-topics";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Field notes from RegainFlow's engineers on getting AI into production in government and regulated organizations: retrieval and evaluation, enablement, procurement, and what stalls between the pilot and the system.",
  path: "/insights/blog",
  feed: true,
});

/** Read per request, like the reports — publishing is flipping a row. */
export const dynamic = "force-dynamic";

/**
 * The blog index, as a hub rather than a feed (`docs/blogs_seo/blog_seo.md`,
 * section 5): a "Start here" row of featured pieces, the newsletter signup
 * (UX doc Part 4: one block, right after the featured posts), the three topic
 * clusters with their own intros, then the latest posts as a dense list.
 *
 * A static segment beside `insights/[slug]`, as `reports` is. Static segments
 * resolve first, so `blog` is a slug no case study can use — and under it,
 * `topics`, `authors` and `page` are slugs no post can use.
 */
export default async function BlogPage() {
  // Degrades to `[]` on a Supabase failure and lands in the empty state.
  const posts = await getPosts();
  const featured = posts.filter((post) => post.featured).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Field notes on putting AI into production."
        lead="Written by the engineers doing the work, from engagements in government, aerospace and regulated enterprise. What we measured, what stalled, and what we would do again."
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
            <section className="rf-section" aria-labelledby="start-here">
              <div className="rf-shell rf-band-tight">
                <h2 id="start-here" className="rf-eyebrow">
                  Start here
                </h2>
                <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featured.map((post, i) => (
                    <li key={post.slug} className="h-full">
                      <DitherReveal className="h-full" delay={(i % 3) * 90}>
                        <BlogCard
                          post={post}
                          surface="blog_featured"
                          priority={i === 0}
                        />
                      </DitherReveal>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <div className="rf-section">
            <div className="rf-shell rf-band-tight">
              <NewsletterSignup source="blog_index" />
            </div>
          </div>

          <section className="rf-section bg-rf-navy" aria-labelledby="topics">
            <div className="rf-shell rf-band-tight">
              <h2 id="topics" className="rf-eyebrow">
                Topics
              </h2>
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {BLOG_TOPICS.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/insights/blog/topics/${topic.slug}`}
                      className="rf-topic-card"
                    >
                      <span className="rf-h3">{topic.name}</span>
                      <span className="rf-body mt-3 block">{topic.hint}</span>
                      <span className="rf-nav-link mt-5 inline-block">
                        Browse the topic &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rf-section" aria-labelledby="latest">
            <div className="rf-shell rf-band">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h2 id="latest" className="rf-h2">
                  Latest
                </h2>
                <TopicChips />
              </div>
              <div className="mt-8">
                <PostList
                  posts={posts.slice(0, PAGE_SIZE)}
                  page={1}
                  total={posts.length}
                />
              </div>
              <p className="mt-8">
                <a href="/insights/blog/feed.xml" className="rf-nav-link">
                  RSS feed &rarr;
                </a>
              </p>
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
    </>
  );
}
