import { shade } from "./dither";

/**
 * RF, extruded.
 *
 * One letterform definition, two consumers: rasterised to dots for the hero
 * monogram, and rasterised to pixels by `scripts`-side tooling to produce
 * `app/icon.png`. The navigation uses the wordmark rather than the glyph, so
 * there is no third rendering to keep in step.
 *
 * Letter space: origin bottom-left, 100 units tall, y up. Continuous
 * rectangles rather than a bitmap — a scaled-up bitmap reads as Minecraft;
 * this keeps clean edges at any grid resolution.
 *
 * Explicitly a placeholder. Swapping in a real mark means replacing the
 * geometry below and nothing else.
 */

export interface Rect {
  l: number;
  b: number;
  w: number;
  h: number;
}

/** Stroke weight. */
const S = 15;
const R_W = 62;
const F_X = R_W + 16;

export const RECTS: Rect[] = [
  // R — stem, top bar, bowl right, mid bar
  { l: 0, b: 0, w: S, h: 100 },
  { l: S, b: 100 - S, w: R_W - S, h: S },
  { l: R_W - S, b: 55, w: S, h: 30 },
  { l: S, b: 55, w: 32, h: S },
  // F — stem, top bar, mid bar
  { l: F_X, b: 0, w: S, h: 100 },
  { l: F_X + S, b: 100 - S, w: 47, h: S },
  { l: F_X + S, b: 50, w: 37, h: S },
];

/** R's leg: a slanted bar from under the bowl down to the baseline. */
export const LEG = { x0: 38, y0: 58, x1: R_W, y1: 0, w: S };

export const MONO_W = F_X + S + 47;
export const MONO_H = 100;

/** Extrusion direction on screen: right and down, matching the `+a` axis the
 *  isometric diagrams already use, so the mark belongs to the same drawing. */
export const EX = 0.866;
export const EY = -0.5;

/**
 * Face tones, spread across the four-step dot ramp so the three faces stay
 * distinguishable: front lands mostly on the largest dot, side mostly on the
 * smallest, top between them. That difference is the only thing making this read
 * as a solid rather than an outline.
 */
export const FRONT = 0.94;
export const TOP = 0.6;
export const SIDE = 0.3;

function inRects(x: number, y: number): boolean {
  for (const r of RECTS) {
    if (x >= r.l && x < r.l + r.w && y >= r.b && y < r.b + r.h) return true;
  }
  return false;
}

/** Perpendicular distance to the leg's centre line, clamped to the segment. */
function inLeg(x: number, y: number): boolean {
  const dx = LEG.x1 - LEG.x0;
  const dy = LEG.y1 - LEG.y0;
  const t = ((x - LEG.x0) * dx + (y - LEG.y0) * dy) / (dx * dx + dy * dy);
  if (t < 0 || t > 1) return false;
  return Math.hypot(x - (LEG.x0 + t * dx), y - (LEG.y0 + t * dy)) < LEG.w * 0.52;
}

export function isSolid(x: number, y: number): boolean {
  return inRects(x, y) || inLeg(x, y);
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
}

function faceTone(cx: number, cy: number, box: Box): number {
  // Screen cell → letter space.
  const lx = ((cx - box.x) / box.w) * MONO_W;
  const ly = (1 - (cy - box.y) / box.h) * MONO_H;

  if (isSolid(lx, ly)) return FRONT;

  // Walk back along the extrusion looking for the front face it belongs to.
  const step = MONO_W / box.w;
  for (let d = step; d <= box.depth * step; d += step) {
    const sx = lx - d * EX;
    const sy = ly - d * EY;
    if (isSolid(sx, sy)) {
      // Top face if nothing sits above the sample; side face otherwise.
      return isSolid(sx, sy + step * 1.2) ? SIDE : TOP;
    }
  }

  return 0;
}

/**
 * The monogram as a grid of characters, spaces everywhere it isn't.
 *
 * Split into two layers so they can be coloured separately — the letterform in
 * one tone, its extrusion in another, exactly as `RfMark` does in the
 * navigation. One flat colour made the faces blend into a single mass; the
 * two-tone split is what lets the R and F read as solids.
 *
 * Static: the letterform doesn't animate, only the field behind it moves. So
 * this renders once on the server and is never touched again.
 */
export function frame(cols: number, rows: number, layer: "face" | "depth"): string {
  const w = cols * 0.34;
  const h = (w / MONO_W) * MONO_H;
  const box: Box = { x: cols * 0.54, y: (rows - h) / 2, w, h, depth: 6 };

  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const t = faceTone(x, y, box);
      const mine = layer === "face" ? t === FRONT : t > 0 && t !== FRONT;
      line += mine ? shade(t, x, y) : " ";
    }
    lines.push(line);
  }

  return lines.join("\n");
}
