import type { ReactNode } from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

/**
 * The marketing site's chrome. A route group rather than the root layout so
 * `app/gov` can carry its own header and footer without a host check in here —
 * reading `headers()` in a layout would make every page on the site dynamic.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />

      {/* One `main` per layout, so the skip link resolves on every route.
          Pages compose sections only. */}
      <main id="main">{children}</main>

      <SiteFooter />
    </>
  );
}
