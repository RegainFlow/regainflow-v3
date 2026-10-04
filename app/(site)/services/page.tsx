import type { Metadata } from "next";

import CapabilityLayers from "@/components/CapabilityLayers";
import EngagementPath from "@/components/EngagementPath";
import FreeAssessment from "@/components/FreeAssessment";
import PageHeader from "@/components/PageHeader";
import RegainFlowSystem from "@/components/RegainFlowSystem";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI engineering services",
  description:
    "AI services in three stages: Discover sets the portfolio direction, Implement engineers the production system, and Scale runs it through managed AI operations.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      {/* The lead used to open "Three stages and four layers", which asked a
          first-time reader to hold a structure before they had any reason to
          care about it. The structure is still on the page; it just no longer
          leads. */}
      <PageHeader
        eyebrow="Services"
        title="From the right decision to a production system your team can run."
        lead="RegainFlow provides AI engineering services in three stages: Discover decides what is worth building, Implement builds the production system, and Scale runs it with your team until handoff. You can start or stop at any stage. We will not hand you something half-built and call it delivery."
      />

      {/* The engagement sequence sits above the engineering layers, not below
          them. A reader arriving here wants to know how this is bought before
          they want the four-layer inventory of what gets built — the layers
          answer a question the sequence has to raise first. */}
      <RegainFlowSystem />
      <EngagementPath />
      <CapabilityLayers />

      {/* `FreeAssessment` closes this page instead of the shared `ClosingCTA`.
          The two were byte-identical primaries stacked back to back, and the
          free assessment is the specific thing we want asked for here. */}
      <FreeAssessment />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Services", "/services")),
        }}
      />
    </>
  );
}
