import Link from "next/link";

import DocHeader from "@/components/gov/DocHeader";
import LogoTile from "@/components/gov/LogoTile";
import {
  GOV_FOCUS,
  GOV_OVERVIEW,
  NAICS_CODES,
  PAST_PERFORMANCE,
  POINTS_OF_CONTACT,
  isVisible,
} from "@/lib/content/gov";

const DOCUMENTS = [
  {
    href: "/capability-statement",
    label: "Capability statement",
    hint: "Core capabilities, differentiators, NAICS and UNSPSC codes, and points of contact. One page.",
  },
  {
    href: "/past-performance",
    label: "Past performance",
    hint: `${PAST_PERFORMANCE.filter(isVisible)
      .map((pp) => pp.customer)
      .join(", ")}. One page.`,
  },
];

export default function GovHomePage() {
  return (
    <>
      <DocHeader eyebrow={GOV_FOCUS.label} title={GOV_FOCUS.statement} lead={GOV_OVERVIEW} />

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-6 py-12 md:py-16">
          {DOCUMENTS.map((doc, i) => (
            <Link key={doc.href} href={doc.href} className="rf-card col-span-full md:col-span-6">
              <p className="rf-index">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="rf-h3 mt-3">{doc.label}</h2>
              <p className="rf-body mt-3">{doc.hint}</p>
              <p className="rf-utility mt-auto pt-8">Read online · Download PDF &rarr;</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell py-10 md:py-12">
          <p className="rf-eyebrow">Past performance</p>
          <ul className="mt-6 flex flex-wrap items-center gap-4">
            {PAST_PERFORMANCE.filter(isVisible).map((pp) =>
              pp.logo ? (
                <li key={pp.customer}>
                  <LogoTile logo={pp.logo} name={pp.customer} />
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-12 md:py-16">
          <div className="col-span-full md:col-span-6">
            <p className="rf-eyebrow">NAICS codes</p>
            <dl className="rf-doc-codes mt-6">
              {NAICS_CODES.map((c) => (
                <div key={c.code}>
                  <dt>{c.code}</dt>
                  <dd className="rf-body">{c.title}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-full md:col-span-6">
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
    </>
  );
}
