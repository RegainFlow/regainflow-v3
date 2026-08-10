import Link from "next/link";

import SiteNav from "@/components/SiteNav";
import { RF_EVENTS } from "@/lib/analytics/events";
import { BOOK_CTA, BOOKING_HREF } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rf-hairline bg-rf-void/90 backdrop-blur-[2px]">
      <div className="rf-shell flex h-16 items-center justify-between gap-4 md:h-20 md:gap-10">
        {/* No separate glyph: the whole word carries the mark's extrusion, so
            the wordmark *is* the logo. */}
        <Link href="/" className="flex items-center" aria-label="RegainFlow — home">
          <span className="rf-wordmark rf-wordmark-3d">RegainFlow</span>
        </Link>

        <SiteNav
          cta={
            <a
              href={BOOKING_HREF}
              className="rf-cta-primary rf-cta-compact"
              data-rf-event={RF_EVENTS.bookingClicked}
              data-rf-location="header"
            >
              {BOOK_CTA}
            </a>
          }
        />
      </div>
    </header>
  );
}
