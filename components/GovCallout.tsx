import LogoTile from "@/components/gov/LogoTile";
import { RF_EVENTS } from "@/lib/analytics/events";
import { BUSINESS_CLASSIFICATIONS, GOV_IDENTIFIERS, LOGOS } from "@/lib/content/gov";
import { GOV_SITE_URL } from "@/lib/site";

const MARKS = [
  { logo: LOGOS.lockheedMartin, name: "Lockheed Martin" },
  { logo: LOGOS.prattWhitney, name: "Pratt & Whitney" },
  { logo: LOGOS.msts, name: "MSTS" },
  { logo: LOGOS.usArmy, name: "U.S. Army" },
];

/**
 * The industry pages' way into gov.regainflow.com, on the groups whose buyers
 * procure through government (`IndustryGroup.gov`).
 *
 * The main site sells; the subdomain is the procurement file a contracting
 * officer pulls — identifiers, codes, past performance, the PDF. The
 * identifiers and marks come from `lib/content/gov.ts`, the same source the gov
 * page reads. The CTA is secondary on purpose: the free assessment directly
 * below stays the lead offer.
 *
 * The marks sit on one light panel (`.rf-logo-wall`). They are transparent
 * files in their own colours, and the main site is dark only — Lockheed
 * Martin's navy and the Army's black would disappear on Void.
 */
export default function GovCallout({
  location,
}: {
  /** `data-rf-location`, e.g. `industry_public-safety`. */
  location: string;
}) {
  const facts = [
    ...GOV_IDENTIFIERS.map((id) => `${id.label} ${id.value}`),
    ...BUSINESS_CLASSIFICATIONS.map((c) => c.abbreviation ?? c.label),
  ];

  return (
    <section className="rf-section">
      <div className="rf-shell py-12 md:py-16">
        <div className="rf-grid items-center gap-y-10">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow">For government buyers</p>
            <h2 className="rf-h3 mt-4 max-w-[36ch]">
              Buying through procurement? The capability statement, codes, and
              past performance are in one place.
            </h2>

            <p className="rf-utility mt-6">{facts.join(" · ")}</p>

            <a
              href={GOV_SITE_URL}
              className="rf-cta-secondary mt-8"
              data-rf-event={RF_EVENTS.capabilityStatementOpened}
              data-rf-location={location}
            >
              Capability statement &amp; past performance &#8599;
            </a>
          </div>

          <div className="col-span-full lg:col-span-6">
            <ul className="rf-logo-wall" aria-label="Past performance">
              {MARKS.map((mark) => (
                <li key={mark.name}>
                  <LogoTile logo={mark.logo} name={mark.name} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
