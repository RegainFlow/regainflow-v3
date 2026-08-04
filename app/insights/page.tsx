import type { Metadata } from "next";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  CASE_STUDIES,
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
    "Selected enterprise AI and platform experience: retrieval, knowledge, interoperability, and secure platform systems delivered inside government, aerospace, defense, and regulated enterprise environments.",
  path: "/insights",
});

/**
 * Mapped over `FEATURED_SLUGS`, not filtered out of `CASE_STUDIES` — the
 * filter kept whatever order the studies happened to sit in, so the slug list
 * chose the three and the array silently chose which one led. With three cards
 * the first is the one that gets read, so the constant has to mean what it
 * says.
 */
const FEATURED = FEATURED_SLUGS.flatMap(
  (slug) => CASE_STUDIES.find((study) => study.slug === slug) ?? [],
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
        lead="Nine systems taken into production inside government, aerospace, defense, and regulated enterprise environments — described by what they had to solve rather than by who paid for them."
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

          {/* The rule belongs to the wrapper, not the heading. On the `<h2>` it
              inherited the 24ch measure and drew a short tick above the words
              rather than a divider between the totals and the work below. */}
          <div className="mt-12 border-t border-rf-hairline pt-12">
            <h2 className="rf-h2 max-w-[24ch]">
              Selected Enterprise AI &amp; Platform Experience
            </h2>

            <p className="rf-body mt-5 max-w-[58ch]">
              The only figures shown are the ones we can confirm.
            </p>
          </div>

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

          {/* Native `<details>`: the remaining studies stay in the server
              output, so they are readable and crawlable with JavaScript off. A
              state toggle would be the first thing on this site that hides
              content behind a trigger that might never fire. */}
          {/* `data-rf-toggle`, not `data-rf-event`: this is tracked on the
              `toggle` event so open and close are distinguishable, and reusing
              the click attribute would make the delegated click listener match
              the `<details>` too and double-count every open. */}
          <details
            id="all-work"
            className="rf-disclosure mt-14"
            data-rf-toggle={RF_EVENTS.allWorkOpened}
          >
            {/* A bounded control rather than a caption. Both labels ship and CSS
                picks between them on `[open]`, so the summary still says the
                right thing with JavaScript off. */}
            <summary className="rf-disclosure-summary rf-disclosure-cta">
              <span className="rf-disclosure-marker" aria-hidden="true" />
              <span className="rf-disclosure-label">
                <span className="rf-on-closed">
                  See all {CASE_STUDIES.length} case studies, by category
                </span>
                <span className="rf-on-open">Show fewer</span>
              </span>
              {/* Counted from the array that actually feeds the list below,
                  never from a subtraction — a `FEATURED_SLUGS` entry that
                  stopped matching a study would make arithmetic lie here while
                  the list rendered correctly. */}
              <span className="rf-disclosure-count">
                +{REMAINING_SLUGS.length}
              </span>
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
