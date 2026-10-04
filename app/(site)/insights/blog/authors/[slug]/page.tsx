import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PostList } from "@/components/BlogArchive";
import ClosingCTA from "@/components/ClosingCTA";
import { getPosts } from "@/lib/blog.server";
import { authorBySlug } from "@/lib/content/company";
import {
  authorProfileJsonLd,
  breadcrumbJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type Params = { slug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const member = authorBySlug((await params).slug);
  if (!member) return {};

  // No posts yet means a bio already on `/company` and an empty list: keep it
  // out of search until the first one. An outage leaves it indexable.
  const posts = await getPosts({ author: member.slug, throwOnError: true }).catch(() => null);

  return pageMetadata({
    title: `${member.name}, ${member.role}`,
    description: member.bio,
    path: `/insights/blog/authors/${member.slug}`,
    feed: true,
    noindex: posts?.length === 0,
  });
}

/**
 * An author page — the "who created this" answer a byline links to. Facts
 * from `TEAM` only, the same source `/company` and `/llm-info` render, so the
 * three cannot disagree about who someone is.
 */
export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const member = authorBySlug((await params).slug);
  if (!member) notFound();

  const posts = await getPosts({ author: member.slug });
  const path = `/insights/blog/authors/${member.slug}`;

  return (
    <div className="rf-soft">
      <section className="rf-section rf-section-open">
        <div className="rf-shell rf-band-lead rf-grid gap-y-10">
          <div className="col-span-full lg:col-span-3">
            {/* Sized like the portraits on `/company`: intrinsic 4/5
                dimensions inside the 16rem frame, not `fill`. */}
            <div className="rf-portrait">
              <Image
                src={member.image}
                alt={`${member.name}, ${member.role} of RegainFlow`}
                width={480}
                height={600}
                sizes="256px"
                priority
              />
            </div>
          </div>

          <div className="col-span-full lg:col-span-8 lg:col-start-5">
            <p className="rf-eyebrow">Author</p>
            <h1 className="rf-h1 mt-5">{member.name}</h1>
            <p className="rf-utility mt-4">{member.role}</p>
            <p className="rf-lead mt-6 max-w-[58ch]">{member.bio}</p>

            {member.detail?.map((paragraph) => (
              <p key={paragraph} className="rf-body mt-4 max-w-[62ch]">
                {paragraph}
              </p>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              {member.credentials?.map((credential) => (
                <span key={credential} className="rf-tag">
                  {credential}
                </span>
              ))}
              {member.profile ? (
                <a
                  href={member.profile}
                  className="rf-nav-link"
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  LinkedIn &#8599;
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rf-section rf-section-open" aria-labelledby="posts">
        <div className="rf-shell rf-blog-archive">
          <h2 id="posts" className="rf-h2">
            Posts by {member.name.split(" ")[0]}
          </h2>
          <div className="mt-8">
            {posts.length > 0 ? (
              <PostList
                posts={posts}
                page={1}
                total={posts.length}
                surface="blog_author"
                paginate={false}
              />
            ) : (
              <p className="rf-body">Nothing published yet.</p>
            )}
          </div>
        </div>
      </section>

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd(member.name, path, [
              { name: "Insights", path: "/insights" },
              { name: "Blog", path: "/insights/blog" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(authorProfileJsonLd(member, posts.length)),
        }}
      />
    </div>
  );
}
