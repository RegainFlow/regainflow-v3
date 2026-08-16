import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ClosingCTA from "@/components/ClosingCTA";
import PageHeader from "@/components/PageHeader";
import { getCaseStudy } from "@/lib/case-studies.server";
import { DEFAULT_NEXT_LABEL } from "@/lib/content/case-studies";
import {
  breadcrumbJsonLd,
  caseStudyJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type Params = { slug: string };

/**
 * No `generateStaticParams`. The slugs live in Supabase now, so prerendering
 * them would freeze the set at deploy time and a study inserted afterwards
 * would 404 until the next build — which is the staleness the table exists to
 * remove. See the migration for what this costs.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  // An outage here would otherwise fail the whole render before the page gets a
  // chance to. Metadata degrades to empty; the page below still throws, which
  // is where the 500 belongs.
  const study = await getCaseStudy(slug).catch(() => null);

  if (!study) return {};

  return pageMetadata({
    // `metaTitle` where a study has one. An `h1` earns attention from someone
    // already reading; a `<title>` has to win a result page, and the two are
    // rarely the same sentence.
    title: study.metaTitle ?? study.title,
    description: study.metaDescription ?? study.summary,
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
  // Deliberately not caught. `null` means no such published slug and reaches
  // `notFound()`; a Supabase outage throws and becomes a 500. A 404 tells a
  // crawler to drop the page, so degrading here would de-index a live study
  // over a blip — see `lib/case-studies.server.ts`.
  const study = await getCaseStudy(slug);

  if (!study) notFound();

  const before = [
    { label: "Context", body: study.context },
    { label: "Constraints", body: study.constraints },
    { label: "RegainFlow's role", body: study.role },
  ];

  const after = [
    { label: "Outcome", body: study.outcome },
    { label: study.nextLabel ?? DEFAULT_NEXT_LABEL, body: study.next },
  ];

  return (
    <>
      <PageHeader
        eyebrow={study.eyebrow ?? study.industry}
        title={study.title}
        lead={study.summary}
      />

      <section className="rf-section">
        <div className="rf-shell py-12 md:py-16">
          {/* Between the header and the tags, where a lead image belongs: after
              the reader knows what they are looking at, before they commit to
              reading. Absent on a study without art, and the page closes up
              rather than leaving a frame. */}
          {study.image ? (
            <div className="rf-case-cover rf-case-hero mb-10">
              <Image
                src={study.image}
                alt={study.imageAlt ?? study.title}
                fill
                // The LCP element on this route when it exists.
                priority
                sizes="(min-width: 1280px) 1120px, 100vw"
              />
            </div>
          ) : null}

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
