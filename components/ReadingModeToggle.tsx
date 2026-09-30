"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import { RF_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { READ_THEME_KEY } from "@/lib/content/blog-reading";

type ReadTheme = "light" | "dark";

/**
 * Light or dark, for a blog post only.
 *
 * The first visit follows the reader's OS setting; this button overrides it.
 * Light matters because the reading research is consistent that dark text on a
 * light ground reads faster for most people over a long article (`docs/
 * blogs_seo/blog_ui_ux.md`, Part 3.1), and letting the reader choose is what
 * NN/g recommends. The choice is remembered per browser and applied before
 * paint by the inline script on the post page, so nobody sees a flash.
 *
 * Same mechanism as `components/gov/GovThemeToggle.tsx`, on its own key: a
 * reader who prefers gov in light should not have the blog switched for them.
 */
export default function ReadingModeToggle() {
  const [theme, setTheme] = useState<ReadTheme>("dark");

  useEffect(() => {
    const current = document.querySelector<HTMLElement>(".rf-read")?.dataset.theme;
    // Syncing from the DOM the pre-paint script already set, once, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current === "light") setTheme("light");
  }, []);

  const next: ReadTheme = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? "Switch to light reading mode" : "Switch to dark reading mode";

  return (
    <button
      type="button"
      className="rf-read-control"
      aria-label={label}
      title={label}
      onClick={() => {
        const root = document.querySelector<HTMLElement>(".rf-read");
        if (root) root.dataset.theme = next;
        try {
          localStorage.setItem(READ_THEME_KEY, next);
        } catch {
          // Blocked storage: the switch still works for this page.
        }
        track(RF_EVENTS.readingModeChanged, { theme: next });
        setTheme(next);
      }}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
      <span className="rf-read-control-label">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
