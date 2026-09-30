import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";
import type { BlogCta } from "@/lib/content/blog";
import { FREE_ASSESSMENT_CTA, FREE_ASSESSMENT_HREF } from "@/lib/site";

/**
 * A post's own next step.
 *
 * Post-specific rather than generic because that is the one conversion pattern
 * with real support in `docs/blogs_seo/blog_ui_ux.md` (Part 6.2): an offer that
 * matches what the reader just read, placed after the first section *and* at
 * the end. Most readers never reach the end, so the inline one is not a
 * duplicate — it is the one most of them see.
 *
 * Never a modal, never covering content: Google treats that as an intrusive
 * interstitial on pages that receive search traffic.
 */
const DEFAULT_CTA: BlogCta = {
  eyebrow: "Free assessment",
  heading: "Have a pilot that stalled, or one about to start?",
  body: "We will look at what you are trying to put into production and tell you plainly what it will take.",
  label: FREE_ASSESSMENT_CTA,
  href: FREE_ASSESSMENT_HREF,
};

export default function PostCTA({
  cta = DEFAULT_CTA,
  placement,
}: {
  cta?: BlogCta;
  placement: "inline" | "end";
}) {
  const external = cta.href.startsWith("https://");
  const props = {
    className: "rf-cta-primary",
    "data-rf-event": RF_EVENTS.blogCtaClicked,
    "data-rf-location": `blog_${placement}`,
    "data-rf-target": cta.href,
  };

  return (
    <aside
      className={placement === "inline" ? "rf-post-cta" : "rf-post-cta rf-post-cta-end"}
      aria-label={cta.eyebrow}
    >
      <p className="rf-eyebrow">{cta.eyebrow}</p>
      <p className={placement === "inline" ? "rf-h3 mt-3" : "rf-h2 mt-4 max-w-[24ch]"}>
        {cta.heading}
      </p>
      <p className="rf-post-cta-body">{cta.body}</p>
      <p className="mt-6">
        {external ? (
          <a href={cta.href} {...props}>
            {cta.label}
          </a>
        ) : (
          <Link href={cta.href} {...props}>
            {cta.label}
          </Link>
        )}
      </p>
    </aside>
  );
}
