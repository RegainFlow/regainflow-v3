import type { Metadata } from "next";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  CASE_STUDIES,
  EXPERIENCE_DISCLAIMER,
  FEATURED_SLUGS,
  GROUPS,
  HEADLINE_FIGURES,
  studiesInGroup,
} from "@/lib/content/case-studies";
import {
  breadcrumbJsonLd,
  caseStudiesJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Selected enterprise AI and platform experience: retrieval, knowledge, interoperability, and secure platform systems delivered by the founders inside aerospace, defense, government, and regulated enterprise environments.",
  path: "/insights",
});

const FEATURED = CASE_STUDIES.filter((study) =>
  FEATURED_SLUGS.includes(study.slug),
);

const REMAINING_SLUGS = CASE_STUDIES.filter(
  (study) => !FEATURED_SLUGS.includes(study.slug),
).map((study) => study.slug);

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="What we have built, and what we learned building it."
        lead="Twelve systems taken into production inside aerospace, defense, government, and regulated enterprise environments — described by what they had to solve rather than by who paid for them."
      />

      <section id="case-studies" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <dl className="grid gap-8 sm:grid-cols-3">
            {HEADLINE_FIGURES.map((figure) => (
              <div key={figure.label}>
                <dt className="rf-utility">{figure.label}</dt>
                <dd className="rf-stat mt-3">{figure.value}</dd>
              </div>
            ))}
          </dl>

          {/* These totals are RegainFlow's own. The studies below are a
              different claim, and the two must not be read as one. */}
          <p className="rf-body mt-6 max-w-[54ch] border-b border-rf-hairline pb-10">
            Totals across all RegainFlow engagements. The experience below is a
            separate account: the enterprise systems our founders built before
            and alongside this firm.
          </p>

          <h2 className="rf-h2 mt-12 max-w-[24ch]">
            Selected Enterprise AI &amp; Platform Experience
          </h2>

          <p className="rf-body mt-5 max-w-[58ch]">
            {EXPERIENCE_DISCLAIMER} Names, customers, and internal program names
            are withheld; the only figures shown are the ones we can confirm.
          </p>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((study, i) => (
              <li key={study.slug} className="h-full">
                {/* Staggered inside a row, so the row arrives rather than the
                    whole grid snapping in at once. */}
                <DitherReveal className="h-full" delay={(i % 3) * 90}>
                  <CaseStudyCard study={study} surface="featured" />
                </DitherReveal>
              </li>
            ))}
          </ul>

          {/* Native `<details>`: the remaining six stay in the server output,
              so they are readable and crawlable with JavaScript off. A state
              toggle would be the first thing on this site that hides content
              behind a trigger that might never fire. */}
          {/* `data-rf-toggle`, not `data-rf-event`: this is tracked on the
              `toggle` event so open and close are distinguishable, and reusing
              the click attribute would make the delegated click listener match
              the `<details>` too and double-count every open. */}
          <details
            id="all-work"
            className="rf-disclosure mt-12"
            data-rf-toggle={RF_EVENTS.allWorkOpened}
          >
            <summary className="rf-disclosure-summary">
              <span className="rf-disclosure-marker" aria-hidden="true" />
              See all twelve, by category
            </summary>

            <div className="rf-disclosure-body">
              {GROUPS.map((group) => {
                const studies = studiesInGroup(group, REMAINING_SLUGS);
                if (studies.length === 0) return null;

                return (
                  <div key={group} className="mt-10 first:mt-8">
                    <h3 className="rf-eyebrow">{group}</h3>

                    <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {studies.map((study) => (
                        <li key={study.slug} className="h-full">
                          <DitherReveal className="h-full">
                            <CaseStudyCard study={study} surface="all_work" />
                          </DitherReveal>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      </section>

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Insights", "/insights")),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(caseStudiesJsonLd()),
        }}
      />
    </>
  );
}
