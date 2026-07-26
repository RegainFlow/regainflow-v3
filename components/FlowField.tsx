/**
 * Ambient flow behind the hero.
 *
 * Picks up the light streams from the brand render so the model sits inside a
 * field rather than on flat navy. Two passes over the same curves: a static
 * hairline for the stream itself, and a dotted pass that drifts along it.
 *
 * Purely decorative, so it stays out of the accessibility tree and takes no
 * pointer events. Masked at the edges by `.rf-flow` so it never competes with
 * the copy on the left.
 */

const STREAMS = [
  "M-40 118 C 220 66, 420 172, 660 128 S 1020 44, 1240 96",
  "M-40 214 C 200 168, 430 262, 690 226 S 1030 150, 1240 198",
  "M-40 300 C 240 268, 440 350, 700 312 S 1040 244, 1240 286",
  "M-40 392 C 210 358, 460 438, 710 400 S 1030 330, 1240 372",
  "M-40 486 C 230 452, 450 528, 700 490 S 1050 418, 1240 462",
];

export default function FlowField() {
  return (
    <div className="rf-flow" aria-hidden="true">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="none" focusable="false">
        {STREAMS.map((d, i) => (
          <path key={`line-${i}`} className="rf-flow-line" d={d} />
        ))}
        {STREAMS.map((d, i) => (
          <path
            key={`pulse-${i}`}
            className="rf-flow-pulse"
            d={d}
            // Offsetting each stream keeps the drift from marching in lockstep.
            style={{ animationDelay: `${i * -4.4}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
