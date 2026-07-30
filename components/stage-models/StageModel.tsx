import {
  at,
  Box,
  box,
  Flow,
  Footprint,
  Ground,
  ISO_VIEWBOX,
  Node,
  port,
  Route,
  segment,
  type BoxSpec,
} from "./iso";

export type StageModelId = "discover" | "implement" | "scale" | "work";

const CAPTION: Record<StageModelId, string> = {
  discover: "Model / Opportunity field",
  implement: "Model / Assembled system",
  scale: "Model / Operated at scale",
  work: "Model / Shared ownership",
};

/** Sits in the caption row, not floating in the corner of the drawing. */
const STATE: Record<StageModelId, string> = {
  discover: "Prioritized",
  implement: "Assembled",
  scale: "Scaled",
  work: "Transferable",
};

/**
 * Discover — one initiative worth funding, found among many.
 *
 * The candidates have *different* heights, because the whole point is that they
 * are not worth the same. A scan sweeps the field, one cell is marked, its block
 * rises, and the rest fall back. The route runs from the chosen block down to
 * the marked ground — the decision, attached at both ends.
 */
function DiscoverModel() {
  // The one that turns out to be worth it, at the centre of the field.
  const chosen = box(-16, -14, 0, 32, 32, 74);
  // What Discover actually hands over: a plan, not just an opinion.
  const plan = box(46, 4, 0, 40, 26, 8);

  const candidates: BoxSpec[] = [
    box(-84, -72, 0, 24, 24, 10),
    box(-30, -78, 0, 24, 24, 20),
    box(14, -74, 0, 24, 24, 8),
    box(-88, -18, 0, 24, 24, 16),
    box(18, -30, 0, 24, 24, 26),
    box(-80, 38, 0, 24, 24, 12),
    box(-24, 44, 0, 24, 24, 22),
    box(16, 46, 0, 24, 24, 14),
  ];

  // Solids are emitted back to front — ascending a + b — so nearer volumes
  // occlude farther ones. Sorting here rather than by hand keeps the chosen
  // block correctly behind the candidates in front of it, which hand-ordering
  // got wrong.
  const solids = [
    ...candidates.map((spec, i) => ({
      spec,
      kind: "candidate" as const,
      delay: 0.1 + i * 0.08,
    })),
    { spec: chosen, kind: "chosen" as const, delay: 1.35 },
    { spec: plan, kind: "plan" as const, delay: 1.75 },
  ].sort((x, y) => x.spec.a + x.spec.b - (y.spec.a + y.spec.b));

  const from = port(chosen, "a", 0.6, 0.55);
  const to = port(plan, "top", 0.4, 0.4);

  return (
    <>
      <Ground />

      {/* The sweep that finds it. */}
      <g className="rf-anim-scan" style={at(0.85)}>
        <path className="rf-iso-scan" d={segment([-96, -14, 1], [96, -14, 1])} />
      </g>

      <g className="rf-anim-appear" style={at(1.15)}>
        <Footprint a={-16} b={-14} w={32} d={32} className="rf-iso-select" />
      </g>

      {solids.map(({ spec, kind, delay }) => (
        <g
          key={`${spec.a}:${spec.b}`}
          className={kind === "chosen" ? "rf-anim-rise" : "rf-anim-appear"}
          style={at(delay)}
        >
          {/* Candidates dim once the choice is made — still on the table, no
              longer the subject. */}
          <Box spec={spec} accent={kind === "chosen"} dim={kind === "candidate"} />
        </g>
      ))}

      {/* The opportunity, committed to a plan. */}
      <g className="rf-anim-draw" style={at(2.05)}>
        <Route from={from} to={to} nodes="both" />
      </g>
      <Flow from={from} to={to} />
    </>
  );
}

/**
 * Implement — the layers assembled and threaded by one system.
 *
 * Plates land on their posts bottom to top, then a single continuous route
 * enters the base plate and threads up through a port on every plate above it.
 * One line, no gaps: the previous version drew three disconnected segments and
 * read as a broken wire.
 */
function ImplementModel() {
  const plates: BoxSpec[] = [
    box(-56, -56, 0, 112, 112, 12),
    box(-56, -56, 46, 112, 112, 12),
    box(-56, -56, 92, 112, 112, 12),
  ];
  const posts: [number, number][] = [
    [-52, -52],
    [40, -52],
    [-52, 40],
  ];

  // One system touching every layer, drawn as three legs that each cross a
  // real gap between two plates. A single route from base to top would run up
  // the outside corner and never touch the plates in between — which is what
  // "threaded through" has to actually mean.
  const legs = [
    { from: port(plates[0], "a", 0.62, 1), to: port(plates[1], "a", 0.62, 0) },
    { from: port(plates[1], "a", 0.62, 1), to: port(plates[2], "a", 0.62, 0) },
    { from: port(plates[2], "a", 0.62, 1), to: port(plates[2], "top", 0.74, 0.62) },
  ];

  return (
    <>
      <Ground extent={80} step={32} />

      {plates.map((spec, i) => (
        <g key={spec.c}>
          {/* Supports go in before the plate that lands on them. */}
          {i > 0 ? (
            <g className="rf-anim-appear" style={at(0.55 * i - 0.18)}>
              {posts.map(([a, b]) => (
                <path
                  key={`${a}:${b}`}
                  className="rf-iso-thin"
                  d={segment([a, b, plates[i - 1].c + 12], [a, b, spec.c])}
                />
              ))}
            </g>
          ) : null}
          <g className="rf-anim-drop" style={at(0.1 + 0.45 * i)}>
            <Box spec={spec} />
          </g>
        </g>
      ))}

      {legs.map((leg, i) => (
        <g key={i} className="rf-anim-draw" style={at(1.5 + i * 0.22)}>
          <Route from={leg.from} to={leg.to} nodes="both" />
        </g>
      ))}
      {/* Offset so the pulse reads as one thing climbing the stack. */}
      {legs.map((leg, i) => (
        <Flow key={i} from={leg.from} to={leg.to} delay={i * -0.55} />
      ))}
    </>
  );
}

/**
 * Scale — one working system becomes many, and evidence closes the loop.
 *
 * Four units, each taller than the last. The return route leaves the tallest
 * unit's top face and terminates on the *first* unit's side face: a closed
 * loop with both ends on a solid, rather than a line running out into empty
 * ground.
 */
function ScaleModel() {
  const platform = box(-76, -76, 0, 152, 152, 10);

  // Painter order: ascending a + b, so nearer volumes cover farther ones.
  const units: { spec: BoxSpec; delay: number; accent: boolean }[] = [
    { spec: box(-62, -62, 10, 56, 56, 40), delay: 0.35, accent: false },
    { spec: box(6, -62, 10, 56, 56, 54), delay: 0.7, accent: false },
    { spec: box(-62, 6, 10, 56, 56, 68), delay: 1.05, accent: false },
    { spec: box(6, 6, 10, 56, 56, 82), delay: 1.4, accent: true },
  ];

  const newest = units[3].spec;
  const first = units[0].spec;

  // Out of the newest unit's roof, over the estate, back down into the first
  // unit. The waypoint sits inside the platform footprint (b < 76) — at b = 84
  // the run hung off the side of the platform, which is the "line pointing at
  // nothing" problem in a different place.
  const from = port(newest, "top", 0.5, 0.5);
  const to = port(first, "b", 0.5, 0.55);
  const via: [number, number, number] = [34, 68, 100];

  return (
    <>
      <Ground extent={92} step={32} />

      <g className="rf-anim-appear" style={at(0.05)}>
        <Box spec={platform} />
      </g>

      {units.map((unit) => (
        <g
          key={`${unit.spec.a}:${unit.spec.b}`}
          className="rf-anim-rise"
          style={at(unit.delay)}
        >
          <Box spec={unit.spec} accent={unit.accent} />
        </g>
      ))}

      {/* Evidence from what is running now, returned to what shipped first. */}
      <g className="rf-anim-draw" style={at(1.85)}>
        <Route from={from} to={to} via={via} nodes="both" />
      </g>
      <Flow from={from} to={to} via={via} />
    </>
  );
}

/**
 * Work — built beside you on shared ground, and able to move fully across.
 *
 * The transfer route ends on a node sitting on the destination footprint, so
 * the handoff visibly lands somewhere instead of stopping in mid-air.
 */
function WorkModel() {
  const ours = box(-96, -44, 0, 80, 88, 10);
  const yours = box(16, -44, 0, 80, 88, 10);
  const capability = box(-40, -24, 10, 80, 48, 40);

  const destination = { a: 26, b: -24, w: 60, d: 48 };
  // On the client's platform, not floating above the outline of it.
  const landing = port(yours, "top", 0.5, 0.5);
  const from = port(capability, "a", 0.5, 0.8);

  return (
    <>
      <Ground extent={88} step={32} />

      <g className="rf-anim-appear" style={at(0.1)}>
        <Box spec={ours} />
      </g>
      <g className="rf-anim-appear" style={at(0.35)}>
        <Box spec={yours} />
      </g>

      {/* Shared ground: the two platforms tied together, not just adjacent. */}
      <g className="rf-anim-appear" style={at(0.6)}>
        <path
          className="rf-iso-thin"
          d={segment([-16, -20, 5], [16, -20, 5])}
        />
        <path className="rf-iso-thin" d={segment([-16, 28, 5], [16, 28, 5])} />
      </g>

      {/* The capability, currently spanning both. */}
      <g className="rf-anim-rise" style={at(0.85)}>
        <Box spec={capability} accent />
      </g>

      {/* And where it sits after a clean transfer. */}
      <g className="rf-anim-appear" style={at(1.5)}>
        <Footprint {...destination} c={10} />
        <Node at={landing} muted />
      </g>

      <g className="rf-anim-draw" style={at(1.8)}>
        <Route from={from} to={landing} nodes="start" />
      </g>
      <Flow from={from} to={landing} />
    </>
  );
}

const MODELS: Record<StageModelId, () => React.JSX.Element> = {
  discover: DiscoverModel,
  implement: ImplementModel,
  scale: ScaleModel,
  work: WorkModel,
};

export default function StageModel({
  model,
  className,
  /** Drives the desktop crossfade inside `.rf-iso-stack`. */
  "data-active": dataActive,
  /** Releases the build sequence. Absent means "render the finished model". */
  "data-play": dataPlay,
}: {
  model: StageModelId;
  className?: string;
  "data-active"?: boolean;
  "data-play"?: boolean;
}) {
  const Model = MODELS[model];

  return (
    <figure
      className={["rf-iso-frame", className].filter(Boolean).join(" ")}
      data-active={dataActive}
      data-play={dataPlay}
    >
      <figcaption className="rf-iso-caption">
        <span className="rf-utility">{CAPTION[model]}</span>
        <span className="rf-utility rf-iso-state rf-anim-appear" style={at(2.4)}>
          {STATE[model]}
        </span>
      </figcaption>
      {/* The stage name, copy, capability list and transformation label sit
          beside this and already carry the meaning. */}
      <div className="rf-iso">
        <svg viewBox={ISO_VIEWBOX} aria-hidden="true" focusable="false">
          <Model />
        </svg>
      </div>
    </figure>
  );
}
