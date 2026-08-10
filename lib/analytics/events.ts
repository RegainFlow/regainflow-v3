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
  /** A route to `/contact`, or one of the two remaining mailto links. */
  contactClicked: "cta_contact_clicked",
  /**
   * A contact form submission that was accepted and written. The other half of
   * the conversion: `contactClicked` counts intent to reach us, this counts
   * arrival, and the gap between them is the form's own drop-off.
   *
   * Fired from the client after the action returns, not from the action — see
   * `lib/analytics/track.ts` for why that is a separate module.
   */
  contactSubmitted: "contact_form_submitted",
  /** Non-converting CTAs, kept separate so they cannot inflate the above. */
  secondaryClicked: "cta_secondary_clicked",
  caseStudyOpened: "case_study_opened",
  /** The `/insights` disclosure — the clearest "digging" signal on the site. */
  allWorkOpened: "all_work_opened",
  assessmentStepOpened: "assessment_step_opened",
  /**
   * A footer assistant link. Carries `assistant` — which of them was picked.
   *
   * The one number that says whether this feature earns its place: it is a
   * convenience for people who were going to ask an AI about us anyway, and
   * that premise is either true in the data or it is not. Kept out of the `cta_`
   * family deliberately, since it converts nothing.
   */
  askAiClicked: "ask_ai_clicked",
  /**
   * The capability statement PDF. Deliberately outside the `cta_` family — it
   * converts nothing on its own, but for a federal or law-enforcement buyer,
   * pulling the capability statement is one of the strongest intent signals
   * the site can observe.
   */
  capabilityStatementOpened: "capability_statement_opened",
  /** A report card, from the listing or from a report page. */
  reportOpened: "report_opened",
  /**
   * The email gate on a report, accepted. Carries `report`.
   *
   * This is the event `instrumentation-client.ts` was configured for:
   * `person_profiles: "identified_only"` means an anonymous visitor creates no
   * person record until `identify(email)` runs here, at which point everything
   * they read beforehand is stitched onto them retroactively.
   */
  reportUnlocked: "report_unlocked",
  /** The PDF itself, after the gate. Separate from the unlock — an unlock that
   *  never becomes a download means the gate is the wrong ask. */
  reportDownloaded: "report_downloaded",
  /** First play of a report's audio overview. Fires once per page view. */
  podcastPlayed: "report_podcast_played",
  /** A founder resume. Carries `person`. Like the capability statement, it
   *  converts nothing and is a strong intent signal, so it stays outside the
   *  `cta_` family. */
  resumeOpened: "resume_opened",
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
  /**
   * The form button beside it. Split out rather than folded into `closing_cta`
   * because the pair is now a ranked choice — booking first, form second — and
   * the number worth having is how often the second one wins.
   */
  | "closing_cta_contact"
  | "assessment"
  | "company_contact"
  | "company_details"
  /** The closing shelf of the footer, on every route. */
  | "footer"
  /** `/contact` — the form's own page. */
  | "contact_page"
  /** The email gate on a report page. */
  | "report_gate"
  /** A report page, outside the gate. */
  | "report";

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
