import { FIELD_GRID } from "@/lib/ascii/field";
import { frame } from "@/lib/ascii/monogram";

/**
 * RF in dots, sitting over the field.
 *
 * The letterform doesn't animate — only the water behind it moves — so this is
 * a plain server component with no loop, no hydration contract, and nothing to
 * pause. It shares the field's grid so the two line up exactly.
 */
export default function AsciiMonogram({ className }: { className?: string }) {
  const { cols, rows } = FIELD_GRID.lg;

  return (
    <div
      className={["rf-ascii", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {/* Depth first, so the letterform sits over its own extrusion. */}
      <pre
        className="rf-ascii-mono-depth"
        style={{ "--rf-cols": cols } as React.CSSProperties}
      >
        {frame(cols, rows, "depth")}
      </pre>
      <pre
        className="rf-ascii-mono-face"
        style={{ "--rf-cols": cols } as React.CSSProperties}
      >
        {frame(cols, rows, "face")}
      </pre>
    </div>
  );
}
