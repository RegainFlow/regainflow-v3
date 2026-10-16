import type { Metadata } from "next";

import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = { title: "Page not found" };

/**
 * A `notFound()` from any page in the site group: an unpublished case study,
 * report or post, an unknown industry or topic. Rendered inside the site
 * layout, so it has the header and footer. Next adds `noindex` to a 404
 * response itself.
 */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
