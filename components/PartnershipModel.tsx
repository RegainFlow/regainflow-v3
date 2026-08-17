import Link from "next/link";

import Icon from "@/components/Icon";
import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";
import { PRINCIPLES } from "@/lib/content/company";

export default function PartnershipModel() {
  return (
    <section id="partnership" className="rf-section">
      {/* Quiet on purpose. It sits between the conversion above and the closing
          CTA below, and a third full-weight section there competes with both. */}
      <div className="rf-shell rf-grid gap-y-10 rf-band-tight">
        <div className="col-span-full lg:col-span-5">
          <p className="rf-eyebrow">The partnership model</p>
          {/* "Clean handoff", not "one accountable path" — that phrase already
              carries the ProductionGap paragraph above, and hearing it twice on
              one page made it read as a slogan rather than a commitment. The
              handoff is also the more specific claim of the two. */}
          <h2 className="rf-h2 mt-5">
            Senior engineers. Shared context. Clean handoff.
          </h2>

          <PlayOnView className="mt-8 lg:mt-10 lg:pr-8">
            <StageModel model="work" />
          </PlayOnView>
        </div>

        <div className="col-span-full lg:col-span-6 lg:col-start-7">
          <p className="rf-lead max-w-[54ch]">
            The people who help define the work remain close enough to ship it.
            RegainFlow works beside internal teams, owns the gaps between
            strategy and production, and leaves clients with stronger
            capability&mdash;not unnecessary dependency.
          </p>

          {/* `ul`, not `ol`. These are three parallel principles and the
              numbers they used to carry implied a sequence that does not
              exist — the list type was making the same claim as the markers. */}
          <ul className="mt-12 border-t border-rf-hairline">
            {PRINCIPLES.map((principle) => (
              <li
                key={principle.title}
                className="flex gap-5 border-b border-rf-hairline py-6"
              >
                <Icon name={principle.icon} className="mt-1" />
                <div>
                  <h3 className="text-[1.05rem] font-medium leading-snug text-rf-warm">
                    {principle.title}
                  </h3>
                  <p className="rf-body mt-2 max-w-[48ch]">
                    {principle.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/company#manifesto" className="rf-nav-link mt-6 inline-block">
            Read the manifesto &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
