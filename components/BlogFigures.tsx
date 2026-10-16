import type {
  BarsFigure,
  CalloutFigure,
  StepsFigure,
} from "@/lib/blog-figures";

/**
 * The three figure shapes a post body can declare — see `lib/blog-figures.ts`
 * for the fence syntax and why they are JSON rather than images.
 *
 * All three are HTML and CSS, so the words in them are real text: searchable,
 * translatable, readable by a screen reader, and sharp at any zoom. The
 * `figcaption` is the accessible description, per `docs/DESIGN.md`.
 */

const CALLOUT_LABEL: Record<CalloutFigure["kind"], string> = {
  note: "Note",
  warning: "Watch for",
  definition: "Definition",
};

/**
 * A callout that adds something the paragraph around it does not — a
 * definition, a warning, a rule of thumb. Never a pull quote of the body: the
 * research is specific that repeating a sentence the reader is about to meet
 * again costs attention rather than earning it.
 */
export function Callout({ figure }: { figure: CalloutFigure }) {
  return (
    <aside
      className="rf-callout"
      data-kind={figure.kind}
      aria-label={`${CALLOUT_LABEL[figure.kind]}: ${figure.title}`}
    >
      <p className="rf-utility rf-callout-label">{CALLOUT_LABEL[figure.kind]}</p>
      <p className="rf-callout-title">{figure.title}</p>
      <p className="rf-callout-body">{figure.body}</p>
    </aside>
  );
}

/** A numbered process. Numbered because order is the information. */
export function Steps({ figure }: { figure: StepsFigure }) {
  return (
    <figure className="rf-figure rf-figure-steps">
      <ol>
        {figure.steps.map((step, i) => (
          <li key={step.title}>
            <span className="rf-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="rf-figure-steps-title">{step.title}</p>
            <p className="rf-figure-steps-detail">{step.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

/**
 * A horizontal bar chart. Each row states its value in text beside the bar, so
 * the bar is decoration for a sighted reader and absent for a screen reader —
 * nothing is encoded only in length. Scaled to the largest value, not to 100:
 * these are comparisons, and a shared baseline at zero is what keeps them
 * honest.
 */
export function Bars({ figure }: { figure: BarsFigure }) {
  const max = Math.max(...figure.bars.map((bar) => bar.value));

  return (
    <figure className="rf-figure rf-figure-bars">
      <ul>
        {figure.bars.map((bar) => (
          <li key={bar.label}>
            <div className="rf-figure-bars-head">
              <span className="rf-figure-bars-label">{bar.label}</span>
              <span className="rf-figure-bars-value">
                {bar.value}
                {figure.unit}
              </span>
            </div>
            <span className="rf-figure-bars-track" aria-hidden="true">
              <span
                className="rf-figure-bars-fill"
                style={{ width: `${max > 0 ? (bar.value / max) * 100 : 0}%` }}
              />
            </span>
            {bar.note ? (
              <span className="rf-figure-bars-note">{bar.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
      <figcaption>
        {figure.caption}
        <span className="rf-figure-source">Source: {figure.source}</span>
      </figcaption>
    </figure>
  );
}
