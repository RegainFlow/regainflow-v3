"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Content that resolves out of dot-noise as it arrives.
 *
 * The same halftone idea as the hero, applied to arrival: an overlay of dots
 * fades off as the block fades up. Pure CSS keyframes driven by one attribute —
 * no per-frame JavaScript, nothing that touches layout.
 *
 * Fires once. Content that re-animates every time it crosses the viewport is
 * the thing that makes a page feel restless.
 */
export default function DitherReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion: the content is already visible, so there is nothing to do.
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          node.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // No `data-revealed` on the server: the resting state is plain visible
      // content, and the attribute only ever *adds* an entrance. Nothing is
      // hidden waiting on a trigger that might never fire.
      className={["rf-reveal", className].filter(Boolean).join(" ")}
      style={delay ? { "--rf-reveal-delay": `${delay}ms` } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}
