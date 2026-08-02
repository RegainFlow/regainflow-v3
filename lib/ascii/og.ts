import { frames } from "@/lib/ascii/monogram";

/**
 * The monogram, prepared for `next/og`.
 *
 * The hero renders `frames()` straight into a `pre` and lets CSS size it. An OG
 * card cannot: Satori has no container queries, so the type scale has to be
 * computed, and the mark has to be cropped out of the grid first because
 * `frames()` places it at 55% of the width for a hero that is mostly empty
 * field. Cropping rather than re-deriving the position keeps `monogram.ts` the
 * only place the letterform's geometry is known.
 */

/**
 * The advance width of a monospace glyph as a fraction of its font size. IBM
 * Plex Mono is 600/1000 em, which is where `line-height: 0.6` in `globals.css`
 * comes from — matching the two makes each cell square, and square cells are
 * what `frames()` assumes when it maps letter units onto the grid. Get this
 * wrong and the mark renders stretched rather than misaligned, which is harder
 * to spot.
 */
export const MONO_ADVANCE = 0.6;

export interface OgMonogram {
  /** Cropped, equal-length lines. Index-aligned with `depth`. */
  face: string[];
  depth: string[];
  cols: number;
  rows: number;
}

/**
 * Trim the empty margin around the mark, measuring both layers together.
 *
 * Together is the important part — the extrusion reaches up and left beyond the
 * front face, so cropping each layer to its own bounds would shift one relative
 * to the other and break the alignment that makes the mark read as a solid.
 */
function cropTogether(face: string[], depth: string[]): OgMonogram {
  const width = Math.max(
    ...face.map((line) => line.length),
    ...depth.map((line) => line.length),
  );

  let top = Number.POSITIVE_INFINITY;
  let bottom = -1;
  let left = Number.POSITIVE_INFINITY;
  let right = -1;

  for (let y = 0; y < face.length; y++) {
    for (let x = 0; x < width; x++) {
      const inked = face[y]?.[x]?.trim() || depth[y]?.[x]?.trim();
      if (!inked) continue;

      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  // No ink at all would mean the geometry changed underneath us. Return the
  // grid untouched rather than a negative-width crop.
  if (bottom < 0) {
    return { face, depth, cols: width, rows: face.length };
  }

  const slice = (lines: string[]) =>
    lines
      .slice(top, bottom + 1)
      // Pad before slicing: trailing spaces are dropped when the grid is joined,
      // so short lines would otherwise crop to different widths and ragged rows
      // shift the mark by a cell.
      .map((line) => line.padEnd(width, " ").slice(left, right + 1));

  return {
    face: slice(face),
    depth: slice(depth),
    cols: right - left + 1,
    rows: bottom - top + 1,
  };
}

/**
 * `cols` is generous relative to the mark because `frames()` scales the letter
 * to 32% of whatever grid it is given — so this is really the dial for how fine
 * the dither reads, at roughly `cols * 0.32` cells across the mark itself.
 *
 * 135 puts the mark at ~43 cells, which is coarser than it sounds like it should
 * be. The hero runs ~74, but it also renders across most of a viewport; here the
 * mark gets 380px, so a finer grid buys detail at the cost of dot size, and the
 * dot size *is* the mark. Rendered at 56 cells the whole letterform went grey
 * and soft — the dither read as texture rather than as a solid, which is exactly
 * the failure the hero's `FRONT = 1` comment warns about. Fewer, larger dots
 * hold the shape at the size a timeline actually shows it.
 *
 * `rows` is derived rather than passed. The mark's height follows from `cols`,
 * and a row count that did not track it would either clip the extrusion or
 * leave the crop doing nothing.
 */
export function ogMonogram(cols = 135): OgMonogram {
  // The mark needs `cols * 0.2667` rows; the rest is headroom for the extrusion,
  // which reaches up and left beyond the front face.
  const rows = Math.ceil(cols * 0.32);
  const { face, depth } = frames(cols, rows);

  return cropTogether(face.split("\n"), depth.split("\n"));
}
