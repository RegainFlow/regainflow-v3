import Image from "next/image";
import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import { reportDate, type Report } from "@/lib/content/reports";

/**
 * A report in a listing. The whole card is the link, matching `CaseStudyCard`.
 *
 * The cover leads, and that is the difference between this and a case study
 * card: a report is a physical-feeling object, and the page it opens is asking
 * for an email. Showing the artifact is most of what earns that.
 */
export default function ReportCard({
  report,
  surface,
  priority = false,
}: {
  report: Report;
  /** Which listing this was clicked from. Required, for the same reason
   *  `CaseStudyCard.surface` is — a default would flatten the distinction. */
  surface: "reports_index" | "insights" | "related";
  /**
   * Loads the cover eagerly. Set on the first card of a listing that starts
   * near the top of the page, where that cover is the Largest Contentful Paint
   * — lazy-loading the LCP element delays it by a round trip.
   *
   * Opt-in rather than derived from `surface`, because it depends on where the
   * listing sits on the page and not on which listing it is: the same component
   * is the LCP on `/insights/reports` and is far below the fold in the
   * `/insights` band.
   */
  priority?: boolean;
}) {
  return (
    <Link
      href={`/insights/reports/${report.slug}`}
      className="rf-card"
      data-rf-event={RF_EVENTS.reportOpened}
      data-rf-report={report.slug}
      data-rf-surface={surface}
    >
      {/* The frame declares the ratio, so a cover that is not quite letter-sized
          still leaves the row level — and so `fill` has a box to fill. No
          intrinsic dimensions travel with a URL pasted into a table editor. */}
      <div className="rf-report-cover">
        <Image
          src={report.cover}
          alt={`Cover of ${report.title}`}
          fill
          priority={priority}
          // The card is one third of an 80rem shell at desktop and full width
          // below `md`. Asking for the rendered size rather than a share of the
          // viewport is what keeps the request proportionate.
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
        />
      </div>

      <p className="rf-utility mt-5 text-rf-flow-soft">
        {reportDate(report.published)}
      </p>

      <h3 className="rf-h3 mt-3">{report.title}</h3>

      <p className="rf-body mt-4">{report.summary}</p>

      {/* Pinned to the bottom so a short and a long summary still line up. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <ReportMeta report={report} />
        <span className="rf-nav-link">Read it &rarr;</span>
      </div>
    </Link>
  );
}

/** Pages, plus an "Audio" chip where there is an audio version: the one
 *  thing a report offers that a post does not, so it is worth a badge. */
function ReportMeta({ report }: { report: Report }) {
  return (
    <p className="rf-utility flex flex-wrap items-center gap-3">
      <span>{report.pages ? `${report.pages} pages` : "Report"}</span>
      {report.audio ? <span className="rf-tag">Audio</span> : null}
    </p>
  );
}

/**
 * The newest report, large: the cover beside the title, the summary and its
 * first three findings. The findings are the page's argument, so showing them
 * here tells a reader what they would be opening, which a cover cannot.
 */
export function ReportFeatured({
  report,
  surface,
  priority = false,
}: {
  report: Report;
  surface: "reports_index" | "insights";
  priority?: boolean;
}) {
  return (
    <Link
      href={`/insights/reports/${report.slug}`}
      className="rf-report-featured"
      data-rf-event={RF_EVENTS.reportOpened}
      data-rf-report={report.slug}
      data-rf-surface={`${surface}_featured`}
    >
      <div className="rf-report-cover">
        <Image
          src={report.cover}
          alt={`Cover of ${report.title}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 40vw, 90vw"
        />
      </div>

      <div className="rf-report-featured-text">
        <p className="rf-utility text-rf-flow-soft">
          Latest report · {reportDate(report.published)}
        </p>
        <h3 className="rf-blog-featured-title mt-3">{report.title}</h3>
        <p className="rf-body mt-4 max-w-[58ch]">{report.summary}</p>

        {report.findings.length > 0 ? (
          <ol className="rf-report-featured-findings mt-6">
            {report.findings.slice(0, 3).map((finding, i) => (
              <li key={finding}>
                <span className="rf-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{finding}</span>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <ReportMeta report={report} />
          <span className="rf-nav-link">Read the findings &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
