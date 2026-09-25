import { GOV_IDENTIFIERS } from "@/lib/content/gov";

/**
 * The opening block of a gov document. `PageHeader`'s layout, plus the
 * identifiers a contracting officer checks first — they sit here rather than
 * only in the footer so they survive into the printed PDF.
 */
export default function DocHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="rf-section">
      <div className="rf-shell rf-grid gap-y-6 py-12 md:py-16">
        <div className="col-span-full lg:col-span-7">
          <p className="rf-eyebrow">{eyebrow}</p>
          <h1 className="rf-h1 mt-5">{title}</h1>
        </div>

        <div className="col-span-full lg:col-span-5 lg:pt-4">
          <p className="rf-lead max-w-[52ch]">{lead}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {GOV_IDENTIFIERS.map((id) => (
              <div key={id.label} className="flex items-baseline gap-3">
                <dt className="rf-utility">{id.label}</dt>
                <dd className="font-mono text-sm text-rf-warm">{id.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
