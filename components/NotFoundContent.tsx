import Link from "next/link";

import TrackOnMount from "@/components/TrackOnMount";
import { RF_EVENTS } from "@/lib/analytics/events";
import { CONTACT_PATH } from "@/lib/site";

/** Where a reader who hit a dead link most likely meant to go. */
const WAYS_BACK = [
  { label: "Services", href: "/services", hint: "What we do, in three stages" },
  { label: "Industries", href: "/industries", hint: "Who we do it for" },
  { label: "Case studies", href: "/insights/case-studies", hint: "Work we delivered" },
  { label: "Reports", href: "/insights/reports", hint: "Research, with an audio version" },
  { label: "Blog", href: "/insights/blog", hint: "Shorter posts by the founders" },
  { label: "Company", href: "/company", hint: "Who we are" },
];

/**
 * The body of the 404 page, shared by `app/not-found.tsx` (an address that
 * matches no route) and `app/(site)/not-found.tsx` (a `notFound()` from a page,
 * such as an unpublished case study).
 *
 * The framework default is a bare line of text with no way back into the site.
 * A reader arriving from a stale link or an old search result leaves; a
 * crawler finds nothing to follow. This gives both the six places they most
 * likely wanted.
 *
 * Counted on arrival: PostHog attaches `$pathname` and `$referrer` to the
 * event, which makes it the list of dead links and who links to them.
 */
export default function NotFoundContent() {
  return (
    <section className="rf-section">
      <TrackOnMount event={RF_EVENTS.notFoundViewed} />

      <div className="rf-shell rf-band-lead">
        <p className="rf-eyebrow">404</p>
        <h1 className="rf-h1 mt-5 max-w-[18ch]">That page is not here.</h1>
        <p className="rf-body mt-6 max-w-[52ch]">
          The link may be old, or the address mistyped. Nothing is broken on
          your end. These are the pages people usually want.
        </p>

        <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {WAYS_BACK.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rf-nav-link"
                data-rf-event={RF_EVENTS.secondaryClicked}
                data-rf-location="not_found"
                data-rf-target={item.href}
              >
                {item.label} &rarr;
              </Link>
              <p className="rf-utility mt-2">{item.hint}</p>
            </li>
          ))}
        </ul>

        <p className="rf-body mt-12 max-w-[52ch]">
          If you followed a link from our own site to get here,{" "}
          <Link
            href={CONTACT_PATH}
            className="rf-nav-link"
            data-rf-event={RF_EVENTS.contactClicked}
            data-rf-location="not_found"
          >
            tell us
          </Link>{" "}
          and we will fix it.
        </p>
      </div>
    </section>
  );
}
