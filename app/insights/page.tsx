import type { Metadata } from "next";
import Link from "next/link";

import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/reports.server";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import {
  breadcrumbJsonLd,
  caseStudiesJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Selected enterprise AI and platform experience: retrieval, knowledge, interoperability, telemetry monitoring, and secure platform systems delivered inside government, utilities, aerospace, defense, and regulated enterprise environments.",
  path: "/insights",
});

/**
 * The case studies below are still authored in the repository and would
 * prerender happily. The reports band is what makes the whole route dynamic —
 * one fetch, and no PPR configured to isolate it. Accepted deliberately: the
 * band is three cards near the bottom of a page that is already server rendered,
 * and splitting it into a client-fetched island to save the prerender would cost
 * more than it returns.
 */
export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  // Degrades to `[]`, which hides the band entirely — the same thing it does
  // before the first report is published. A visible page missing one section
  // beats an error page.
  const reports = await getReports();

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Practical lessons from engineering AI systems in real operating environments."
        lead="Case studies, reports, and field guidance for public-sector and regulated organizations."
      />

      <section id="case-studies" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <h2 className="rf-h2 max-w-[24ch]">Our Case Studies</h2>

          {/* No totals above this heading and no defence of the figures below
              it. Both existed to make published numbers credible; there are no
              published numbers now, and a paragraph explaining that would be
              the same defensiveness in a new form.

              Nor does this say the studies are anonymized. That is a rule we
              hold ourselves to (see `lib/content/case-studies.ts`), not news a
              reader needs — naming the omission is what makes it conspicuous. */}
          <p className="rf-body mt-5 max-w-[58ch]">
            Each one says what the problem was, what we owned, what we
            engineered, and what it produced.
          </p>

          {/* All three, with no disclosure. The `<details>` this replaced held
              nine studies back; with three, every one is above the fold. Filter
              chips and pagination land when the library needs them, not
              before. */}
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((study, i) => (
              <li key={study.slug} className="h-full">
                {/* Staggered inside a row, so the row arrives rather than the
                    whole grid snapping in at once. */}
                <DitherReveal className="h-full" delay={(i % 3) * 90}>
                  <CaseStudyCard study={study} surface="featured" />
                </DitherReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reports get a band of their own rather than a nav link alone. They are
          the only thing on this route that asks the reader for something, so
          burying them behind a dropdown item would be asking without offering.
          Absent entirely until the first one is published — an empty promotion
          is worse than none. */}
      {reports.length > 0 ? (
        <section id="reports" className="rf-section bg-rf-navy">
          <div className="rf-shell py-14 md:py-18">
            <div className="rf-grid gap-y-6">
              {/* "Reports & Guides", not "Thought Leadership". Thought
                  leadership is something the work demonstrates, not something
                  we get to call ourselves. */}
              <div className="col-span-full lg:col-span-5">
                <p className="rf-eyebrow">Reports &amp; Guides</p>
                <h2 className="rf-h2 mt-5 max-w-[20ch]">
                  What we have written down.
                </h2>
              </div>
              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
                Research we publish because we needed it to exist and it did
                not. Free to read, and every one comes with an audio version.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.slice(0, 3).map((report, i) => (
                <li key={report.slug} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 3) * 90}>
                    <ReportCard report={report} surface="insights" />
                  </DitherReveal>
                </li>
              ))}
            </ul>

            {reports.length > 3 ? (
              <p className="mt-10">
                <Link href="/insights/reports" className="rf-nav-link">
                  All {reports.length} reports &rarr;
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

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
