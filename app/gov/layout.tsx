import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { GovFooter, GovHeader } from "@/components/gov/GovChrome";
import { GOV_THEME_KEY } from "@/lib/content/gov";
import { GOV_SITE_URL, SITE_NAME } from "@/lib/site";

/**
 * Everything under here is served at gov.regainflow.com (see `proxy.ts`), so
 * relative canonicals resolve against the subdomain rather than `SITE_URL`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(GOV_SITE_URL),
  title: {
    default: `${SITE_NAME} for Government | Capability Statement & Past Performance`,
    template: `%s | ${SITE_NAME} for Government`,
  },
  description:
    "RegainFlow's capability statement and past performance for federal, state, local, and public-safety buyers. UEI XD3FZFEHMCD7, CAGE 20BV9.",
  alternates: { canonical: "/" },
  openGraph: { url: GOV_SITE_URL, siteName: `${SITE_NAME} for Government` },
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
