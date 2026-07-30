"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { FIELD_GRID, frame, type GridSize } from "@/lib/ascii/field";

/** Calm, not a data stream — and the grid is ~25,000 cells, so each frame is a
 *  sizeable string write. Slow is both the look and the budget. */
const FPS = 7;

/** How much a full page of scrolling advances the field. Scrolling should move
 *  the water, not race it. */
const SCROLL_GAIN = 1.6;

export default function AsciiField({
  className,
  /** Top of the tone range. Pushes the brightest bands up onto the larger dots
   *  — at 0.62 almost every cell landed on the smallest one and the field was
   *  barely there. */
  ceiling = 0.88,
  /** Still fields (below the fold) skip the loop entirely. */
  animate = true,
}: {
  className?: string;
  ceiling?: number;
  animate?: boolean;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const [size, setSize] = useState<GridSize>(FIELD_GRID.lg);

  // Match the grid to the viewport. The server renders `lg`; the field is
  // clipped and masked, so the moment before this runs costs nothing.
  useEffect(() => {
    const md = window.matchMedia("(min-width: 640px)");
    const lg = window.matchMedia("(min-width: 1024px)");

    const sync = () =>
      setSize(lg.matches ? FIELD_GRID.lg : md.matches ? FIELD_GRID.md : FIELD_GRID.sm);

    sync();
    md.addEventListener("change", sync);
    lg.addEventListener("change", sync);
    return () => {
      md.removeEventListener("change", sync);
      lg.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || !animate) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      // Leave the still frame React rendered. Scroll does not move it either.
      return;
    }

    let raf = 0;
    let start = 0;
    let last = 0;
    let onScreen = false;
    let scroll = 0;
    const interval = 1000 / FPS;

    const readScroll = () => {
      const span = document.documentElement.scrollHeight - window.innerHeight;
      scroll = span > 0 ? (window.scrollY / span) * SCROLL_GAIN * Math.PI : 0;
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < interval) return;
      last = now;
      if (!start) start = now;

      // Written through the ref, never through React — an ancestor re-render
      // would otherwise restore React's own child and snap the animation back.
      node.textContent = frame(size.cols, size.rows, (now - start) / 1000 + scroll, ceiling);
    };

    const play = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => {
      if (onScreen && document.visibilityState === "visible") play();
      else stop();
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(node);

    document.addEventListener("visibilitychange", sync);
    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", readScroll);
      stop();
    };
  }, [size, ceiling, animate]);

  return (
    <div
      className={["rf-ascii", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <pre
        ref={ref}
        style={{ "--rf-cols": size.cols } as CSSProperties}
        // The animation writes this node directly, so its content is expected to
        // diverge from React's tree the moment it starts.
        suppressHydrationWarning
      >
        {frame(size.cols, size.rows, 0, ceiling)}
      </pre>
    </div>
  );
}
