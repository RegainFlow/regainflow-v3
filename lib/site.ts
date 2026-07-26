export const CONTACT_EMAIL = "leonardo.j.ramirez7@regainflow.com";

/**
 * No scheduling destination is configured for this project, so the primary
 * action falls back to a pre-structured mail draft.
 */
export const CONTACT_HREF =
  "mailto:leonardo.j.ramirez7@regainflow.com?subject=Map%20an%20AI%20opportunity&body=Organization%3A%0AWhat%20are%20you%20trying%20to%20move%20into%20production%3F%0ATimeline%3A";

export const PRIMARY_CTA = "Map an AI opportunity";

/**
 * Section anchors for the one-page build.
 *
 * `#work` is absent: the Experience in Practice proof point is not cleared for
 * publication. `#services` is absent too — the What We Engineer section was cut,
 * and a nav item pointing at nothing is worse than one fewer link.
 */
export const NAV_ITEMS = [
  { label: "Approach", href: "#approach" },
  { label: "Company", href: "#company" },
] as const;

export const LOCATION = "Orlando, Florida";
