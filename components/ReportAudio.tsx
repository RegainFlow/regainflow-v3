import type { CSSProperties } from "react";

import ReportAudioPlayer from "@/components/ReportAudioPlayer";
import { frames } from "@/lib/ascii/monogram";

/**
 * The audio overview that accompanies a report.
 *
 * A server component whose only job is to draw the RF mark and hand it to the
 * client transport in `ReportAudioPlayer`. The mark comes from the same raymarch
 * the hero uses, and it stays on this side of the boundary for the same reason
 * `AsciiMonogram` is a server component: the letterform never animates, so
 * shipping the generator to the browser would cost bundle size to recompute a
 * constant.
 *
 * Ungated on purpose: the audio is the hook that makes the PDF worth an email,
 * so putting it behind the same ask would be charging admission twice.
 */

/**
 * The source grid.
 *
 * Deliberately larger than the tile needs, because `frames` places the mark at a
 * fixed fraction of the grid rather than filling it — it is composed to sit
 * off-centre behind a hero headline, which is the opposite of what a thumbnail
 * wants. `crop` below reclaims the resolution; rendering straight into a small
 * grid instead would produce a mark a few cells wide floating in dead space.
 */
const GRID = { cols: 110, rows: 84 };

/**
 * Trim both layers to the mark's own bounding box.
 *
 * Measured from the output rather than derived from the placement constants in
 * `lib/ascii/monogram.ts`. Those constants are private to that module and exist
 * to serve the hero; reading the drawing that actually came back means this tile
 * stays correct if the composition there is ever retuned, instead of silently
 * drifting off-centre.
 *
 * The two layers are cropped to one shared box, not to their own — they are a
 * letterform and its extrusion and have to stay registered to each other.
 */
function crop(face: string, depth: string) {
  const f = face.split("\n");
  const d = depth.split("\n");

  let top = Infinity;
  let bottom = -1;
  let left = Infinity;
  let right = -1;

  for (let y = 0; y < f.length; y++) {
    const width = Math.max(f[y].length, d[y].length);

    for (let x = 0; x < width; x++) {
      if ((f[y][x] ?? " ") === " " && (d[y][x] ?? " ") === " ") continue;

      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  const cols = right - left + 1;

  // Padded to a rectangle. A `pre` with ragged lines would leave the two layers
  // disagreeing about their own width, and the overlay depends on them matching.
  const slice = (lines: string[]) =>
    lines
      .slice(top, bottom + 1)
      .map((line) => line.slice(left, right + 1).padEnd(cols, " "))
      .join("\n");

  return { face: slice(f), depth: slice(d), cols };
}

/**
 * Drawn once, at module scope.
 *
 * It is a pure function of two constants, and the report page is `force-dynamic`
 * now — inside the component this would raymarch ~9,000 cells on every request
 * to produce a byte-identical result. Hoisting also keeps true what `frames`
 * says about itself: it runs once on the server and is never touched again.
 */
const MARK = (() => {
  // One call for both layers: the extrusion raymarch is the expensive part, and
  // asking for them separately walks every cell twice for one result.
  const drawn = frames(GRID.cols, GRID.rows);
  return crop(drawn.face, drawn.depth);
})();

export default function ReportAudio({
  src,
  length,
  slug,
  title,
  cover,
}: {
  src: string;
  length?: string;
  slug: string;
  /** For the OS media session — what the lock screen shows. */
  title: string;
  /** The report cover, used as media session artwork. */
  cover: string;
}) {
  const { face, depth, cols } = MARK;

  return (
    <ReportAudioPlayer
      src={src}
      length={length}
      slug={slug}
      title={title}
      cover={cover}
    >
      {/* Depth first, so the letterform sits over its own extrusion — the same
          layering and the same two blues as `AsciiMonogram`. */}
      <div className="rf-ascii-mark" style={{ "--rf-cols": cols } as CSSProperties}>
        <pre className="rf-ascii-mono-depth">{depth}</pre>
        <pre className="rf-ascii-mono-face">{face}</pre>
      </div>
    </ReportAudioPlayer>
  );
}
