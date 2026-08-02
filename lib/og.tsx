import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { MONO_ADVANCE, ogMonogram } from "@/lib/ascii/og";
import { SITE_NAME } from "@/lib/site";

/**
 * The shared OG card.
 *
 * Satori cannot read Tailwind or CSS custom properties, so the palette is
 * repeated here as literals — this file and `@theme` in `globals.css` are two
 * sources for one set of colours, and a palette change has to be applied to
 * both by hand. That is the cost of generating the card instead of shipping a
 * PNG, and it is worth it: a static file would drift from the positioning copy
 * far faster than the hexes will drift from the theme.
 */
const VOID = "#050912";
const WARM = "#f2f5fa";
const FLOW = "#2f6bff";
const SLATE = "#8b96aa";
const HAIRLINE = "#253149";
const FLOW_SOFT = "#6e9bff";

const MONO = "IBM Plex Mono";
const DISPLAY = "Space Grotesk";

/**
 * `next/font/google` only emits hash-named `.woff2` into `.next`, and Satori
 * does not read woff2 — so the binaries are vendored under `app/fonts` and read
 * from disk at build time. They never reach the browser; the site itself still
 * loads its webfonts through `next/font`.
 */
export async function ogFonts() {
  const [mono, display] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/IBMPlexMono-Regular.ttf")),
    readFile(join(process.cwd(), "app/fonts/SpaceGrotesk-SemiBold.ttf")),
  ]);

  return [
    { name: MONO, data: mono, weight: 400 as const, style: "normal" as const },
    {
      name: DISPLAY,
      data: display,
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * The card's own geometry. Satori has no percentage-free way to let a flex child
 * shrink predictably, so the text column is sized explicitly from these rather
 * than left to `minWidth: 0` — which silently let a long lead run off the right
 * edge of the card.
 */
const PAD_X = 72;
const GAP = 48;
/** How wide the mark is allowed to be on the 1200px card. */
const MARK_WIDTH = 380;
const TEXT_WIDTH = 1200 - PAD_X * 2 - MARK_WIDTH - GAP;

/**
 * The RF mark, as two stacked layers of dots.
 *
 * Depth sits behind the face, exactly as the hero stacks them, so the extrusion
 * reads as one solid rather than as a letter with a shadow. Each row is its own
 * div rather than a single `pre`: Satori's `white-space` handling across a
 * multi-line text node is not dependable, and ASCII that loses a leading space
 * does not degrade gracefully — it looks broken.
 */
function Monogram() {
  const { face, depth, cols, rows } = ogMonogram();

  // Derived, not chosen: the cell must stay square or the letterform stretches.
  const fontSize = MARK_WIDTH / (cols * MONO_ADVANCE);
  const cell = fontSize * MONO_ADVANCE;

  const layer = (lines: string[], color: string) => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        color,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: MONO,
            fontSize,
            lineHeight: `${cell}px`,
            height: cell,
            whiteSpace: "pre",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: MARK_WIDTH,
        height: rows * cell,
        flexShrink: 0,
      }}
    >
      {layer(depth, FLOW)}
      {layer(face, WARM)}
    </div>
  );
}

export interface OgCardProps {
  /** Tracked mono line above the title. */
  eyebrow: string;
  title: string;
  lead: string;
  /** Replaces the stage list bottom-left. Used by the case study cards. */
  meta?: string;
}

export function ogCard({ eyebrow, title, lead, meta }: OgCardProps) {
  // Long case study titles need to give way before they wrap to three lines.
  const titleSize = title.length > 46 ? 46 : title.length > 28 ? 58 : 88;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: VOID,
        padding: `64px ${PAD_X}px`,
        color: WARM,
        fontFamily: DISPLAY,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 56, height: 2, background: FLOW }} />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: SLATE,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: GAP }}>
        <Monogram />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            // Explicit, not `minWidth: 0` — Satori sized this column to its
            // content instead of shrinking it, and the lead ran off the card.
            width: TEXT_WIDTH,
          }}
        >
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.3, color: SLATE }}>
            {lead}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 24,
          fontFamily: MONO,
          fontSize: 21,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: FLOW_SOFT,
        }}
      >
        <div style={{ display: "flex" }}>
          {meta ?? "Discover · Implement · Scale"}
        </div>
        <div style={{ display: "flex", color: SLATE }}>
          {SITE_NAME.toLowerCase()}.com
        </div>
      </div>
    </div>
  );
}
