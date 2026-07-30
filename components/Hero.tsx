import AsciiField from "@/components/brand/AsciiField";
import AsciiMonogram from "@/components/brand/AsciiMonogram";
import IndustryMarquee from "@/components/IndustryMarquee";
import { BOOKING_HREF, POSITIONING, PRIMARY_CTA } from "@/lib/site";

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

          <h1 className="rf-h1 mt-6">
            Turn AI ambition into systems your business can run.
          </h1>

          <p className="rf-lead mt-6 max-w-[46ch]">
            We find the AI work worth doing, engineer the production system
            around it, and leave your team able to run it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={BOOKING_HREF} className="rf-cta-primary">
              {PRIMARY_CTA}
            </a>
            <a href="#approach" className="rf-cta-secondary">
              How we work
            </a>
          </div>
        </div>
      </div>

      <IndustryMarquee />
    </section>
  );
}
