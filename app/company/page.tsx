import type { Metadata } from "next";
import Image from "next/image";

import PageHeader from "@/components/PageHeader";
import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
import { RF_EVENTS } from "@/lib/analytics/events";
import { MANIFESTO, MISSION, MISSION_DETAIL, TEAM, VISION } from "@/lib/content/company";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import {
  BOOKING_HREF,
  CONTACT_EMAIL,
  CONTACT_HREF,
  LOCATION,
  PRIMARY_CTA,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Company",
  description:
    "RegainFlow is a senior AI transformation partner based in Orlando, Florida. Who we are, what we believe about AI in production, and how to reach us.",
  path: "/company",
});

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="A small firm of senior operators, on purpose."
        lead={MISSION_DETAIL}
      />

      <section id="about" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <div className="rf-grid gap-y-8">
            <div className="col-span-full lg:col-span-6">
              <p className="rf-eyebrow">Who we are</p>
              <h2 className="rf-h2 mt-5">{MISSION}</h2>
            </div>

            <p className="rf-body col-span-full max-w-[52ch] lg:col-span-5 lg:col-start-8 lg:pt-3">
              {VISION}
            </p>
          </div>

          {/* Stacked while the column is narrow; from `lg` the portrait moves
              beside the copy. Stacked at that width left most of a ~600px grid
              cell empty to the right of a 240px portrait and a 42ch bio. */}
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
            {TEAM.map((member) => (
              <li key={member.name} className="lg:flex lg:items-start lg:gap-6">
                {/* Drop real photographs at the same paths and the layout does
                    not move — the frame declares its own ratio. */}
                {/* Grows with the card rather than taking one fixed width: at
                    `lg` the cell is only ~447px, so a portrait sized for the
                    1280px layout would squeeze the bio to under 30 characters. */}
                <div className="rf-portrait lg:w-48 lg:flex-none xl:w-56">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} of RegainFlow`}
                    width={480}
                    height={600}
                    // The widest the frame ever gets is the 16rem stacked cap,
                    // so ask for that rather than a share of the viewport —
                    // `40vw` was requesting ~576px to fill a 240px slot.
                    sizes="256px"
                    // `next/image` will not send an SVG through the optimizer
                    // unless `dangerouslyAllowSVG` is set, and it fails rather
                    // than falling back — which is why the pending placeholder
                    // rendered as alt text. Serving these 657 bytes straight
                    // from `/public` costs nothing and keeps the optimizer
                    // closed to SVG everywhere else, which is the safe default.
                    unoptimized={member.image.endsWith(".svg")}
                  />
                </div>

                {/* One flex item, not three — otherwise the name, role, and bio
                    each become their own column beside the portrait. */}
                <div className="mt-5 lg:mt-0 lg:min-w-0">
                  <h3 className="rf-h3">{member.name}</h3>
                  <p className="rf-utility mt-2">{member.role}</p>
                  <p className="rf-body mt-3 max-w-[42ch]">{member.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="manifesto" className="rf-section bg-rf-navy">
        <div className="rf-shell rf-grid gap-y-10 py-14 md:py-18 lg:py-22">
          <div className="col-span-full lg:col-span-4">
            <p className="rf-eyebrow">Manifesto</p>
            <h2 className="rf-h2 mt-5">What we will and will not do.</h2>

            <PlayOnView className="mt-10 lg:pr-6">
              <StageModel model="work" />
            </PlayOnView>
          </div>

          <ol className="col-span-full border-t border-rf-hairline lg:col-span-7 lg:col-start-6">
            {MANIFESTO.map((item, i) => (
              <li
                key={item.claim}
                className="flex gap-5 border-b border-rf-hairline py-6"
              >
                <span className="rf-index pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="rf-h3">{item.claim}</h3>
                  <p className="rf-body mt-2 max-w-[52ch]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-14 md:py-20">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow">Contact</p>
            <h2 className="rf-h2 mt-5">Bring us your ambitions.</h2>
            <p className="rf-lead mt-6 max-w-[46ch]">
              We will help you clarify where to focus, what it will take, and
              whether RegainFlow is the right partner for it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Both carry the same location on purpose: it is one decision
                  point, and the event name is what separates them, so book-vs-
                  email stays a direct comparison. */}
              <a
                href={BOOKING_HREF}
                className="rf-cta-primary"
                data-rf-event={RF_EVENTS.bookingClicked}
                data-rf-location="company_contact"
              >
                {PRIMARY_CTA}
              </a>
              <a
                href={CONTACT_HREF}
                className="rf-cta-secondary"
                data-rf-event={RF_EVENTS.contactClicked}
                data-rf-location="company_contact"
              >
                Email us instead
              </a>
            </div>
          </div>

          <dl className="col-span-full lg:col-span-4 lg:col-start-9 lg:pt-6">
            <dt className="rf-utility border-t border-rf-hairline pt-4">
              Email
            </dt>
            <dd className="rf-body mt-2 break-words">
              <a
                href={CONTACT_HREF}
                className="rf-text-link"
                data-rf-event={RF_EVENTS.contactClicked}
                data-rf-location="company_details"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>

            <dt className="rf-utility mt-8 border-t border-rf-hairline pt-4">
              Location
            </dt>
            <dd className="rf-body mt-2">{LOCATION}</dd>
          </dl>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Company", "/company")),
        }}
      />
    </>
  );
}
