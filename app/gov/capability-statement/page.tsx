import type { Metadata } from "next";
import Link from "next/link";

import DocumentPage from "@/components/gov/DocumentPage";
import LogoTile from "@/components/gov/LogoTile";
import {
  CORE_CAPABILITIES,
  DIFFERENTIATORS,
  GOV_FOCUS,
  GOV_OVERVIEW,
  NAICS_CODES,
  PAST_PERFORMANCE,
  POINTS_OF_CONTACT,
  UNSPSC_CODES,
  WHY_REGAINFLOW,
  isVisible,
} from "@/lib/content/gov";
import { GOV_CAPABILITY_PDF, GOV_PREVIEWS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Capability Statement",
  description:
    "RegainFlow's capability statement: core capabilities, differentiators, past performance, NAICS and UNSPSC codes, and points of contact.",
  alternates: { canonical: "/capability-statement" },
};

export default function CapabilityStatementPage() {
  return (
    <DocumentPage
      eyebrow={`Capability statement · ${GOV_FOCUS.label}`}
      title={GOV_FOCUS.statement}
      lead={GOV_OVERVIEW}
      pdf={GOV_CAPABILITY_PDF}
      fileName="RegainFlow_Capability_Statement_2026.pdf"
      document="capability_statement"
      preview={GOV_PREVIEWS.capabilityStatement}
      pages="One page"
    >
      <section className="rf-section">
        <div className="rf-shell py-12 md:py-16">
          <p className="rf-eyebrow">Core capabilities</p>
          <h2 className="rf-h2 mt-4">The system around the model.</h2>
          <div className="rf-grid mt-10 gap-y-10">
            {CORE_CAPABILITIES.map((cap) => (
              <div key={cap.index} className="col-span-full md:col-span-4">
                <p className="rf-index">{cap.index}</p>
                <h3 className="rf-h3 mt-3">{cap.name}</h3>
                <ul className="rf-doc-list mt-5">
                  {cap.points.map((point) => (
                    <li key={point} className="rf-body">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-12 md:py-16">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">Why RegainFlow</p>
            <h2 className="rf-h2 mt-4">{WHY_REGAINFLOW}</h2>
            <ul className="rf-doc-list mt-8">
              {DIFFERENTIATORS.map((line) => (
                <li key={line} className="rf-body">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-full lg:col-span-5">
            <p className="rf-eyebrow">Past performance</p>
            <ul className="mt-6 flex flex-col gap-6">
              {PAST_PERFORMANCE.filter(isVisible).map((pp) => (
                <li key={pp.customer} className="border-l border-rf-hairline pl-5">
                  {pp.logo ? (
                    <span className="mb-3 block">
                      <LogoTile logo={pp.logo} name={pp.customer} size="sm" />
                    </span>
                  ) : null}
                  <p className="rf-h3">{pp.customer}</p>
                  <p className="rf-utility mt-2">{pp.deliveredBy}</p>
                  <p className="rf-body mt-2">{pp.title}</p>
                </li>
              ))}
            </ul>
            <Link href="/past-performance" className="rf-text-link mt-6 inline-block">
              Full past performance &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-12 md:py-16">
          <CodeTable label="NAICS codes" codes={NAICS_CODES} />
          <CodeTable label="UNSPSC codes" codes={UNSPSC_CODES} />

          <div className="col-span-full lg:col-span-4">
            <p className="rf-eyebrow">Points of contact</p>
            <ul className="mt-6 flex flex-col gap-6">
              {POINTS_OF_CONTACT.map((poc) => (
                <li key={poc.email}>
                  <p className="text-rf-warm">{poc.name}</p>
                  <p className="rf-utility mt-1">{poc.role}</p>
                  <a href={`mailto:${poc.email}`} className="rf-text-link mt-2 inline-block text-sm">
                    {poc.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}

function CodeTable({
  label,
  codes,
}: {
  label: string;
  codes: { code: string; title: string }[];
}) {
  return (
    <div className="col-span-full md:col-span-6 lg:col-span-4">
      <p className="rf-eyebrow">{label}</p>
      <dl className="rf-doc-codes mt-6">
        {codes.map((c) => (
          <div key={c.code}>
            <dt>{c.code}</dt>
            <dd className="rf-body">{c.title}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
