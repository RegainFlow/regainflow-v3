import { ImageResponse } from "next/og";

import { getPost } from "@/lib/blog.server";
import { postDate } from "@/lib/content/blog";
import { resolveAuthor } from "@/lib/content/blog-authors";
import { topicBySlug } from "@/lib/content/blog-topics";
import { ogCard, ogFonts } from "@/lib/og";
import { POSITIONING } from "@/lib/site";

/**
 * A post's social card, at a stable URL.
 *
 * A route handler rather than an `opengraph-image.tsx`, because a dynamic
 * segment's convention card is served at `opengraph-image-<hash>` in a
 * production build and the page cannot know the hash. The post needs the URL
 * twice — `og:image` and the `BlogPosting` image — so it lives where both can
 * name it.
 *
 * Per request, like the page. An unknown slug gets a generic card rather than
 * a 404: a scraper holding the URL should still get a valid image.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await getPost(slug);

  const meta = post
    ? [resolveAuthor(post.author).name, postDate(post.published)].join(" · ")
    : undefined;

  return new ImageResponse(
    ogCard({
      eyebrow: post ? (topicBySlug(post.topic)?.name ?? "Blog") : "Blog",
      title: post ? post.title : "Blog",
      lead: post ? post.summary : `Notes from an ${POSITIONING}.`,
      meta,
    }),
    {
      width: 1200,
      height: 630,
      fonts: await ogFonts(),
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
