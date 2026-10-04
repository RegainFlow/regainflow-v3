import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { GovFooter, GovHeader } from "@/components/gov/GovChrome";
import { GOV_THEME_KEY } from "@/lib/content/gov";
import { GOV_DESCRIPTION, GOV_SITE_URL, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Everything under here is served at gov.regainflow.com (see `proxy.ts`), so
 * relative canonicals resolve against the subdomain rather than `SITE_URL`.
 */
const GOV_TITLE = `${SITE_NAME} for Government | Capability Statement & Past Performance`;

/**
 * The main site's card, by absolute URL: `opengraph-image` is excluded from the
 * proxy so the subdomain serves it too, but a share preview should not depend
 * on that.
 */
const GOV_CARD = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${SITE_NAME}, AI engineering & transformation partner`,
};

export const metadata: Metadata = {
  metadataBase: new URL(GOV_SITE_URL),
  title: {
    default: GOV_TITLE,
    template: `%s | ${SITE_NAME} for Government`,
  },
  description: GOV_DESCRIPTION,
  alternates: { canonical: "/" },
  // Stated in full. A page that declares `openGraph` or `twitter` replaces the
  // root layout's object rather than merging into it, so the two-field version
  // this used to be shipped no title, description or image, and the Twitter
  // tags fell through to the main site's wording.
  openGraph: {
    title: GOV_TITLE,
    description: GOV_DESCRIPTION,
    url: GOV_SITE_URL,
    siteName: `${SITE_NAME} for Government`,
    type: "website",
    locale: "en_US",
    images: [GOV_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: GOV_TITLE,
    description: GOV_DESCRIPTION,
    images: [GOV_CARD],
  },
};

/** Light, unlike the rest of the site — see `.rf-gov` in `globals.css`. */
export const viewport: Viewport = {
  themeColor: "#f6f7fa",
  colorScheme: "light",
};

/**
 * Applies a saved dark choice before first paint. Runs inline, as the wrapper's
 * first child, so it sees the wrapper and nothing has rendered below it yet.
 * The key is the only interpolation, and it is a constant.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(GOV_THEME_KEY)});if(t==="dark")document.currentScript.parentElement.dataset.theme="dark"}catch(e){}`;

export default function GovLayout({ children }: { children: ReactNode }) {
  return (
    // The pre-paint script can change `data-theme` before hydration, which is
    // the one mismatch React should ignore here.
    <div className="rf-gov" data-theme="light" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <GovHeader />
      <main id="main">{children}</main>
      <GovFooter />
    </div>
  );
}
