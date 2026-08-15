import { RF_EVENTS, type RfEvent } from "@/lib/analytics/events";

export const SITE_NAME = "RegainFlow";

export const SITE_URL = "https://www.regainflow.com";

export const CONTACT_EMAIL = "contact@regainflow.com";

/** Primary destination for every conversion on the site. */
export const FREE_ASSESSMENT_HREF =
  "https://cal.com/regainflow/free-assessment";

/**
 * The capability statement, hosted on Supabase storage. The document a federal,
 * defense, or law-enforcement buyer asks for by name, so it gets a real route
 * out of the nav rather than living only in an email attachment.
 *
 * The year is in the filename, which makes replacing it a one-line change here
 * and leaves the superseded edition reachable for anyone holding the old link.
 */
export const CAPABILITY_STATEMENT_HREF =
  "https://qsnaxtjoyqycpbmmghff.supabase.co/storage/v1/object/public/site/RegainFlow_Capability_Statement_2026.pdf";

/** The canonical contact route. Every contact CTA on the site points here. */
export const CONTACT_PATH = "/contact";

/**
 * The `mailto:`, kept as a pre-structured draft so an email arrives with the
 * three things we need in order to reply usefully.
 *
 * **No longer a call to action.** It was the primary contact route until
 * `/contact` shipped, and it lost that job for two reasons: it opens a client
 * this audience frequently does not have configured, and it leaves no record
 * anywhere we can query. It now appears only where the address is being stated
 * as a fact and happens to be clickable — `/contact`, `/company#contact`, and
 * `/llm-info`. Do not route a button here.
 */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=AI%20transformation%20inquiry&body=Organization%3A%0AWhat%20are%20you%20trying%20to%20move%20into%20production%3F%0ATimeline%3A`;

/**
 * The two CTAs, each named for where it goes.
 *
 * They replaced a single `PRIMARY_CTA = "Contact Us"` that was wired to
 * `FREE_ASSESSMENT_HREF` on every surface — so every button reading "Contact Us" opened
 * cal.com, and the form at `CONTACT_PATH` was reachable only from the nav
 * dropdown and the footer. Two labels pointing at two destinations is the whole
 * fix; the ambiguous constant is deliberately deleted rather than aliased, so a
 * new call site cannot reach for it.
 *
 * Booking stays the primary conversion. `CONTACT_CTA` is the secondary route,
 * for the visitor who is not ready to put something in a calendar.
 */
export const FREE_ASSESSMENT_CTA = "Free Assessment";
export const CONTACT_CTA = "Contact Us";

export interface Profile {
  label: string;
  href: string;
}

/**
 * Verified profiles for this organization, in `sameAs` order.
 *
 * This is the entity anchor: it is how an answer engine confirms that the site,
 * the LinkedIn page, and the name in its index are all one organization rather
 * than three. Cheap to add and disproportionately load-bearing, which is why it
 * gets a named constant instead of an inline array.
 *
 * Labelled rather than a bare URL list, because these are rendered in the footer
 * as well as emitted as `sameAs` — and the one thing worse than an unverified
 * profile URL is two copies of a verified one that can drift apart. `lib/seo.ts`
 * maps to the hrefs; nothing else may hold this list.
 *
 * Every entry has to be a profile we control and that resolves. A guessed URL
 * that 404s is worse than an absent one, because it asserts an identity we
 * cannot back.
 */
export const PROFILES: Profile[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/regain-flow" },
  { label: "GitHub", href: "https://github.com/RegainFlow" },
];

export const LOCATION = "Orlando, Florida";

/**
 * Cased for use mid-sentence as well as in the eyebrow, which is why "AI" is
 * capitalized and nothing else is. Two call sites drop it into running prose —
 * `app/llm-info/page.tsx` and the reports OG card — and both used to lowercase
 * it, which turned the term into "ai engineering" and left one of them reading
 * "a ai". Render this constant as written; the eyebrow's own CSS handles caps.
 */
export const POSITIONING = "AI engineering & transformation partner";

export const TAGLINE = "AI transformation, from ambition to operation.";

/**
 * Who the site is written for. Rendered on `/llm-info` and in `llms.txt`.
 *
 * Public agencies lead; complex organizations follow. The firm is
 * engineering-led and focused on government and regulated environments, and
 * this sentence has to hold that focus without excluding the complex commercial
 * organizations the same engineering applies to.
 *
 * It deliberately no longer closes on "the same engineers behind aerospace,
 * defense, and federal systems". That framing came out of the hero, and leaving
 * it here would keep the defense-credibility pitch alive in a second constant
 * that two surfaces still render.
 *
 * The four named industries are the market, stated in the same order and words
 * as `INDUSTRY_GROUPS`. Say nothing here that reads as a client list — this
 * sentence describes who the work is for, not who has bought it.
 */
export const AUDIENCE =
  "Built for public agencies and complex organizations, across four industries: public safety; infrastructure and utilities; federal, state, and local government; and defense and aerospace.";

export interface NavLink {
  label: string;
  href: string;
  /** One line, shown in the dropdown. Says what the section is for. */
  hint: string;
  /** Set only where the items genuinely are a sequence. */
  index?: string;
  /** Renders below a rule, as a secondary route out of the panel. */
  secondary?: boolean;
  /**
   * Leaves the site. Renders as a plain anchor in a new tab rather than a
   * `next/link`, on every surface `NAV` feeds — see `components/NavItemLink`.
   */
  external?: boolean;
  /**
   * `data-rf-event` for an item worth counting on its own. Most navigation is
   * not; an item that is gets a name here rather than an inline string.
   */
  event?: RfEvent;
}

export interface NavGroup {
  label: string;
  href: string;
  items: NavLink[];
}

/**
 * Four routes, each with its own sections. The group label is a real link to
 * the landing route, so navigation works with the dropdown closed — or absent.
 *
 * Service hints mirror `STAGES[].promise` in `lib/content/stages.ts`; industry
 * items mirror `INDUSTRY_GROUPS[].hint`. Both are repeated rather than imported
 * so this module stays free of content imports, and both are short enough that
 * drift would be obvious.
 *
 * Industries sits second, ahead of Insights and Company, because it is the
 * group a visitor self-selects into and everything after it is evidence.
 *
 * Its items are the four **groups**, not the thirteen sectors underneath them.
 * The panel is single column by design (see `docs/DESIGN.md`), so thirteen
 * items with hints would run past the fold; the sectors are named on
 * `/industries` and on each group page, which is where someone searching for
 * "corrections" finds the word.
 */
export const NAV: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    items: [
      {
        index: "01",
        label: "Discover",
        href: "/services#discover",
        hint: "Find the AI work worth funding",
      },
      {
        index: "02",
        label: "Implement",
        href: "/services#implement",
        hint: "Build and ship the real system",
      },
      {
        index: "03",
        label: "Scale",
        href: "/services#scale",
        hint: "Operate it, then hand you the keys",
      },
      {
        label: "Free assessment",
        href: "/services#assessment",
        hint: "Start with a no-cost read",
        secondary: true,
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    items: [
      {
        label: "Public Safety",
        href: "/industries/public-safety",
        hint: "Law enforcement, fire & EMS, corrections, dispatch",
      },
      {
        label: "Infrastructure & Utilities",
        href: "/industries/infrastructure-utilities",
        hint: "Power, water and wastewater, public works",
      },
      {
        label: "Federal, State & Local Government",
        href: "/industries/federal-state-local",
        hint: "Federal, state, and local agencies, records, risk",
      },
      {
        label: "Defense & Aerospace",
        href: "/industries/defense-aerospace",
        hint: "Aerospace, defense, federal contractors",
      },
      // No free-assessment item here. It sits under Services and as the header's
      // primary CTA, and a third copy in this panel made the offer read as the
      // thing we lead with in every sector rather than the one route into the
      // work. Removing it here takes it out of the footer column too, which is
      // the same decision.
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    items: [
      {
        label: "Case studies",
        href: "/insights#case-studies",
        hint: "Our own engagements, anonymized",
      },
      {
        label: "Reports & Guides",
        href: "/insights/reports",
        hint: "Written research, with an audio version",
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    items: [
      {
        label: "About",
        href: "/company#about",
        hint: "Who you would be working with",
      },
      {
        label: "Manifesto",
        href: "/company#manifesto",
        hint: "What we will and will not do",
      },
      // Its own route rather than the `/company#contact` anchor it used to be.
      // The form is the destination now, and an anchor into the middle of
      // another page is a weak thing to point every contact CTA at.
      {
        label: "Contact",
        href: CONTACT_PATH,
        hint: "Tell us what you are building",
      },
      {
        label: "Capability statement ↗",
        href: CAPABILITY_STATEMENT_HREF,
        hint: "The one-page overview, as a PDF",
        secondary: true,
        external: true,
        event: RF_EVENTS.capabilityStatementOpened,
      },
    ],
  },
];

/**
 * The static top-level routes.
 *
 * Nothing reads this. `app/sitemap.ts` holds the list that actually ships,
 * because it carries per-route priorities and the dynamic report URLs too.
 * Kept in step rather than deleted so a stale copy cannot mislead anyone who
 * finds it first — if it ever gains a consumer, that consumer should be
 * `app/sitemap.ts` rather than a second source.
 */
export const ROUTES = [
  "/",
  "/services",
  "/industries",
  "/insights",
  "/insights/reports",
  "/company",
  CONTACT_PATH,
] as const;
