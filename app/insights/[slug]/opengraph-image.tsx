import { ImageResponse } from "next/og";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { ogCard, ogFonts } from "@/lib/og";
import { POSITIONING } from "@/lib/site";

export const alt = "RegainFlow case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { slug: string };

/**
 * Without this the nine cards would be generated on demand rather than at
 * build time, which for a static export means they would not be generated at
 * all.
 */
export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

/**
 * A card per study, so a shared link says which piece of work it points at.
 *
 * Until now every study unfurled as the generic site card — a set of links that
 * looked like one link. The study's own title is the whole point, so it takes
 * the headline slot and the industry runs where the stage list normally sits.
 */
export default async function Image({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((item) => item.slug === slug);

  return new ImageResponse(
    ogCard({
      eyebrow: study ? study.group : POSITIONING,
      title: study ? study.title : "Selected experience",
      lead: study ? study.summary : "Delivered enterprise AI and platform work.",
      meta: study?.industry,
    }),
    { ...size, fonts: await ogFonts() },
  );
}
