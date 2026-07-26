"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The longest sequence finishes at ~2.85s. The rest of the cycle is the model
 * sitting assembled — deliberately the majority, so the panel reads as a
 * finished diagram that rebuilds occasionally, not as a flickering loop.
 */
const CYCLE_MS = 9000;

/**
 * Runs a model's build sequence while it is on screen, and repeats it.
 *
 * The animations are declared only under `[data-play="true"]`, so the default —
 * server output, JavaScript disabled, reduced motion — is the finished model.
 * Nothing is ever hidden waiting for a trigger that might not fire.
 *
 * `active` gates the loop for the sticky column, where three models share one
 * slot: only the one currently being read replays. When a model stops being
 * active the attribute is left in place, so it rests on its finished frame
 * instead of snapping back to blank.
 */
export default function PlayOnView({
  children,
  className,
  active = true,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    let timer: number | undefined;

    const replay = () => {
      // Drop the attribute, force a reflow, then re-add it. That restarts the
      // keyframes without needing every element's animation to share one
      // duration, which is what an `infinite` iteration count would require.
      node.removeAttribute("data-play");
      void node.offsetWidth;
      node.setAttribute("data-play", "true");
    };

    const start = () => {
      if (timer !== undefined) return;
      replay();
      timer = window.setInterval(replay, CYCLE_MS);
    };

    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };

    const shouldRun = () =>
      onScreen.current && active && document.visibilityState === "visible";

    const sync = () => {
      if (shouldRun()) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    // A hidden tab does not advance CSS animations, so a sequence released
    // there would sit frozen on its blank first frame. Park on the finished
    // state instead, and rebuild when the tab comes back.
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync();
      else {
        stop();
        node.setAttribute("data-play", "true");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [active]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
