"use client";

import posthog from "posthog-js";
import { useState } from "react";

import AssessmentReport from "@/components/AssessmentReport";
import AsciiField from "@/components/brand/AsciiField";
import { RF_EVENTS, type RfLocation } from "@/lib/analytics/events";
import {
  ASSESSMENT_CTA,
  ASSESSMENT_PHASES,
} from "@/lib/content/assessment";
import { FREE_ASSESSMENT_HREF } from "@/lib/site";

/** Where each phase's route leaves the column, in SVG units. */
const NODE_Y = [40, 100, 160, 220];
const JUNCTION = 130;

/**
 * The free assessment — the page's one conversion, and the only thing on this
 * site we give away.
 *
 * The section answers two questions and is ordered so neither can be missed:
 * **what you get** (the report panel, immediately under the lead) and **what it
 * costs** (the price on that panel). Everything after them is how it runs.
 *
 * That ordering is the fix for what this was. The section used to open with
 * four phases, then a second list of four steps saying the same thing from
 * another angle, then a $0/None/Zero stat row, with the report's actual
 * contents buried as a chip row inside step 03's body copy. A reader had to
 * work to find out what arrived, and the price read as a claim rather than a
 * price. See `lib/content/assessment.ts` for the content-side half of that.
 *
 * Every phase's copy is rendered at rest. Highlighting one lights its route
 * into the junction and lifts the row; it never reveals text that was hidden,
 * because a visitor with JavaScript off has to be able to read all four.
 *
 * `hook` swaps the lead for a caller-supplied one. `/services` and the home
 * page both take the default; the shorter `AssessmentCallout` is what industry
 * pages use, since four phases and a traced diagram repeated at the foot of
 * every sector page stop reading as substance.
 *
 * `location` is the analytics value for the booking anchor, because this now
 * renders on two routes and a shared value would merge them.
 */
export default function FreeAssessment({
  hook,
  location = "assessment",
}: {
  hook?: string;
  location?: RfLocation;
} = {}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="assessment"
      className="rf-section relative isolate overflow-clip"
    >
      {/* The wave once more, at echo strength — the same treatment the home
          proof strip uses, so this reads as the identity and not an effect. */}
      <AsciiField className="rf-ascii-field rf-ascii-echo" animate={false} />

      {/* `rf-band-lead` — the page's one conversion, and the only thing here
          we give away. The other section carrying this weight is the argument
          that earns it. */}
      <div className="rf-shell relative z-10 rf-band-lead">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow text-rf-flow-soft">Free assessment</p>
            <h2 className="rf-h2 mt-5">
              Get a clear read on what is worth doing&mdash;and what it will
              take.
            </h2>
          </div>

          <p className="rf-lead col-span-full max-w-[50ch] lg:col-span-5 lg:col-start-8 lg:pt-3">
            {hook ??
              "A real mini-engagement, not a free first conversation. It runs in four phases and ends in a written report that is yours to act on."}
          </p>
        </div>

        {/* What you get, and what it costs — the two questions this section
            exists to answer, in one object, before anything about process. The
            panel is capped and left-aligned rather than full-bleed: a document
            that spans twelve columns stops reading as a document. */}
        <div className="mt-12 max-w-[34rem]">
          <AssessmentReport />
        </div>

        <p className="rf-utility mt-14 text-rf-flow-soft">
          <span className="rf-on-touch">Tap</span>
          <span className="rf-on-pointer">Hover</span> a phase to trace it
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
            {ASSESSMENT_PHASES.map((step) => (
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

                  {/* No report-contents chip row here any more. It was only
                      discoverable by reading phase 03 to the end; the panel
                      above carries it where a reader looks first. */}
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
            href={FREE_ASSESSMENT_HREF}
            className="rf-cta-primary"
            data-rf-event={RF_EVENTS.bookingClicked}
            data-rf-location={location}
          >
            {ASSESSMENT_CTA}
          </a>
          <p className="rf-utility">No cost &middot; No obligation</p>
        </div>

        {/* The "this call is qualification, not the assessment" note used to
            live here as its own constant. It now opens phase 01, which is the
            phase it describes — a caveat under the button was answering a
            question the reader had already formed two screens earlier. */}
      </div>
    </section>
  );
}

/** Four phases converging on one read. Decorative — the list carries the copy. */
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
      {ASSESSMENT_PHASES.map((step, i) => {
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

      <path
        className="rf-assess-route"
        data-active
        d={`M150 ${JUNCTION} H206`}
      />

      <rect
        x="147"
        y={JUNCTION - 3}
        width="6"
        height="6"
        fill="var(--color-rf-flow)"
      />
      <path
        className="rf-head"
        d={`M220 ${JUNCTION} L206 ${JUNCTION - 7} L206 ${JUNCTION + 7} Z`}
      />

      <rect
        x="222"
        y={JUNCTION - 22}
        width="164"
        height="44"
        fill="var(--color-rf-void)"
        stroke="var(--color-rf-flow)"
        strokeWidth="1.5"
      />
      <text
        className="rf-annotation"
        x="304"
        y={JUNCTION + 5}
        textAnchor="middle"
      >
        A CLEAR READ
      </text>
    </svg>
  );
}
