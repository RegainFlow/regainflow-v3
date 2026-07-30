import type { Metadata } from "next";

import CapabilityLayers from "@/components/CapabilityLayers";
import EngagementPath from "@/components/EngagementPath";
import FreeAssessment from "@/components/FreeAssessment";
import PageHeader from "@/components/PageHeader";
import RegainFlowSystem from "@/components/RegainFlowSystem";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Discover, Implement, and Scale — AI portfolio direction, production engineering across the intelligence, data, workflow, and platform layers, and managed AI operations.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="From the decision worth making to the system that runs it."
        lead="Three stages and four layers. You can start at any stage, and you can stop at any stage — the only thing we will not do is hand you something half-built and call it delivery."
      />

      <RegainFlowSystem />
      <CapabilityLayers />
      <EngagementPath />

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
