import Link from "next/link";
import type { ReactNode } from "react";

import type { NavLink } from "@/lib/site";

/**
 * One `NAV` item as an element.
 *
 * `NAV` feeds three surfaces — the footer columns, the desktop dropdown, and
 * the mobile panel — so the internal-versus-external branch lives here rather
 * than being remembered in all three. An item marked `external` gets a plain
 * anchor in a new tab; routing an off-site href through the client router would
 * be wrong, and `next/link` has no business carrying it.
 *
 * No `"use client"`: the footer renders this on the server, and `SiteNav` pulls
 * it into the client bundle by importing it. Both work because the component
 * holds no state of its own.
 */
export default function NavItemLink({
  item,
  className,
  onClick,
  children,
}: {
  item: NavLink;
  className: string;
  /** Panel dismissal, where the surface has a panel to dismiss. */
  onClick?: () => void;
  children: ReactNode;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        // Undefined for an untracked item, and React drops the attribute
        // entirely rather than emitting an empty one.
        data-rf-event={item.event}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
