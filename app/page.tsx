import ClosingCTA from "@/components/ClosingCTA";
import FreeAssessment from "@/components/FreeAssessment";
import Hero from "@/components/Hero";
import LayerSummary from "@/components/LayerSummary";
import PartnershipModel from "@/components/PartnershipModel";
import ProductionGap from "@/components/ProductionGap";
import ProofStrip from "@/components/ProofStrip";
import StageSummary from "@/components/StageSummary";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductionGap />
      <StageSummary />
      <LayerSummary />
      <ProofStrip />
      {/* After the proof and before the partnership model, not at the foot of
          the page. `ClosingCTA` closes this route with the same primary, and
          `app/services/page.tsx` documents why two identical primaries must not
          stack — the two need a section between them to stay distinguishable.
          Placing it here also puts the free offer directly after the evidence
          that earns it. */}
      <FreeAssessment location="home_assessment" />
      <PartnershipModel />
      <ClosingCTA />
    </>
  );
}
