/**
 * The analytics vocabulary — every event name and property value the site can
 * emit, in one place, for the same reason stages and case studies live in
 * `lib/content`: a name that exists in two files drifts, and a drifted event
 * name silently orphans whatever dashboard was built on it.
 *
 * **This module has no imports and must keep it that way.** Server components
 * read `RF_EVENTS` for their `data-rf-event` values, so a top-level
 * `posthog-js` import here would be evaluated on the server once per importer.
 * The imperative `track()` wrapper lives in the one client component that
 * actually needs it.
 *
 * How an event gets emitted: the delegated listener in
 * `instrumentation-client.ts` reads these off the DOM. An element carrying
 * `data-rf-event` fires that event on click, and every other `data-rf-*`
 * attribute on it becomes a property — `data-rf-location` arrives as
 * `location`. Instrumenting a CTA is therefore adding an attribute, not adding
 * a client boundary, which is why every anchor on this site is still a server
 * component.
 */

export const RF_EVENTS = {
  /** Any route to the booking page. The site's primary conversion. */
  bookingClicked: "cta_booking_clicked",
  /** Either mailto route. */
  contactClicked: "cta_contact_clicked",
  /** Non-converting CTAs, kept separate so they cannot inflate the above. */
  secondaryClicked: "cta_secondary_clicked",
  caseStudyOpened: "case_study_opened",
  /** The `/insights` disclosure — the clearest "digging" signal on the site. */
  allWorkOpened: "all_work_opened",
  assessmentStepOpened: "assessment_step_opened",
} as const;

export type RfEvent = (typeof RF_EVENTS)[keyof typeof RF_EVENTS];

/**
 * Where a CTA sits.
 *
 * `closing_cta` is deliberately one value across `/`, `/insights`, and
 * `/insights/[slug]`. PostHog attaches `$pathname` to every event, so those
 * three are already separable in a query — threading a prop through
 * `ClosingCTA` would add an argument to a component that otherwise needs none,
 * to recover something we already have.
 *
 * `company_contact` covers both the booking button and the "Email us instead"
 * beside it: same decision point, and the event name is what distinguishes
 * them, so the pair stays directly comparable.
 */
export type RfLocation =
  | "header"
  | "hero"
  | "hero_how_we_work"
  | "closing_cta"
  | "assessment"
  | "company_contact"
  | "company_details";

/**
 * Which surface a case study card was opened from.
 *
 * Required on `CaseStudyCard` rather than defaulted, because the whole point of
 * the property is the distinction between browsing and digging, and a default
 * would let any new call site report as `featured` and quietly flatten it.
 * `home_proof` is the one that matters most: a homepage visitor going straight
 * into a study is a stronger signal than someone who reached `/insights` first.
 */
export type RfSurface = "home_proof" | "featured" | "all_work" | "related";
