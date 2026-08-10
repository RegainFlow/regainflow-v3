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
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-rf-hairline pt-5">
        <p className="rf-utility">
          {report.pages ? `${report.pages} pages` : "Report"}
          {report.audio ? " · Audio" : ""}
        </p>
        <span className="rf-nav-link">Read it &rarr;</span>
      </div>
    </Link>
  );
}
