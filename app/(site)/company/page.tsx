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
import {
  PARTNERS,
  PARTNERS_EYEBROW,
  PARTNERS_HEADLINE,
  PARTNERS_LEAD,
  type PartnerPerson,
} from "@/lib/content/partners";
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

/** The visible half of a partner URL. The protocol is noise in a link label. */
function hostOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Alt text for a partner's portrait.
 *
 * It names the firm rather than stopping at the role, because "Co-founder & CEO"
 * beside a photograph on regainflow.com reads as a RegainFlow co-founder to
 * anyone who cannot see which panel it sits in.
 */
function personAlt(person: PartnerPerson, firm: string) {
  return `${person.name}, ${person.role} of ${firm}`;
}

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

      {/* Void ground, like `#about` above it, with the partner raised into a
          Navy panel rather than the section taking Navy itself. `#manifesto`
          below is already Navy, and spending the ground change here would cost
          the beat that tells a scrolling reader the manifesto has started.

          The panel runs the full shell rather than sitting in the right six
          columns, which is where this started. A partner entry carries a firm,
          two people, four figures and two routes out — beside a three-line
          headline that left the entire left half of the page empty for about
          fifteen hundred pixels. Full width, split internally, uses it. */}
      <section id="partners" className="rf-section">
        <div className="rf-shell rf-band">
          <div className="rf-grid gap-y-6">
            <div className="col-span-full lg:col-span-5">
              <p className="rf-eyebrow">{PARTNERS_EYEBROW}</p>
              <h2 className="rf-h2 mt-5">{PARTNERS_HEADLINE}</h2>
            </div>

            {/* Beside the headline rather than under it. Stacked, the two of
                them made a tall left column with nothing opposite. */}
            <p className="rf-lead col-span-full max-w-[50ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
              {PARTNERS_LEAD}
            </p>
          </div>

          <ul className="mt-12 flex flex-col gap-10">
            {PARTNERS.map((partner) => (
              /* Deliberately not `.rf-card`. That class warms its border to
                 Slate on hover for any element, not only anchors, and every
                 other call site is a card you can click — on a panel that is
                 not a link it advertises a target that is not there. */
              <li
                key={partner.name}
                className="border border-rf-hairline bg-rf-navy p-6 md:p-8"
              >
                <div className="rf-grid gap-y-10">
                  {/* The identity rail. Their mark, their name, what they sell,
                      and their people — everything that says which company you
                      are reading about, kept together and away from our prose. */}
                  <div className="col-span-full lg:col-span-4">
                    {/* Empty `alt`: the name is rendered as text immediately
                        below, and a mark that spells it out would read twice.

                        `width`/`height` are the file's real pixels. They were
                        180×28 — a lockup's proportions, guessed before the asset
                        existed — and the mark is square, so `h-16 w-auto` left
                        one axis resolving from CSS and the other from a ratio
                        that did not match. That is the `next/image` warning
                        about modifying one dimension but not the other. */}
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt=""
                        width={1944}
                        height={1944}
                        sizes="64px"
                        className="h-16 w-auto"
                        unoptimized={partner.logo.endsWith(".svg")}
                      />
                    ) : null}

                    <h3 className="rf-h2 mt-6">{partner.name}</h3>
                    <p className="rf-utility mt-3">{partner.location}</p>

                    {/* No marker. Order carries nothing here, so not numbered,
                        and the closed icon set holds nothing honest for "App &
                        Web Development" — a list with no honest marker wants
                        none. */}
                    <ul className="rf-tags mt-6">
                      {partner.specialties.map((specialty) => (
                        <li key={specialty} className="rf-tag">
                          {specialty}
                        </li>
                      ))}
                    </ul>

                    {/* Their founders, not ours. Nothing here reaches
                        `peopleJsonLd()` — `lib/content/partners.ts` documents
                        why that separation has to hold.

                        Portrait above the text rather than beside it: the rail
                        is four columns, and a face plus a 50ch bio side by side
                        in that width leaves the bio about twenty characters
                        wide. */}
                    <ul className="mt-8 flex flex-col gap-8 border-t border-rf-hairline pt-8">
                      {partner.people.map((person) => (
                        <li key={person.name}>
                          {person.image ? (
                            <div className="rf-portrait w-32">
                              <Image
                                src={person.image}
                                alt={personAlt(person, partner.name)}
                                width={500}
                                height={500}
                                sizes="128px"
                                unoptimized={person.image.endsWith(".svg")}
                              />
                            </div>
                          ) : null}

                          <h4 className="rf-body mt-4 text-rf-warm">
                            {person.name}
                          </h4>
                          <p className="rf-utility mt-1">{person.role}</p>
                          <p className="rf-body mt-3 max-w-[46ch]">
                            {person.bio}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What we have to say about them, and the two routes out. */}
                  <div className="col-span-full lg:col-span-7 lg:col-start-6">
                    <p className="rf-lead max-w-[54ch]">{partner.summary}</p>

                    {partner.detail.map((paragraph) => (
                      <p key={paragraph} className="rf-body mt-5 max-w-[62ch]">
                        {paragraph}
                      </p>
                    ))}

                    {/* Attribution is structural rather than repeated per line.
                        These are the partner's numbers about the partner's own
                        clients; unlabelled on this domain they become ours, and
                        we cannot say how any of them was measured. */}
                    {partner.claims ? (
                      <div className="mt-10 border-t border-rf-hairline pt-6">
                        <p className="rf-utility">
                          Figures published by {partner.name}
                        </p>
                        <ul className="mt-4 flex flex-col gap-2">
                          {partner.claims.map((claim) => (
                            <li key={claim} className="rf-body max-w-[56ch]">
                              {claim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Both secondary. The page spends its one primary CTA in
                        `#contact`, and a second mid-page would compete with the
                        conversion this section is supposed to feed. */}
                    <div className="mt-10 flex flex-col gap-4 border-t border-rf-hairline pt-6 sm:flex-row sm:items-center sm:gap-6">
                      <Link
                        href={CONTACT_PATH}
                        className="rf-cta-secondary"
                        data-rf-event={RF_EVENTS.contactClicked}
                        data-rf-location="company_partners"
                      >
                        Ask about the partner network
                      </Link>

                      <a
                        href={partner.url}
                        className="rf-nav-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-rf-event={RF_EVENTS.partnerSiteOpened}
                        data-rf-partner={partner.name}
                      >
                        {hostOf(partner.url)} &#8599;
                      </a>
                    </div>
                  </div>
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
