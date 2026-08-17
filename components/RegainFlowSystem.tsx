"use client";

import { useEffect, useRef, useState } from "react";

import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
import { STAGES, type StageId } from "@/lib/content/stages";

/**
 * The full three-stage treatment: every output and capability, with the
 * anchors the navigation dropdown targets. Used on `/services` only — the home
 * page carries the condensed `StageSummary` instead.
 */
export default function RegainFlowSystem() {
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
    <section className="rf-section">
      {/* `rf-band-lead` — the primary framework on `/services`, and the first
          thing after the hero. */}
      <div className="rf-shell rf-band-lead">
        <div className="rf-grid gap-y-5">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">The RegainFlow system</p>
            <h2 className="rf-h2 mt-5">
              From decision to dependable operation.
            </h2>
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

          <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:gap-24">
            {STAGES.map((item, i) => (
              <article
                key={item.id}
                id={item.id}
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

                <p className="rf-body mt-5 max-w-[56ch]">{item.copy}</p>

                {/* Below lg the model belongs with its own stage, in reading order. */}
                <PlayOnView className="mt-7 lg:hidden">
                  <StageModel model={item.id} />
                </PlayOnView>

                <p className="rf-utility mt-7">{item.listLabel}</p>
                <ul className="mt-3">
                  {item.items.map((entry) => (
                    <li
                      key={entry}
                      className="rf-body border-t border-rf-hairline py-2"
                    >
                      {entry}
                    </li>
                  ))}
                </ul>

                <p className="rf-utility mt-6 flex flex-wrap items-center gap-3 border-t border-rf-hairline pt-4 text-rf-flow-soft">
                  {item.transformation}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
