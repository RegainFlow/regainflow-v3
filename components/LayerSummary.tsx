import LayerSystem from "@/components/LayerSystem";

/** Home: the layers named, and the stack they form. `/services` shows the same
 *  stack with the line describing what each layer enables. */
export default function LayerSummary() {
  return (
    // `rf-band-tight`: this section's job is finished when the reader clicks
    // through to `/services`. It carried the same weight as the argument above
    // it, which is more than a summary has to earn.
    <section className="rf-section">
      <div className="rf-shell rf-band-tight">
        <div className="rf-grid gap-y-5">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">What we build</p>
            <h2 className="rf-h2 mt-5">Four layers, engineered together.</h2>
          </div>
        </div>

        <LayerSystem />
      </div>
    </section>
  );
}
