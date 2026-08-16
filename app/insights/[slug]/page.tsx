import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Artifact from "@/components/case-study/Artifact";
import TrackMap from "@/components/case-study/TrackMap";
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
 * The full study.
 *
 * Every study answers the same six questions — context, constraints, our role,
 * what we engineered, outcome, what came next — and that fixed spine is the
 * point: a reader comparing two studies is comparing the same six answers.
 *
 * Everything else on this page is optional and renders only when the row fills
 * it. A study with no `tracks` is not a study with an empty tracks section; the
 * page closes up around what is there. That is what lets one template serve a
 * three-paragraph engagement and a dual-track workshop programme without either
 * looking like a degraded version of the other.
 *
 * `stages` **replaces** `engineered` where present rather than joining it —
 * both answer "what we engineered", and rendering both prints the same content
 * twice under one heading.
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

      <article className="rf-article">
        <section className="rf-section">
          <div className="rf-shell rf-band-tight">
            {/* Above the fold-line of the article, not under the header, so a
                reader who arrived from search can see where they are before
                they start reading. */}
            <nav aria-label="Breadcrumb">
              <ol className="rf-crumbs rf-utility">
                <li>
                  <Link href="/insights" className="rf-nav-link">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link href="/insights#case-studies" className="rf-nav-link">
                    Case studies
                  </Link>
                </li>
              </ol>
            </nav>

            {/* A lead image belongs after the reader knows what they are
                looking at and before they commit to reading. Absent on a study
                without art, and the page closes up rather than leaving a
                frame. */}
            {study.image ? (
              <div className="rf-case-cover rf-case-hero mt-8">
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

            {/* A real list, not a pipe-separated `.rf-mech` run. Each tag wraps
                as a unit, so a long one breaks the line rather than itself. */}
            <ul className="rf-tags mt-8">
              {study.capabilityTags.map((tag) => (
                <li key={tag} className="rf-tag">
                  {tag}
                </li>
              ))}
            </ul>

            {/* Scope facts. What was delivered, never what it returned — see
                the figure rule in `lib/content/case-studies.ts`. */}
            {study.atAGlance?.length ? (
              <dl className="rf-glance mt-10">
                {study.atAGlance.map((fact) => (
                  <div key={fact.label}>
                    <dd>{fact.value}</dd>
                    <dt className="rf-utility mt-2">{fact.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>

        {/* The three opening answers. No rule between them: spacing and the
            heading carry the hierarchy, and a divider under every block was
            what made every section on this page look identical. */}
        <section className="rf-section">
          <div className="rf-shell rf-band">
            <div className="flex flex-col gap-12">
              {before.map((section) => (
                <div key={section.label} className="rf-grid gap-y-3">
                  <h2 className="rf-h3 col-span-full lg:col-span-3">
                    {section.label}
                  </h2>
                  <p className="rf-body rf-measure col-span-full lg:col-span-8">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {study.tracks?.length ? (
          <section className="rf-section bg-rf-navy">
            <div className="rf-shell rf-band">
              <div className="rf-grid gap-y-6">
                <div className="col-span-full lg:col-span-5">
                  <p className="rf-eyebrow">Two client contexts</p>
                  <h2 className="rf-h2 mt-5 max-w-[20ch]">
                    One engagement, two different problems.
                  </h2>
                </div>
                <p className="rf-body rf-measure col-span-full lg:col-span-6 lg:col-start-7 lg:pt-3">
                  Each track was built against its own environment. What they
                  share is the method, not the material.
                </p>
              </div>

              <div className="mt-12">
                <TrackMap tracks={study.tracks} />
              </div>
            </div>
          </section>
        ) : null}

        <section className="rf-section">
          <div className="rf-shell rf-band">
            <h2 className="rf-h2 max-w-[22ch]">What RegainFlow engineered</h2>

            {/* `stages` wins where a study has them — see the note above the
                component. Numbered, because a process is a sequence and order
                is information (`docs/DESIGN.md#iconography`). */}
            {study.stages?.length ? (
              <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {study.stages.map((stage, i) => (
                  <li
                    key={stage.name}
                    className="border-t border-rf-hairline pt-4"
                  >
                    <span className="rf-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="rf-h3 mt-3">{stage.name}</h3>
                    <p className="rf-body mt-2">{stage.detail}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="mt-10 flex flex-col gap-4">
                {study.engineered.map((item) => (
                  <li key={item} className="rf-body rf-measure flex gap-4">
                    <span className="rf-route-tick" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {study.artifacts?.length ? (
          <section className="rf-section">
            <div className="rf-shell rf-band-tight">
              <p className="rf-eyebrow">Selected artifacts</p>
              <h2 className="rf-h2 mt-5 max-w-[22ch]">
                Reconstructed, not screenshotted.
              </h2>

              <div className="mt-10 flex flex-col gap-4">
                {study.artifacts.map((artifact) => (
                  <Artifact key={artifact.title} artifact={artifact} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {study.deliverables?.length ? (
          <section className="rf-section bg-rf-navy">
            <div className="rf-shell rf-band-tight">
              <div className="rf-grid gap-y-6">
                <h2 className="rf-h2 col-span-full max-w-[20ch] lg:col-span-4">
                  What the partner received
                </h2>
                <ul className="col-span-full flex flex-col gap-3 lg:col-span-7 lg:col-start-6">
                  {study.deliverables.map((item) => (
                    <li key={item} className="rf-body flex gap-4">
                      <span className="rf-route-tick" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rf-section">
          <div className="rf-shell rf-band">
            <div className="flex flex-col gap-12">
              {after.map((section) => (
                <div key={section.label} className="rf-grid gap-y-3">
                  <h2 className="rf-h3 col-span-full lg:col-span-3">
                    {section.label}
                  </h2>
                  <p className="rf-body rf-measure col-span-full lg:col-span-8">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-14">
              <Link href="/insights#case-studies" className="rf-nav-link">
                &larr; All case studies
              </Link>
            </p>
          </div>
        </section>
      </article>

      {/* No "more in this category" band. With three studies, a related-work
          shelf is the other two every time, which is what `/insights` already
          shows one click away. */}

      <ClosingCTA override={study.cta} />

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
