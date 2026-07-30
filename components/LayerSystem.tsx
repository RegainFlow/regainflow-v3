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
        Hover a layer to see where it sits
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <LayerStack active={active} />
          </div>
        </div>

        {/* `self-start`: the grid row is as tall as the sticky diagram beside it,
            and a stretched list drags its spine down into empty space below the
            last layer. */}
        <ol className="rf-layers self-start lg:col-span-6 lg:col-start-1 lg:row-start-1">
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
                onClick={() =>
                  setActive((id) => (id === layer.index ? null : layer.index))
                }
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
