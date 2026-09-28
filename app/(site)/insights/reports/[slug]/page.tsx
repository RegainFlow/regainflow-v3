import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ClosingCTA from "@/components/ClosingCTA";
import PageHeader from "@/components/PageHeader";
import ReportAudio from "@/components/ReportAudio";
import ReportCard from "@/components/ReportCard";
import ReportGate from "@/components/ReportGate";
import { reportDate } from "@/lib/content/reports";
import { getReport, getReports } from "@/lib/reports.server";
import {
  breadcrumbJsonLd,
  pageMetadata,
  reportJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

type Params = { slug: string };

/**
 * Read per request rather than prerendered from a known set of slugs. There is
 * no `generateStaticParams` any more because there is no build-time list to
 * generate it from — a report published in the Supabase UI has to resolve here
 * without a deploy.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReport(slug);

  if (!report) return {};

  return pageMetadata({
    title: report.title,
    description: report.summary,
    path: `/insights/reports/${report.slug}`,
    // This segment generates its own card in `opengraph-image.tsx`. Naming it
    // here is what stops the default site card being used instead — see
    // `pageMetadata`.
    image: {
      url: `/insights/reports/${report.slug}/opengraph-image`,
      alt: report.title,
    },
  });
}

/**
 * A report page.
 *
 * The substance — cover, summary, findings, and the audio overview — is server
 * rendered and crawlable. Only the PDF link sits behind the email ask, and even
 * that is a courtesy: the file is in a public bucket. Gating the page itself
 * would trade the search traffic this page exists to earn for a form nobody has
 * a reason to fill in yet.
 *
 * The gate's memory lives in `localStorage`, on the client, so nothing here
 * reads `cookies()` — the route is dynamic because of the fetch, not the user.
 *
 * `getReport` returns null only for a slug nobody published, and throws if the
 * fetch itself failed. So this `notFound()` is reached only when the report
 * genuinely is not there: a Supabase outage becomes a 500, which a crawler
 * retries, rather than a 404, which would de-index a live report.
 */
export default async function ReportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const report = await getReport(slug);

  if (!report) notFound();

  const others = (await getReports()).filter(
    (other) => other.slug !== report.slug,
  );

  return (
    <>
      <PageHeader
        eyebrow={`Report · ${reportDate(report.published)}`}
        title={report.title}
        lead={report.summary}
      />

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-12 py-12 md:py-16">
          <div className="col-span-full lg:col-span-4">
            {/* `fill`, because no intrinsic dimensions travel with a URL pasted
                into a table editor. The frame declares the ratio instead. */}
            <div className="rf-report-cover rf-report-cover-lead">
              <Image
                src={report.cover}
                alt={`Cover of ${report.title}`}
                fill
                sizes="(min-width: 1024px) 380px, 90vw"
                priority
              />
            </div>

            <dl className="mt-6">
              <div className="flex justify-between gap-4 border-t border-rf-hairline py-3">
                <dt className="rf-utility">Published</dt>
                <dd className="rf-utility text-rf-warm">
                  {reportDate(report.published)}
                </dd>
              </div>
              {report.pages ? (
                <div className="flex justify-between gap-4 border-t border-rf-hairline py-3">
                  <dt className="rf-utility">Length</dt>
                  <dd className="rf-utility text-rf-warm">
                    {report.pages} pages
                  </dd>
                </div>
              ) : null}
              {report.audioLength ? (
                <div className="flex justify-between gap-4 border-t border-rf-hairline py-3">
                  <dt className="rf-utility">Audio</dt>
                  <dd className="rf-utility text-rf-warm">
                    {report.audioLength}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="col-span-full lg:col-span-7 lg:col-start-6">
            <h2 className="rf-h2 max-w-[22ch]">What it found</h2>

            {/* Public, and the reason this page is worth landing on cold. The
                gate asks for the document, not for the argument. */}
            <ol className="mt-8 border-t border-rf-hairline">
              {report.findings.map((finding, i) => (
                <li
                  key={finding}
                  className="flex gap-5 border-b border-rf-hairline py-5"
                >
                  <span className="rf-index pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="rf-body max-w-[58ch]">{finding}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {report.audio ? (
        <section className="rf-section bg-rf-navy">
          <div className="rf-shell py-12 md:py-16">
            {/* `title` and `cover` are for the OS media session — they are what
                the iOS lock screen and the Android notification show. */}
            <ReportAudio
              src={report.audio}
              length={report.audioLength}
              slug={report.slug}
              title={report.title}
              cover={report.cover}
            />
          </div>
        </section>
      ) : null}

      <section id="download" className="rf-section">
        <div className="rf-shell py-12 md:py-16">
          <ReportGate report={report} />

          <p className="mt-12">
            <Link href="/insights/reports" className="rf-nav-link">
              &larr; All reports
            </Link>
          </p>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="rf-section bg-rf-navy">
          <div className="rf-shell py-12 md:py-16">
            <p className="rf-eyebrow">More reports</p>

            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((other) => (
                <li key={other.slug} className="h-full">
                  <ReportCard report={other} surface="related" />
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
            breadcrumbJsonLd(
              report.title,
              `/insights/reports/${report.slug}`,
              { name: "Reports", path: "/insights/reports" },
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(reportJsonLd(report)),
        }}
      />
    </>
  );
}
