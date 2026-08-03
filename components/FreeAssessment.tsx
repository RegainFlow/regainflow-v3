"use client";

import posthog from "posthog-js";
import { useState } from "react";

import AsciiField from "@/components/brand/AsciiField";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  ASSESSMENT_CTA,
  ASSESSMENT_PROOF,
  ASSESSMENT_STEPS,
} from "@/lib/content/assessment";
import { BOOKING_HREF } from "@/lib/site";

/** Where each step's route leaves the column, in SVG units. */
const NODE_Y = [40, 100, 160, 220];
const JUNCTION = 130;

/**
 * The free assessment — the page's one conversion, and the only thing on this
 * site we give away.
 *
 * Every step's copy is rendered at rest. Highlighting a step lights its route
 * into the junction and lifts the row; it never reveals text that was hidden,
 * because a visitor with JavaScript off has to be able to read all four.
 */
export default function FreeAssessment() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="assessment"
      className="rf-section relative isolate overflow-clip"
    >
      {/* The wave once more, at echo strength — the same treatment the home
          proof strip uses, so this reads as the identity and not an effect. */}
      <AsciiField className="rf-ascii-field rf-ascii-echo" animate={false} />

      <div className="rf-shell relative z-10 py-14 md:py-18 lg:py-22">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow text-rf-flow-soft">Free assessment</p>
            <h2 className="rf-h2 mt-5">
              Find out what is worth doing&mdash;before you pay anyone to do it.
            </h2>
          </div>

          <p className="rf-lead col-span-full max-w-[50ch] lg:col-span-5 lg:col-start-8 lg:pt-3">
            The first conversation is free, and it stays free whether or not it
            ends in work. You get our read either way.
          </p>
        </div>

        <dl className="mt-12 grid gap-8 sm:grid-cols-3">
          {ASSESSMENT_PROOF.map((item) => (
            <div key={item.label} className="border-t border-rf-hairline pt-4">
              <dt className="rf-utility">{item.label}</dt>
              <dd className="rf-stat mt-3 text-rf-flow-soft">{item.value}</dd>
            </div>
          ))}
        </dl>

        <p className="rf-utility mt-14 text-rf-flow-soft">
          <span className="rf-on-touch">Tap</span>
          <span className="rf-on-pointer">Hover</span> a step to trace it
        </p>

        {/* Grid only from `lg` — see the note in `LayerSystem`; below that the
            block container is what the pinned route travels inside. */}
        <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-14">
          <div className="rf-model-pin sticky top-16 lg:static lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <AssessmentRoute active={active} />
            </div>
          </div>

          {/* `self-start`: the row is as tall as the sticky diagram beside it,
              and a stretched list drags its last rule into empty space. */}
          <ol className="rf-assess-steps mt-10 self-start lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-0">
            {ASSESSMENT_STEPS.map((step) => (
              <li
                key={step.index}
                className="rf-assess-step"
                data-active={active === step.index || undefined}
                onMouseEnter={() => setActive(step.index)}
                onMouseLeave={() => setActive(null)}
              >
                {/* A real control, so the diagram answers to the keyboard too.
                    The diagram is decorative, which is why this only ever
                    changes emphasis. */}
                <button
                  type="button"
                  className="rf-assess-toggle"
                  aria-pressed={active === step.index}
                  onFocus={() => setActive(step.index)}
                  onBlur={() => setActive(null)}
                  // Sets rather than toggles — see the note in `LayerSystem`:
                  // on touch, focus lands before click, so a toggle undid the
                  // tap that caused it.
                  //
                  // The site's only imperative capture, and the only handler of
                  // the three here that carries one. `onMouseEnter` and
                  // `onFocus` also set `active`, but they fire on incidental
                  // pointer travel and on tabbing straight through the list, so
                  // tracking them would bury the deliberate reads in noise.
                  onClick={() => {
                    setActive(step.index);
                    posthog.capture(RF_EVENTS.assessmentStepOpened, {
                      step: step.index,
                      name: step.name,
                    });
                  }}
                >
                  <span className="rf-assess-head">
                    <span className="rf-index">{step.index}</span>
                    <span className="rf-assess-name">{step.name}</span>
                    <span className="sr-only"> — highlight this step</span>
                  </span>

                  <span className="rf-body mt-2 block max-w-[58ch]">
                    {step.detail}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={BOOKING_HREF}
            className="rf-cta-primary"
            data-rf-event={RF_EVENTS.bookingClicked}
            data-rf-location="assessment"
          >
            {ASSESSMENT_CTA}
          </a>
          <p className="rf-utility">No cost &middot; No obligation</p>
        </div>
      </div>
    </section>
  );
}

/** Four steps converging on one read. Decorative — the list carries the copy. */
function AssessmentRoute({ active }: { active: string | null }) {
  return (
    <svg
      viewBox="0 0 400 270"
      // Centred while it is pinned above the steps; left-aligned in its own
      // column from `lg`, which is where it was to begin with.
      className="mx-auto w-full max-w-[420px] lg:mx-0"
      aria-hidden="true"
      focusable="false"
    >
      {ASSESSMENT_STEPS.map((step, i) => {
        const y = NODE_Y[i];
        const on = active === step.index;

        return (
          <g key={step.index} data-active={on || undefined}>
            <text className="rf-annotation" x="64" y={y + 4} textAnchor="end">
              {step.index}
            </text>

            <path
              className="rf-assess-route"
              data-active={on || undefined}
              d={`M74 ${y} H150 V${JUNCTION}`}
            />

            <rect
              className="rf-assess-node"
              data-active={on || undefined}
              x="70"
              y={y - 3}
              width="6"
              height="6"
            />

            {/* Pulses run continuously rather than only while a step is
                active — a route that carried traffic only on hover would sit
                dead for most of the time anyone is looking at it. */}
            <path
              className="rf-cta-pulse"
              d={`M74 ${y} H150 V${JUNCTION} H206`}
              style={{ animationDelay: `${-0.7 * i}s` }}
            />
          </g>
        );
      })}

      <path className="rf-assess-route" data-active d={`M150 ${JUNCTION} H206`} />

      <rect
        x="147"
        y={JUNCTION - 3}
        width="6"
        height="6"
        fill="var(--color-rf-flow)"
      />
      <path className="rf-head" d={`M220 ${JUNCTION} L206 ${JUNCTION - 7} L206 ${JUNCTION + 7} Z`} />

      <rect
        x="222"
        y={JUNCTION - 22}
        width="164"
        height="44"
        fill="var(--color-rf-void)"
        stroke="var(--color-rf-flow)"
        strokeWidth="1.5"
      />
      <text className="rf-annotation" x="304" y={JUNCTION + 5} textAnchor="middle">
        A CLEAR READ
      </text>
    </svg>
  );
}
