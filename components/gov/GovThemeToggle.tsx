"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import { GOV_THEME_KEY } from "@/lib/content/gov";

type GovTheme = "light" | "dark";

/**
 * Light or dark, for the gov subdomain only. Light is the default; a reader who
 * switches keeps their choice (`localStorage`, per browser), and the inline
 * script in `app/gov/layout.tsx` applies it before paint so a dark-mode reader
 * does not see a white flash on every page.
 *
 * The theme lives on the `.rf-gov` wrapper, not on `<html>`, because the rest
 * of the site is dark-only and must stay that way.
 */
export default function GovThemeToggle() {
  const [theme, setTheme] = useState<GovTheme>("light");

  useEffect(() => {
    const current = document.querySelector<HTMLElement>(".rf-gov")?.dataset.theme;
    // Syncing from the DOM the pre-paint script already set, once, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current === "dark") setTheme("dark");
  }, []);

  const next: GovTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="rf-theme-toggle"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => {
        const root = document.querySelector<HTMLElement>(".rf-gov");
        if (root) root.dataset.theme = next;
        try {
          localStorage.setItem(GOV_THEME_KEY, next);
        } catch {
          // Private windows and blocked storage: the switch still works for
          // this page, it just is not remembered.
        }
        setTheme(next);
      }}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} className="h-4 w-4" />
    </button>
  );
}
