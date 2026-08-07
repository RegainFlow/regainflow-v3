import { RF_EVENTS, type RfEvent } from "@/lib/analytics/events";

export const SITE_NAME = "RegainFlow";

export const SITE_URL = "https://www.regainflow.com";

export const CONTACT_EMAIL = "contact@regainflow.com";

/** Primary destination for every conversion on the site. */
export const BOOKING_HREF = "https://cal.com/regainflow/schedule";

/**
 * The capability statement, hosted on Supabase storage. The document a federal,
 * defense, or law-enforcement buyer asks for by name, so it gets a real route
 * out of the nav rather than living only in an email attachment.
 *
 * The year is in the filename, which makes replacing it a one-line change here
 * and leaves the superseded edition reachable for anyone holding the old link.
 */
export const CAPABILITY_STATEMENT_HREF =
  "https://wixdxikcuwgcdwhkmtsr.supabase.co/storage/v1/object/public/capability_sheet/RegainFlow_Capability_Statement_2026.pdf";

/**
 * Secondary contact path. Kept as a pre-structured draft so an email arrives
 * with the three things we need in order to reply usefully.
 */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=AI%20transformation%20inquiry&body=Organization%3A%0AWhat%20are%20you%20trying%20to%20move%20into%20production%3F%0ATimeline%3A`;

export const PRIMARY_CTA = "Contact Us";

/**
 * Verified profiles for this organization, in `sameAs` order.
 *
 * This is the entity anchor: it is how an answer engine confirms that the site,
 * the LinkedIn page, and the name in its index are all one organization rather
 * than three. Cheap to add and disproportionately load-bearing, which is why it
 * gets a named constant instead of an inline array.
 *
 * Deliberately empty pending the real URLs — a guessed profile URL that 404s is
 * worse than an absent one, because it asserts an identity we cannot back.
 * `sameAs` below still carries the booking link, so the node stays valid.
 */
export const PROFILES: string[] = [
  // "https://www.linkedin.com/company/regainflow",
  // "https://www.crunchbase.com/organization/regainflow",
];

export const LOCATION = "Orlando, Florida";

export const POSITIONING = "AI transformation partner";

export const TAGLINE = "AI transformation, from ambition to operation.";

/**
 * Who the site is written for. Named in the hero because the first test the
 * page has to pass is "can you tell who we're targeting".
 */
export const AUDIENCE =
  "Built for law enforcement agencies and aerospace manufacturers, and for the defense and federal organizations carrying AI, data, and modernization scope.";

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
 * Three routes, each with its own sections. The group label is a real link to
 * the landing route, so navigation works with the dropdown closed — or absent.
 *
 * Service hints mirror `STAGES[].promise` in `lib/content/stages.ts`; they are
 * repeated rather than imported so this module stays free of content imports,
 * and they are short enough that drift would be obvious.
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
    label: "Insights",
    href: "/insights",
    items: [
      {
        label: "Case studies",
        href: "/insights#case-studies",
        hint: "Selected enterprise AI and platform work",
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    items: [
      { label: "About", href: "/company#about", hint: "Who you would be working with" },
      {
        label: "Manifesto",
        href: "/company#manifesto",
        hint: "What we will and will not do",
      },
      { label: "Contact", href: "/company#contact", hint: "Start the conversation" },
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

export const ROUTES = ["/", "/services", "/insights", "/company"] as const;
