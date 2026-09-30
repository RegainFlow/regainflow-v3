"use client";

import { useEffect, useState } from "react";

import type { TocEntry } from "@/lib/blog-toc";

/**
 * The desktop table of contents: a sticky rail beside the article, drawn as a
 * route. Each section is a node; the route fills in Flow up to the section
 * being read, and every node already passed is filled. The site's diagram
 * vocabulary (`docs/DESIGN.md`, "Adding a diagram") applied to reading
 * progress: the reader's position becomes a drawn path.
 *
 * Server-rendered as a plain list of anchor links, so it works before and
 * without JavaScript; the observer only adds the active marker. On mobile this
 * component is not shown — the post renders an in-content "On this page" list
 * instead, because NN/g found pinned, collapsed TOCs on phones mostly went
 * unnoticed.
 */
export default function BlogToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    // A heading counts as current once it passes the top quarter of the
    // viewport, below the sticky header, and stays current until the next one
    // does. That reads as "the section you are in", not "the heading you can
    // see".
    const observer = new IntersectionObserver(
      () => {
        const passed = headings.filter(
          (el) => el.getBoundingClientRect().top < window.innerHeight * 0.25,
        );
        setActive(passed.length ? passed[passed.length - 1].id : null);
      },
      { rootMargin: "0px 0px -75% 0px", threshold: [0, 1] },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  const activeIndex = entries.findIndex((entry) => entry.id === active);

  return (
    <nav className="rf-toc" aria-label="On this page">
      <p className="rf-utility">On this page</p>
      <ol>
        {entries.map((entry, i) => (
          <li key={entry.id} data-passed={i < activeIndex || undefined}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? "location" : undefined}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
