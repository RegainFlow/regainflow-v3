import Link from "next/link";

import SiteNav from "@/components/SiteNav";
import { RF_EVENTS } from "@/lib/analytics/events";
import { FREE_ASSESSMENT_CTA, FREE_ASSESSMENT_HREF } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rf-hairline bg-rf-void/90 backdrop-blur-[2px]">
      {/* `lg`, not `md`, and this is load-bearing rather than tidiness. The
          burger and the portalled mobile panel now show up to 1024px, and
          `.rf-mobile-nav` pins itself at `top: 4rem` with no breakpoint of its
          own. A header that grew to 5rem at 768px would leave the panel
          starting an inch under the header it replaced, painting over the
          wordmark and the burger on a layer portalled to `body`. One
          breakpoint governs the whole mobile-nav story: `SiteNav`'s utilities,
          its `matchMedia`, and this height. */}
      <div className="rf-shell flex h-16 items-center justify-between gap-4 lg:h-20 lg:gap-10">
        {/* No separate glyph: the whole word carries the mark's extrusion, so
            the wordmark *is* the logo. */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="RegainFlow — home"
        >
          <span className="rf-wordmark rf-wordmark-3d">RegainFlow</span>
        </Link>

        <SiteNav
          cta={
            <a
              href={FREE_ASSESSMENT_HREF}
              className="rf-cta-primary rf-cta-compact"
              data-rf-event={RF_EVENTS.bookingClicked}
              data-rf-location="header"
            >
              {FREE_ASSESSMENT_CTA}
            </a>
          }
        />
      </div>
    </header>
  );
}
