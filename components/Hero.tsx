import AsciiField from "@/components/brand/AsciiField";
import AsciiMonogram from "@/components/brand/AsciiMonogram";
import IndustryMarquee from "@/components/IndustryMarquee";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  FREE_ASSESSMENT_CTA,
  FREE_ASSESSMENT_HREF,
  GOV_SITE_URL,
  POSITIONING,
} from "@/lib/site";

export default function Hero() {
  return (
    // Fills the fold minus the header, as a column, so the industries row is
    // pinned to the bottom of the first screen rather than floating wherever
    // the copy happens to end.
    <section className="rf-section relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-clip md:min-h-[calc(100svh-5rem)]">
      {/* The water, and RF standing in it. Two layers on one grid so the field
          moves behind the letterform rather than beside it. */}
      <AsciiField className="rf-ascii-field" />
      <AsciiMonogram className="rf-ascii-mono" />
      <div className="rf-hero-scrim" aria-hidden="true" />

      <div className="rf-shell relative z-10 flex flex-1 flex-col justify-center py-14 md:py-16">
        <div className="max-w-[36rem]">
          <p className="rf-eyebrow">{POSITIONING}</p>

          {/* "Public agencies and complex organizations", not "company" and not
              "agency". Government and regulated environments are the focus, and
              this line has to say so without shutting out the complex
              commercial organizations the same engineering applies to. The
              sector-specific framing lives on the industry pages, where the
              reader has already told us which one they are. */}
          <h1 className="rf-h1 mt-6">
            We build production AI systems for public agencies and complex
            organizations.
          </h1>

          {/* States the part most firms leave out. "Built by the engineers who
              built them for defense" used to close this paragraph; it sold a
              past employer's record as ours, and what actually distinguishes
              the work is that we are still there after the launch. */}
          <p className="rf-lead mt-6 max-w-[48ch]">
            We stay through integration, deployment, adoption, and
            handoff&mdash;so your team can operate what ships.
          </p>

          {/* One lead offer, sized to read as the lead. Everything else in the
              hero is a step down from it: a secondary door for government
              buyers, and a text link for the reader who wants to scroll.

              A two-column grid sized to its content: the primary spans both
              columns, so its edges line up exactly with the row beneath it —
              longer than the gov button, never wider than the block. Stacks
              full width on a phone. */}
          <div className="mt-9 grid gap-3 sm:inline-grid sm:grid-cols-[auto_auto] sm:items-center sm:gap-x-6">
            <a
              href={FREE_ASSESSMENT_HREF}
              className="rf-cta-primary sm:col-span-2"
              data-rf-event={RF_EVENTS.bookingClicked}
              data-rf-location="hero"
            >
              {FREE_ASSESSMENT_CTA}
            </a>

            {/* A contracting officer or prime arrives knowing what they need —
                the capability statement, not a tour — so they get their own
                door. */}
            <a
              href={GOV_SITE_URL}
              className="rf-cta-secondary"
              data-rf-event={RF_EVENTS.capabilityStatementOpened}
              data-rf-location="hero_gov"
            >
              RegainFlow Government &#8599;
            </a>
            <a
              href="#approach"
              className="rf-nav-link inline-flex items-center justify-center gap-2 justify-self-center"
              data-rf-event={RF_EVENTS.secondaryClicked}
              data-rf-location="hero_how_we_work"
            >
              See how we work
              {/* The same chevron the nav's disclosure buttons use. */}
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <IndustryMarquee />
    </section>
  );
}
