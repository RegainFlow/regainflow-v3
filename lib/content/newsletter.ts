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
  heading: "New field notes, by email.",
  body: "Each new post and report from the engineers doing the work, sent when it is published. Nothing else, and one click to leave.",
  label: "Subscribe",
} as const;

/** How long a confirmation link stays valid. Stated in the email too. */
export const CONFIRM_WINDOW_DAYS = 7;
