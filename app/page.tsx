import ClosingCTA from "@/components/ClosingCTA";
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
      <PartnershipModel />
      <ClosingCTA />
    </>
  );
}
