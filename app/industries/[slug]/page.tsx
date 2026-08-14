import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AssessmentCallout from "@/components/AssessmentCallout";
import CaseStudyCard from "@/components/CaseStudyCard";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { studiesForIndustry } from "@/lib/content/case-studies";
import { INDUSTRY_GROUPS, groupBySlug } from "@/lib/content/industries";
import { LAYERS } from "@/lib/content/layers";
import {
  breadcrumbJsonLd,
  industryJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return INDUSTRY_GROUPS.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = groupBySlug(slug);

  if (!group) return {};

  return pageMetadata({
    title: group.name,
    description: group.lead,
    path: `/industries/${group.slug}`,
  });
}

/**
 * One industry group in full.
 *
 * The four layers are rendered here rather than through `LayerSystem`. That
 * component pairs the list with a sticky isometric stack and owns hover state,
 * so it is a client component — and what this page needs from the layers is the
 * *industry-specific* line, not the generic `enables` one. Reading `LAYERS` for
 * the index, name, and mechanisms keeps the spine shared without dragging a
 * pinned diagram and a hydration boundary onto a page that otherwise needs
 * neither.
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const group = groupBySlug(slug);

  if (!group) notFound();

  const studies = studiesForIndustry(group.proof);
  const layers = LAYERS.map((layer) => ({
    ...layer,
    // Falls back to the generic line rather than rendering an empty row, so a
    // group added without all four `installs` still lays out.
    detail:
      group.installs.find((install) => install.layer === layer.index)?.detail ??
      layer.enables,
  }));

  return (
    <>
      <PageHeader eyebrow="Industries" title={group.name} lead={group.lead} />

      <section className="rf-section">
        <div className="rf-shell py-12 md:py-16">
          <p className="rf-utility">Sectors we work in</p>
          {/* `.rf-mech` styles its direct `span` children, the same way it does
              on the capability lists, so this stays a `p` rather than a `ul`. */}
          <p className="rf-mech mt-4">
            {group.industries.map((industry) => (
              <span key={industry.name}>{industry.name}</span>
            ))}
          </p>
        </div>
      </section>

      <section className="rf-section bg-rf-navy">
        <div className="rf-shell py-14 md:py-18 lg:py-22">
          <div className="rf-grid gap-y-6">
            <div className="col-span-full lg:col-span-5">
              <p className="rf-eyebrow">Where it stalls</p>
              <h2 className="rf-h2 mt-5 max-w-[20ch]">
                You have probably seen at least one of these.
              </h2>
            </div>

            <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
              Each of these is a place where the data, the systems, and the
              people who own them stopped lining up. The free assessment starts
              by finding which one you are actually in.
            </p>
          </div>

          <ol className="mt-12 border-b border-rf-hairline md:mt-16">
            {group.stalls.map((stall, i) => (
              <li
                key={stall}
                className="rf-grid gap-y-3 border-t border-rf-hairline py-7 md:py-8"
              >
                <p className="rf-index col-span-full lg:col-span-2 lg:pt-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="rf-h3 col-span-full max-w-[54ch] lg:col-span-9 lg:col-start-4">
                  {stall}
                </h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18 lg:py-22">
          <div className="rf-grid gap-y-6">
            <div className="col-span-full lg:col-span-5">
              <p className="rf-eyebrow">What we install</p>
              <h2 className="rf-h2 mt-5 max-w-[20ch]">
                Four layers, engineered together.
              </h2>
            </div>

            <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
              The same four layers we build everywhere, described here in the
              terms this work actually takes.{" "}
              <Link href="/services" className="rf-text-link">
                See every capability
              </Link>
              .
            </p>
          </div>

          <ol className="mt-12 border-b border-rf-hairline md:mt-16">
            {layers.map((layer) => (
              <li
                key={layer.index}
                className="rf-grid gap-y-3 border-t border-rf-hairline py-7 md:py-8"
              >
                <p className="col-span-full lg:col-span-2 lg:pt-1">
                  <span className="rf-index">{layer.index}</span>
                </p>

                <div className="col-span-full lg:col-span-9 lg:col-start-4">
                  <h3 className="rf-h3 max-w-[46ch]">{layer.name}</h3>

                  <p className="rf-body mt-3 flex gap-4">
                    <span className="rf-route-tick" aria-hidden="true" />
                    <span className="max-w-[62ch]">{layer.detail}</span>
                  </p>

                  <p className="rf-mech mt-4">
                    {layer.mechanisms.map((mechanism) => (
                      <span key={mechanism}>{mechanism}</span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {studies.length > 0 ? (
        <section className="rf-section bg-rf-navy">
          <div className="rf-shell py-14 md:py-18 lg:py-22">
            <div className="rf-grid gap-y-6">
              <div className="col-span-full lg:col-span-5">
                <p className="rf-eyebrow">Proof</p>
                <h2 className="rf-h2 mt-5 max-w-[20ch]">
                  Systems already in production.
                </h2>
              </div>

              {/* The disclosure this band needs, and it stays. Some of these
                  studies ran in aerospace and defense, and a reader who works
                  out for themselves that the proof is transferable has already
                  stopped believing the rest of the page. */}
              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
                Some of these ran in other sectors. Each is here because the
                problem it solved is the problem this one brings us, and every
                figure on it was published or confirmed.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, i) => (
                <li key={study.slug} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 3) * 90}>
                    <CaseStudyCard study={study} surface="industry" />
                  </DitherReveal>
                </li>
              ))}
            </ul>

            <p className="mt-10">
              <Link href="/insights#case-studies" className="rf-nav-link">
                All case studies &rarr;
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <AssessmentCallout hook={group.assessmentHook} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd(group.name, `/industries/${group.slug}`, {
              name: "Industries",
              path: "/industries",
            }),
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(industryJsonLd(group)),
        }}
      />
    </>
  );
}
