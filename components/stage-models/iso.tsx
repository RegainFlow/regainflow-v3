/**
 * Isometric drawing primitives.
 *
 * One projection for every model so the four read as a single set:
 *   +a runs right-and-down, +b runs left-and-down, +c runs straight up.
 * Visible faces of any box are therefore the top (c + h), the +a side, and the
 * +b side. Faces carry a Navy fill so overlapping solids occlude correctly —
 * which means blocks must be emitted back-to-front, lowest (a + b) first.
 */

export type Vec3 = [a: number, b: number, c: number];

const COS30 = 0.8660254;
const ORIGIN_X = 240;
// Tuned against measured bounding boxes so every model's geometry sits centred
// in the frame. At 250/400 the models sat in the lower half with a large empty
// gap above them; at 200/320 they were still ~30 units low.
const ORIGIN_Y = 170;

export const ISO_VIEWBOX = "0 0 480 320";

export function project(a: number, b: number, c: number): string {
  const x = ORIGIN_X + (a - b) * COS30;
  const y = ORIGIN_Y + (a + b) * 0.5 - c;
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

export function poly(points: Vec3[]): string {
  return (
    points
      .map((pt, i) => `${i === 0 ? "M" : "L"}${project(pt[0], pt[1], pt[2])}`)
      .join(" ") + " Z"
  );
}

export function segment(...points: Vec3[]): string {
  return points
    .map((pt, i) => `${i === 0 ? "M" : "L"}${project(pt[0], pt[1], pt[2])}`)
    .join(" ");
}

interface BoxProps {
  a: number;
  b: number;
  c: number;
  w: number;
  d: number;
  h: number;
  accent?: boolean;
}

/** A solid box drawn as its three visible faces. */
export function Box({ a, b, c, w, d, h, accent = false }: BoxProps) {
  const cls = accent ? "rf-iso-accent" : "rf-iso-line";

  return (
    <>
      <path
        className={cls}
        d={poly([
          [a, b + d, c],
          [a + w, b + d, c],
          [a + w, b + d, c + h],
          [a, b + d, c + h],
        ])}
      />
      <path
        className={cls}
        d={poly([
          [a + w, b, c],
          [a + w, b + d, c],
          [a + w, b + d, c + h],
          [a + w, b, c + h],
        ])}
      />
      <path
        className={cls}
        d={poly([
          [a, b, c + h],
          [a + w, b, c + h],
          [a + w, b + d, c + h],
          [a, b + d, c + h],
        ])}
      />
    </>
  );
}

/** A flat footprint on the ground plane, used for outlines and ghosts. */
export function Footprint({
  a,
  b,
  w,
  d,
  c = 0,
  className = "rf-iso-ghost",
}: {
  a: number;
  b: number;
  w: number;
  d: number;
  c?: number;
  className?: string;
}) {
  return (
    <path
      className={className}
      d={poly([
        [a, b, c],
        [a + w, b, c],
        [a + w, b + d, c],
        [a, b + d, c],
      ])}
    />
  );
}

/** The dashed ground plane every model sits on. */
export function Ground({ extent = 96, step = 32 }: { extent?: number; step?: number }) {
  const ticks: number[] = [];
  for (let v = -extent; v <= extent; v += step) ticks.push(v);

  return (
    <g>
      {ticks.map((t) => (
        <path
          key={`a${t}`}
          className="rf-iso-grid"
          d={segment([t, -extent, 0], [t, extent, 0])}
        />
      ))}
      {ticks.map((t) => (
        <path
          key={`b${t}`}
          className="rf-iso-grid"
          d={segment([-extent, t, 0], [extent, t, 0])}
        />
      ))}
      <path
        className="rf-iso-ground"
        d={poly([
          [-extent, -extent, 0],
          [extent, -extent, 0],
          [extent, extent, 0],
          [-extent, extent, 0],
        ])}
      />
    </g>
  );
}

/** A small square marker sitting at an isometric point. */
export function Marker({ at, accent = true }: { at: Vec3; accent?: boolean }) {
  const [x, y] = project(at[0], at[1], at[2]).split(" ").map(Number);
  return (
    <rect
      className={accent ? "rf-iso-dot" : "rf-iso-dot-muted"}
      x={x - 3.5}
      y={y - 3.5}
      width="7"
      height="7"
    />
  );
}
