import { ENGAGEMENT_PATH } from "@/lib/content/stages";

/**
 * How the work is actually bought. Prices, scopes, and success measures are
 * deliberately absent — the shape of the commitment is the useful part at this
 * stage of a conversation, and anything more specific would be a promise made
 * before we have seen the problem.
 *
 * No CTA here on purpose: `FreeAssessment` closes this page, and two primaries
 * in a row read as a page that does not know what it wants you to do.
 */
export default function EngagementPath() {
  return (
    <section id="engagement" className="rf-section bg-rf-navy">
      <div className="rf-shell py-14 md:py-18 lg:py-22">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow">How an engagement runs</p>
            <h2 className="rf-h2 mt-5">
              Small and provable&mdash;before it is big.
            </h2>
          </div>

          <p className="rf-body col-span-full max-w-[50ch] lg:col-span-5 lg:col-start-8 lg:pt-3">
            You should not have to buy a transformation to find out whether we
            are any good. Each step stands on its own, and each one has to earn
            the next.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {ENGAGEMENT_PATH.map((step) => (
            <li key={step.step} className="rf-card">
              <span className="rf-index">{step.step}</span>
              <h3 className="rf-h3 mt-4">{step.name}</h3>
              <p className="rf-body mt-3">{step.detail}</p>
              <p className="rf-utility mt-auto pt-6 text-rf-flow-soft">
                {step.output}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
