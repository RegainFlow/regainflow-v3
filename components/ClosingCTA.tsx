import { CONTACT_HREF, PRIMARY_CTA } from "@/lib/site";

export default function ClosingCTA() {
  return (
    <section id="contact" className="rf-section bg-rf-navy">
      <div className="rf-shell rf-grid gap-y-12 py-14 md:py-20 lg:py-24">
        <div className="col-span-full lg:col-span-7">
          <p className="rf-eyebrow">Start with the opportunity</p>

          <h2 className="rf-h2 mt-5">Bring us your ambitions.</h2>

          <p className="rf-lead mt-6 max-w-[50ch]">
            We will help you clarify where to focus, what it will take, and
            whether RegainFlow is the right engineering partner.
          </p>

          <div className="mt-8">
            <a href={CONTACT_HREF} className="rf-cta-primary">
              {PRIMARY_CTA}
            </a>
          </div>
        </div>

        <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:pt-6">
          {/* The three inputs the headline used to name, routed to one place. */}
          <svg
            viewBox="0 0 420 200"
            className="w-full max-w-[420px]"
            aria-hidden="true"
            focusable="false"
          >
            <text className="rf-annotation" x="170" y="45" textAnchor="end">
              AMBITION
            </text>
            <text className="rf-annotation" x="170" y="105" textAnchor="end">
              STALLED PILOT
            </text>
            <text className="rf-annotation" x="170" y="165" textAnchor="end">
              PRODUCTION PROBLEM
            </text>

            <path className="rf-route" d="M178 40 H230 V100" />
            <path className="rf-route" d="M178 100 H230" />
            <path className="rf-route" d="M178 160 H230 V100" />
            <path className="rf-route" d="M230 100 H256" />

            <rect x="227" y="97" width="6" height="6" fill="var(--color-rf-flow)" />
            <path className="rf-head" d="M270 100 L256 93 L256 107 Z" />

            <rect
              x="272"
              y="78"
              width="140"
              height="44"
              fill="var(--color-rf-void)"
              stroke="var(--color-rf-flow)"
              strokeWidth="1.5"
            />
            <text className="rf-annotation" x="342" y="105" textAnchor="middle">
              REGAINFLOW
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
