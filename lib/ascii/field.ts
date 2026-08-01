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

/**
 * Crest shaping.
 *
 * A sine is symmetric — as much of it is bright as is dark — and that symmetry is
 * the single reason the field used to read as a pattern rather than as water. Real
 * swell has broad flat troughs and narrow crests. Raising the gamma buys exactly
 * that asymmetry: it pushes the middle of the range down without moving the peaks,
 * so the bands separate into distinct crests instead of blurring into each other.
 */
const CREST = 1.7;

function tone(u: number, v: number, t: number): number {
  const warp =
    0.55 * Math.sin(v * 2.3 + t * 0.15) + 0.28 * Math.sin(u * 1.9 - t * 0.09);

  // Three wave trains: two broad sweeps crossing, and a shorter one at roughly
  // twice the frequency for the fine detail between them. Its direction sits
  // between the other two and it drifts at its own rate, so the three never phase
  // -lock into a stationary grid.
  const band =
    Math.sin((u * 2.4 + v * 1.5 + warp) * Math.PI + t * 0.2) * 0.58 +
    Math.sin((u * 1.3 - v * 2.1 - warp * 0.8) * Math.PI - t * 0.13) * 0.34 +
    Math.sin((u * 4.6 - v * 3.7 - warp * 1.6) * Math.PI + t * 0.31) * 0.16;

  const lifted = (band * 0.5 + 0.5 - BLACK_POINT) / (1 - BLACK_POINT);
  return lifted > 0 ? lifted ** CREST : 0;
}

export function frame(cols: number, rows: number, t: number, ceiling = 1): string {
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
