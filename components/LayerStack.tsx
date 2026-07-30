"use client";

import { Box, box, Ground, port, project, segment } from "@/components/stage-models/iso";
import { LAYERS } from "@/lib/content/layers";

/** Bottom plate first: painter order runs from the ground up. */
const PLANES = [...LAYERS]
  .reverse()
  .map((layer, i) => ({ layer, spec: box(-70, -70, 8 + i * 34, 140, 140, 11) }));

/** The spines run through every plane, so the stack reads as one build. */
const SPINES: [number, number][] = [
  [-52, -52],
  [46, -52],
  [-52, 46],
];

const TOP = PLANES[PLANES.length - 1].spec;
const BOTTOM = PLANES[0].spec;

/**
 * Fitted to this drawing rather than borrowing the stage models' viewBox.
 *
 * Measured against `project()`: the geometry spans x 81–399 and y −21–262, so
 * the shared `0 0 480 320` clipped the top plate off the top edge and left
 * ~58px dead at the bottom. That is why it looked off-centre.
 */
const VIEWBOX = "69 -33 342 307";

/** Screen point for a plate's label — near-left corner of its top face. */
function nameAt(spec: (typeof PLANES)[number]["spec"]): [number, number] {
  const [x, y] = project(...port(spec, "top", 0.06, 0.78)).split(" ").map(Number);
  return [x, y];
}

/**
 * The four capability layers as one drawing.
 *
 * Four separate models said "here are four things we do". One connected stack
 * says "these are engineered together", which is the actual claim. Hovering or
 * focusing a row lifts its plane; the resting state — server output, no
 * JavaScript, reduced motion — is all four planes visible and connected.
 */
export default function LayerStack({ active }: { active: string | null }) {
  const current = PLANES.find((p) => p.layer.index === active);

  return (
    // Capped so the drawing's height stays close to the list beside it —
    // unbounded it ran ~100px taller and left dead space under the rows.
    <figure className="rf-iso-frame mx-auto max-w-[30rem]">
      <figcaption className="rf-iso-caption">
        <span className="rf-utility">Model / One system</span>
        <span className="rf-utility rf-iso-state">
          {current ? current.layer.name : "Four layers"}
        </span>
      </figcaption>

      <div className="rf-iso">
        <svg viewBox={VIEWBOX} aria-hidden="true" focusable="false">
          <Ground extent={92} step={32} />

          {/* One continuous spine per column, bottom plate to top. Drawn before
              the plates so each plate occludes the segment passing through it —
              which is what makes the spine read as threading the stack rather
              than lying in front of it. */}
          {SPINES.map(([a, b]) => (
            <path
              key={`spine-${a}:${b}`}
              className="rf-iso-spine"
              d={segment([a, b, BOTTOM.c], [a, b, TOP.c + TOP.h])}
            />
          ))}

          {PLANES.map(({ layer, spec }) => {
            const isActive = active === layer.index;
            // Label sits on the plane's near-left corner, on the top face, so
            // it reads as printed on the layer rather than floating beside it.
            const [lx, ly] = nameAt(spec);

            return (
              <g
                key={layer.index}
                className="rf-plane"
                data-active={isActive}
                data-dim={active !== null && !isActive}
              >
                <Box spec={spec} accent={isActive} />
                {/* Index only. Four spelled-out names at once collided with each
                    other and with the plate edges above them. */}
                <text className="rf-plane-label" x={lx} y={ly}>
                  {layer.index}
                </text>
              </g>
            );
          })}

          {/* The active layer's name, drawn after every plate. Inside its own
              group it was painted before the plates above it and came out
              half-occluded. */}
          {current ? (
            <text
              className="rf-plane-name"
              x={nameAt(current.spec)[0] + 24}
              y={nameAt(current.spec)[1] - 9}
            >
              {current.layer.name}
            </text>
          ) : null}
        </svg>
      </div>
    </figure>
  );
}
