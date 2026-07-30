export const SITE_NAME = "RegainFlow";

export const SITE_URL = "https://www.regainflow.com";

export const CONTACT_EMAIL = "contact@regainflow.com";

/** Primary destination for every conversion on the site. */
export const BOOKING_HREF = "https://cal.com/regainflow/schedule";

/**
 * Secondary contact path. Kept as a pre-structured draft so an email arrives
 * with the three things we need in order to reply usefully.
 */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=AI%20transformation%20inquiry&body=Organization%3A%0AWhat%20are%20you%20trying%20to%20move%20into%20production%3F%0ATimeline%3A`;

export const PRIMARY_CTA = "Contact Us";

export const LOCATION = "Orlando, Florida";

export const POSITIONING = "AI transformation partner";

export const TAGLINE = "AI transformation, from ambition to operation.";

/**
 * Who the site is written for. Named in the hero because the first test the
 * page has to pass is "can you tell who we're targeting".
 */
export const AUDIENCE =
  "Built for aerospace and industrial engineering organizations, and for federal contractors carrying AI, data, and modernization scope.";

export interface NavLink {
  label: string;
  href: string;
  /** One line, shown in the dropdown. Says what the section is for. */
  hint: string;
  /** Set only where the items genuinely are a sequence. */
  index?: string;
  /** Renders below a rule, as a secondary route out of the panel. */
  secondary?: boolean;
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
      {
        // Targets the disclosure itself, which a fragment cannot open — so the
        // hint promises the control, not the contents.
        label: "All engagements",
        href: "/insights#all-work",
        hint: "Open the full list, by category",
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
    ],
  },
];

export const ROUTES = ["/", "/services", "/insights", "/company"] as const;
