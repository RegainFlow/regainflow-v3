import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PageHeader from "@/components/PageHeader";
import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  MANIFESTO,
  MISSION,
  MISSION_DETAIL,
  TEAM,
  VISION,
} from "@/lib/content/company";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import {
  FREE_ASSESSMENT_CTA,
  FREE_ASSESSMENT_HREF,
  CONTACT_CTA,
  CONTACT_EMAIL,
  CONTACT_HREF,
  CONTACT_PATH,
  LOCATION,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Company",
  description:
    "RegainFlow is an AI engineering and transformation partner based in Orlando, Florida. Who we are, what we believe about AI in production, and how to reach us.",
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

          {/* One founder per row rather than the two-up it used to be. A 42ch
              bio fitted beside a portrait in a half-width cell; a three-
              paragraph account does not, and squeezing it there produced a
              column of about thirty characters. Full width buys the measure. */}
          <div className="mt-14 border-t border-rf-hairline pt-10">
            <p className="rf-eyebrow">Founders</p>
            <h2 className="rf-h2 mt-5 max-w-[26ch]">
              Two operators, both still in the code.
            </h2>
            <p className="rf-body mt-5 max-w-[54ch]">
              There is no bench behind us. The people described here are the
              people who show up.
            </p>
          </div>

          <ul className="mt-12 flex flex-col gap-14 lg:gap-16">
            {TEAM.map((member) => (
              <li key={member.name} className="rf-grid gap-y-6">
                {/* Drop real photographs at the same paths and the layout does
                    not move — the frame declares its own ratio. */}
                {/* `self-start` is load-bearing: grid items stretch to the row
                    height by default, so beside a tall bio the frame grew to
                    match while the image kept its 4/5 ratio — leaving a column
                    of empty Navy under the photograph. */}
                <div className="rf-portrait col-span-full self-start lg:col-span-3">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} of RegainFlow`}
                    width={480}
                    height={600}
                    // The widest the frame ever gets is the 16rem cap, so ask
                    // for that rather than a share of the viewport — `40vw` was
                    // requesting ~576px to fill a 240px slot.
                    sizes="256px"
                    // `next/image` will not send an SVG through the optimizer
                    // unless `dangerouslyAllowSVG` is set, and it fails rather
                    // than falling back — which is why the pending placeholder
                    // rendered as alt text. Serving those bytes straight from
                    // `/public` costs nothing and keeps the optimizer closed to
                    // SVG everywhere else, which is the safe default.
                    unoptimized={member.image.endsWith(".svg")}
                  />
                </div>

                <div className="col-span-full lg:col-span-8 lg:col-start-5">
                  <h3 className="rf-h3">{member.name}</h3>
                  <p className="rf-utility mt-2">{member.role}</p>

                  {member.credentials ? (
                    <p className="rf-mech mt-4">
                      {member.credentials.map((credential) => (
                        <span key={credential}>{credential}</span>
                      ))}
                    </p>
                  ) : null}

                  <p className="rf-body mt-5 max-w-[58ch]">{member.bio}</p>

                  {/* Absent for a founder whose long form has not been written
                      yet, which is why the field is optional — a short entry
                      beside a long one still reads as deliberate. */}
                  {member.detail?.map((paragraph) => (
                    <p key={paragraph} className="rf-body mt-4 max-w-[58ch]">
                      {paragraph}
                    </p>
                  ))}

                  {/* The profile is the same URL `peopleJsonLd()` emits as
                      `sameAs` — a crawler already had it; this is the version a
                      person can click.

                      A resume link used to sit beside it. It came out because a
                      founder's resume frames this page as two people looking
                      for work rather than a firm you would hire, and the bio
                      above already answers "who am I dealing with" at the depth
                      a buyer needs. The capability statement is the document
                      that does this job. */}
                  {member.profile ? (
                    <p className="mt-6">
                      <a
                        href={member.profile}
                        className="rf-nav-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn &#8599;
                      </a>
                    </p>
                  ) : null}
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

          {/* No marker of any kind, and that is the considered choice rather
              than an omission. These eight are arguments, not categories — "A
              pilot is not a result", "Nobody gets used", "You should be able to
              leave" — so a number implies a sequence that does not exist and an
              icon would be decoration standing in front of a claim. The
              register here is a flat assertion followed by the reasoning that
              earns it; anything to the left of the claim competes with it. The
              hairline rule already does the separating. */}
          <ul className="col-span-full border-t border-rf-hairline lg:col-span-7 lg:col-start-6">
            {MANIFESTO.map((item) => (
              <li
                key={item.claim}
                className="border-b border-rf-hairline py-6"
              >
                <h3 className="rf-h3">{item.claim}</h3>
                <p className="rf-body mt-2 max-w-[52ch]">{item.detail}</p>
              </li>
            ))}
          </ul>
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
                href={FREE_ASSESSMENT_HREF}
                className="rf-cta-primary"
                data-rf-event={RF_EVENTS.bookingClicked}
                data-rf-location="company_contact"
              >
                {FREE_ASSESSMENT_CTA}
              </a>
              {/* Points at the form, not the mailto it used to open. The
                  address itself is still below, as a fact. */}
              <Link
                href={CONTACT_PATH}
                className="rf-cta-secondary"
                data-rf-event={RF_EVENTS.contactClicked}
                data-rf-location="company_contact"
              >
                {CONTACT_CTA}
              </Link>
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
