import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostView, { cardPath } from "@/components/BlogPostView";
import { getPost, getPosts } from "@/lib/blog.server";
import { resolveAuthor } from "@/lib/content/blog-authors";
import { topicBySlug } from "@/lib/content/blog-topics";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type Params = { slug: string };

/**
 * A post published in the Supabase UI resolves here with no deploy: nothing is
 * prerendered at build, each post is rendered on its first visit, cached, and
 * rebuilt at most once a minute. See `docs/content-cache.md`.
 */
export const revalidate = 60;

export function generateStaticParams(): Params[] {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const author = resolveAuthor(post.author);

  return pageMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.summary,
    path: `/insights/blog/${post.slug}`,
    image: { url: cardPath(post.slug), alt: post.title },
    feed: true,
    article: {
      publishedTime: post.published,
      modifiedTime: post.updatedOn ?? post.published,
      authors: [author.href ? `${SITE_URL}${author.href}` : SITE_URL],
      section: topicBySlug(post.topic)?.name,
      tags: post.tags,
    },
  });
}

/**
 * A published post. The template is `components/BlogPostView.tsx`, shared with
 * the draft preview.
 *
 * `getPost` returns null only for a slug nobody published and throws on an
 * outage, so `notFound()` is a real 404 — the report page's contract.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return <BlogPostView post={post} all={await getPosts()} />;
}
