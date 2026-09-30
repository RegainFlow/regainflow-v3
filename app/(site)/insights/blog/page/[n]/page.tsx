import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { PAGE_SIZE, PostList, TopicChips, pageCount } from "@/components/BlogArchive";
import PageHeader from "@/components/PageHeader";
import { getPosts } from "@/lib/blog.server";
import { pageMetadata } from "@/lib/seo";

type Params = { n: string };

export const dynamic = "force-dynamic";

function parse(n: string): number | null {
  return /^[1-9]\d*$/.test(n) ? Number(n) : null;
}

/**
 * Older posts, page 2 onward. Each page has its own URL and a
 * self-referencing canonical — never canonicalized to page one, which Google's
 * pagination documentation calls out specifically.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const page = parse((await params).n);
  if (!page || page < 2) return {};

  return pageMetadata({
    title: `Blog — page ${page}`,
    description: `Older posts from the RegainFlow blog, page ${page}.`,
    path: `/insights/blog/page/${page}`,
  });
}

export default async function BlogArchivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const page = parse((await params).n);
  if (!page) notFound();
  // `/page/1` is the index; one URL per page of content.
  if (page === 1) permanentRedirect("/insights/blog");

  const posts = await getPosts();
  if (page > pageCount(posts.length)) notFound();

  return (
    <>
      <PageHeader open eyebrow="Blog" title={`Page ${page}`} lead="Every post, newest first." />

      <section className="rf-section rf-section-open rf-soft">
        <div className="rf-shell rf-blog-archive">
          <TopicChips />
          <div className="mt-8">
            <PostList
              posts={posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
              page={page}
              total={posts.length}
            />
          </div>
        </div>
      </section>
    </>
  );
}
