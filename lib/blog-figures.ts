/**
 * The fenced blocks a post body can carry beyond plain markdown, and the
 * image-size hint the publishing pipeline writes onto image URLs.
 *
 *     ```callout
 *     {"kind": "definition", "title": "…", "body": "…"}
 *     ```
 *
 * Diagrams are HTML and CSS, never an image of words (`docs/DESIGN.md`), and a
 * table row cannot hold a process, a chart or a video. So the shapes a post
 * actually needs are declared as JSON in the markdown and rendered by
 * `components/BlogFigures.tsx`.
 *
 * Every parser returns `null` for anything malformed, and the renderer then
 * shows the fence as an ordinary code block. A typo in a table editor should
 * produce a visibly wrong block, not a crashed page.
 *
 * Import-free, and pure, so `scripts/blog/figures.test.mts` can exercise it.
 */

export interface CalloutFigure {
  kind: "note" | "warning" | "definition";
  title: string;
  body: string;
}

export interface StepsFigure {
  caption: string;
  steps: { title: string; detail: string }[];
}

export interface BarsFigure {
  caption: string;
  /** Appended to each value, e.g. "%". */
  unit: string;
  bars: { label: string; value: number; note?: string }[];
  /** The line under the chart saying where the numbers came from. */
  source: string;
}

/** A YouTube video, shown as a still until the reader asks for the player. */
export interface VideoFigure {
  /** The 11-character YouTube id, never a URL. */
  youtube: string;
  /** Names the iframe and the play button for a screen reader. */
  title: string;
  caption?: string;
}

export const FIGURE_LANGUAGES = ["callout", "steps", "bars", "video"] as const;
export type FigureLanguage = (typeof FIGURE_LANGUAGES)[number];

function json(text: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function parseCallout(text: string): CalloutFigure | null {
  const value = json(text);
  if (!value) return null;

  const { kind, title, body } = value;
  if (kind !== "note" && kind !== "warning" && kind !== "definition") return null;
  if (!isText(title) || !isText(body)) return null;

  return { kind, title, body };
}

export function parseSteps(text: string): StepsFigure | null {
  const value = json(text);
  if (!value || !isText(value.caption) || !Array.isArray(value.steps)) return null;

  const steps = value.steps.filter(
    (step): step is { title: string; detail: string } =>
      !!step && isText(step.title) && isText(step.detail),
  );

  // A process of one is not a process, and a silently dropped step is worse
  // than showing the fence raw.
  if (steps.length < 2 || steps.length !== value.steps.length) return null;

  return {
    caption: value.caption,
    steps: steps.map(({ title, detail }) => ({ title, detail })),
  };
}

export function parseBars(text: string): BarsFigure | null {
  const value = json(text);
  if (!value || !isText(value.caption) || !isText(value.source)) return null;
  if (!Array.isArray(value.bars) || value.bars.length === 0) return null;

  const bars = value.bars.filter(
    (bar): bar is { label: string; value: number; note?: string } =>
      !!bar &&
      isText(bar.label) &&
      typeof bar.value === "number" &&
      Number.isFinite(bar.value) &&
      bar.value >= 0 &&
      (bar.note === undefined || typeof bar.note === "string"),
  );
  if (bars.length !== value.bars.length) return null;

  return {
    caption: value.caption,
    unit: typeof value.unit === "string" ? value.unit : "",
    bars: bars.map(({ label, value: n, note }) => ({
      label,
      value: n,
      ...(note ? { note } : {}),
    })),
    source: value.source,
  };
}

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * An id and nothing else, so the fence can never point the iframe at an
 * arbitrary origin: the player URL is built from the id, not taken from the
 * post.
 */
export function parseVideo(text: string): VideoFigure | null {
  const value = json(text);
  if (!value || !isText(value.title)) return null;
  if (typeof value.youtube !== "string" || !YOUTUBE_ID.test(value.youtube)) return null;
  if (value.caption !== undefined && typeof value.caption !== "string") return null;

  return {
    youtube: value.youtube,
    title: value.title,
    ...(isText(value.caption) ? { caption: value.caption } : {}),
  };
}

/**
 * Splits `…/shot.png#1600x900` into the URL and its intrinsic size.
 *
 * `pnpm blog prepare` measures every body image and writes its size into the
 * fragment, which the browser never sends to the server, so the URL still
 * resolves unchanged. With a size, the image renders at its own ratio with its
 * space reserved (no CLS). Without one (a hand-typed URL), the renderer
 * letterboxes rather than crops, because a cropped screenshot loses exactly
 * the edge someone was pointing at.
 */
export function parseImageSize(src: string): {
  src: string;
  width?: number;
  height?: number;
} {
  const match = /#(\d{1,5})x(\d{1,5})$/.exec(src);
  if (!match) return { src };

  const width = Number(match[1]);
  const height = Number(match[2]);
  const bare = src.slice(0, match.index);

  return width > 0 && height > 0 ? { src: bare, width, height } : { src: bare };
}
