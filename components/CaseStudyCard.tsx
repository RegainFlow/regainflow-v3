import Link from "next/link";

import { RF_EVENTS, type RfSurface } from "@/lib/analytics/events";
import { GROUP_KEYS, type CaseStudy } from "@/lib/content/case-studies";

/**
 * The whole card is the link — the same shape the home proof strip already
 * used. Everything technical (capabilities, stack) is held back for the study
 * page; what a card has to survive is being read by someone who never opens it.
 *
 * `surface` has no default. This card renders in four places and the property
 * exists to tell them apart — a homepage `ProofStrip` click and a click inside
 * the `/insights` disclosure are different signals about the same study. A
 * default would let a fifth call site report as one of the existing four and
 * quietly flatten that; requiring it makes the type checker ask.
 */
export default function CaseStudyCard({
  study,
  surface,
}: {
  study: CaseStudy;
  surface: RfSurface;
}) {
  return (
    <Link
      href={`/insights/${study.slug}`}
      className="rf-card"
      data-rf-event={RF_EVENTS.caseStudyOpened}
      data-rf-slug={study.slug}
      // The stable key, not `study.group` — see `GROUP_KEYS`. With traffic this
      // low the category rollup is the readable number; per-slug counts will
      // sit at one or two for a long time.
      data-rf-group={GROUP_KEYS[study.group]}
      data-rf-surface={surface}
    >
      <p className="rf-utility text-rf-flow-soft">{study.industry}</p>

      <h3 className="rf-h3 mt-3">{study.title}</h3>

      <p className="rf-body mt-4">{study.summary}</p>

      {/* Only two studies carry a confirmed figure. The route tick marks it as
          a stated result rather than another line of description. */}
      {study.metric ? (
        <p className="rf-utility mt-5 flex gap-4 text-rf-flow-soft">
          <span className="rf-route-tick" aria-hidden="true" />
          <span>{study.metric}</span>
        </p>
      ) : null}

      {/* `mt-auto` pins this row to the bottom of the card, so a short and a
          long study still line up in the same row of the grid. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-rf-hairline pt-5">
        <p className="rf-utility">{study.group}</p>
        <span className="rf-nav-link">View more &rarr;</span>
      </div>
    </Link>
  );
}
