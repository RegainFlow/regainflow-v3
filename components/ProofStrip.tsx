import Link from "next/link";

import AsciiField from "@/components/brand/AsciiField";
import CaseStudyCard from "@/components/CaseStudyCard";
import DitherReveal from "@/components/DitherReveal";
import {
  CASE_STUDIES,
  EXPERIENCE_DISCLAIMER,
  HEADLINE_FIGURES,
  HOME_SLUGS,
} from "@/lib/content/case-studies";

/** Two, not the six `/insights` leads with — this is a teaser, not the list. */
const FEATURED = CASE_STUDIES.filter((study) =>
  HOME_SLUGS.includes(study.slug),
);

/** Proof on the home page without duplicating `/insights`: totals, two
 *  examples, and a way through. */
export default function ProofStrip() {
  return (
    <section className="rf-section relative isolate overflow-clip bg-rf-navy">
      {/* The wave, once more and almost imperceptibly. The hero carries it
          loudly; this is the only echo, so it reads as the identity rather
          than a hero effect. */}
      <AsciiField className="rf-ascii-field rf-ascii-echo" animate={false} />

      <div className="rf-shell relative z-10 py-14 md:py-16">
        <div className="rf-grid gap-y-10">
          <div className="col-span-full lg:col-span-5">
            <p className="rf-eyebrow">Delivered</p>
            <h2 className="rf-h2 mt-5 max-w-[18ch]">
              Systems in production, not slideware.
            </h2>
            <Link href="/insights#case-studies" className="rf-nav-link mt-6 inline-block">
              All case studies &rarr;
            </Link>
          </div>

          <dl className="col-span-full grid gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {HEADLINE_FIGURES.map((figure) => (
              <div key={figure.label} className="border-t border-rf-hairline pt-4">
                <dt className="rf-utility">{figure.label}</dt>
                <dd className="rf-stat mt-3">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The figures above are RegainFlow's own; the two studies below are
            founder work elsewhere. Without this line between them, "18+ client
            transformations delivered" reads as a caption for the cards. */}
        <p className="rf-body mt-12 max-w-[62ch] border-t border-rf-hairline pt-6">
          {EXPERIENCE_DISCLAIMER}
        </p>

        {/* The same card `/insights` renders, rather than a second inline
            version that has to be kept in sync by hand. */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {FEATURED.map((study, i) => (
            <li key={study.slug} className="h-full">
              <DitherReveal className="h-full" delay={i * 90}>
                <CaseStudyCard study={study} />
              </DitherReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
