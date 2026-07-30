import { shade } from "./dither";

/**
 * The wave field.
 *
 * Broad diagonal sweeps, bent by a slow vertical warp — folded cloth rather
 * than scan lines. A purely horizontal base read as a ticker; the bend is what
 * makes it look like water.
 *
 * `frame()` is pure so the server and the client's first render agree exactly.
 * The animation writes `textContent` through a ref and never through React.
 */

/** Everything below this is black. Without it the dither puts a mark in about
 *  a quarter of the dark cells and the whole field turns to grain. */
const BLACK_POINT = 0.46;

function tone(u: number, v: number, t: number): number {
  const warp =
    0.55 * Math.sin(v * 2.3 + t * 0.15) + 0.28 * Math.sin(u * 1.9 - t * 0.09);

  const band =
    Math.sin((u * 2.4 + v * 1.5 + warp) * Math.PI + t * 0.2) * 0.62 +
    Math.sin((u * 1.3 - v * 2.1 - warp * 0.8) * Math.PI - t * 0.13) * 0.38;

  const lifted = (band * 0.5 + 0.5 - BLACK_POINT) / (1 - BLACK_POINT);
  return lifted > 0 ? lifted ** 1.5 : 0;
}

export function frame(cols: number, rows: number, t: number, ceiling = 0.62): string {
  const lines: string[] = [];

  for (let y = 0; y < rows; y++) {
    const v = y / rows;
    let line = "";
    for (let x = 0; x < cols; x++) {
      line += shade(tone(x / cols, v, t) * ceiling, x, y);
    }
    lines.push(line);
  }

  return lines.join("\n");
}

export interface GridSize {
  cols: number;
  rows: number;
}

/**
 * Grid sizes per breakpoint.
 *
 * Cells are square: the stylesheet sets `line-height` to the monospace advance
 * width, and the type scale is derived from the container, so a grid always
 * fills its width exactly. Row counts are set to *over*-fill the height and be
 * clipped — under-filling would leave bare Void at an edge.
 */
export const FIELD_GRID: Record<"sm" | "md" | "lg", GridSize> = {
  sm: { cols: 84, rows: 150 },
  md: { cols: 150, rows: 120 },
  lg: { cols: 232, rows: 110 },
};
