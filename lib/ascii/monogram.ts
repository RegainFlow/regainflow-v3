import { shade } from "./dither";

/**
 * RF, extruded.
 *
 * Traced from `app/icon.png`, which is now the source of truth for the mark: it
 * is drawn, not generated, so the geometry here follows it rather than the other
 * way round. Sampling the PNG put the white front face at x 209→857, y 247→787,
 * which fixes the scale at 1 letter unit = 5.4px.
 *
 * Letter space: origin at the bottom-left of the R's stem, 100 units to the cap,
 * y up. Continuous primitives rather than a bitmap — a scaled-up bitmap reads as
 * Minecraft; this keeps clean edges at any grid resolution.
 */

export const MONO_W = 120;
export const MONO_H = 100;

/** Stroke weight. Not a free parameter: it is the difference between the bowl's
 *  two radii, and every other limb was measured against it. */
const S = 18.6;

/**
 * The bowl is a true annulus — outer and inner circles are concentric.
 *
 * This one fact is the whole construction of the R, and two things fall out of it
 * rather than needing rules of their own: the outer disc reaches back past the
 * stem's right edge unaided, so there is no bottom bar to draw; and the sliver of
 * Void that opens between stem and bowl a third of the way up appears exactly
 * where the icon has it.
 */
const BOWL_X = 38.4;
const BOWL_Y = 70.6;
const BOWL_OUTER = 30;
/** The counter. */
const BOWL_INNER = BOWL_OUTER - S;

/** Cap and baseline. The bowl's crown rises a fraction above the cap and the leg
 *  runs below the baseline; both get cut flat, as they are in the icon. Cutting
 *  the crown matters more than it sounds — a circle changes width fastest at its
 *  top, so letting it through put a visible bulge on the R's shoulder. */
const CAP = 100;
const BASE = 0;

/**
 * One slope, two uses.
 *
 * In the icon the R's leg runs exactly parallel to the extrusion axis. Deriving
 * both from a single constant is what stops them drifting apart, and that
 * alignment is a large part of why the mark reads as one solid rather than as a
 * letter with a shadow behind it.
 *
 * Note this is deliberately *not* the isometric `+a` axis (0.866, -0.5) that the
 * wordmark's `text-shadow` stack and the stage diagrams share. The icon's
 * extrusion is steeper, and the mark follows the icon.
 */
const SLOPE = 0.8;
const BASE_ANGLE = Math.atan(SLOPE);
export const EX = Math.sin(BASE_ANGLE);
export const EY = -Math.cos(BASE_ANGLE);

/** Extrusion length in *letter units*, not in cells. Measured in cells — as it
 *  used to be — the mark's physical depth changed with the grid it was drawn on,
 *  so the same mark got shallower as the grid got denser. */
export const DEPTH = 7.6;

interface Rect {
  l: number;
  b: number;
  w: number;
  h: number;
}

/** Heights overshoot the cap on purpose; `isSolid` cuts them flat. */
const RECTS: Rect[] = [
  // R stem. Its baseline is raised — the leg descends past it, which is what
  // stops the mark sitting on one flat line.
  { l: 0, b: 12.8, w: 18.5, h: 90 },
  // R top bar. Its right end is the bowl's disc, not a corner of its own.
  { l: 0, b: 82, w: BOWL_X, h: 20 },
  // F stem — and it stops well short of the full height, at the point where the
  // mid arm's slanted end crosses its own left edge. Above that the F has no stem
  // at all: its top arm hangs off the R's bowl, and the Void between the two arms
  // is what lets the R read through the F rather than the two letters stacking
  // into a single block.
  { l: 65.2, b: BASE, w: 18.5, h: 38.3 },
];

/** Both of the F's arms lean: their ends are cut on the same slant, top edge
 *  further right than the bottom. `l` and `r` are measured at the bottom edge. */
const ARM_SLANT = 0.52;

interface Arm {
  b: number;
  h: number;
  l: number;
  r: number;
}

const ARMS: Arm[] = [
  // Top arm. Its left end is buried inside the bowl, and that overlap is what
  // fuses R and F into one continuous stroke across the top of the mark.
  { b: 68.3, h: 17.3, l: 50, r: 110.8 },
  // Mid arm. Its left end is what carries the join down onto the F's stem, so it
  // lands a hair left of the stem rather than exactly on it — flush, and the two
  // slants would show a notch where they meet.
  { b: 35, h: 17.8, l: 64.4, r: 96.6 },
];

/**
 * The R's leg — anchored on one traced point and run along `SLOPE`.
 *
 * It starts inside the bowl and finishes below the baseline, so the cap/baseline
 * clip cuts its foot horizontally instead of square to its own direction. It
 * reads a shade lighter than the other limbs in the icon, which keeps it from
 * overpowering the bowl it hangs from.
 */
const LEG_X = 45.6;
const LEG_Y = 29.4;
const LEG_TOP = 46;
const LEG_BOTTOM = -4;
const LEG_W = 18.2;
/** Horizontal half-width: the perpendicular one, opened out along the slope. */
const LEG_HALF = (LEG_W / 2) * Math.hypot(1, SLOPE);

function inRects(x: number, y: number): boolean {
  for (const r of RECTS) {
    if (x >= r.l && x < r.l + r.w && y >= r.b && y < r.b + r.h) return true;
  }
  return false;
}

function inArms(x: number, y: number): boolean {
  for (const a of ARMS) {
    if (y < a.b || y >= a.b + a.h) continue;
    const shift = (y - a.b) * ARM_SLANT;
    if (x >= a.l + shift && x < a.r + shift) return true;
  }
  return false;
}

/** The counter: the inner disc, squared off to the left so the hole has one
 *  straight side against the stem. Only ever subtracted from the bowl — the stem
 *  is unioned back on top of it, so the flat side needs no bound of its own. */
function inCounter(x: number, y: number): boolean {
  if (x <= BOWL_X) return Math.abs(y - BOWL_Y) < BOWL_INNER;
  return Math.hypot(x - BOWL_X, y - BOWL_Y) < BOWL_INNER;
}

function inBowl(x: number, y: number): boolean {
  return (
    Math.hypot(x - BOWL_X, y - BOWL_Y) < BOWL_OUTER && !inCounter(x, y)
  );
}

function inLeg(x: number, y: number): boolean {
  if (y < LEG_BOTTOM || y > LEG_TOP) return false;
  return Math.abs(x - (LEG_X - SLOPE * (y - LEG_Y))) < LEG_HALF;
}

/**
 * The cap/baseline clip lives here, not in the cell mapping, and that placement
 * is load-bearing: the extrusion raymarch calls `isSolid` directly at negative
 * `y`, so a clip applied anywhere further out would leave the blue hanging below
 * the baseline.
 */
export function isSolid(x: number, y: number): boolean {
  if (y < BASE || y >= CAP) return false;
  return inRects(x, y) || inArms(x, y) || inBowl(x, y) || inLeg(x, y);
}

/**
 * Face tones.
 *
 * The front face is solid: at 74 cells across, letting it dither meant roughly a
 * fifth of its cells dropped to the smaller dot, and that read as noise rather
 * than as texture. It can be solid safely because the ramp is dots — the "never
 * reach 1.0" rule this replaces was guarding against block glyphs welding into a
 * slab at `line-height: 0.6`, which a dot cannot do at any density.
 *
 * The extruded faces carry all the modelling instead. `UNDER` is the broad face
 * below a horizontal edge, `FLANK` the narrow one beside a vertical edge; both
 * fade with distance back, so the solid recedes into Void rather than stopping at
 * a hard edge. Two flat values here made the mark read as an outline.
 */
const FRONT = 1;
const UNDER = 0.85;
const FLANK = 0.62;
/** How much of its tone the extrusion loses across its full depth. Kept well
 *  under 1: the whole extrusion is only about five cells deep at the size this
 *  renders, so a steep falloff spent most of them below the ramp's first step and
 *  the solid came apart into a fringe. */
const FALLOFF = 0.55;
const RAY_STEPS = 12;

/**
 * The extrusion, resolved once. Nothing here varies per cell or per render — the
 * letterform is static — so it is worth hoisting out of the hot loop entirely.
 */
const VIEW = {
  step: DEPTH / RAY_STEPS,
  /** How far past the letterform the extrusion can reach, so cells nowhere near
   *  the mark can be rejected before any hit testing. */
  padX: DEPTH * Math.abs(EX) + 1,
  padY: DEPTH * Math.abs(EY) + 1,
};

/**
 * Tone for one cell, with the layer encoded in the sign: positive is the front
 * face, negative the extrusion, zero empty. A sign rather than a struct because
 * this runs ~25,000 times a frame and per-cell allocation would show.
 */
function sample(lx: number, ly: number): number {
  // Most of the grid is nowhere near the mark; bail before any hit testing.
  if (lx < -1 || lx > MONO_W + VIEW.padX) return 0;
  if (ly < -VIEW.padY || ly > CAP + 1) return 0;

  if (isSolid(lx, ly)) return FRONT;

  // Walk back along the extrusion looking for the front face this cell belongs to.
  for (let d = VIEW.step; d <= DEPTH; d += VIEW.step) {
    const sx = lx - d * EX;
    const sy = ly - d * EY;
    if (isSolid(sx, sy)) {
      const base = isSolid(sx, sy + VIEW.step * 1.2) ? FLANK : UNDER;
      return -(base * (1 - (d / DEPTH) * FALLOFF));
    }
  }

  return 0;
}

/** Where the mark sits in the grid, as fractions of its width. */
const MONO_SCALE = 0.32;
const MONO_X = 0.55;

/**
 * Both layers of the monogram, in one pass.
 *
 * They are split so they can be coloured separately — white letterform, blue
 * extrusion, as the icon has it. A single flat colour collapsed R and F into one
 * silhouette.
 *
 * Built together rather than by two calls because the raymarch is the expensive
 * part, and rendering the layers separately walked every cell twice for one
 * result.
 *
 * Static: the letterform does not animate, only the water behind it moves. So
 * this runs once on the server and is never touched again.
 */
export function frames(cols: number, rows: number): { face: string; depth: string } {
  const w = cols * MONO_SCALE;
  const h = (w / MONO_W) * MONO_H;
  const bx = cols * MONO_X;
  const by = (rows - h) / 2;

  const face: string[] = [];
  const back: string[] = [];

  for (let y = 0; y < rows; y++) {
    const ly = (1 - (y - by) / h) * MONO_H;
    let f = "";
    let b = "";

    for (let x = 0; x < cols; x++) {
      const tone = sample(((x - bx) / w) * MONO_W, ly);
      if (tone > 0) {
        f += shade(tone, x, y);
        b += " ";
      } else if (tone < 0) {
        f += " ";
        b += shade(-tone, x, y);
      } else {
        f += " ";
        b += " ";
      }
    }

    face.push(f);
    back.push(b);
  }

  return { face: face.join("\n"), depth: back.join("\n") };
}
