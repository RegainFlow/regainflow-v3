import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";

export interface Pill {
  label: string;
  href: string;
  current?: boolean;
}

/**
 * A row of pill links: the blog's topic filter, and the section jumps on
 * `/insights`. Every pill is a plain link (a URL or an anchor), so it works
 * without JavaScript and a crawler follows it. The current one carries
 * `aria-current="page"`, which is also what styles it.
 */
export default function Pills({ label, items }: { label: string; items: Pill[] }) {
  return (
    <nav aria-label={label}>
      <ul className="rf-pills">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="rf-pill"
              aria-current={item.current ? "page" : undefined}
              data-rf-event={RF_EVENTS.insightsNavClicked}
              data-rf-target={item.label}
              data-rf-surface={label}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
