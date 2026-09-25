import type { Metadata } from "next";

import DocumentPage from "@/components/gov/DocumentPage";
import LogoTile from "@/components/gov/LogoTile";
import {
  NAICS_CODES,
  PAST_PERFORMANCE,
  PAST_PERFORMANCE_LEAD,
  PAST_PERFORMANCE_TITLE,
  POINTS_OF_CONTACT,
  isVisible,
} from "@/lib/content/gov";
import { GOV_PAST_PERFORMANCE_PDF, GOV_PREVIEWS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Past Performance",
  description:
    "RegainFlow past performance: MSTS, Pratt & Whitney, Lockheed Martin, and U.S. Army — secure AI, aerospace, and defense work delivered by RegainFlow and its founders.",
  alternates: { canonical: "/past-performance" },
};

const naicsTitle = (code: string) =>
  NAICS_CODES.find((n) => n.code === code)?.title ?? "";

export default function PastPerformancePage() {
  const entries = PAST_PERFORMANCE.filter(isVisible);

  return (
    <DocumentPage
      eyebrow="Past performance"
      title={PAST_PERFORMANCE_TITLE}
      lead={PAST_PERFORMANCE_LEAD}
      pdf={GOV_PAST_PERFORMANCE_PDF}
      fileName="RegainFlow_Past_Performance_2026.pdf"
      document="past_performance"
      preview={GOV_PREVIEWS.pastPerformance}
      pages="One page"
    >
      {/* A wrapper for print only, where the entries become a 2×2 grid so the
          sheet stays one page. On screen it is transparent. */}
      <div className="rf-pp-list">
        {entries.map((pp, i) => (
          <article key={pp.customer} className="rf-section rf-doc-entry">
            <div className="rf-shell rf-grid gap-y-8 py-12 md:py-16">
              <div className="col-span-full lg:col-span-4">
                {pp.logo ? (
                  <LogoTile logo={pp.logo} name={pp.customer} />
                ) : null}
                <p className="rf-index mt-6">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="rf-h2 mt-3">{pp.customer}</h2>
                {pp.customerFull ? (
                  <p className="rf-body mt-2">{pp.customerFull}</p>
                ) : null}
                {pp.draft ? (
                  <p className="rf-tag mt-4 inline-block">Draft — dev only</p>
                ) : null}

                <dl className="rf-doc-facts mt-8">
                  <div>
                    <dt>Delivered by</dt>
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
                      <dt>Period</dt>
                      <dd>{pp.period}</dd>
                    </div>
                  ) : null}
                  {pp.naics?.length ? (
                    <div>
                      <dt>NAICS</dt>
                      <dd>
                        {pp.naics.map((code) => (
                          <span key={code} className="block">
                            {code}{" "}
                            <span className="text-rf-slate">
                              {naicsTitle(code)}
                            </span>
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="col-span-full lg:col-span-8">
                <h3 className="rf-h3">{pp.title}</h3>
                <p className="rf-body mt-4 max-w-[68ch]">{pp.overview}</p>

                {pp.work.length > 0 ? (
                  <>
                    <p className="rf-utility mt-8">Work performed</p>
                    <ul className="rf-doc-list mt-4 max-w-[68ch]">
                      {pp.work.map((line) => (
                        <li key={line} className="rf-body">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <ul className="rf-tags mt-8">
                  {pp.capabilities.map((cap) => (
                    <li key={cap} className="rf-tag">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rf-section rf-doc-entry">
        <div className="rf-shell py-12 md:py-16">
          <p className="rf-eyebrow">Points of contact</p>
          <ul className="mt-6 flex flex-wrap gap-x-16 gap-y-6">
            {POINTS_OF_CONTACT.map((poc) => (
              <li key={poc.email}>
                <p className="text-rf-warm">{poc.name}</p>
                <p className="rf-utility mt-1">{poc.role}</p>
                <a
                  href={`mailto:${poc.email}`}
                  className="rf-text-link mt-2 inline-block text-sm"
                >
                  {poc.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </DocumentPage>
  );
}
