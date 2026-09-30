/**
 * Images for a blog post: what format a file really is, how big it is, and
 * the art direction for a generated cover.
 *
 * Dimensions come from the file header rather than a decoder, because `sharp`
 * is blocked in `pnpm-workspace.yaml` and a header is all that is needed: the
 * size goes into the image URL's `#<w>x<h>` fragment so the page reserves the
 * right space (`parseImageSize` in `lib/blog-figures.ts`).
 *
 * Nothing here resizes or re-encodes. A 6 MB phone photo is refused rather
 * than silently shipped; `next/image` serves resized AVIF/WebP to visitors,
 * but the original still has to be uploaded and stored.
 */

export type ImageFormat = "png" | "jpeg" | "webp";

export const CONTENT_TYPES: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

/** Above this an image is refused. Above `WARN_BYTES` it is flagged. */
export const MAX_BYTES = 5 * 1024 * 1024;
export const WARN_BYTES = 1.5 * 1024 * 1024;

/** Sniffed from the bytes, never the extension: a PNG renamed `.jpg` uploads
 *  with a lying Content-Type and renders as a broken image. */
export function sniffFormat(bytes: Uint8Array): ImageFormat | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";

  const tag = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
  if (tag(0) === "RIFF" && tag(8) === "WEBP") return "webp";

  return null;
}

const u16be = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1];
const u16le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u24le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
const u32be = (b: Uint8Array, i: number) =>
  ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];

/**
 * Width and height from the header, or null when the file is not one of the
 * three formats or the header is damaged.
 *
 * JPEG orientation (EXIF) is not applied, so a portrait phone photo stored
 * sideways reports landscape dimensions. Browsers rotate it on display, and
 * the reserved box would then be the wrong shape; the skill tells the author
 * to export photos upright for that reason.
 */
export function imageSize(bytes: Uint8Array): { width: number; height: number } | null {
  const format = sniffFormat(bytes);

  if (format === "png") {
    if (bytes.length < 24) return null;
    return { width: u32be(bytes, 16), height: u32be(bytes, 20) };
  }

  if (format === "jpeg") {
    let i = 2;
    while (i + 9 < bytes.length) {
      if (bytes[i] !== 0xff) return null;
      const marker = bytes[i + 1];
      // Padding and standalone markers carry no length.
      if (marker === 0xff) {
        i += 1;
        continue;
      }
      const length = u16be(bytes, i + 2);
      // SOF0–SOF15, except DHT (C4), JPG (C8) and DAC (CC).
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: u16be(bytes, i + 5), width: u16be(bytes, i + 7) };
      }
      i += 2 + length;
    }
    return null;
  }

  if (format === "webp") {
    const chunk = String.fromCharCode(...bytes.subarray(12, 16));
    if (chunk === "VP8 " && bytes.length >= 30) {
      return { width: u16le(bytes, 26) & 0x3fff, height: u16le(bytes, 28) & 0x3fff };
    }
    if (chunk === "VP8L" && bytes.length >= 25) {
      const b = bytes.subarray(21, 25);
      const width = 1 + (((b[1] & 0x3f) << 8) | b[0]);
      const height = 1 + (((b[3] & 0x0f) << 10) | (b[2] << 2) | ((b[1] & 0xc0) >> 6));
      return { width, height };
    }
    if (chunk === "VP8X" && bytes.length >= 30) {
      return { width: 1 + u24le(bytes, 24), height: 1 + u24le(bytes, 27) };
    }
  }

  return null;
}

/**
 * The house preamble for a generated blog cover. The case study's, adjusted
 * for where a blog cover is shown: `.rf-case-cover` at 16:9 only (the post
 * page and the "Start here" cards), so the 3:2 frame loses a strip from the
 * top and bottom, not the case study's 21:9 band.
 *
 * A generated cover is the fallback. The skill asks for real imagery first,
 * because `docs/blogs_seo/blog_ui_ux.md` is clear that images carrying
 * information beat decoration.
 */
export const BLOG_COVER_PREAMBLE = [
  "Abstract technical illustration for a B2B engineering consultancy blog post.",
  "",
  "COMPOSITION — this is the hard constraint:",
  "The image is cropped to 16:9 from this 3:2 frame, cutting from the top and bottom.",
  "Keep every meaningful element inside the middle 75% horizontal band.",
  "Leave the top 12% and bottom 12% free of anything important.",
  "Centre the subject.",
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
