import { timingSafeEqual } from "node:crypto";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostView from "@/components/BlogPostView";
import { getPost, getPosts } from "@/lib/blog.server";

type Params = { slug: string };
type Search = { token?: string | string[] };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * A constant-time comparison against `BLOG_PREVIEW_TOKEN`. Unset means the
 * route is off: every request 404s, including one carrying an empty token.
 */
function authorized(token: string | string[] | undefined): boolean {
  const expected = process.env.BLOG_PREVIEW_TOKEN;
  if (!expected || typeof token !== "string") return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * A post in any status, for review before it goes live. `pnpm blog stage`
 * writes the draft row and prints this URL; the publishing skill's approval
 * gate is someone reading this page.
 *
 * A wrong or missing token is a 404, not a 401, so the route does not confirm
 * that a draft exists. `noindex` and the `robots.ts` disallow are belt and
 * braces: without the token there is nothing here to index.
 */
export default async function BlogPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, { token }] = await Promise.all([params, searchParams]);
  if (!authorized(token)) notFound();

  // A staged draft lives under `preview--<slug>` so reviewing a refresh never
  // touches the live row (see the blog publisher migration). Prefer it; fall
  // back to the row itself, which covers a first-time post staged in place.
  const post =
    (await getPost(`preview--${slug}`, { includeDrafts: true })) ??
    (await getPost(slug, { includeDrafts: true }));
  if (!post) notFound();

  return <BlogPostView post={{ ...post, slug }} all={await getPosts()} preview />;
}
