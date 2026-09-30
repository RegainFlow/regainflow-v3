import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogCard from "@/components/BlogCard";
import { PostList, TopicChips } from "@/components/BlogArchive";
import ClosingCTA from "@/components/ClosingCTA";
import PageHeader from "@/components/PageHeader";
import { getPosts } from "@/lib/blog.server";
import { topicBySlug } from "@/lib/content/blog-topics";
import {
  breadcrumbJsonLd,
  pageMetadata,
  serializeJsonLd,
  topicCollectionJsonLd,
} from "@/lib/seo";

type Params = { topic: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const topic = topicBySlug((await params).topic);
  if (!topic) return {};

  return pageMetadata({
    title: `${topic.name} — Blog`,
    description: topic.intro,
    path: `/insights/blog/topics/${topic.slug}`,
    feed: true,
  });
}

/**
 * A topic hub: a curated category page worth indexing on its own. It leads
 * with a unique intro and the topic's pillar post, then lists every post in
 * the cluster — the pillar-and-cluster structure the SEO research recommends,
 * and the constructive alternative to a thin tag archive.
 */
export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const topic = topicBySlug((await params).topic);
  if (!topic) notFound();

  const posts = await getPosts({ topic: topic.slug });
  const pillar = posts.find((post) => post.pillar);
  const rest = posts.filter((post) => post !== pillar);

  return (
    <>
      <PageHeader eyebrow="Blog · Topic" title={topic.name} lead={topic.intro} />

      {pillar ? (
        <section className="rf-section" aria-labelledby="pillar">
          <div className="rf-shell rf-band-tight">
            <h2 id="pillar" className="rf-eyebrow">
              Start with
            </h2>
            <div className="mt-8 max-w-[44rem]">
              <BlogCard post={pillar} surface="blog_topic" priority />
            </div>
          </div>
        </section>
      ) : null}

      <section className="rf-section" aria-labelledby="in-topic">
        <div className="rf-shell rf-band">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="in-topic" className="rf-h2">
              {pillar ? "More in this topic" : "Posts"}
            </h2>
            <TopicChips current={topic.slug} />
          </div>
          <div className="mt-8">
            {rest.length > 0 ? (
              <PostList posts={rest} page={1} total={rest.length} />
            ) : (
              <p className="rf-body">More posts in this topic are on the way.</p>
            )}
          </div>
        </div>
      </section>

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd(topic.name, `/insights/blog/topics/${topic.slug}`, [
              { name: "Insights", path: "/insights" },
              { name: "Blog", path: "/insights/blog" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(topicCollectionJsonLd(topic, posts)),
        }}
      />
    </>
  );
}
