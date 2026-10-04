import type { Metadata } from "next";
import Link from "next/link";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import RelatedReading from "@/components/RelatedReading";
import { getCaseStudies } from "@/lib/case-studies.server";
import { getReports } from "@/lib/reports.server";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

const DESCRIPTION =
  "RegainFlow case studies: AI engineering work delivered in government, energy, aerospace and professional services, from retrieval platforms to evaluation.";

export const metadata: Metadata = pageMetadata({
  title: "Case studies",
  description: DESCRIPTION,
  path: "/insights/case-studies",
});

/** Reads the table, like the reports index. */
export const dynamic = "force-dynamic";

/**
 * The case studies index, beside Reports and Blog, so each library has its own
 * page and the nav's "Case studies" no longer lands on the hub.
 *
 * Every study, in `sort_order`, as the same cards the hub and home page use.
 * No filter pills: with a handful of studies, a filter is a row of buttons
 * that each leave one card. They come in when the library needs them.
 *
 * A static segment beside `insights/[slug]`, which Next resolves first; the
 * case study pipeline refuses `case-studies` as a slug for that reason.
 */
export default async function CaseStudiesPage() {
  const [studies, reports] = await Promise.all([getCaseStudies(), getReports()]);

  return (
    <div className="rf-soft">
      <PageHeader
        open
        eyebrow="Insights"
        title="Case studies"
        lead="Work we delivered. Each one says what the problem was, what we owned, what we built, and what it produced."
      />

      {studies.length > 0 ? (
        <section className="rf-section rf-section-open" aria-label="Case studies">
          <div className="rf-shell rf-band-tight">
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, i) => (
                <li key={study.slug} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 3) * 90}>
                    <CaseStudyCard study={study} surface="case_studies_index" />
                  </DitherReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="rf-section rf-section-open">
          <div className="rf-shell rf-band">
            <div className="max-w-[52ch]">
              <h2 className="rf-h3">The first one is being written.</h2>
              <p className="rf-body mt-4">
                Nothing is published here yet. The reports and the blog are the
                better read in the meantime.
              </p>
              <p className="mt-8 flex flex-wrap gap-6">
                <Link href="/insights/reports" className="rf-nav-link">
                  Reports &rarr;
                </Link>
                <Link href="/insights/blog" className="rf-nav-link">
                  Blog &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* The research behind the work: the reason a reader who trusts a study
          has somewhere to go next that is not the booking form. */}
      <RelatedReading
        title="The research behind the work"
        items={reports.slice(0, 3).map((report) => ({ kind: "report" as const, report }))}
      />

      <section className="rf-section rf-section-open" aria-label="Newsletter">
        <div className="rf-shell rf-blog-newsletter-wrap">
          <div className="rf-blog-newsletter">
            <NewsletterSignup source="case_studies_index" layout="split" />
          </div>
        </div>
      </section>

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd("Case studies", "/insights/case-studies", {
              name: "Insights",
              path: "/insights",
            }),
          ),
        }}
      />
      {studies.length > 0 ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(
                collectionJsonLd({
                  path: "/insights/case-studies",
                  name: "RegainFlow case studies",
                  description: DESCRIPTION,
                  items: studies.map((study) => ({
                    type: "CreativeWork" as const,
                    path: `/insights/${study.slug}`,
                    name: study.title,
                  })),
                }),
              ),
            }}
          />
        </>
      ) : null}
    </div>
  );
}
