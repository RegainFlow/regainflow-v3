import Image from "next/image";

import FlowField from "@/components/FlowField";
import { CONTACT_HREF, PRIMARY_CTA } from "@/lib/site";

const PILLARS = [
  "AI portfolio and ROI direction",
  "Senior hands-on engineering",
  "Managed AI operations",
];

export default function Hero() {
  return (
    <section className="rf-section relative isolate">
      <FlowField />

      <div className="rf-shell rf-grid relative z-10 items-center gap-y-10 py-12 md:py-14 lg:py-16">
        <div className="col-span-full lg:col-span-5">
          <p className="rf-eyebrow">AI systems engineering partner</p>

          <h1 className="rf-h1 mt-5">
            Turn AI ambition into systems your business can run.
          </h1>

          <p className="rf-lead mt-5 max-w-[44ch]">
            RegainFlow finds the work worth doing, engineers the complete
            production system, and builds the operating capability your team
            needs to move from decision to production with less delivery
            risk&mdash;and retain ownership over time.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={CONTACT_HREF} className="rf-cta-primary">
              {PRIMARY_CTA}
            </a>
            {/* Not "See how we work" — that now names the Company section. */}
            <a href="#approach" className="rf-cta-secondary">
              See the path
            </a>
          </div>

          <ul className="mt-8 grid gap-px sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <li
                key={pillar}
                className="rf-utility border-t border-rf-hairline pt-3 sm:pr-4"
              >
                {pillar}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full lg:col-span-7">
          {/* LCP element: preloaded, with the real intrinsic size reserved. */}
          <Image
            src="/brand/regainflow-3d-model.png"
            alt="The RegainFlow mark, rendered as four converging metallic forms on a circular platform."
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
