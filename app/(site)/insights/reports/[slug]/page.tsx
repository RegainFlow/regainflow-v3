import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import ClosingCTA from "@/components/ClosingCTA";
import Crumbs from "@/components/Crumbs";
import ExploreWithAI from "@/components/ExploreWithAI";
import Findings from "@/components/Findings";
import RelatedReading, { type RelatedItem } from "@/components/RelatedReading";
import ReportAudio from "@/components/ReportAudio";
import ReportGate from "@/components/ReportGate";
import ShareButton from "@/components/ShareButton";
import { getPostsLinkingTo } from "@/lib/blog.server";
import { getCaseStudies } from "@/lib/case-studies.server";
import { reportDate } from "@/lib/content/reports";
import { getReport, getReports } from "@/lib/reports.server";
import {
  breadcrumbJsonLd,
  pageMetadata,
  reportJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { slug: string };

/** "Related reading" holds this many cards: one row at desktop. */
const RELATED_COUNT = 3;

/**
 * Nothing is prerendered at build: there is no build-time list of slugs, and a
 * report published in the Supabase UI has to resolve here without a deploy. So
 * `generateStaticParams` returns nothing, and each report is rendered on its
 * first visit, cached, and rebuilt at most once a minute after that. See
 * `docs/content-cache.md`.
 */
export const revalidate = 60;

export function generateStaticParams(): Params[] {
  return [];
}

const CRUMBS = [
  { name: "Insights", path: "/insights" },
  { name: "Reports", path: "/insights/reports" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReport(slug).catch(() => null);

  if (!report) return {};

  return pageMetadata({
    title: report.title,
    description: report.summary,
    path: `/insights/reports/${report.slug}`,
    // This segment generates its own card in `opengraph-image.tsx`, and the
    // file convention emits its (hashed) URL — see `segmentCard`.
    segmentCard: true,
    article: {
      publishedTime: report.published,
      // A report is not revised after publication (see `app/sitemap.ts`).
      modifiedTime: report.published,
      authors: [SITE_NAME],
      section: "Reports",
    },
  });
}

/**
 * A report page, in the blog post's shape: breadcrumb, title, summary as the
 * deck, then share and Explore with AI. Below that, the cover beside the
 * findings (numbered, like a post's TL;DR), the audio overview and the gate.
 *
 * The substance (summary, findings, audio) is server rendered and crawlable.
 * Only the PDF link sits behind the email ask, and even that is a courtesy: the
 * file is in a public bucket. Gating the page itself would trade the search
 * traffic this page exists to earn for a form nobody has a reason to fill in.
 *
 * "Related reading" lists blog posts that cite this report first (found by
 * their links, so nobody keeps the list by hand), then other reports, then
 * case studies.
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

  const path = `/insights/reports/${report.slug}`;
  const url = `${SITE_URL}${path}`;

  const [citing, reports, studies] = await Promise.all([
    getPostsLinkingTo(path, RELATED_COUNT),
    getReports(),
    getCaseStudies(),
  ]);

  const related: RelatedItem[] = [
    ...citing.map((post) => ({ kind: "post" as const, post })),
    ...reports
      .filter((other) => other.slug !== report.slug)
      .map((other) => ({ kind: "report" as const, report: other })),
    ...studies.map((study) => ({ kind: "study" as const, study })),
  ].slice(0, RELATED_COUNT);

  const facts = [
    reportDate(report.published),
    report.pages ? `${report.pages} pages` : null,
    report.audioLength ? `${report.audioLength} audio` : null,
  ].filter(Boolean);

  return (
    <div className="rf-soft">
      <article className="rf-article">
        <header className="rf-section rf-section-open">
          <div className="rf-shell rf-post-head">
            <Crumbs items={CRUMBS} />

            <h1 className="rf-h1 rf-post-title">{report.title}</h1>
            <p className="rf-post-deck">{report.summary}</p>

            <div className="rf-byline">
              <div className="rf-byline-text">
                <p className="rf-byline-name">
                  Report<span className="rf-byline-role">by {SITE_NAME}</span>
                </p>
                <p className="rf-utility rf-byline-dates">
                  <span>
                    Published{" "}
                    <time dateTime={report.published}>{facts[0]}</time>
                  </span>
                  {facts.slice(1).map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </p>
              </div>
              <div className="rf-byline-controls">
                <ShareButton title={report.title} url={url} kind="report" />
              </div>
              <ExploreWithAI url={url} kind="report" />
            </div>
          </div>
        </header>

        <section className="rf-section rf-section-open">
          <div className="rf-shell rf-grid gap-y-10 rf-band-tight">
            <div className="col-span-full lg:col-span-4">
              {/* `fill`, because no intrinsic dimensions travel with a URL
                  pasted into a table editor. The frame declares the ratio.
                  Capped on a phone, where full width pushed the findings a
                  whole screen down. */}
              <div className="rf-report-cover rf-report-cover-lead max-lg:max-w-[13rem] lg:sticky lg:top-24">
                <Image
                  src={report.cover}
                  alt={`Cover of ${report.title}`}
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  priority
                />
              </div>
            </div>

            <div className="col-span-full flex flex-col gap-10 lg:col-span-7 lg:col-start-6">
              {/* Public, and the reason this page is worth landing on cold. The
                  gate asks for the document, not for the argument. */}
              <Findings items={report.findings} title="What it found" id="findings" />

              {report.audio ? (
                // `title` and `cover` are for the OS media session: what the
                // iOS lock screen and the Android notification show.
                <ReportAudio
                  src={report.audio}
                  length={report.audioLength}
                  slug={report.slug}
                  title={report.title}
                  cover={report.cover}
                />
              ) : null}

              <div id="download" className="scroll-mt-24">
                <ReportGate report={report} />
              </div>
            </div>
          </div>
        </section>
      </article>

      <RelatedReading items={related} />

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd(report.title, path, CRUMBS)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(reportJsonLd(report)),
        }}
      />
    </div>
  );
}
