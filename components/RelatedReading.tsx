import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import { postDateShort, type BlogPostSummary } from "@/lib/content/blog";
import type { CaseStudy } from "@/lib/content/case-studies";
import { reportDate, type Report } from "@/lib/content/reports";

export type RelatedItem =
  | { kind: "post"; post: BlogPostSummary }
  | { kind: "report"; report: Report }
  | { kind: "study"; study: CaseStudy };

/**
 * "Related reading" at the end of a report or case study: blog posts that cite
 * the page first, then the rest of Insights. It is what joins the three
 * libraries into one, so a reader who lands on a report from search has a
 * next step that is not the booking form.
 *
 * One card shape for every kind, rather than each kind's own card: a report
 * cover beside two text cards left the row ragged. The kind is the first line,
 * so a reader knows whether they are opening a 3-minute post or a 20-page
 * report.
 */
export default function RelatedReading({
  items,
  title = "Related reading",
}: {
  items: RelatedItem[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="rf-section rf-section-open" aria-labelledby="related-reading">
      <div className="rf-shell rf-band">
        <h2 id="related-reading" className="rf-eyebrow">
          {title}
        </h2>

        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const card = describe(item);
            return (
              <li key={card.href} className="h-full">
                <Link
                  href={card.href}
                  className="rf-card rf-related-card"
                  data-rf-event={card.event}
                  data-rf-slug={card.slug}
                  data-rf-surface="related_reading"
                >
                  <p className="rf-utility text-rf-flow-soft">{card.kind}</p>
                  <h3 className="rf-h3 mt-3">{card.title}</h3>
                  <p className="rf-body mt-4">{card.summary}</p>
                  <p className="rf-utility mt-auto pt-6">{card.meta}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function describe(item: RelatedItem) {
  switch (item.kind) {
    case "post":
      return {
        kind: "Blog post",
        href: `/insights/blog/${item.post.slug}`,
        slug: item.post.slug,
        title: item.post.title,
        summary: item.post.summary,
        meta: `${postDateShort(item.post.published)} · ${item.post.readingMinutes} min read`,
        event: RF_EVENTS.blogPostOpened,
      };
    case "report":
      return {
        kind: "Report",
        href: `/insights/reports/${item.report.slug}`,
        slug: item.report.slug,
        title: item.report.title,
        summary: item.report.summary,
        meta: [
          reportDate(item.report.published),
          item.report.pages ? `${item.report.pages} pages` : null,
          item.report.audio ? "Audio" : null,
        ]
          .filter(Boolean)
          .join(" · "),
        event: RF_EVENTS.reportOpened,
      };
    case "study":
      return {
        kind: "Case study",
        href: `/insights/${item.study.slug}`,
        slug: item.study.slug,
        title: item.study.title,
        summary: item.study.summary,
        meta: item.study.industry,
        event: RF_EVENTS.caseStudyOpened,
      };
  }
}
