import LayerSystem from "@/components/LayerSystem";

/** `/services`: the same stack as the home page, with what each layer enables. */
export default function CapabilityLayers() {
  return (
    <section id="layers" className="rf-section">
      {/* Tight: the detailed layer inventory a reader reaches after the
          framework and the engagement sequence have already sold the shape. */}
      <div className="rf-shell rf-band-tight">
        <div className="rf-grid gap-y-5">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">What we engineer</p>
            <h2 className="rf-h2 mt-5">
              The layers that make AI useful in production.
            </h2>
          </div>
        </div>

        <LayerSystem detailed />
      </div>
    </section>
  );
}
