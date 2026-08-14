import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { CASE_STUDIES, studiesInGroup } from "@/lib/content/case-studies";
import {
  breadcrumbJsonLd,
  caseStudyJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

function find(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = find(slug);

  if (!study) return {};

  return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/insights/${study.slug}`,
    // This segment generates its own card in `opengraph-image.tsx`; naming it
    // here is what stops the default site card from being used instead.
    image: {
      url: `/insights/${study.slug}/opengraph-image`,
      alt: study.title,
    },
  });
}

/**
 * The full study. The listing card carries the executive read; this is where
 * the technical detail is allowed to appear — challenge, solution, the
 * capability inventory, and the stack where the stack is the point.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = find(slug);

  if (!study) notFound();

  const siblings = studiesInGroup(study.group).filter(
    (other) => other.slug !== study.slug,
  );

  const sections = [
    { label: "Challenge", body: study.challenge },
    { label: "Solution", body: study.solution },
    { label: "Impact", body: study.impact },
  ];

  return (
    <>
      <PageHeader
        eyebrow={study.industry}
        title={study.title}
        lead={study.summary}
      />

      <section className="rf-section">
        <div className="rf-shell py-12 md:py-16">
          {/* Rendered as its own block rather than a grid cell: the disclaimer
              that used to sit beside it is gone, so a study without figures
              would otherwise open with an empty grid row. */}
          {study.metrics?.length ? (
            <dl className="flex flex-wrap gap-x-16 gap-y-8">
              {study.metrics.map((metric) => (
                <div key={metric.label} className="max-w-[22ch]">
                  <dd className="rf-stat">{metric.value}</dd>
                  <dt className="rf-utility mt-3">{metric.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}

          {/* Scope before narrative. A reader deciding whether this study is
              relevant to them wants the environment and the volumes, and both
              are facts about the engagement rather than claims about its
              return — which is why this block is not governed by the figure
              rule the metrics above are. */}
          {study.atAGlance?.length ? (
            <div
              className={`rf-grid gap-y-4 ${study.metrics?.length ? "mt-12" : ""}`}
            >
              <h2 className="rf-h3 col-span-full lg:col-span-3">At a glance</h2>
              <dl className="col-span-full grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
                {study.atAGlance.map((item) => (
                  <div key={item.label}>
                    <dt className="rf-utility">{item.label}</dt>
                    <dd className="rf-body mt-2 max-w-[38ch]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div
            className={`border-t border-rf-hairline ${
              study.metrics?.length || study.atAGlance?.length ? "mt-12" : ""
            }`}
          >
            {sections.map((section) => (
              <div
                key={section.label}
                className="rf-grid gap-y-3 border-b border-rf-hairline py-8"
              >
                <h2 className="rf-h3 col-span-full lg:col-span-3">
                  {section.label}
                </h2>
                <p className="rf-body col-span-full max-w-[68ch] lg:col-span-8">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* `impact` is the paragraph; this is the itemized version of it.
              Both are kept because the paragraph is what an assistant quotes
              and the list is what a skimming reader actually reads. */}
          {study.outcomes?.length ? (
            <div className="rf-grid mt-10 gap-y-4">
              <h2 className="rf-h3 col-span-full lg:col-span-3">Outcomes</h2>
              <ul className="col-span-full flex flex-col gap-4 lg:col-span-8">
                {study.outcomes.map((outcome) => (
                  <li key={outcome} className="rf-body flex gap-4">
                    <span className="rf-route-tick" aria-hidden="true" />
                    <span className="max-w-[64ch]">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rf-grid mt-10 gap-y-4">
            <h2 className="rf-h3 col-span-full lg:col-span-3">
              Key capabilities
            </h2>
            <div className="col-span-full lg:col-span-8">
              <p className="rf-mech">
                {study.capabilities.map((capability) => (
                  <span key={capability}>{capability}</span>
                ))}
              </p>

              {study.technologies ? (
                <p className="rf-body mt-6 flex gap-4">
                  <span className="rf-route-tick" aria-hidden="true" />
                  <span>{study.technologies}</span>
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-12">
            <Link href="/insights#case-studies" className="rf-nav-link">
              &larr; All case studies
            </Link>
          </p>
        </div>
      </section>

      {siblings.length > 0 ? (
        <section className="rf-section bg-rf-navy">
          <div className="rf-shell py-12 md:py-16">
            <p className="rf-eyebrow">More in {study.group}</p>

            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 3).map((other, i) => (
                <li key={other.slug} className="h-full">
                  <DitherReveal className="h-full" delay={i * 90}>
                    <CaseStudyCard study={other} surface="related" />
                  </DitherReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd(study.title, `/insights/${study.slug}`, {
              name: "Insights",
              path: "/insights",
            }),
          ),
        }}
      />

      {/* The study itself. Without this the page declared its position in the
          site but never what it was about. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(caseStudyJsonLd(study)),
        }}
      />
    </>
  );
}
