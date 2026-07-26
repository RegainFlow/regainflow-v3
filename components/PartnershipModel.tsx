import PlayOnView from "@/components/stage-models/PlayOnView";
import StageModel from "@/components/stage-models/StageModel";

const PRINCIPLES = [
  {
    index: "01",
    title: "Strategy through production",
    // Expansion lines are RegainFlow-authored framing, pending commercial review.
    detail:
      "The people who frame the opportunity stay accountable for what ships.",
  },
  {
    index: "02",
    title: "Embedded collaboration without hidden handoffs",
    detail:
      "We work inside your repositories, your review process, and your delivery rhythm.",
  },
  {
    index: "03",
    title: "Flexible ownership: continue together, scale down, or transfer cleanly",
    detail:
      "Documentation, runbooks, and working sessions make a handoff a decision rather than a rescue.",
  },
];

export default function PartnershipModel() {
  return (
    <section id="company" className="rf-section">
      <div className="rf-shell rf-grid gap-y-10 py-14 md:py-18 lg:py-22">
        <div className="col-span-full lg:col-span-5">
          <p className="rf-eyebrow">How we work</p>
          <h2 className="rf-h2 mt-5">
            Senior operators. Shared context. One accountable path.
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

          <ol className="mt-12 border-t border-rf-hairline">
            {PRINCIPLES.map((principle) => (
              <li
                key={principle.index}
                className="flex gap-5 border-b border-rf-hairline py-6"
              >
                <span className="rf-index pt-1">{principle.index}</span>
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
          </ol>
        </div>
      </div>
    </section>
  );
}
