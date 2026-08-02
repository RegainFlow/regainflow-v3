import type { MetadataRoute } from "next";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SITE_URL } from "@/lib/site";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.8,
  "/insights": 0.8,
  "/company": 0.6,
  // Below the marketing routes on purpose — it is a reference sheet, not a
  // destination — but it has to be listed, because the only link to it is in
  // the footer and an unlisted page is one a crawler has to be lucky to reach.
  "/llm-info": 0.5,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = Object.entries(PRIORITY).map(
    ([path, priority]) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
    }),
  );

  // Generated rather than listed, so a new study cannot ship unindexed.
  const studies: MetadataRoute.Sitemap = CASE_STUDIES.map((study) => ({
    url: `${SITE_URL}/insights/${study.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...studies];
}
