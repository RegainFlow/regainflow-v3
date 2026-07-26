import Image from "next/image";

import { LOCATION, NAV_ITEMS } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-rf-void">
      <div className="rf-shell pt-16 md:pt-20">
        <div className="rf-grid gap-y-12 border-t border-rf-hairline pt-12">
          <div className="col-span-full lg:col-span-5">
            <p className="flex items-center gap-2.5">
              <Image
                src="/brand/regainflow-mark.png"
                alt=""
                width={1024}
                height={1024}
                className="h-7 w-auto"
              />
              <span className="rf-wordmark text-[1.0625rem]">RegainFlow</span>
            </p>
            <p className="rf-body mt-4 max-w-[34ch]">
              AI systems engineering, from ambition to operation.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="col-span-full sm:col-span-6 lg:col-span-3"
          >
            <p className="rf-utility">Sections</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="rf-nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="rf-nav-link">
                  Map an AI opportunity
                </a>
              </li>
            </ul>
          </nav>

          {/* The address is reachable through the mailto CTA, not printed here. */}
          <div className="col-span-full sm:col-span-6 lg:col-span-4">
            <p className="rf-utility">Location</p>
            <p className="rf-body mt-4">{LOCATION}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-rf-hairline pt-6">
          <p className="rf-utility">&copy; {year} RegainFlow</p>
          <a href="#top" className="rf-nav-link">
            Back to top &uarr;
          </a>
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
