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
  /**
   * An industry page, opened from a card or the home marquee. Carries
   * `industry` (the group slug) and `surface`. The menu is not counted here:
   * the question is which on-page route into a sector earns the click.
   */
  industryOpened: "industry_opened",
  /**
   * A pill: a section jump on `/insights` or a topic filter on the blog.
   * Carries `target` (the pill's label) and `surface` (which row of pills).
   */
  insightsNavClicked: "insights_nav_clicked",
  /** A breadcrumb link above a post, report or case study. Carries `target`. */
  breadcrumbClicked: "breadcrumb_clicked",
  /** LinkedIn or GitHub from the footer. Carries `network`. */
  socialProfileOpened: "social_profile_opened",
  /** The blog's RSS link. A reader subscribing without giving an email. */
  feedOpened: "rss_feed_opened",
  /**
   * The 404 page, rendered. PostHog attaches `$pathname` and `$referrer`, so
   * this is the list of dead links and where they are linked from.
   */
  notFoundViewed: "not_found_viewed",
  /**
   * A visit that arrived from an AI assistant (ChatGPT, Perplexity, Claude,
   * Gemini, Copilot…), once per browser session. Carries `ai_source`, and the
   * same value is registered on every later event in the session, so any
   * funnel can be split by it. See `lib/analytics/ai-source.ts` for what it
   * can and cannot detect.
   */
  aiReferralLanded: "ai_referral_landed",
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
  /**
   * A partner's own site, from the partner network on `/company`. Carries
   * `partner` — which firm.
   *
   * Outside the `cta_` family for the same reason as the line above it: it
   * converts nothing here, and counting it as a CTA would inflate the numbers
   * that decide whether the page works. What it measures is whether naming a
   * partner sends readers away or gives them a reason to trust the bench.
   */
  partnerSiteOpened: "partner_site_opened",
  /**
   * The capability statement PDF, downloaded from gov.regainflow.com (named
   * in `document`). Separate from `capabilityStatementOpened`
   * because this reader has already read the page; the download is a second,
   * stronger decision.
   */
  govPdfDownloaded: "gov_pdf_downloaded",
  /** The capability statement preview on the gov page, opened full size. */
  govPdfViewed: "gov_pdf_viewed",
  /** A report card, from the listing or from a report page. */
  reportOpened: "report_opened",
  /** A blog post card, from the blog index, the `/insights` band, or a post. */
  blogPostOpened: "blog_post_opened",
  /**
   * A post's own next step, inline or at the end (named in `location`).
   * Separate from `bookingClicked` because the destination varies by post — a
   * report, a case study, or the assessment — and the question it answers is
   * whether a post-specific offer earns the click.
   */
  blogCtaClicked: "blog_cta_clicked",
  /** The share button on a post, report or case study: native share sheet or
   *  copy-link. Carries `method` and `page` (blog_post, report, case_study). */
  pageShared: "page_shared",
  /** Reading mode switched on a post. Carries `theme`. */
  readingModeChanged: "reading_mode_changed",
  /** "Ask ChatGPT" / "Ask Claude" on a post, report or case study. `target`
   *  names the assistant and `surface` the kind of page. */
  exploreAi: "explore_ai",
  /** A video facade in a post, pressed. Carries `video` (the YouTube id). */
  blogVideoPlayed: "blog_video_played",
  /**
   * How far through the article body a reader got: 25, 50, 75 and 90, each
   * once per page view (carries `depth` and `post`). PostHog's pageleave only
   * records the last position; this records where the drop-offs happen, which
   * is what the UX research says to look at.
   */
  blogScrollDepth: "blog_scroll_depth",
  /**
   * The FT-style "quality read": at least half the article scrolled *and* at
   * least half its expected reading time spent with the tab visible. Once per
   * page view. Plotted against views per post, it separates posts people open
   * from posts people read (`docs/blogs_seo/blog_ui_ux.md`, Part 10).
   */
  blogQualityRead: "blog_quality_read",
  /**
   * The newsletter form, submitted and written: fired from
   * `/newsletter/check-email`, which only a successful submission reaches.
   * Not yet a subscriber: that is `newsletterConfirmed`, and the gap between
   * the two is how many confirmation emails go unanswered.
   */
  newsletterSubmitted: "newsletter_submitted",
  /** Double opt-in completed. Fired from `/newsletter/confirmed`. */
  newsletterConfirmed: "newsletter_confirmed",
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
  /**
   * The `FreeAssessment` section on the home page, as distinct from the one
   * closing `/services`. Both render the same component, so `$pathname` would
   * separate them — but this one sits mid-page between proof and partnership
   * rather than closing the route, and the question worth answering is whether
   * a reader converts there or carries on to the closing CTA.
   */
  | "home_assessment"
  /** The compact callout closing an industry group page. */
  | "industry_assessment"
  | "company_contact"
  | "company_details"
  /**
   * The partner network section on `/company`. Its own value rather than
   * `company_contact`, because the question worth answering is whether a
   * reader who came for the partner goes on to contact us or leaves for the
   * partner's own site — and otherwise those two are the same click count.
   */
  | "company_partners"
  /** The closing shelf of the footer, on every route. */
  | "footer"
  /** `/contact` — the form's own page. */
  | "contact_page"
  /** The email gate on a report page. */
  | "report_gate"
  /** A report page, outside the gate. */
  | "report"
  /** Any page on gov.regainflow.com. */
  | "gov"
  /** The three home sections that link into `/services` and `/company`. */
  | "home_production_gap"
  | "home_stage_summary"
  | "home_partnership"
  /** "All case studies" under the home proof strip. */
  | "home_proof"
  /** The "All …" links closing each band of `/insights`. Carries `target`. */
  | "insights_hub"
  /** The way back in from the 404 and error pages. */
  | "not_found"
  | "error_page";

/**
 * Which surface a case study card was opened from.
 *
 * Required on `CaseStudyCard` rather than defaulted, because the whole point of
 * the property is the distinction between browsing and digging, and a default
 * would let any new call site report as `featured` and quietly flatten it.
 * `home_proof` is the one that matters most: a homepage visitor going straight
 * into a study is a stronger signal than someone who reached `/insights` first.
 */
export type RfSurface =
  | "home_proof"
  | "featured"
  /**
   * The Selected Engagements band on the `/industries` hub. Its own value
   * rather than `featured`, because a click here comes from a reader browsing
   * sectors rather than one who came to `/insights` for the work — the two say
   * different things about how they arrived.
   */
  | "industries_hub"
  /**
   * The proof band on an industry group page. Its own value rather than
   * `featured`, because a click here means a reader who already self-selected
   * into a sector went looking for evidence — the strongest qualifying signal
   * the site can observe short of a booking.
   */
  | "industry"
  /** The "Related reading" shelf on a report or case study page. */
  | "related_reading"
  /** The `/insights/case-studies` index. */
  | "case_studies_index";
