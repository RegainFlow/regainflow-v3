import Link from "next/link";

import GovThemeToggle from "@/components/gov/GovThemeToggle";
import { RF_EVENTS } from "@/lib/analytics/events";
import { GOV_IDENTIFIERS, NAICS_CODES } from "@/lib/content/gov";
import { CONTACT_PATH, LOCATION, SITE_URL } from "@/lib/site";

/**
 * gov.regainflow.com's header and footer.
 *
 * Lean on purpose. The reader is a contracting officer or a prime's capture
 * lead who came for two documents, so the marketing nav and its dropdowns are
 * gone. The way back to the main site is one link, not four menus.
 *
 * Paths here have no `/gov` prefix — see `lib/gov-routing.ts` for why they
 * resolve on every host.
 */
const GOV_NAV = [
  { label: "Capability statement", href: "/capability-statement" },
  { label: "Past performance", href: "/past-performance" },
];

export function GovHeader() {
  return (
    <header className="rf-gov-chrome sticky top-0 z-50 border-b border-rf-hairline bg-rf-void/90 backdrop-blur-[2px]">
      <div className="rf-shell flex h-16 items-center justify-between gap-4 lg:h-20 lg:gap-10">
        <Link href="/" className="flex items-baseline gap-3" aria-label="RegainFlow government — home">
          <span className="rf-wordmark rf-wordmark-3d">RegainFlow</span>
          <span className="rf-utility hidden sm:inline">Government</span>
        </Link>

        <nav aria-label="Government" className="flex items-center gap-4 md:gap-8">
          {GOV_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rf-nav-link hidden md:inline">
              {item.label}
            </Link>
          ))}
          <GovThemeToggle />
          <a
            href={`${SITE_URL}${CONTACT_PATH}`}
            className="rf-cta-primary rf-cta-compact"
            data-rf-event={RF_EVENTS.contactClicked}
            data-rf-location="gov"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* The two documents stay one tap away on a phone, where the inline links
          above are hidden. */}
      <nav aria-label="Government documents" className="rf-shell flex gap-6 pb-3 md:hidden">
        {GOV_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="rf-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function GovFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rf-gov-chrome bg-rf-void">
      <div className="rf-shell py-12 md:py-16">
        <div className="rf-grid gap-y-8 border-t border-rf-hairline pt-10">
          <div className="col-span-full lg:col-span-5">
            <span className="rf-wordmark rf-wordmark-3d">RegainFlow</span>
            <p className="rf-body mt-4">{LOCATION}</p>
          </div>

          <dl className="col-span-full grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-7">
            {GOV_IDENTIFIERS.map((id) => (
              <div key={id.label}>
                <dt className="rf-utility">{id.label}</dt>
                <dd className="rf-body mt-2 font-mono text-rf-warm">{id.value}</dd>
              </div>
            ))}
            <div>
              <dt className="rf-utility">Primary NAICS</dt>
              <dd className="rf-body mt-2 font-mono text-rf-warm">{NAICS_CODES[0].code}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rf-hairline pt-6">
          <p className="rf-utility">&copy; {year} RegainFlow</p>
          <a href={SITE_URL} className="rf-nav-link">
            regainflow.com &#8599;
          </a>
        </div>
      </div>
    </footer>
  );
}
