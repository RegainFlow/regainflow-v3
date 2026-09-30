/**
 * Numbered findings on a Navy panel: a blog post's TL;DR and a report's "What
 * it found". The numbers give a scanner a count and an order to talk about, the
 * way Profound's research posts run them, and a plain `<ol>` is what an answer
 * engine lifts as a list.
 */
export default function Findings({
  items,
  title = "TL;DR",
  id = "takeaways",
}: {
  items: string[];
  title?: string;
  /** The heading's id, so a page can link or label to it. */
  id?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="rf-takeaways" aria-labelledby={id}>
      <h2 id={id} className="rf-utility">
        {title}
      </h2>
      <ol>
        {items.map((item, i) => (
          <li key={item}>
            <span className="rf-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
