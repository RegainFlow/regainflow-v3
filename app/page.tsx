import ClosingCTA from "@/components/ClosingCTA";
import FreeAssessment from "@/components/FreeAssessment";
import Hero from "@/components/Hero";
import LayerSummary from "@/components/LayerSummary";
import PartnershipModel from "@/components/PartnershipModel";
import ProductionGap from "@/components/ProductionGap";
import ProofStrip from "@/components/ProofStrip";
import StageSummary from "@/components/StageSummary";

/**
 * **Required, and not obviously so.** `ProofStrip` reads the case studies
 * table, but it does that inside the component rather than here — so without
 * this flag Next happily prerenders the home page, and if the fetch is cold or
 * failing at build time it bakes in a page with no proof section that never
 * recovers. The build output says `○ /` and looks correct right up until you
 * notice the section is missing.
 *
 * The most-visited route on the site is server-rendered per request as a
 * result. That is the acknowledged cost of putting case studies in a table —
 * see the migration, and `export const revalidate` if it needs walking back.
 */
export const dynamic = "force-dynamic";

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
