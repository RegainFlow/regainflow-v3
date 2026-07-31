"use client";

import Link from "next/link";
import { useState } from "react";

import LayerStack from "@/components/LayerStack";
import { LAYERS } from "@/lib/content/layers";

/**
 * The four layers and the stack they form, side by side.
 *
 * One component serves both pages: home shows names and mechanisms, `/services`
 * adds the line describing what each layer enables. Both read
 * `lib/content/layers.ts`, so the two cannot drift.
 */
export default function LayerSystem({ detailed = false }: { detailed?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <p className="rf-utility mt-8 text-rf-flow-soft">
        <span className="rf-on-touch">Tap</span>
        <span className="rf-on-pointer">Hover</span> a layer to see where it sits
      </p>

      {/* Grid only from `lg`. Below that it is a plain block container, which is
          what gives the pinned model something to travel inside — a grid item's
          containing block is its own grid area, so `sticky` there has nowhere
          to go. */}
      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-14">
        {/* Below `lg` this element does the sticking, against the tall block
            container. From `lg` it is a stretched grid item and the inner
            wrapper sticks inside it instead. */}
        <div className="rf-model-pin sticky top-16 lg:static lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <LayerStack active={active} />
          </div>
        </div>

        {/* `self-start`: the grid row is as tall as the sticky diagram beside it,
            and a stretched list drags its spine down into empty space below the
            last layer. */}
        <ol className="rf-layers mt-10 self-start lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:mt-0">
          {LAYERS.map((layer) => (
            <li
              key={layer.index}
              className="rf-layer"
              data-active={active === layer.index || undefined}
              onMouseEnter={() => setActive(layer.index)}
              onMouseLeave={() => setActive(null)}
            >
              {/* A real control, so the diagram is reachable by keyboard and not
                  only by pointer. The stack is decorative, which is why this
                  only ever changes emphasis. */}
              <button
                type="button"
                className="rf-layer-toggle"
                aria-pressed={active === layer.index}
                onFocus={() => setActive(layer.index)}
                onBlur={() => setActive(null)}
                // Sets rather than toggles, and that is the whole fix for
                // touch: a tap fires focus before click, so by the time a
                // toggle ran, `active` was already this row and the tap
                // cleared it again — the row looked dead. Deselection happens
                // on blur, or by choosing another row.
                onClick={() => setActive(layer.index)}
              >
                <span className="rf-layer-head">
                  <span className="rf-index">{layer.index}</span>
                  <span className="rf-layer-name">{layer.name}</span>
                  <span className="sr-only"> — highlight this layer</span>
                </span>

                {detailed ? (
                  <span className="rf-layer-enables">{layer.enables}</span>
                ) : null}

                <span className="rf-mech">
                  {layer.mechanisms.map((mechanism) => (
                    <span key={mechanism}>{mechanism}</span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Outside the list: an `li` here would extend the spine down into it. */}
      {!detailed ? (
        <p className="mt-10">
          <Link href="/services" className="rf-cta-secondary">
            See every capability
          </Link>
        </p>
      ) : null}
    </>
  );
}
