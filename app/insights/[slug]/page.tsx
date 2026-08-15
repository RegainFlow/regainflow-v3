import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ClosingCTA from "@/components/ClosingCTA";
import PageHeader from "@/components/PageHeader";
import { CASE_STUDIES } from "@/lib/content/case-studies";
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
 * The full study, in the same six sections on every one. A reader comparing two
 * studies is comparing the same six answers, which is the whole reason the
 * structure is fixed here rather than per study.
 *
 * `engineered` renders as a list between the prose sections because it is the
 * one field that is genuinely itemized — everything else is a paragraph.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = find(slug);

  if (!study) notFound();

  const before = [
    { label: "Context", body: study.context },
    { label: "Constraints", body: study.constraints },
    { label: "RegainFlow's role", body: study.role },
  ];

  const after = [
    { label: "Outcome", body: study.outcome },
    { label: "What changed next", body: study.next },
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
          {/* Capability tags open the page. They are what a reader scanning for
              relevance actually wants first, and they replace the headline
              figures that used to sit here — see the figure rule in
              `lib/content/case-studies.ts`. */}
          <p className="rf-mech">
            {study.capabilityTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>

          <div className="mt-12 border-t border-rf-hairline">
            {before.map((section) => (
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

            <div className="rf-grid gap-y-3 border-b border-rf-hairline py-8">
              <h2 className="rf-h3 col-span-full lg:col-span-3">
                What we engineered
              </h2>
              <ul className="col-span-full flex flex-col gap-4 lg:col-span-8">
                {study.engineered.map((item) => (
                  <li key={item} className="rf-body flex gap-4">
                    <span className="rf-route-tick" aria-hidden="true" />
                    <span className="max-w-[64ch]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {after.map((section) => (
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

          <p className="mt-12">
            <Link href="/insights#case-studies" className="rf-nav-link">
              &larr; All case studies
            </Link>
          </p>
        </div>
      </section>

      {/* No "more in this category" band. With three studies, a related-work
          shelf is the other two every time, which is what `/insights` already
          shows one click away. */}

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
