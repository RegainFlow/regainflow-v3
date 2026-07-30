/**
 * Isometric drawing primitives.
 *
 * One projection for every model so they read as a single set:
 *   +a runs right-and-down, +b runs left-and-down, +c runs straight up.
 * Visible faces of any box are therefore the top (c + h), the +a side, and the
 * +b side. Faces carry a Navy fill so overlapping solids occlude correctly —
 * which means blocks must be emitted back-to-front, lowest (a + b) first.
 *
 * ## The connection rule
 *
 * A route may only begin and end at a `port` on a `BoxSpec`. That is why solids
 * are declared as objects rather than as inline props: a port is computed from
 * the solid it belongs to, so a line cannot miss the face it is supposed to
 * touch. `Route` derives its own elbows, so no model hand-writes coordinates
 * that happen to land in mid-air. Every terminal gets a node, so both ends are
 * visibly attached to something.
 *
 * If you find yourself reaching for `segment()` to draw a connection, you are
 * about to reintroduce the bug this file was rewritten to remove. `segment()`
 * is for structure — posts, ground ties — not for flow.
 */

import type { CSSProperties } from "react";

export type Vec3 = [a: number, b: number, c: number];

const COS30 = 0.8660254;
const ORIGIN_X = 240;
// Tuned against measured bounding boxes so every model's geometry sits centred
// in the frame.
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

/** Animation stagger, shared by every model. */
export function at(seconds: number): CSSProperties {
  return { "--rf-delay": `${seconds}s` } as CSSProperties;
}

/* --------------------------------------------------------------------------
   Solids
-------------------------------------------------------------------------- */

export interface BoxSpec {
  a: number;
  b: number;
  c: number;
  w: number;
  d: number;
  h: number;
}

export function box(
  a: number,
  b: number,
  c: number,
  w: number,
  d: number,
  h: number,
): BoxSpec {
  return { a, b, c, w, d, h };
}

/** A solid box drawn as its three visible faces. */
export function Box({
  spec,
  accent = false,
  dim = false,
}: {
  spec: BoxSpec;
  accent?: boolean;
  dim?: boolean;
}) {
  const { a, b, c, w, d, h } = spec;
  const cls = accent ? "rf-iso-accent" : dim ? "rf-iso-dim" : "rf-iso-line";

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

/* --------------------------------------------------------------------------
   Ports and routes
-------------------------------------------------------------------------- */

export type Face = "top" | "a" | "b";

/**
 * A point on a box face. `u` and `v` run 0–1 across that face, so a port can
 * never land off the solid it belongs to.
 *
 * - `top` — the upward face; u across +a, v across +b.
 * - `a`   — the +a side, the one facing right-and-down; u across +b, v up.
 * - `b`   — the +b side, the one facing left-and-down; u across +a, v up.
 */
export function port(spec: BoxSpec, face: Face, u = 0.5, v = 0.5): Vec3 {
  const { a, b, c, w, d, h } = spec;

  if (face === "top") return [a + w * u, b + d * v, c + h];
  if (face === "a") return [a + w, b + d * u, c + h * v];
  return [a + w * u, b + d, c + h * v];
}

/**
 * An axis-aligned path between two ports.
 *
 * The elbows are derived here rather than supplied: travel +c first, then +a,
 * then +b, then +c again. That ordering keeps a route reading as leaving a
 * surface, crossing, and arriving — never as a diagonal floating over the
 * scene. `via` inserts a waypoint when a route has to go around something.
 */
export function routePath(from: Vec3, to: Vec3, via?: Vec3 | Vec3[]): Vec3[] {
  const legs = (start: Vec3, end: Vec3): Vec3[] => {
    const points: Vec3[] = [start];
    const [a0, b0, c0] = start;
    const [a1, b1, c1] = end;

    // Lift clear of the starting face before travelling.
    const cross = Math.max(c0, c1);
    if (cross !== c0) points.push([a0, b0, cross]);
    if (a1 !== a0) points.push([a1, b0, cross]);
    if (b1 !== b0) points.push([a1, b1, cross]);
    if (c1 !== cross) points.push([a1, b1, c1]);

    return points;
  };

  const waypoints = via ? (Array.isArray(via[0]) ? (via as Vec3[]) : [via as Vec3]) : [];
  const stops = [from, ...waypoints, to];

  return stops.slice(0, -1).reduce<Vec3[]>((path, start, i) => {
    const leg = legs(start, stops[i + 1]);
    // Each stop is the last point of one leg and the first of the next.
    return i === 0 ? leg : [...path, ...leg.slice(1)];
  }, []);
}

interface RouteProps {
  from: Vec3;
  to: Vec3;
  via?: Vec3 | Vec3[];
  /** Both terminals get a node by default — that is what makes a route read
   *  as attached. Drop one only when a solid already covers the join. */
  nodes?: "both" | "start" | "end" | "none";
  className?: string;
}

export function Route({
  from,
  to,
  via,
  nodes = "both",
  className,
}: RouteProps) {
  const points = routePath(from, to, via);
  const d = segment(...points);

  return (
    <g className={className}>
      <path className="rf-iso-route" d={d} />
      {nodes === "both" || nodes === "start" ? <Node at={from} /> : null}
      {nodes === "both" || nodes === "end" ? <Node at={to} /> : null}
    </g>
  );
}

/**
 * A travelling pulse along a route, so the line reads as carrying something.
 * Same seamless dash technique as the converging-routes glyph in `ClosingCTA`.
 */
export function Flow({
  from,
  to,
  via,
  delay = 0,
}: {
  from: Vec3;
  to: Vec3;
  via?: Vec3 | Vec3[];
  delay?: number;
}) {
  return (
    <path
      className="rf-iso-pulse"
      d={segment(...routePath(from, to, via))}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

/** The square that marks a route terminal. */
export function Node({ at: point, muted = false }: { at: Vec3; muted?: boolean }) {
  const [x, y] = project(point[0], point[1], point[2]).split(" ").map(Number);
  return (
    <rect
      className={muted ? "rf-iso-node-muted" : "rf-iso-node"}
      x={x - 3}
      y={y - 3}
      width="6"
      height="6"
    />
  );
}

/* --------------------------------------------------------------------------
   Ground and outlines
-------------------------------------------------------------------------- */

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
export function Ground({
  extent = 96,
  step = 32,
}: {
  extent?: number;
  step?: number;
}) {
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
