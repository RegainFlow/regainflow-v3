/**
 * The hero image.
 *
 * One generation per study, and the constraints on it come from CSS rather
 * than taste: `.rf-case-cover` crops to 16:9 on the card and `.rf-case-hero` to
 * 21:9 on the study page, both with `object-fit: cover`. The API's nearest size
 * is 3:2, so **both crops eat the top and bottom** — a subject that fills the
 * frame vertically loses its head on the study page.
 *
 * That is why the preamble spends its words on the vertical band rather than on
 * adjectives. It is the one instruction that, if ignored, produces art that
 * looks fine in the preview folder and wrong on the page.
 */

import { RemoteError, requireEnv, withRetry } from "./core.mjs";

/**
 * The model, as one constant with one override.
 *
 * A model id is the single thing in this script most likely to be wrong a year
 * from now, and the cost of being wrong is a 400 with an unhelpful body. Keep
 * it here so that is a one-line fix rather than a search.
 */
export const IMAGE_MODEL = process.env.RF_IMAGE_MODEL ?? "gpt-image-1";

/** 3:2. The API offers no 16:9, and cropping in CSS is free while `sharp` is
 *  blocked in `pnpm-workspace.yaml`. */
export const IMAGE_SIZE = "1536x1024";
export const IMAGE_COMPRESSION = 82;

const ENDPOINT = "https://api.openai.com/v1/images/generations";

/**
 * The house preamble.
 *
 * Palette is quoted from `app/globals.css` rather than described, because
 * "dark blue" is not a colour and the studies have to sit next to each other.
 */
export const PROMPT_PREAMBLE = [
  "Abstract technical illustration for a B2B engineering consultancy case study.",
  "",
  "COMPOSITION — this is the hard constraint:",
  "The image is cropped to 21:9 and 16:9 from this 3:2 frame, cutting from the top and bottom.",
  "Keep every meaningful element inside the middle 60% horizontal band.",
  "Leave the top 20% and bottom 20% deliberately empty — ground, gradient, or negative space.",
  "Centre the subject. Do not fill the frame vertically.",
  "",
  "PALETTE — use only these:",
  "  #050912 near-black ground",
  "  #0a1222 raised surfaces",
  "  #253149 hairlines and structure",
  "  #2f6bff the single accent, used sparingly",
  "  #6e9bff a lighter accent for depth",
  "  #f2f5fa highlights",
  "",
  "FORBIDDEN: text, lettering, numbers, labels, watermarks, logos, brand marks,",
  "people, faces, hands, UI screenshots, dashboards, photorealism, stock-photo",
  "business imagery, clip art.",
  "",
  "STYLE: geometric, diagrammatic, restrained. Flat or subtly dimensional.",
  "Dark throughout — it sits on a #0a1222 panel with a hairline border.",
  "",
  "SUBJECT:",
].join("\n");

export function buildPrompt(subject: string): string {
  return `${PROMPT_PREAMBLE}\n${subject.trim()}\n`;
}

/** WebP is `RIFF....WEBP`. Checked because a PNG saved under a `.webp` name
 *  uploads with a lying Content-Type and renders as a broken image. */
export function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;

  const tag = (offset: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + 4));

  return tag(0) === "RIFF" && tag(8) === "WEBP";
}

export interface GeneratedImage {
  bytes: Uint8Array;
  model: string;
  size: string;
  prompt: string;
}

/**
 * Generate once, defensively.
 *
 * The response shape is not assumed: image models have returned base64 in
 * `b64_json` and a signed URL in `url` depending on the model and the year, so
 * both are handled rather than guessed at. The format assertion at the end is
 * what makes a wrong guess loud.
 */
export async function generateHero(subject: string): Promise<GeneratedImage> {
  const key = requireEnv("OPENAI_API_KEY");
  const prompt = buildPrompt(subject);

  const payload = await withRetry("image generation", async () => {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        n: 1,
        size: IMAGE_SIZE,
        output_format: "webp",
        output_compression: IMAGE_COMPRESSION,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new RemoteError(
        `OpenAI returned ${response.status}`,
        response.status,
        [
          body.slice(0, 600),
          `retry-after: ${response.headers.get("retry-after") ?? ""}`,
        ].join("\n")
      );
    }

    return (await response.json()) as {
      data?: { b64_json?: string; url?: string }[];
    };
  });

  const first = payload.data?.[0];

  if (!first) {
    throw new RemoteError("OpenAI returned no image", undefined);
  }

  const bytes = first.b64_json
    ? new Uint8Array(Buffer.from(first.b64_json, "base64"))
    : await fetchImage(first.url);

  if (!isWebp(bytes)) {
    throw new RemoteError(
      `${IMAGE_MODEL} did not return WebP.`,
      undefined,
      "The model ignored or rejected output_format. Set RF_IMAGE_MODEL to a model that supports WebP output, or convert before upload."
    );
  }

  return { bytes, model: IMAGE_MODEL, size: IMAGE_SIZE, prompt };
}

async function fetchImage(url: string | undefined): Promise<Uint8Array> {
  if (!url)
    throw new RemoteError(
      "OpenAI returned neither b64_json nor url",
      undefined
    );

  return withRetry("image download", async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new RemoteError(
        `Image download returned ${response.status}`,
        response.status
      );
    }

    return new Uint8Array(await response.arrayBuffer());
  });
}
