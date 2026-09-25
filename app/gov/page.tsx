import type { Metadata } from "next";
import Image from "next/image";

import LogoTile from "@/components/gov/LogoTile";
import { RF_EVENTS } from "@/lib/analytics/events";
import {
  GOV_IDENTIFIERS,
  GOV_LOCATION,
  NAICS_CODES,
  PAST_PERFORMANCE,
  PAST_PERFORMANCE_NOTE,
  POINTS_OF_CONTACT,
  isVisible,
} from "@/lib/content/gov";
import { GOV_CAPABILITY_PDF, GOV_PAST_PERFORMANCE_PDF, GOV_PREVIEWS } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "RegainFlow | Capability Statement & Past Performance" },
  alternates: { canonical: "/" },
};

const naicsTitle = (code: string) =>
  NAICS_CODES.find((n) => n.code === code)?.title ?? "";

/**
 * gov.regainflow.com — one page, laid out the way a contracting officer reads
 * a vendor: identifiers first, then past performance, with the capability
 * statement beside it as the actual PDF. Nothing to click through to.
 *
 * Also the source of the past performance PDF: `pnpm gov:pdf` prints this
 * page. The print stylesheet drops the capability statement column and the
 * reference section (`.rf-print-hide`) and sets the entries as a one-page 2×2
 * sheet, so the printed file is the past performance alone.
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
          {/* Past performance, left. */}
          <div className="col-span-full lg:col-span-7">
            <h2 className="rf-h2">Past performance</h2>
            <p className="rf-body mt-3 max-w-[60ch]">{PAST_PERFORMANCE_NOTE}</p>

            <div className="rf-pp-list mt-8">
              {entries.map((pp) => (
                <article key={pp.customer} className="rf-pp">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    {pp.logo ? <LogoTile logo={pp.logo} name={pp.customer} size="sm" /> : null}
                    <div>
                      <h3 className="rf-h3">{pp.customer}</h3>
                      {pp.customerFull ? (
                        <p className="rf-body text-sm">{pp.customerFull}</p>
                      ) : null}
                    </div>
                    {pp.draft ? <span className="rf-tag">Draft, dev only</span> : null}
                  </div>

                  <dl className="rf-doc-facts mt-5">
                    <div>
                      <dt>Performed by</dt>
                      <dd>{pp.deliveredBy}</dd>
                    </div>
                    {pp.role ? (
                      <div>
                        <dt>Role</dt>
                        <dd>{pp.role}</dd>
                      </div>
                    ) : null}
                    {pp.period ? (
                      <div>
                        <dt>Period of performance</dt>
                        <dd>{pp.period}</dd>
                      </div>
                    ) : null}
                    {pp.naics?.length ? (
                      <div>
                        <dt>NAICS</dt>
                        <dd>
                          {pp.naics.map((code) => (
                            <span key={code} className="block">
                              <span className="font-mono">{code}</span>{" "}
                              <span className="text-rf-slate">{naicsTitle(code)}</span>
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <p className="rf-utility mt-5">Scope</p>
                  <p className="rf-body mt-2">
                    <span className="text-rf-warm">{pp.title}.</span> {pp.overview}
                  </p>

                  {pp.work.length > 0 ? (
                    <ul className="rf-doc-list mt-4">
                      {pp.work.map((line) => (
                        <li key={line} className="rf-body">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          {/* Capability statement, right: the PDF itself, as an image so it
              renders on any device. Sticky, so it stays beside the list. */}
          <aside className="rf-print-hide col-span-full lg:col-span-5">
            <div className="lg:sticky lg:top-28">
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
                  sizes="(min-width: 1024px) 36vw, 92vw"
                  priority
                />
              </a>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={GOV_CAPABILITY_PDF}
                  download="RegainFlow_Capability_Statement_2026.pdf"
                  className="rf-cta-primary justify-center"
                  data-rf-event={RF_EVENTS.govPdfDownloaded}
                  data-rf-document="capability_statement"
                  data-rf-location="gov"
                >
                  Download capability statement (PDF)
                </a>
                <a
                  href={GOV_PAST_PERFORMANCE_PDF}
                  download="RegainFlow_Past_Performance_2026.pdf"
                  className="rf-cta-secondary justify-center"
                  data-rf-event={RF_EVENTS.govPdfDownloaded}
                  data-rf-document="past_performance"
                  data-rf-location="gov"
                >
                  Download past performance (PDF)
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="rf-section rf-print-hide">
        <div className="rf-shell py-10 md:py-12">
          <h2 className="rf-h3">NAICS codes</h2>
          <dl className="rf-doc-codes rf-doc-codes-2 mt-5">
            {NAICS_CODES.map((c) => (
              <div key={c.code}>
                <dt>{c.code}</dt>
                <dd className="rf-body">{c.title}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
