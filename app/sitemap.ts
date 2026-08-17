import type { MetadataRoute } from "next";

import { getCaseStudies } from "@/lib/case-studies.server";
import { INDUSTRY_GROUPS } from "@/lib/content/industries";
import { getReports } from "@/lib/reports.server";
import { SITE_URL } from "@/lib/site";

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
  "/company": 0.6,
  // The conversion. `/contact/thanks` is deliberately absent — it is `noindex`
  // and reachable only by submitting.
  "/contact": 0.7,
  // Below the marketing routes on purpose — it is a reference sheet, not a
  // destination — but it has to be listed, because the only link to it is in
  // the footer and an unlisted page is one a crawler has to be lucky to reach.
  "/llm-info": 0.5,
};

/** Reports and case studies are both read per request, so this is too. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Both throw rather than degrading, and this is the whole reason that option
  // exists. The default `[]` would emit a perfectly valid sitemap that simply
  // omits every report and every case study — a document asserting they do not
  // exist, which is how you de-index live pages over a thirty-second blip.
  // Failing the request is honest: a crawler retries a 500 and believes an
  // empty sitemap.
  const [published, caseStudies] = await Promise.all([
    getReports({ throwOnError: true }),
    getCaseStudies({ throwOnError: true }),
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
  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${SITE_URL}/insights/${study.slug}`,
    lastModified,
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

  return [...pages, ...industries, ...reports, ...studies];
}
