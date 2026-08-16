import type { Artifact as ArtifactData } from "@/lib/content/case-studies";

/**
 * A sanitized artifact from an engagement, drawn rather than photographed.
 *
 * **Nothing here is an image of words.** Every label is real text in the DOM,
 * so it stays selectable, translatable, searchable, and readable by a screen
 * reader — and so none of it can leak a client's actual deck. That second
 * reason is the load-bearing one: the source material for these is
 * confidential, and a screenshot is the one format that cannot be sanitized by
 * review.
 *
 * `kind` picks the layout; the data supplies the labels. That split is the same
 * one `components/Icon.tsx` makes for glyphs — an arbitrary diagram cannot be
 * expressed as data, but which diagram, and what it says, can be. An unknown
 * `kind` renders the nodes as a plain list rather than throwing, because a row
 * inserted by a generator should degrade to something readable rather than take
 * the page down.
 *
 * The caption is both the `figcaption` and the accessible description. The
 * layout is presentational, so the caption has to carry the meaning on its own
 * for anyone who cannot see the arrangement.
 */
export default function Artifact({ artifact }: { artifact: ArtifactData }) {
  return (
    <figure className="rf-artifact">
      <p className="rf-utility">{artifact.title}</p>

      <div className="mt-5">
        <Body artifact={artifact} />
      </div>

      <figcaption className="rf-body">{artifact.caption}</figcaption>
    </figure>
  );
}

function Body({ artifact }: { artifact: ArtifactData }) {
  switch (artifact.kind) {
    // A directed run. Both use the same flow layout because both are
    // left-to-right journeys ending somewhere — the spine ends at a shipped
    // kit, the branch stack ends at a human review gate. The terminal node
    // takes the Flow Blue edge, which is what gives the row direction without
    // an arrowhead in every gap.
    case "spine":
    case "branch-stack":
      return (
        <ol className="rf-flow">
          {artifact.nodes.map((node) => (
            <li key={node} className="rf-flow-node">
              {node}
            </li>
          ))}
        </ol>
      );

    // Contents, not a sequence. An unordered grid, deliberately, so nothing
    // about the layout implies you do these in an order.
    case "kit":
      return (
        <ul className="rf-kit">
          {artifact.nodes.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ul>
      );

    default:
      return (
        <ul className="rf-kit">
          {artifact.nodes.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ul>
      );
  }
}
