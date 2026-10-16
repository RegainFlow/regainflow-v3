import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";

/**
 * The visible breadcrumb above a title: the parents only, not the page itself,
 * which the H1 already names. Pair it with `breadcrumbJsonLd` from `lib/seo`
 * using the same parents, so the trail a reader sees is the one search shows.
 */
export default function Crumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="rf-crumbs rf-utility">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="rf-nav-link"
              data-rf-event={RF_EVENTS.breadcrumbClicked}
              data-rf-target={item.path}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
