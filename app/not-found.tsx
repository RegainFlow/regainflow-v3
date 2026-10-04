import type { Metadata } from "next";

import NotFoundContent from "@/components/NotFoundContent";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Page not found" };

/**
 * An address that matches no route at all. That case is handled at the root,
 * above the `(site)` group, so the site layout does not wrap it and the chrome
 * is added here by hand. `app/(site)/not-found.tsx` covers `notFound()` thrown
 * by a page, where the layout is already present.
 *
 * The gov host never reaches this: `proxy.ts` sends every unknown gov path to
 * the main site first.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
