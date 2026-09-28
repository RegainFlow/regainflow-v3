import { ImageResponse } from "next/og";

import { getCaseStudy } from "@/lib/case-studies.server";
import { ogCard, ogFonts } from "@/lib/og";
import { POSITIONING } from "@/lib/site";

export const alt = "RegainFlow case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated on request, like the page it belongs to.
 *
 * `generateStaticParams` used to prerender one card per study at build time.
 * It cannot now: the slugs live in Supabase, and a study added after a deploy
 * would have no card at all. Cards are cheap and scrapers fetch them once.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string };

/**
 * A card per study, so a shared link says which piece of work it points at.
 *
 * Until now every study unfurled as the generic site card — a set of links that
 * looked like one link. The study's own title is the whole point, so it takes
 * the headline slot and the industry runs where the stage list normally sits.
 *
 * Falls back to a generic card rather than throwing when the fetch fails or the
 * slug is unknown: a scraper that has the URL should still get a valid image
 * back, which is the same stance `insights/reports/[slug]` takes.
 */
export default async function Image({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const study = await getCaseStudy(slug).catch(() => null);

  return new ImageResponse(
    ogCard({
      eyebrow: study ? study.industry : POSITIONING,
      title: study ? study.title : "Case studies",
      lead: study ? study.summary : "Engineering work RegainFlow delivered.",
      meta: study?.industry,
    }),
    { ...size, fonts: await ogFonts() },
  );
}
