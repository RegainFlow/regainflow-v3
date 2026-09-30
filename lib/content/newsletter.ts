/**
 * What the newsletter promises, in one place, so the signup blocks and the
 * confirmation pages cannot drift apart.
 *
 * The UX research is specific (`docs/blogs_seo/blog_ui_ux.md`, Part 6.2): one
 * field, and a specific promise of topic and frequency. It also says to show
 * a subscriber count only if it is honest, so there is none. **Say nothing
 * here about cadence that the sending schedule does not keep.**
 *
 * Import-free, like the other `lib/content` modules.
 */
export const NEWSLETTER = {
  eyebrow: "Newsletter",
  heading: "Get new posts by email.",
  body: "We send each new post and report when it is published, and nothing else. Every email has a one-click unsubscribe.",
  label: "Subscribe",
} as const;

/** How long a confirmation link stays valid. Stated in the email too. */
export const CONFIRM_WINDOW_DAYS = 7;
