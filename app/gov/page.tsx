import type { Metadata } from "next";
import Image from "next/image";

import LogoTile from "@/components/gov/LogoTile";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  BUSINESS_CLASSIFICATIONS,
  GOV_IDENTIFIERS,
  GOV_LOCATION,
  NAICS_CODES,
  PAST_PERFORMANCE,
  POINTS_OF_CONTACT,
  PSC_CODES,
  isVisible,
} from "@/lib/content/gov";
import { GOV_CAPABILITY_PDF, GOV_PREVIEWS } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "RegainFlow | Capability Statement & Past Performance" },
  alternates: { canonical: "/" },
};

/**
 * gov.regainflow.com — one page, laid out the way a contracting officer reads
 * a vendor: identifiers first, then past performance, with the capability
 * statement beside it as the actual PDF. Nothing to click through to.
 *
 * Printing the page (`.rf-print-hide` in `globals.css`) drops the capability
 * statement column, the full descriptions, and the NAICS and PSC lists, leaving company
 * data, the past performance one-liners, and business classifications on one
 * sheet.
 */
export default function GovPage() {
  const entries = PAST_PERFORMANCE.filter(isVisible);

  return (
    <>
      {/* The printed sheet has no site header, so it carries a masthead. */}
      <div className="rf-print-only rf-shell">
        <div className="flex items-baseline justify-between border-b border-rf-hairline pb-3">
          <span className="rf-wordmark">RegainFlow</span>
          <span className="rf-utility">gov.regainflow.com</span>
        </div>
      </div>

      {/* Company data. The block a contracting officer checks against SAM.gov
          before reading anything else. */}
      <section className="rf-section">
        <div className="rf-shell py-10 md:py-12">
          {/* The printed sheet's masthead already names the company. */}
          <div className="rf-print-hide mb-8">
            <p className="rf-eyebrow">Capability statement &amp; past performance</p>
            <h1 className="rf-h1 mt-4">RegainFlow</h1>
          </div>

          <dl className="rf-gov-facts">
            {GOV_IDENTIFIERS.map((id) => (
              <div key={id.label}>
                <dt>{id.label}</dt>
                <dd className="font-mono">{id.value}</dd>
              </div>
            ))}
            <div>
              <dt>Primary NAICS</dt>
              <dd>
                <span className="font-mono">{NAICS_CODES[0].code}</span>{" "}
                <span className="text-rf-slate">{NAICS_CODES[0].title}</span>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{GOV_LOCATION}</dd>
            </div>
            {POINTS_OF_CONTACT.map((poc) => (
              <div key={poc.email}>
                <dt>Point of contact</dt>
                <dd>
                  {poc.name}, {poc.role}
                  <a href={`mailto:${poc.email}`} className="rf-text-link block text-sm">
                    {poc.email}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-12 py-10 md:py-12">
          {/* Past performance, left. The one-liner is the scope; the expanded
              description is one click away and never printed. */}
          <div className="col-span-full lg:col-span-5">
            <h2 className="rf-h2">Past performance</h2>

            <div className="rf-pp-list mt-8">
              {entries.map((pp) => (
                <article key={`${pp.customer}-${pp.program}`} className="rf-pp">
                  <div className="flex items-start gap-5">
                    {pp.logo ? <LogoTile logo={pp.logo} name={pp.customer} size="sm" /> : null}
                    <div className="min-w-0">
                      <h3 className="rf-h3">
                        {pp.customer} <span className="text-rf-slate">— {pp.program}</span>
                      </h3>
                      {pp.role ? <p className="rf-utility mt-2">{pp.role}</p> : null}
                      {pp.draft ? <span className="rf-tag mt-2 inline-block">Draft, dev only</span> : null}
                    </div>
                  </div>

                  {/* A labelled segment leads with its program in bold, as the
                      capability statement does. */}
                  {pp.segments.map((seg) => (
                    <p key={seg.summary.slice(0, 40)} className="rf-body mt-4">
                      {seg.label ? <strong className="text-rf-warm">{seg.label}. </strong> : null}
                      {seg.summary}
                    </p>
                  ))}

                  <details className="rf-pp-more rf-print-hide mt-3">
                    <summary>Full description</summary>
                    {pp.segments.map((seg) =>
                      seg.detail.map((para, i) => (
                        <p key={para.slice(0, 40)} className="rf-body mt-3">
                          {seg.label && i === 0 ? (
                            <strong className="text-rf-warm">{seg.label}. </strong>
                          ) : null}
                          {para}
                        </p>
                      )),
                    )}
                  </details>
                </article>
              ))}
            </div>
          </div>

          {/* Capability statement, right, and the wider column: the PDF itself,
              as an image so it renders on any device, sized to be read in
              place rather than downloaded. Not sticky — at this size it is
              taller than most screens, and a pinned sheet would hide its own
              bottom half. */}
          <aside className="rf-print-hide col-span-full lg:col-span-7">
            <div>
              <h2 className="rf-h2">Capability statement</h2>
              <a
                href={GOV_CAPABILITY_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="rf-doc-preview mt-6"
                aria-label="Open the capability statement PDF full size"
                data-rf-event={RF_EVENTS.govPdfViewed}
                data-rf-document="capability_statement"
                data-rf-location="gov"
              >
                <Image
                  src={GOV_PREVIEWS.capabilityStatement.src}
                  alt="RegainFlow capability statement, page one"
                  width={GOV_PREVIEWS.capabilityStatement.width}
                  height={GOV_PREVIEWS.capabilityStatement.height}
                  sizes="(min-width: 1280px) 740px, (min-width: 1024px) 56vw, 92vw"
                  priority
                />
              </a>

              <a
                href={GOV_CAPABILITY_PDF}
                download={GOV_CAPABILITY_PDF.split("/").pop()}
                className="rf-cta-primary mt-6 w-full justify-center"
                data-rf-event={RF_EVENTS.govPdfDownloaded}
                data-rf-document="capability_statement"
                data-rf-location="gov"
              >
                Download capability statement (PDF)
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-10 md:py-12">
          <div className="col-span-full lg:col-span-5">
            <h2 className="rf-h3">Business classifications</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {BUSINESS_CLASSIFICATIONS.map((c) => (
                <li key={c.label}>
                  <p className="text-rf-warm">
                    {c.label}
                    {c.abbreviation ? (
                      <span className="text-rf-slate"> ({c.abbreviation})</span>
                    ) : null}
                  </p>
                  {c.certification ? (
                    <p className="rf-utility mt-1">Certified: {c.certification}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="rf-print-hide col-span-full lg:col-span-7">
            <h2 className="rf-h3">NAICS codes</h2>
            <dl className="rf-doc-codes rf-doc-codes-2 mt-5">
              {NAICS_CODES.map((c) => (
                <div key={c.code}>
                  <dt>{c.code}</dt>
                  <dd className="rf-body">{c.title}</dd>
                </div>
              ))}
            </dl>

            <h2 className="rf-h3 mt-10">PSC codes</h2>
            <dl className="rf-doc-codes rf-doc-codes-2 mt-5">
              {PSC_CODES.map((c) => (
                <div key={c.code}>
                  <dt>{c.code}</dt>
                  <dd className="rf-body">{c.title}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
