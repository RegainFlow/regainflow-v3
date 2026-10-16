import type { Metadata } from "next";
import Link from "next/link";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { getCaseStudies } from "@/lib/case-studies.server";
import { INDUSTRY_GROUPS, type IndustryGroup } from "@/lib/content/industries";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { RF_EVENTS } from "@/lib/analytics/events";
import { GOV_SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "AI engineering by industry",
  description:
    "AI engineering for public safety, infrastructure and utilities, federal, state and local government, and defense and aerospace, with a page for each.",
  path: "/industries",
});

/**
 * The hub. Four large cards, each the route into a focused industry page.
 *
 * This replaced a page that rendered all four groups in full — every sector
 * card, every lead, alternating bands — which made the hub longer than the
 * pages it linked to and left the group names as small headings inside their
 * own sections. A hub's job is to let a reader self-select and leave; the
 * sectors are named here only as the evidence that a card is the right one.
 *
 * The whole card is the link, the same shape `CaseStudyCard` uses.
 * The government card opens gov.regainflow.com instead of its group page,
 * the same choice the nav makes: see `IndustryGroup.govFirst`.
 */
// The selected-engagements band reads the case studies table. Cached, and
// rebuilt at most once a minute: see `docs/content-cache.md`.
export const revalidate = 60;

export default async function IndustriesPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="We engineer the AI systems public agencies and complex organizations run on."
        lead="RegainFlow builds production AI systems for four industries: public safety, infrastructure and utilities, government, and defense and aerospace. Each page says where the work usually stalls and what we would build instead."
      />

      <section className="rf-section">
        {/* The hub's whole reason to exist — a reader self-selects here. */}
        <div className="rf-shell rf-band-lead">
          <ul className="grid gap-4 md:grid-cols-2">
            {INDUSTRY_GROUPS.map((group, i) => (
              <li key={group.slug} className="h-full">
                <DitherReveal className="h-full" delay={(i % 2) * 90}>
                  {group.govFirst ? (
                    <a
                      href={GOV_SITE_URL}
                      className="rf-card"
                      data-rf-event={RF_EVENTS.capabilityStatementOpened}
                      data-rf-location="industries_hub"
                    >
                      <IndustryCardBody group={group} external />
                    </a>
                  ) : (
                    <Link
                      href={`/industries/${group.slug}`}
                      className="rf-card"
                      data-rf-event={RF_EVENTS.industryOpened}
                      data-rf-industry={group.slug}
                      data-rf-surface="industries_hub"
                    >
                      <IndustryCardBody group={group} />
                    </Link>
                  )}
                </DitherReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engagements rather than a logo wall. Logos need permission we do not
          have yet; the work speaks without them, and it is the work a reader in
          one of these sectors came here to check. */}
      <section id="engagements" className="rf-section bg-rf-navy">
        <div className="rf-shell rf-band">
          <div className="rf-grid gap-y-6">
            <div className="col-span-full lg:col-span-5">
              <p className="rf-eyebrow">Selected engagements</p>
              <h2 className="rf-h2 mt-5 max-w-[20ch]">
                Work we have done, across these environments.
              </h2>
            </div>

            <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
              Each one says what the problem was, what we owned, and what it
              produced.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studies.map((study, i) => (
              <li key={study.slug} className="h-full">
                <DitherReveal className="h-full" delay={(i % 3) * 90}>
                  <CaseStudyCard study={study} surface="industries_hub" />
                </DitherReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Industries", "/industries")),
        }}
      />
    </>
  );
}

/**
 * A hub card's contents. Shared by the two wrappers above: a `Link` to the
 * group's page, or, for the group flagged `govFirst`, an anchor to
 * gov.regainflow.com with the affordance saying where it goes.
 */
function IndustryCardBody({
  group,
  external = false,
}: {
  group: IndustryGroup;
  external?: boolean;
}) {
  return (
    <>
      <p className="rf-utility text-rf-flow-soft">{group.hint}</p>

      <h2 className="rf-h2 mt-4 max-w-[16ch]">{group.name}</h2>

      <p className="rf-body mt-4 max-w-[46ch]">{group.lead}</p>

      {/* `mt-auto` pins the sector row and the affordance to the
          bottom, so two cards of unequal copy still line up. */}
      <div className="mt-auto pt-8">
        <p className="rf-mech">
          {group.industries.map((industry) => (
            <span key={industry.name}>{industry.name}</span>
          ))}
        </p>
        <span className="rf-nav-link mt-5 inline-block">
          {external
            ? "Capability statement & past performance \u2197"
            : `${group.name} in full \u2192`}
        </span>
      </div>
    </>
  );
}
