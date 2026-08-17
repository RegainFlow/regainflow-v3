"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
import { STAGES, type StageId } from "@/lib/content/stages";

/**
 * The home-page version of the three services: name, promise, and one line
 * each. The full panels — outputs, capabilities, engagement shape — live on
 * `/services`, so this section never repeats that page.
 */
export default function StageSummary() {
  // Server output — and any client that opts out below — renders the final
  // stage, so the section is fully meaningful without JavaScript.
  const [stage, setStage] = useState<StageId>("scale");
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)");
    const allowsMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    if (!isDesktop.matches || !allowsMotion.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only ever set on entry. Clearing would flicker in the gaps between
          // panels; setting on entry alone also restores state when scrolling up.
          if (!entry.isIntersecting) continue;
          const next = (entry.target as HTMLElement).dataset.stage as
            | StageId
            | undefined;
          if (!next) continue;
          setStage(next);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel);
    }

    return () => observer.disconnect();
  }, []);

  return (
    // Navy. The home page ran four Void sections back to back and this is the
    // first of them that is a different *kind* of thing — the argument above it
    // is a diagnosis, this is the offer. The ground change is what tells a
    // scrolling reader that.
    <section id="approach" className="rf-section bg-rf-navy">
      <div className="rf-shell rf-band">
        <div className="rf-grid gap-y-5">
          <div className="col-span-full lg:col-span-7">
            {/* Deliberately not the `/services` heading — each route makes one
                claim, and this one is the shape of the path. */}
            <p className="rf-eyebrow">How we work</p>
            <h2 className="rf-h2 mt-5">Three stages. One accountable path.</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-14">
          {/* Desktop: one sticky model area, crossfading as each panel is read. */}
          <div className="hidden lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:block">
            <div className="lg:sticky lg:top-24">
              <div className="rf-iso-stack">
                {STAGES.map((item) => (
                  <PlayOnView key={item.id} active={stage === item.id}>
                    <StageModel model={item.id} data-active={stage === item.id} />
                  </PlayOnView>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:gap-20">
            {STAGES.map((item, i) => (
              <article
                key={item.id}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                data-stage={item.id}
                data-current={stage === item.id}
                className="rf-stage-panel p-5 md:p-7"
              >
                <div className="flex items-baseline gap-4 border-b border-rf-hairline pb-4">
                  <span className="rf-index">{item.index}</span>
                  <h3 className="rf-h3">
                    {item.name}
                    <span className="text-rf-slate"> — {item.promise}</span>
                  </h3>
                </div>

                <p className="rf-lead mt-5 max-w-[48ch]">{item.summary}</p>

                {/* Below lg the model belongs with its own stage, in reading order. */}
                <PlayOnView className="mt-7 lg:hidden">
                  <StageModel model={item.id} />
                </PlayOnView>

                <p className="rf-utility mt-6 border-t border-rf-hairline pt-4 text-rf-flow-soft">
                  {item.transformation}
                </p>

                {/* One expression: JSX splits `What {expr} includes` into
                    separate text nodes and drops the space before "includes". */}
                <Link
                  href={`/services#${item.id}`}
                  className="rf-nav-link mt-4 inline-block"
                >
                  {`What ${item.name.toLowerCase()} includes →`}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
