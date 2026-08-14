import { RF_EVENTS } from "@/lib/analytics/events";
import { ASSESSMENT_CTA, ASSESSMENT_PROOF } from "@/lib/content/assessment";
import { FREE_ASSESSMENT_HREF } from "@/lib/site";

/**
 * The free assessment, compressed.
 *
 * `FreeAssessment` is the full version — four steps, a traced SVG, and client
 * state to light the route belonging to whichever step is hovered. That earns
 * its place once, on `/services`, and again on the home page. Repeating it at
 * the foot of every industry page would put the same four-step walkthrough in
 * front of a reader four times, and by the third it reads as filler.
 *
 * This carries the part that has to appear everywhere: the offer is free, and
 * here is the button. `hook` is what changes between pages — the sector's own
 * version of "bring us this and we will tell you that" — so the ask is specific
 * to what the reader just finished reading.
 *
 * A server component on purpose. There is no state here, and every industry
 * page is static; adding a client boundary for a proof row and an anchor would
 * cost hydration on four routes to buy nothing.
 */
export default function AssessmentCallout({ hook }: { hook: string }) {
  return (
    <section id="assessment" className="rf-section">
      <div className="rf-shell py-14 md:py-20 lg:py-24">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-5">
            <p className="rf-eyebrow">Free assessment</p>
            <h2 className="rf-h2 mt-5 max-w-[18ch]">
              Start with the part that costs nothing.
            </h2>
          </div>

          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            <p className="rf-body max-w-[52ch]">{hook}</p>

            {/* The same three claims the full section leads with, from the same
                constant, so the offer cannot say one thing here and another on
                `/services`. */}
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {ASSESSMENT_PROOF.map((proof) => (
                <div key={proof.label}>
                  <dd className="rf-stat">{proof.value}</dd>
                  <dt className="rf-utility mt-2">{proof.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={FREE_ASSESSMENT_HREF}
                className="rf-cta-primary"
                data-rf-event={RF_EVENTS.bookingClicked}
                data-rf-location="industry_assessment"
              >
                {ASSESSMENT_CTA}
              </a>
              <p className="rf-utility">No cost &middot; No obligation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
