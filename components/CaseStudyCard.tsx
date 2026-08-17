import Image from "next/image";
import Link from "next/link";

import { RF_EVENTS, type RfSurface } from "@/lib/analytics/events";
import { type CaseStudy } from "@/lib/content/case-studies";

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
      // No `data-rf-group`. Categories came out with the twelve prior-career
      // studies — with three, the rollup they existed to make readable is the
      // per-slug count.
      data-rf-surface={surface}
    >
      {/* Optional, and the card is designed to look deliberate without it —
          most studies will have no art for a long time, and a placeholder
          frame is worse than no frame. `.rf-case-cover` declares the ratio so
          `fill` has a box and a row of cards stays level either way. */}
      {study.image ? (
        <div className="rf-case-cover mb-5">
          <Image
            src={study.image}
            // `imageAlt` is authored per study. Falling back to the title is a
            // weak alt but a truthful one; an empty string would claim the
            // image is decorative, which it is not.
            alt={study.imageAlt ?? study.title}
            fill
            // A third of an 80rem shell at desktop, full width below `md`.
            // Asking for the rendered size keeps the request proportionate.
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
          />
        </div>
      ) : null}

      <p className="rf-utility text-rf-flow-soft">{study.industry}</p>

      <h3 className="rf-h3 mt-3">{study.title}</h3>

      <p className="rf-body mt-4">{study.summary}</p>

      {/* No figure row. Nothing is published on a card that we cannot explain
          how we measured — see the header in `lib/content/case-studies.ts`. The
          capability tags do the qualifying work a metric used to. */}

      {/* `mt-auto` pins this row to the bottom of the card, so a short and a
          long study still line up in the same row of the grid. */}
      <div className="mt-auto border-t border-rf-hairline pt-5">
        <p className="rf-mech">
          {study.capabilityTags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
        <span className="rf-nav-link mt-4 inline-block">View more &rarr;</span>
      </div>
    </Link>
  );
}
