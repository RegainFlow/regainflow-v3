import Link from "next/link";

/**
 * The three states a client is usually in when they call, and what we do about
 * each. The response leads and the symptom follows: the page is selling the
 * work, not the diagnosis.
 */
const FAILURE_STATES = [
  {
    service: "Discover",
    href: "/services#discover",
    response:
      "We find the work worth funding and say so plainly, measured against staff time, service levels, risk, or the deadline you are actually working to.",
    state: "A modernization budget with a spend deadline and no plan behind it.",
  },
  {
    service: "Implement",
    href: "/services#implement",
    response:
      "We build and ship the real system — architecture, data, integration, evaluation, deployment, and the adoption work that gets it used.",
    state: "A vendor pilot that impressed the room and nobody can extend.",
  },
  {
    service: "Scale",
    href: "/services#scale",
    // "The operating layer" was the phrase here, and it is jargon doing the
    // work of a description. Naming the five controls says the same thing in
    // terms a reader can check themselves against.
    response:
      "We engineer the controls around the AI — evaluation, observability, security, cost, and handoff — so it stays reliable as usage grows and your team can run it.",
    state:
      "A system that cleared procurement and cannot produce the record an auditor asks for.",
  },
];

export default function ProductionGap() {
  return (
    <section className="rf-section">
      <div className="rf-shell py-14 md:py-18 lg:py-22">
        <div className="rf-grid gap-y-8">
          <div className="col-span-full lg:col-span-7">
            <p className="rf-eyebrow">The production gap</p>
            <h2 className="rf-h2 mt-6">AI is only one part of the system.</h2>
          </div>

          <p className="rf-body col-span-full max-w-[52ch] lg:col-span-5 lg:pt-3">
            AI programs stall when the mandate, the data, the systems, and the
            people who own them move on separate tracks. RegainFlow turns those
            fragments into one accountable path from decision to production, and
            stays on it through the handoff.
          </p>
        </div>

        <ol className="mt-14 border-b border-rf-hairline md:mt-20">
          {FAILURE_STATES.map((item) => (
            <li
              key={item.service}
              className="rf-grid gap-y-4 border-t border-rf-hairline py-7 md:py-9"
            >
              <p className="col-span-full lg:col-span-2 lg:pt-1">
                <Link href={item.href} className="rf-index rf-nav-link">
                  {item.service}
                </Link>
              </p>

              {/* The problem leads — it is the thing a reader recognises
                  themselves in. What we do about it follows underneath. */}
              <div className="col-span-full lg:col-span-9 lg:col-start-4">
                <h3 className="rf-h3 max-w-[46ch]">{item.state}</h3>

                <p className="rf-body mt-3 flex gap-4">
                  <span className="rf-route-tick" aria-hidden="true" />
                  <span className="max-w-[58ch]">{item.response}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
