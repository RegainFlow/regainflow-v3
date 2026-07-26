import type { CSSProperties } from "react";

import { Box, Footprint, Ground, ISO_VIEWBOX, Marker, segment } from "./iso";

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

/** Stagger for the play sequence. */
function at(seconds: number): CSSProperties {
  return { "--rf-delay": `${seconds}s` } as CSSProperties;
}

/**
 * Discover — survey the field, then commit to one thing.
 * Candidates arrive one at a time, the chosen cell is marked, and the
 * opportunity rises out of the field.
 */
function DiscoverModel() {
  const candidates: [number, number][] = [
    [-78, -66],
    [30, -70],
    [46, -26],
    [-70, 34],
    [-34, -18],
    [8, 40],
    [58, 46],
  ];

  return (
    <>
      <Ground />

      {candidates.map(([a, b], i) => (
        <g key={`${a}:${b}`} className="rf-anim-appear" style={at(0.1 + i * 0.11)}>
          <Box a={a} b={b} c={0} w={22} d={22} h={8} />
        </g>
      ))}

      {/* the cell that turns out to be worth it */}
      <g className="rf-anim-appear" style={at(1.05)}>
        <Footprint a={-14} b={-8} w={30} d={30} />
      </g>

      {/* lifted out of the field */}
      <g className="rf-anim-rise" style={at(1.3)}>
        <Box a={-14} b={-8} c={0} w={30} d={30} h={72} accent />
        <Marker at={[1, 7, 72]} />
      </g>

      {/* measured against the rest */}
      <g className="rf-anim-appear" style={at(1.9)}>
        <path
          className="rf-iso-thin"
          d={segment([16, -8, 0], [46, -8, 0], [46, -8, 72])}
        />
        <path className="rf-iso-thin" d={segment([16, -8, 72], [46, -8, 72])} />
      </g>
    </>
  );
}

/**
 * Implement — the layers put together.
 * Plates drop into place bottom-to-top with their supports, then one route is
 * threaded up through every layer.
 */
function ImplementModel() {
  const layers = [
    { c: 0, delay: 0.1 },
    { c: 46, delay: 0.55 },
    { c: 92, delay: 1.0 },
  ];
  const posts: [number, number][] = [
    [-52, -52],
    [40, -52],
    [-52, 40],
  ];

  return (
    <>
      <Ground extent={80} step={32} />

      {layers.map((layer, i) => (
        <g key={layer.c}>
          {/* supports go in before the plate that lands on them */}
          {i > 0 ? (
            <g className="rf-anim-appear" style={at(layer.delay - 0.18)}>
              {posts.map(([a, b]) => (
                <path
                  key={`${a}:${b}`}
                  className="rf-iso-thin"
                  d={segment([a, b, layers[i - 1].c + 12], [a, b, layer.c])}
                />
              ))}
            </g>
          ) : null}
          <g className="rf-anim-drop" style={at(layer.delay)}>
            <Box a={-56} b={-56} c={layer.c} w={112} d={112} h={12} />
          </g>
        </g>
      ))}

      {/* one route threaded through the finished stack, drawn in the gaps */}
      <g className="rf-anim-draw" style={at(1.45)}>
        <path className="rf-iso-route" d={segment([34, 34, 12], [34, 34, 46])} />
      </g>
      <g className="rf-anim-draw" style={at(1.65)}>
        <path className="rf-iso-route" d={segment([34, 34, 58], [34, 34, 92])} />
      </g>
      <g className="rf-anim-draw" style={at(1.85)}>
        <path className="rf-iso-route" d={segment([34, 34, 104], [34, 34, 128])} />
      </g>
      <g className="rf-anim-appear" style={at(2.15)}>
        <Marker at={[34, 34, 128]} />
      </g>
    </>
  );
}

/**
 * Scale — one working system becomes many, each iteration taller than the last,
 * with evidence routing back to the start.
 */
function ScaleModel() {
  // Painter order: ascending a + b, so nearer volumes cover farther ones.
  const units = [
    { a: -62, b: -62, h: 40, delay: 0.15, accent: false },
    { a: 6, b: -62, h: 54, delay: 0.55, accent: false },
    { a: -62, b: 6, h: 68, delay: 0.95, accent: false },
    { a: 6, b: 6, h: 82, delay: 1.35, accent: true },
  ];

  return (
    <>
      <Ground extent={92} step={32} />

      <g className="rf-anim-appear" style={at(0.05)}>
        <Box a={-76} b={-76} c={0} w={152} d={152} h={10} />
      </g>

      {units.map((u) => (
        <g key={`${u.a}:${u.b}`} className="rf-anim-rise" style={at(u.delay)}>
          <Box a={u.a} b={u.b} c={10} w={56} d={56} h={u.h} accent={u.accent} />
        </g>
      ))}

      {/* Evidence returning to the first iteration. Held at b = 88, in front of
          every unit (b <= 62), so painting it last is also correct depth. */}
      <g className="rf-anim-draw" style={at(1.8)}>
        <path
          className="rf-iso-route"
          d={segment([34, 34, 92], [34, 88, 92], [-88, 88, 92], [-88, 88, 56])}
        />
      </g>
      <g className="rf-anim-appear" style={at(2.35)}>
        <Marker at={[-88, 88, 56]} />
      </g>
    </>
  );
}

/**
 * Work — built beside you on shared ground, and able to move fully across.
 */
function WorkModel() {
  return (
    <>
      <Ground extent={88} step={32} />

      <g className="rf-anim-appear" style={at(0.1)}>
        <Box a={-96} b={-44} c={0} w={80} d={88} h={10} />
      </g>
      <g className="rf-anim-appear" style={at(0.35)}>
        <Box a={16} b={-44} c={0} w={80} d={88} h={10} />
      </g>

      <g className="rf-anim-appear" style={at(0.6)}>
        <path className="rf-iso-thin" d={segment([-16, -20, 5], [16, -20, 5])} />
        <path className="rf-iso-thin" d={segment([-16, 28, 5], [16, 28, 5])} />
      </g>

      {/* the capability, currently spanning both */}
      <g className="rf-anim-rise" style={at(0.85)}>
        <Box a={-40} b={-24} c={10} w={80} d={48} h={40} accent />
      </g>

      {/* and where it sits after a clean transfer */}
      <g className="rf-anim-appear" style={at(1.5)}>
        <Footprint a={26} b={-24} w={60} d={48} c={10} />
        <path
          className="rf-iso-ghost"
          d={segment([26, -24, 10], [26, -24, 40], [86, -24, 40], [86, -24, 10])}
        />
      </g>
      <g className="rf-anim-draw" style={at(1.8)}>
        <path className="rf-iso-route" d={segment([40, 0, 52], [72, 0, 52])} />
      </g>
      <g className="rf-anim-appear" style={at(2.1)}>
        <Marker at={[72, 0, 52]} />
      </g>
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
