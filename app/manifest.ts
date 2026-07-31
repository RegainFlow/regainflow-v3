import type { MetadataRoute } from "next";

import { SITE_NAME, TAGLINE } from "@/lib/site";

/**
 * Installed/standalone metadata. `background_color` matches Void so the launch
 * screen does not flash white before the first paint on a phone.
 *
 * Both icons are the same 512×512 RF mark — `app/icon.png` and its
 * `app/apple-icon.png` copy. It is stored without an alpha channel on purpose:
 * iOS composites transparency against black, so an icon with alpha saves to the
 * home screen as a black square.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — AI Transformation Partner`,
    short_name: SITE_NAME,
    description: TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#050912",
    theme_color: "#050912",
    // One entry, `any`. A `maskable` duplicate would be a promise the art does
    // not keep — maskable means ≥10% safe padding on every side so Android can
    // crop to any shape, and this mark fills most of its canvas. The iOS
    // touch icon does not come from here anyway; Next emits it from the
    // `app/apple-icon.png` file convention.
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
