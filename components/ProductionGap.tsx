const FAILURE_STATES = [
  {
    index: "01",
    state: "Too many initiatives, no shared priority",
    response:
      "Focus investment on measurable revenue, efficiency, risk, or strategic advantage.",
  },
  {
    index: "02",
    state: "A working pilot, no accountable production path",
    response:
      "Connect architecture, engineering, integration, evaluation, deployment, and adoption.",
  },
  {
    index: "03",
    state: "A deployed model, no dependable operating system around it",
    response:
      "Add the quality, visibility, governance, reliability, cost control, and portability needed to operate with confidence.",
  },
];

export default function ProductionGap() {
  return (
    <section className="rf-section">
      <div className="rf-shell py-14 md:py-18 lg:py-22">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">The production gap</p>
            <h2 className="rf-h2 mt-6">
              The model is only one part of the system.
            </h2>
          </div>

          <p className="rf-body col-span-full max-w-[52ch] lg:col-span-5 lg:pt-3">
            AI initiatives stall when business priorities, data, software,
            security, and operations move on separate tracks. RegainFlow turns
            those fragments into one accountable path from decision to
            production.
          </p>
        </div>

        <ol className="mt-14 border-b border-rf-hairline md:mt-20">
          {FAILURE_STATES.map((item) => (
            <li
              key={item.index}
              className="rf-grid gap-y-3 border-t border-rf-hairline py-7 md:py-9"
            >
              <span className="rf-index col-span-full lg:col-span-1 lg:pt-1">
                {item.index}
              </span>

              <h3 className="rf-h3 col-span-full lg:col-span-5 lg:pr-8">
                {item.state}
              </h3>

              <p className="rf-body col-span-full flex gap-4 lg:col-span-6">
                <span className="rf-route-tick" aria-hidden="true" />
                <span className="max-w-[54ch]">{item.response}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
