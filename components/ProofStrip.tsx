import Link from "next/link";

import AsciiField from "@/components/brand/AsciiField";
import CaseStudyCard from "@/components/CaseStudyCard";
import DitherReveal from "@/components/DitherReveal";
import { CASE_STUDIES } from "@/lib/content/case-studies";

/** Proof on the home page without duplicating `/insights`: totals, two
 *  examples, and a way through. */
export default function ProofStrip() {
  return (
    <section className="rf-section relative isolate overflow-clip bg-rf-navy">
      {/* The wave, once more and almost imperceptibly. The hero carries it
          loudly; this is the only echo, so it reads as the identity rather
          than a hero effect. */}
      <AsciiField className="rf-ascii-field rf-ascii-echo" animate={false} />

      <div className="rf-shell relative z-10 rf-band">
        <div className="rf-grid gap-y-10">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow">Featured case studies</p>
            <h2 className="rf-h2 mt-5 max-w-[18ch]">
              Systems in production, not slideware.
            </h2>
          </div>

          {/* The totals that sat here — estimated value, hours reduced,
              transformations delivered — are gone. They were career figures
              presented as RegainFlow's, and none of them survives the rule that
              a published number has to be one we can explain how we measured
              and defend in a procurement conversation. */}
          <p className="rf-body col-span-full max-w-[50ch] lg:col-span-5 lg:col-start-8 lg:pt-3">
            Our own engagements. Each one says what the problem was, what we
            owned, and what it produced.
          </p>
        </div>

        {/* The same card `/insights` renders, rather than a second inline
            version that has to be kept in sync by hand. */}
        <ul className="mt-12 grid gap-4 border-t border-rf-hairline pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((study, i) => (
            <li key={study.slug} className="h-full">
              <DitherReveal className="h-full" delay={i * 90}>
                <CaseStudyCard study={study} surface="home_proof" />
              </DitherReveal>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link href="/insights#case-studies" className="rf-nav-link">
            All case studies &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
