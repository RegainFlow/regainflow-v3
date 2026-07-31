import { INDUSTRIES } from "@/lib/content/industries";

/**
 * Who the site is for, said once and kept moving.
 *
 * The list is duplicated so a single CSS translation of -50% loops seamlessly.
 * `aria-hidden` on the copy keeps a screen reader from hearing every industry
 * twice. No JavaScript: the animation is declarative and pauses on hover.
 */
export default function IndustryMarquee() {
  return (
    <div className="rf-marquee">
      {/* The tail drops below 30rem — at 375px the full label took roughly half
          the row and left the industries themselves inside the edge fade. */}
      <p className="rf-utility rf-marquee-label">
        Industries<span className="rf-marquee-label-tail"> we support</span>
      </p>

      <div className="rf-marquee-viewport">
        <ul className="rf-marquee-track">
          {INDUSTRIES.map((industry) => (
            <li key={industry}>{industry}</li>
          ))}
        </ul>
        <ul className="rf-marquee-track" aria-hidden="true">
          {INDUSTRIES.map((industry) => (
            <li key={industry}>{industry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
