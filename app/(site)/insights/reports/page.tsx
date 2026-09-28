import type { Metadata } from "next";
import Link from "next/link";

import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/reports.server";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Reports",
  description:
    "Written research from RegainFlow on getting AI into production inside government, defense, aerospace, and regulated enterprise environments. Each report comes with an audio overview.",
  path: "/insights/reports",
});

/**
 * Read on every request, so a row flipped to `published` in the Supabase UI is
 * on this page at the next refresh with no deploy. That is the whole point of
 * the table, and this is where it is paid for.
 */
export const dynamic = "force-dynamic";

/**
 * A static segment sitting beside the dynamic `[slug]` that renders the case
 * studies. Next resolves static segments first, so the two cannot collide.
 */
export default async function ReportsPage() {
  // Degrades to `[]` on a Supabase failure, which lands in the empty state
  // below rather than on an error page — see `getReports`.
  const reports = await getReports();

  return (
    <>
      <PageHeader
        eyebrow="Reports & Guides"
        title="What we have written down."
        lead="Research we publish because we needed it to exist and it did not. Every report is free, and every one comes with an audio version for the drive."
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          {reports.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, i) => (
                <li key={report.slug} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 3) * 90}>
                    {/* The first cover is this page's LCP element. */}
                    <ReportCard
                      report={report}
                      surface="reports_index"
                      priority={i === 0}
                    />
                  </DitherReveal>
                </li>
              ))}
            </ul>
          ) : (
            /* An empty state rather than an empty grid. The route is in the nav
               and the sitemap from the day it ships, which means it can be
               reached before the first report is authored — and a page that
               renders nothing reads as broken rather than as early. */
            <div className="max-w-[52ch]">
              <h2 className="rf-h3">The first one is being written.</h2>
              <p className="rf-body mt-4">
                Nothing is published here yet. The case studies describe work
                already delivered, and are the better read in the meantime.
              </p>
              <p className="mt-8">
                <Link href="/insights#case-studies" className="rf-nav-link">
                  Selected work &rarr;
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

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
    </>
  );
}
