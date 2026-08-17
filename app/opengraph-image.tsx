import { ImageResponse } from "next/og";

import { ogCard, ogFonts } from "@/lib/og";
import { POSITIONING, SITE_NAME } from "@/lib/site";

export const alt = "RegainFlow — AI engineering & transformation partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated rather than shipped as a file, so the card can never disagree with
 * the positioning in `lib/site.ts` — and now so it carries the same RF mark the
 * hero draws, from the same geometry module.
 */
export default async function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: POSITIONING,
      title: SITE_NAME,
      lead: "Production AI systems for public agencies and complex organizations.",
    }),
    { ...size, fonts: await ogFonts() },
  );
}
