import type { Metadata } from "next";
import Link from "next/link";

import ClosingCTA from "@/components/ClosingCTA";
import DitherReveal from "@/components/DitherReveal";
import PageHeader from "@/components/PageHeader";
import { INDUSTRY_GROUPS } from "@/lib/content/industries";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries",
  description:
    "AI systems for public safety, utilities and water, county and state government, and the defense and aerospace organizations we came from. Four groups, thirteen sectors, and the case studies behind each.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="We install the AI systems public agencies run on."
        lead="Four groups, and the case studies behind each one. If your sector is here, the page for it says where the work usually stalls and what we would build instead."
      />

      {/* Each group anchors on its own slug, because the navigation dropdown
          points at these pages directly and the footer and mobile panel share
          that tree. The `id` is kept anyway so a link written as an anchor
          still lands somewhere real. */}
      {INDUSTRY_GROUPS.map((group, groupIndex) => (
        <section
          key={group.slug}
          id={group.slug}
          className={`rf-section ${groupIndex % 2 === 1 ? "bg-rf-navy" : ""}`}
        >
          <div className="rf-shell py-14 md:py-18 lg:py-22">
            <div className="rf-grid gap-y-6">
              <div className="col-span-full lg:col-span-5">
                <p className="rf-eyebrow">{group.hint}</p>
                <h2 className="rf-h2 mt-5 max-w-[20ch]">
                  <Link
                    href={`/industries/${group.slug}`}
                    className="rf-nav-link"
                  >
                    {group.name}
                  </Link>
                </h2>
              </div>

              <p className="rf-body col-span-full max-w-[52ch] lg:col-span-6 lg:col-start-7 lg:pt-3">
                {group.lead}
              </p>
            </div>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {group.industries.map((industry, i) => (
                <li key={industry.name} className="h-full">
                  <DitherReveal className="h-full" delay={(i % 4) * 90}>
                    {/* Not a link. Sectors have no route of their own yet, and
                        a card that looks clickable and is not is worse than a
                        card that plainly is not — the group link above is the
                        one destination this band has. */}
                    <div className="rf-card">
                      <h3 className="rf-h3">{industry.name}</h3>
                      <p className="rf-body mt-3">{industry.detail}</p>
                    </div>
                  </DitherReveal>
                </li>
              ))}
            </ul>

            <p className="mt-10">
              <Link
                href={`/industries/${group.slug}`}
                className="rf-cta-secondary"
              >
                {group.name} in full
              </Link>
            </p>
          </div>
        </section>
      ))}

      <ClosingCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Industries", "/industries")),
        }}
      />
    </>
  );
}
