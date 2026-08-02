/**
 * Ordered dithering.
 *
 * This is the technique behind the reference: thousands of tiny marks whose
 * *density* traces a smooth gradient. A per-cell threshold would band, and
 * random noise would fizz — a Bayer matrix gives the even, deliberate grain
 * that reads as a printed halftone rather than as static.
 */

/**
 * Sparse to dense — dots only, never block fills.
 *
 * `▪ ▓ █` paint their whole character box. Square cells force `line-height` down
 * to the monospace advance width (0.6), which is *less* than a glyph's em box, so
 * block glyphs overlap their vertical neighbours and a dense region welds into a
 * solid slab. No opacity or grid size fixes that. A dot occupies part of its cell
 * and leaves the rest black, so it never touches the row above or below.
 *
 * Every character here is ASCII or Latin-1. A glyph the font lacks falls back to
 * another family with a different advance width and shears the entire grid, so
 * exotic dots are not worth one extra tone step.
 *
 * Index 0 is empty on purpose: troughs have to go fully black, or the field
 * reads as uniform grain instead of as bands.
 */
const RAMP = [" ", "·", ":", "•"] as const;

/**
 * 8×8, not 4×4.
 *
 * The ramp only has three intervals, so *all* the tonal resolution lives in the
 * threshold: a 4×4 matrix offers 16 steps between one dot and the next, and the
 * monogram's extruded sides — which now fade continuously with depth rather than
 * sitting on two flat values — banded into visible terraces at that granularity.
 * 8×8 gives 64, and costs one extra bit of masking.
 */
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/**
 * Tone 0–1 → one character.
 *
 * Picks the ramp step, then lets the cell's Bayer threshold decide whether it
 * rounds up to the next one. Two neighbouring cells at the same tone can land
 * on different characters, and that disagreement is what creates the texture.
 */
export function shade(tone: number, x: number, y: number): string {
  const t = tone < 0 ? 0 : tone > 1 ? 1 : tone;
  const level = t * (RAMP.length - 1);
  const step = Math.floor(level);
  const threshold = (BAYER8[y & 7][x & 7] + 0.5) / 64;
  const index = level - step > threshold ? step + 1 : step;
  return RAMP[index < RAMP.length ? index : RAMP.length - 1];
}
