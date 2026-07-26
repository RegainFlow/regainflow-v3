import Image from "next/image";

import { CONTACT_HREF, NAV_ITEMS, PRIMARY_CTA } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rf-hairline bg-rf-void/90 backdrop-blur-[2px]">
      <div className="rf-shell flex h-16 items-center justify-between gap-4 md:h-20 md:gap-10">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="RegainFlow — back to top"
        >
          <Image
            src="/brand/regainflow-mark.png"
            alt=""
            width={1024}
            height={1024}
            className="h-6 w-auto md:h-7"
          />
          <span className="rf-wordmark text-[1rem] md:text-[1.0625rem]">
            RegainFlow
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="rf-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <a href={CONTACT_HREF} className="rf-cta-primary rf-cta-compact">
          {PRIMARY_CTA}
        </a>
      </div>
    </header>
  );
}
