"use client";

import { useEffect } from "react";

import { RF_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

const DEPTHS = [25, 50, 75, 90] as const;

/**
 * Scroll depth and the "quality read", for one post. Renders nothing.
 *
 * Depth is measured against the article body (`.rf-prose`), not the page:
 * the related posts and footer below it would otherwise count as reading.
 * Each threshold fires once per page view.
 *
 * A quality read is the FT's metric, adapted: the reader got at least halfway
 * down the body *and* spent at least half the post's expected reading time
 * with the tab visible (`docs/blogs_seo/blog_ui_ux.md`, Part 10). Time counts
 * in one-second ticks while the tab is visible, so a post left open in a
 * background tab does not become a read.
 */
export default function ReadDepth({
  post,
  readingMinutes,
}: {
  post: string;
  readingMinutes: number;
}) {
  useEffect(() => {
    const body = document.querySelector<HTMLElement>(".rf-post .rf-prose");
    if (!body) return;

    const fired = new Set<number>();
    const neededSeconds = readingMinutes * 60 * 0.5;
    let deepest = 0;
    let visibleSeconds = 0;
    let qualityRead = false;
    let frame = 0;

    const checkQuality = () => {
      if (!qualityRead && deepest >= 50 && visibleSeconds >= neededSeconds) {
        qualityRead = true;
        track(RF_EVENTS.blogQualityRead, { post });
      }
    };

    const measure = () => {
      frame = 0;
      const rect = body.getBoundingClientRect();
      if (rect.height <= 0) return;

      const seen = ((window.innerHeight - rect.top) / rect.height) * 100;
      deepest = Math.max(deepest, Math.min(100, seen));

      for (const depth of DEPTHS) {
        if (deepest >= depth && !fired.has(depth)) {
          fired.add(depth);
          track(RF_EVENTS.blogScrollDepth, { post, depth: String(depth) });
        }
      }
      checkQuality();
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      visibleSeconds += 1;
      checkQuality();
      if (qualityRead) window.clearInterval(timer);
    }, 1000);

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [post, readingMinutes]);

  return null;
}
