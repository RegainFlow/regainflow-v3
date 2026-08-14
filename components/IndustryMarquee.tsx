import Link from "next/link";

import {
  GROUP_BY_INDUSTRY,
  INDUSTRY_NAMES,
} from "@/lib/content/industries";

/**
 * Who the site is for, said once and kept moving.
 *
 * The list is duplicated so a single CSS translation of -50% loops seamlessly.
 * `aria-hidden` on the copy keeps a screen reader from hearing every industry
 * twice — and it is also why only the first track carries links, since a
 * duplicated set of focusable anchors would put thirteen invisible tab stops in
 * the middle of the page. No JavaScript: the animation is declarative and
 * pauses on hover.
 */
export default function IndustryMarquee() {
  return (
    <div className="rf-marquee">
      {/* The tail drops below 30rem — at 375px the full label took roughly half
          the row and left the industries themselves inside the edge fade. */}
      <p className="rf-utility rf-marquee-label">
        Industries<span className="rf-marquee-label-tail"> we serve</span>
      </p>

      <div className="rf-marquee-viewport">
        <ul className="rf-marquee-track">
          {INDUSTRY_NAMES.map((name) => (
            <li key={name}>
              {/* Not `.rf-nav-link` — it sets its own `font-size` and
                  `padding-block`, which would break the row out of the mono
                  utility scale the track establishes. `.rf-marquee-link`
                  inherits both and only adds the hover colour. */}
              <Link
                href={`/industries/${GROUP_BY_INDUSTRY[name].slug}`}
                className="rf-marquee-link"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="rf-marquee-track" aria-hidden="true">
          {INDUSTRY_NAMES.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
