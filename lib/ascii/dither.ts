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

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
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
  const threshold = (BAYER4[y & 3][x & 3] + 0.5) / 16;
  const index = level - step > threshold ? step + 1 : step;
  return RAMP[index < RAMP.length ? index : RAMP.length - 1];
}
