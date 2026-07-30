import type { MetadataRoute } from "next";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SITE_URL } from "@/lib/site";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.8,
  "/insights": 0.8,
  "/company": 0.6,
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
