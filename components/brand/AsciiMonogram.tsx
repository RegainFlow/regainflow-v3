import type { CSSProperties } from "react";

import { FIELD_GRID } from "@/lib/ascii/field";
import { frames } from "@/lib/ascii/monogram";

/**
 * RF in dots, sitting over the field.
 *
 * The letterform doesn't animate — only the water behind it moves — so this is
 * a plain server component with no loop, no hydration contract, and nothing to
 * pause. It shares the field's grid so the two line up exactly.
 *
 * Both layers come from one call: the extrusion raymarch is the expensive part of
 * the render, and asking for the layers separately walked every cell twice.
 */
export default function AsciiMonogram({ className }: { className?: string }) {
  const { cols, rows } = FIELD_GRID.lg;
  const { face, depth } = frames(cols, rows);

  return (
    <div
      className={["rf-ascii", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {/* Depth first, so the letterform sits over its own extrusion. It also
          stays in flow and gives the wrapper its height — see the Firefox note
          on `.rf-ascii-mono` in globals.css. */}
      <pre
        className="rf-ascii-mono-depth"
        style={{ "--rf-cols": cols } as CSSProperties}
      >
        {depth}
      </pre>
      <pre
        className="rf-ascii-mono-face"
        style={{ "--rf-cols": cols } as CSSProperties}
      >
        {face}
      </pre>
    </div>
  );
}
