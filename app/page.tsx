import ClosingCTA from "@/components/ClosingCTA";
import Hero from "@/components/Hero";
import PartnershipModel from "@/components/PartnershipModel";
import ProductionGap from "@/components/ProductionGap";
import RegainFlowSystem from "@/components/RegainFlowSystem";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <Hero />
        <ProductionGap />
        <RegainFlowSystem />
        <PartnershipModel />
        <ClosingCTA />
      </main>

      <SiteFooter />
    </>
  );
}
