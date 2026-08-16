import Icon from "@/components/Icon";
import {
  ASSESSMENT_REPORT_CONTENTS,
  REPORT_NAME,
  REPORT_PRICE,
  REPORT_TERMS,
} from "@/lib/content/assessment";

/**
 * The deliverable, drawn as the document it is.
 *
 * This section's whole job is to answer two questions — *what am I getting* and
 * *what does it cost* — and neither was landing. The contents of the report
 * were a chip row buried inside step 03's body copy, where you only found them
 * if you read that far; the price was a `$0` in a three-stat row that read as a
 * clever claim rather than a price tag. Both now sit in one object a reader
 * recognises on sight: a titled document with a price on it and a list of what
 * is inside.
 *
 * Deliberately not a card. `.rf-card` is the site's *navigational* surface —
 * every one of them is a link to somewhere else, and a reader has learned that.
 * This is a thing being shown, not a route, so it takes the hairline-on-Navy
 * treatment without inheriting the hover state or the affordance.
 *
 * `compact` drops the phase-by-phase context that only the full section
 * provides. Industry pages take it: `AssessmentCallout` is the compressed
 * version of this offer and has always deliberately withheld the walkthrough,
 * but "what you get" belongs on those pages too — it just does not need the
 * header row repeated under a heading that already says it.
 *
 * A server component. No state, and it renders on four static industry pages —
 * a client boundary here would cost hydration to buy nothing.
 */
export default function AssessmentReport({
  compact = false,
}: {
  compact?: boolean;
} = {}) {
  return (
    <figure className="rf-report">
      {/* The title bar. `figcaption` rather than a heading, because the panel
          sits under a real `h2` in both call sites and a nested heading here
          would claim a level in the outline it has no business holding. */}
      <figcaption className="rf-report-head">
        <span className="rf-utility">{REPORT_NAME}</span>
        {/* The price, at stat size. This is the one number on the page and it
            is the number a reader came to find. */}
        <span className="rf-report-price">{REPORT_PRICE}</span>
      </figcaption>

      <ul className="rf-report-body">
        {ASSESSMENT_REPORT_CONTENTS.map((section) => (
          <li key={section.label} className="rf-report-row">
            <Icon name={section.icon} />
            <span className="rf-body">{section.label}</span>
          </li>
        ))}
      </ul>

      {!compact ? (
        <p className="rf-report-foot rf-utility">{REPORT_TERMS}</p>
      ) : null}
    </figure>
  );
}
