import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/blog.server";
import { BLOG_TOPICS } from "@/lib/content/blog-topics";
import { TEAM } from "@/lib/content/company";
import { getCaseStudies } from "@/lib/case-studies.server";
import { INDUSTRY_GROUPS } from "@/lib/content/industries";
import { getReports } from "@/lib/reports.server";
import { GOV_SITE_URL, SITE_URL } from "@/lib/site";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.8,
  // Level with `/services`. An inbound search from this audience is far more
  // likely to name a sector than a service — "AI for county government" rather
  // than "AI implementation" — so the industry hub is a landing route, not a
  // secondary one. The four group pages are generated below.
  "/industries": 0.8,
  "/insights": 0.8,
  // The reports index. Level with `/insights` because a gated report is what an
  // inbound search is most likely to be looking for by name.
  "/insights/reports": 0.8,
  "/insights/case-studies": 0.7,
  "/insights/blog": 0.7,
  "/company": 0.6,
  // The conversion. `/contact/thanks` is deliberately absent — it is `noindex`
  // and reachable only by submitting.
  "/contact": 0.7,
  // Below the marketing routes on purpose — it is a reference sheet, not a
  // destination — but it has to be listed, because the only link to it is in
  // the footer and an unlisted page is one a crawler has to be lucky to reach.
  "/llm-info": 0.5,
};

/** Reports, case studies, and posts are all read per request, so this is too. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Both throw rather than degrading, and this is the whole reason that option
  // exists. The default `[]` would emit a perfectly valid sitemap that simply
  // omits every report and every case study — a document asserting they do not
  // exist, which is how you de-index live pages over a thirty-second blip.
  // Failing the request is honest: a crawler retries a 500 and believes an
  // empty sitemap.
  const [published, caseStudies, posts] = await Promise.all([
    getReports({ throwOnError: true }),
    getCaseStudies({ throwOnError: true }),
    getPosts({ throwOnError: true }),
  ]);

  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = Object.entries(PRIORITY).map(
    ([path, priority]) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
    }),
  );

  // Generated rather than listed, so a new group cannot ship unindexed. Above
  // the case studies: these are the pages written to be found by a sector
  // search, and a study is what a reader opens once one of them convinced them.
  const industries: MetadataRoute.Sitemap = INDUSTRY_GROUPS.map((group) => ({
    url: `${SITE_URL}/industries/${group.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Generated rather than listed, so a new study cannot ship unindexed.
  // `lastModified` is the row's last edit. Studies carry no visible date, so
  // there is no hand-set one to prefer, and the request time claimed a change
  // on every crawl.
  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${SITE_URL}/insights/${study.slug}`,
    lastModified: study.updated ? new Date(`${study.updated}T00:00:00Z`) : lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Same rule as the studies. Above them on purpose: a report is written to be
  // found by search, which is the whole reason its page is public and only the
  // PDF sits behind the email ask.
  const reports: MetadataRoute.Sitemap = published.map((report) => ({
    url: `${SITE_URL}/insights/reports/${report.slug}`,
    // The real date, not the build's. A report does not change after it is
    // published, and claiming it did teaches a crawler to ignore the field.
    lastModified: new Date(`${report.published}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // Same rule again. `lastModified` is the visible "Updated" date when a post
  // has one — set by hand after a substantive edit — and the published date
  // otherwise. Never the row's `updated_at`, which a typo fix moves.
  const blog: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/insights/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedOn ?? post.published}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // The curated topic hubs, dated to their newest post. Author pages carry
  // less on their own, so they sit lower.
  const newest = (list: typeof posts) =>
    list.length
      ? new Date(`${list[0].updatedOn ?? list[0].published}T00:00:00Z`)
      : lastModified;
  const hubs: MetadataRoute.Sitemap = [
    // Only topics with a published post: an empty hub is a thin page.
    ...BLOG_TOPICS.filter((topic) => posts.some((post) => post.topic === topic.slug)).map((topic) => ({
      url: `${SITE_URL}/insights/blog/topics/${topic.slug}`,
      lastModified: newest(posts.filter((post) => post.topic === topic.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...TEAM.filter((member) => posts.some((post) => post.author === member.slug)).map(
      (member) => ({
        url: `${SITE_URL}/insights/blog/authors/${member.slug}`,
        lastModified: newest(posts.filter((post) => post.author === member.slug)),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }),
    ),
  ];

  // The subdomain's one page. Cross-host entries are accepted when both hosts sit
  // under one Search Console domain property, which is how regainflow.com is
  // verified; `gov.regainflow.com/sitemap.xml` is this same file.
  const gov: MetadataRoute.Sitemap = [
    // Trailing slash, to match the canonical the gov layout emits exactly.
    { url: `${GOV_SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];

  return [...pages, ...industries, ...reports, ...studies, ...blog, ...hubs, ...gov];
}
