/** The opening block on every route below the home page. */
export default function PageHeader({
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
      <div className="rf-shell rf-grid gap-y-6 py-12 md:py-16 lg:py-20">
        <div className="col-span-full lg:col-span-7">
          <p className="rf-eyebrow">{eyebrow}</p>
          <h1 className="rf-h1 mt-5">{title}</h1>
        </div>

        <p className="rf-lead col-span-full max-w-[52ch] lg:col-span-5 lg:pt-4">
          {lead}
        </p>
      </div>
    </section>
  );
}
