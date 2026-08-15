import AsciiField from "@/components/brand/AsciiField";
import AsciiMonogram from "@/components/brand/AsciiMonogram";
import IndustryMarquee from "@/components/IndustryMarquee";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  FREE_ASSESSMENT_CTA,
  FREE_ASSESSMENT_HREF,
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

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={FREE_ASSESSMENT_HREF}
              className="rf-cta-primary"
              data-rf-event={RF_EVENTS.bookingClicked}
              data-rf-location="hero"
            >
              {FREE_ASSESSMENT_CTA}
            </a>
            <a
              href="#approach"
              className="rf-cta-secondary"
              data-rf-event={RF_EVENTS.secondaryClicked}
              data-rf-location="hero_how_we_work"
            >
              How we work
            </a>
          </div>

          {/* The one thing on this site that is free, said under the button
              that leads to it. The label already reads "Free Assessment"; what
              a first-time reader does not know is that free means no call
              sequence attached, which is the objection this answers. */}
          <p className="rf-cta-note">
            No cost, no obligation, no sales deck.
          </p>
        </div>
      </div>

      <IndustryMarquee />
    </section>
  );
}
