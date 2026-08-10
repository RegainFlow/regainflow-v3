import { ImageResponse } from "next/og";

import { reportDate } from "@/lib/content/reports";
import { getReport } from "@/lib/reports.server";
import { ogCard, ogFonts } from "@/lib/og";
import { POSITIONING } from "@/lib/site";

export const alt = "RegainFlow report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { slug: string };

/**
 * Generated per request, like the page it belongs to. `generateStaticParams` is
 * gone with the build-time list of slugs it was built from — a card for a report
 * published an hour ago has to exist without a deploy, and rendering one card on
 * demand is cheap next to that.
 */
export const dynamic = "force-dynamic";

/**
 * A card per report.
 *
 * This is the page most likely to be pasted into LinkedIn, which makes the card
 * the first thing most readers will see of it — the title takes the headline
 * slot and the publication date runs where the case study cards put the
 * industry.
 */
export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  // Falls back to a generic card for an unknown slug rather than 404-ing: a
  // scraper that has the URL should still get a valid image back.
  const report = await getReport(slug);

  return new ImageResponse(
    ogCard({
      eyebrow: "Report",
      title: report ? report.title : "Reports",
      lead: report
        ? report.summary
        : `Written research from a ${POSITIONING.toLowerCase()}.`,
      meta: report ? reportDate(report.published) : undefined,
    }),
    { ...size, fonts: await ogFonts() },
  );
}
