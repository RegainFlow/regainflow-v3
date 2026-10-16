import type { ReactNode } from "react";

/**
 * The opening block on every route below the home page. `meta` is an optional
 * line under the lead, e.g. the blog's archive stats strip.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  open = false,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  meta?: ReactNode;
  /** No hairline under the header: the next section is set off by space. */
  open?: boolean;
}) {
  return (
    <section className={open ? "rf-section rf-section-open" : "rf-section"}>
      <div className="rf-shell rf-grid gap-y-6 py-12 md:py-16 lg:py-20">
        <div className="col-span-full lg:col-span-7">
          <p className="rf-eyebrow">{eyebrow}</p>
          <h1 className="rf-h1 mt-5">{title}</h1>
        </div>

        <div className="col-span-full lg:col-span-5 lg:pt-4">
          <p className="rf-lead max-w-[52ch]">{lead}</p>
          {meta}
        </div>
      </div>
    </section>
  );
}
