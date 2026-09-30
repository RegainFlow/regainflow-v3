import type { Metadata } from "next";
import Link from "next/link";

import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import ReportCard, { ReportFeatured } from "@/components/ReportCard";
import { getReports } from "@/lib/reports.server";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

const DESCRIPTION =
  "Free research reports from RegainFlow on AI ROI, where to start, and getting AI into production in regulated organizations. Each has an audio version.";

export const metadata: Metadata = pageMetadata({
  title: "Reports",
  description: DESCRIPTION,
  path: "/insights/reports",
});

/**
 * Read on every request, so a row flipped to `published` in the Supabase UI is
 * on this page at the next refresh with no deploy. That is the whole point of
 * the table, and this is where it is paid for.
 */
export const dynamic = "force-dynamic";

/**
 * The reports index, in the Insights shape: plain header, the newest report
 * featured with its findings, the rest as cards, the newsletter, no rules.
 *
 * A static segment sitting beside the dynamic `[slug]` that renders the case
 * studies. Next resolves static segments first, so the two cannot collide.
 */
export default async function ReportsPage() {
  // Degrades to `[]` on a Supabase failure, which lands in the empty state
  // below rather than on an error page — see `getReports`.
  const reports = await getReports();
  const [latest, ...rest] = reports;

  return (
    <div className="rf-soft">
      <PageHeader
        open
        eyebrow="Insights"
        title="Reports"
        lead="Research we publish in full. Every report is free to read, and each one comes with an audio version for the drive."
      />

      {latest ? (
        <>
          <section className="rf-section rf-section-open" aria-label="Latest report">
            <div className="rf-shell rf-band-tight">
              {/* The first cover is this page's LCP element. */}
              <ReportFeatured report={latest} surface="reports_index" priority />
            </div>
          </section>

          {rest.length > 0 ? (
            <section
              className="rf-section rf-section-open"
              aria-labelledby="all-reports"
            >
              <div className="rf-shell rf-band-tight">
                <h2 id="all-reports" className="rf-h2">
                  All reports
                </h2>
                <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((report, i) => (
                    <li key={report.slug} className="h-full">
                      <DitherReveal className="h-full" delay={(i % 3) * 90}>
                        <ReportCard report={report} surface="reports_index" />
                      </DitherReveal>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <section className="rf-section rf-section-open" aria-label="Newsletter">
            <div className="rf-shell rf-blog-newsletter-wrap">
              <div className="rf-blog-newsletter">
                <NewsletterSignup source="reports_index" layout="split" />
              </div>
            </div>
          </section>
        </>
      ) : (
        /* An empty state rather than an empty grid. The route is in the nav
           and the sitemap from the day it ships, so it can be reached before
           the first report is published. */
        <section className="rf-section rf-section-open">
          <div className="rf-shell rf-band">
            <div className="max-w-[52ch]">
              <h2 className="rf-h3">The first one is being written.</h2>
              <p className="rf-body mt-4">
                Nothing is published here yet. The case studies and the blog
                are the better read in the meantime.
              </p>
              <p className="mt-8 flex flex-wrap gap-6">
                <Link href="/insights/case-studies" className="rf-nav-link">
                  Case studies &rarr;
                </Link>
                <Link href="/insights/blog" className="rf-nav-link">
                  Blog &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd("Reports", "/insights/reports", {
              name: "Insights",
              path: "/insights",
            }),
          ),
        }}
      />
      {reports.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              collectionJsonLd({
                path: "/insights/reports",
                name: "RegainFlow reports",
                description: DESCRIPTION,
                items: reports.map((report) => ({
                  type: "Report" as const,
                  path: `/insights/reports/${report.slug}`,
                  name: report.title,
                })),
              }),
            ),
          }}
        />
      ) : null}
    </div>
  );
}
