import type { Metadata } from "next";
import Link from "next/link";

import { PostList } from "@/components/BlogArchive";
import CaseStudyCard from "@/components/CaseStudyCard";
import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import Pills from "@/components/Pills";
import ReportCard, { ReportFeatured } from "@/components/ReportCard";
import { getPosts } from "@/lib/blog.server";
import { getCaseStudies } from "@/lib/case-studies.server";
import { getReports } from "@/lib/reports.server";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  pageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { RF_EVENTS } from "@/lib/analytics/events";

const DESCRIPTION =
  "Case studies, research reports and blog posts from RegainFlow's AI engineering work in government, aerospace and regulated enterprise.";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description: DESCRIPTION,
  path: "/insights",
  feed: true,
});

/** Every band reads a table. Cached, and rebuilt at most once a minute: see
 *  `docs/content-cache.md`. */
export const revalidate = 60;

/** Posts shown in the blog band: two rows of the two-column list. */
const HUB_POSTS = 4;

/**
 * The Insights hub: one page that shows all three libraries and says what each
 * is, in the shape the blog index set (plain header, pills, space instead of
 * rules, `.rf-soft`).
 *
 * - The pills jump to each band. They are anchors, not filters: each library
 *   has its own index, and a band ends with the link to it.
 * - Case studies lead, as before: they are the evidence the rest argues from.
 * - Reports on Navy, the newest one featured with its findings.
 * - Blog posts as the blog's own rows, so a post looks the same everywhere.
 *
 * Every fetch degrades to `[]` and its band disappears with it; the pills are
 * built from the same data, so no pill points at a band that is not there.
 */
export default async function InsightsPage() {
  const [studies, reports, posts] = await Promise.all([
    getCaseStudies(),
    getReports(),
    getPosts({ limit: HUB_POSTS }),
  ]);
  const [latestReport, ...otherReports] = reports;

  const sections = [
    studies.length > 0 && { label: "Case studies", href: "#case-studies" },
    reports.length > 0 && { label: "Reports", href: "#reports" },
    posts.length > 0 && { label: "Blog", href: "#blog" },
  ].filter((section) => section !== false);

  return (
    <div className="rf-soft">
      <PageHeader
        open
        eyebrow="RegainFlow"
        title="Insights"
        lead="What we have learned putting AI into production: the work itself, the research behind it, and shorter posts from the engineers."
        meta={
          sections.length > 1 ? (
            <div className="mt-6">
              <Pills label="Insights sections" items={sections} />
            </div>
          ) : null
        }
      />

      {studies.length > 0 ? (
        <section
          id="case-studies"
          className="rf-section rf-section-open scroll-mt-24"
          aria-labelledby="case-studies-title"
        >
          <div className="rf-shell rf-band">
            <div className="rf-grid gap-y-4">
              <h2 id="case-studies-title" className="rf-h2 col-span-full lg:col-span-5">
                Case studies
              </h2>
              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-2">
                What the problem was, what we owned, what we built, and what it
                produced.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, i) => (
                <li key={study.slug} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 3) * 90}>
                    <CaseStudyCard study={study} surface="featured" />
                  </DitherReveal>
                </li>
              ))}
            </ul>

            <p className="mt-10">
              <Link
                href="/insights/case-studies"
                className="rf-nav-link"
                data-rf-event={RF_EVENTS.secondaryClicked}
                data-rf-location="insights_hub"
                data-rf-target="case_studies"
              >
                All case studies &rarr;
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      {latestReport ? (
        <section
          id="reports"
          className="rf-section rf-section-open bg-rf-navy scroll-mt-24"
          aria-labelledby="reports-title"
        >
          <div className="rf-shell rf-band">
            <div className="rf-grid gap-y-4">
              <h2 id="reports-title" className="rf-h2 col-span-full lg:col-span-5">
                Reports
              </h2>
              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-2">
                Longer research we publish in full. Free to read, and each one
                comes with an audio version.
              </p>
            </div>

            <div className="mt-10">
              <ReportFeatured report={latestReport} surface="insights" />
            </div>

            {otherReports.length > 0 ? (
              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherReports.slice(0, 3).map((report, i) => (
                  <li key={report.slug} className="h-full">
                    <DitherReveal className="h-full" delay={(i % 3) * 90}>
                      <ReportCard report={report} surface="insights" />
                    </DitherReveal>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-10">
              <Link
                href="/insights/reports"
                className="rf-nav-link"
                data-rf-event={RF_EVENTS.secondaryClicked}
                data-rf-location="insights_hub"
                data-rf-target="reports"
              >
                All reports &rarr;
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section
          id="blog"
          className="rf-section rf-section-open scroll-mt-24"
          aria-labelledby="blog-title"
        >
          <div className="rf-shell rf-band">
            <div className="rf-grid gap-y-4">
              <h2 id="blog-title" className="rf-h2 col-span-full lg:col-span-5">
                Blog
              </h2>
              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-2">
                Shorter posts by the founders on what we keep seeing when AI
                meets a real operating environment.
              </p>
            </div>

            <div className="mt-10">
              <PostList
                posts={posts}
                page={1}
                total={posts.length}
                surface="insights"
                paginate={false}
              />
            </div>

            <p className="mt-10">
              <Link
                href="/insights/blog"
                className="rf-nav-link"
                data-rf-event={RF_EVENTS.secondaryClicked}
                data-rf-location="insights_hub"
                data-rf-target="blog"
              >
                All posts &rarr;
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <section className="rf-section rf-section-open" aria-label="Newsletter">
        <div className="rf-shell rf-blog-newsletter-wrap">
          <div className="rf-blog-newsletter">
            <NewsletterSignup source="insights_hub" layout="split" />
          </div>
        </div>
      </section>

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
          __html: serializeJsonLd(
            collectionJsonLd({
              path: "/insights",
              name: "Insights",
              description: DESCRIPTION,
              items: [
                ...studies.map((study) => ({
                  type: "CreativeWork" as const,
                  path: `/insights/${study.slug}`,
                  name: study.title,
                })),
                ...reports.slice(0, 4).map((report) => ({
                  type: "Report" as const,
                  path: `/insights/reports/${report.slug}`,
                  name: report.title,
                })),
                ...posts.map((post) => ({
                  type: "BlogPosting" as const,
                  path: `/insights/blog/${post.slug}`,
                  name: post.title,
                })),
              ],
            }),
          ),
        }}
      />
    </div>
  );
}
