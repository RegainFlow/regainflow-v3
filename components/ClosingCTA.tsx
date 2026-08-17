import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import {
  FREE_ASSESSMENT_CTA,
  FREE_ASSESSMENT_HREF,
  CONTACT_CTA,
  CONTACT_PATH,
} from "@/lib/site";

/**
 * The shelf that closes most routes.
 *
 * `override` swaps the copy where a page has earned more specific words than
 * "Bring us the opportunity" — a case study whose reader is a consulting
 * partner is being asked something different from a visitor on `/insights`.
 * Copy only: the destinations stay the free assessment and the contact form on
 * every surface, because two buttons that go somewhere different depending on
 * the page is how a site grows a broken link nobody notices.
 *
 * Extended rather than forked. A second closing component would drift from this
 * one within a release, and the analytics locations below would stop being
 * comparable across routes.
 */
export default function ClosingCTA({
  override,
}: {
  override?: { heading: string; body: string; secondaryLabel: string };
} = {}) {
  return (
    <section id="contact" className="rf-section bg-rf-navy">
      {/* `rf-band`, not `rf-band-lead`. This was the tallest section on the
          site, which on the home page put a closing shelf above the free
          assessment it points back at. It closes four routes; on none of them
          is it the main event. */}
      <div className="rf-shell rf-grid gap-y-12 rf-band">
        <div className="col-span-full lg:col-span-7">
          <p className="rf-eyebrow">Start with the opportunity</p>

          <h2 className="rf-h2 mt-5">
            {override?.heading ?? "Bring us the opportunity."}
          </h2>

          <p className="rf-lead mt-6 max-w-[50ch]">
            {override?.body ??
              "We’ll help determine whether it is worth funding and what it will take."}
          </p>

          {/* Both routes, ranked. Booking is still the primary conversion; the
              form is here for the visitor who wants to say something before
              committing to a time — which, until now, this shelf offered no way
              to do. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* One location across `/`, `/insights`, and `/insights/[slug]`.
                PostHog attaches `$pathname` to every event, so the three are
                already separable without giving this component a prop it
                otherwise has no use for. */}
            <a
              href={FREE_ASSESSMENT_HREF}
              className="rf-cta-primary"
              data-rf-event={RF_EVENTS.bookingClicked}
              data-rf-location="closing_cta"
            >
              {FREE_ASSESSMENT_CTA}
            </a>
            {/* Its own location rather than sharing `closing_cta`: these two are
                a ranked pair, and the whole question this shelf now answers is
                how many people pick the form over the calendar. */}
            <Link
              href={CONTACT_PATH}
              className="rf-cta-secondary"
              data-rf-event={RF_EVENTS.contactClicked}
              data-rf-location="closing_cta_contact"
            >
              {override?.secondaryLabel ?? CONTACT_CTA}
            </Link>
          </div>

          {/* No `ASSESSMENT_PROOF` trio here any more. This shelf is a closing
              CTA, and restating the assessment's terms turned it into a second
              copy of the assessment section a screen above it. The terms still
              render where the offer is actually explained — `FreeAssessment`
              and `AssessmentCallout`. */}
        </div>

        <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:pt-6">
          {/* The three inputs the headline used to name, routed to one place. */}
          <svg
            viewBox="0 0 420 200"
            className="w-full max-w-[420px]"
            aria-hidden="true"
            focusable="false"
          >
            <text className="rf-annotation" x="170" y="45" textAnchor="end">
              AMBITION
            </text>
            <text className="rf-annotation" x="170" y="105" textAnchor="end">
              STALLED PILOT
            </text>
            <text className="rf-annotation" x="170" y="165" textAnchor="end">
              PRODUCTION PROBLEM
            </text>

            <path className="rf-route" d="M178 40 H230 V100" />
            <path className="rf-route" d="M178 100 H230" />
            <path className="rf-route" d="M178 160 H230 V100" />
            <path className="rf-route" d="M230 100 H256" />

            {/* Pulses running the full journey from each input into the mark.
                Offset so the three don't march in lockstep. */}
            <path
              className="rf-cta-pulse"
              d="M178 40 H230 V100 H256"
              style={{ animationDelay: "0s" }}
            />
            <path
              className="rf-cta-pulse"
              d="M178 100 H256"
              style={{ animationDelay: "-0.75s" }}
            />
            <path
              className="rf-cta-pulse"
              d="M178 160 H230 V100 H256"
              style={{ animationDelay: "-1.5s" }}
            />

            <rect
              x="227"
              y="97"
              width="6"
              height="6"
              fill="var(--color-rf-flow)"
            />
            <path className="rf-head" d="M270 100 L256 93 L256 107 Z" />

            <rect
              x="272"
              y="78"
              width="140"
              height="44"
              fill="var(--color-rf-void)"
              stroke="var(--color-rf-flow)"
              strokeWidth="1.5"
            />
            <text className="rf-annotation" x="342" y="105" textAnchor="middle">
              REGAINFLOW
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
