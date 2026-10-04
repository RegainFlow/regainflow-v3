import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  // Empty until its first post, and an empty hub is a thin page: keep it out
  // of search until then. `[]` on a failed fetch would hide a live hub, so an
  // outage leaves the page indexable.
  const posts = await getPosts({ topic: topic.slug, throwOnError: true }).catch(() => null);

  return pageMetadata({
    title: `${topic.name} blog posts`,
    description: topic.intro,
    path: `/insights/blog/topics/${topic.slug}`,
    feed: true,
    noindex: posts?.length === 0,
  });
}

/**
 * A topic hub: the index filtered to one topic (its pill is active), with the
 * topic's own intro as the lead so the page is worth indexing on its own. The
 * pillar is listed first and marked "Read first": the pillar-and-cluster
 * structure the SEO research recommends, not a thin tag archive.
 */
export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const topic = topicBySlug((await params).topic);
  if (!topic) notFound();

  const all = await getPosts();
  const posts = all.filter((post) => post.topic === topic.slug);
  // The pillar leads, marked "Read first"; the rest follow newest first.
  const pillar = posts.find((post) => post.pillar);
  const ordered = pillar ? [pillar, ...posts.filter((post) => post !== pillar)] : posts;

  return (
    <div className="rf-soft">
      <PageHeader open eyebrow="Blog" title={topic.name} lead={topic.intro} />

      <section className="rf-section rf-section-open" aria-labelledby="in-topic">
        <div className="rf-shell rf-blog-archive">
          <h2 id="in-topic" className="sr-only">
            Posts in {topic.name}
          </h2>
          <TopicChips
            current={topic.slug}
            available={[...new Set(all.map((post) => post.topic))]}
          />
          <div className="mt-10">
            {ordered.length > 0 ? (
              <PostList
                posts={ordered}
                page={1}
                total={ordered.length}
                surface="blog_topic"
                showTopic={false}
                paginate={false}
                {...(pillar ? { readFirst: pillar.slug } : {})}
              />
            ) : (
              <p className="rf-body">Posts in this topic are on the way.</p>
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
    </div>
  );
}
