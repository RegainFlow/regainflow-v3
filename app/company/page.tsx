import type { Metadata } from "next";
import Image from "next/image";

import PageHeader from "@/components/PageHeader";
import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
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

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
            {TEAM.map((member) => (
              <li key={member.name}>
                {/* Placeholder frames. Drop real photographs at the same paths
                    and the layout does not move. */}
                <div className="rf-portrait">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} of RegainFlow`}
                    width={480}
                    height={600}
                    sizes="(min-width: 640px) 40vw, 100vw"
                  />
                </div>
                <h3 className="rf-h3 mt-5">{member.name}</h3>
                <p className="rf-utility mt-2">{member.role}</p>
                <p className="rf-body mt-3 max-w-[42ch]">{member.bio}</p>
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
              <a href={BOOKING_HREF} className="rf-cta-primary">
                {PRIMARY_CTA}
              </a>
              <a href={CONTACT_HREF} className="rf-cta-secondary">
                Email us instead
              </a>
            </div>
          </div>

          <dl className="col-span-full lg:col-span-4 lg:col-start-9 lg:pt-6">
            <dt className="rf-utility border-t border-rf-hairline pt-4">
              Email
            </dt>
            <dd className="rf-body mt-2 break-words">
              <a href={CONTACT_HREF} className="rf-text-link">
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
