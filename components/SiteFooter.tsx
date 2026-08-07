import Link from "next/link";

import AskAi from "@/components/AskAi";
import NavItemLink from "@/components/NavItemLink";
import { LOCATION, NAV, TAGLINE } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-rf-void">
      <div className="rf-shell pt-16 md:pt-20">
        <div className="rf-grid gap-y-12 border-t border-rf-hairline pt-12">
          <div className="col-span-full lg:col-span-4">
            <Link href="/" className="flex items-center">
              <span className="rf-wordmark rf-wordmark-3d">RegainFlow</span>
            </Link>
            <p className="rf-body mt-4 max-w-[34ch]">{TAGLINE}</p>
            <p className="rf-utility mt-8">Location</p>
            <p className="rf-body mt-3">{LOCATION}</p>
          </div>

          {NAV.map((group) => (
            <nav
              key={group.href}
              aria-label={group.label}
              className="col-span-full sm:col-span-4 lg:col-span-2 lg:col-start-auto"
            >
              <p className="rf-utility">
                <Link href={group.href} className="rf-nav-link">
                  {group.label}
                </Link>
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavItemLink item={item} className="rf-nav-link">
                      {item.label}
                    </NavItemLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* One closing block under a single rule — the assistant links and the
            legal line read as the same shelf of the footer rather than two
            stacked bands. */}
        <div className="mt-14 border-t border-rf-hairline pt-6">
          <AskAi />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="rf-utility">&copy; {year} RegainFlow</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {/* Linked here rather than in the nav: it is written for machines,
                  and a visitor who wants it is already looking for the fine
                  print. It still needs a crawlable link to be found. */}
              <Link href="/llm-info" className="rf-nav-link">
                AI fact sheet
              </Link>
              <Link href="/company#contact" className="rf-nav-link">
                Contact us &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* textLength pins the wordmark to exactly the container width at any
          viewport, and the short viewBox crops it on the baseline. */}
      <div className="rf-watermark" aria-hidden="true">
        {/* Measured in-browser: all-caps REGAINFLOW is 1096 units at font-size
            182, so 166 puts its natural width at ~1000 and textLength then
            adjusts by almost nothing rather than distorting the tracking.
            y = 126 sits the caps (~116 tall) on the bottom edge. */}
        <svg viewBox="0 0 1000 126" focusable="false">
          <text
            x="0"
            y="126"
            fontSize="166"
            textLength="1000"
            lengthAdjust="spacing"
          >
            REGAINFLOW
          </text>
        </svg>
      </div>
    </footer>
  );
}
