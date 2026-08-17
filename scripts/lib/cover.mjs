import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { pdf } from "pdf-to-img";

/**
 * Rendering page 1 of a report PDF to the cover image the listing and detail
 * pages show.
 *
 * Extracted from `scripts/report-cover.mjs` so `scripts/publish-report.mjs` can
 * render a cover as one step of a longer job rather than shelling out to a
 * sibling script and scraping its stdout for the page count.
 *
 * `pdf-to-img` is a devDependency and stays one. It never ships.
 */

export const TARGET_WIDTH = 1000;

/**
 * PNG dimensions, straight out of the IHDR chunk — width and height are two
 * big-endian uint32s at a fixed offset in every PNG ever written. A whole image
 * library to read eight bytes would not be worth the install.
 */
export function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * Returns a `Buffer`, and the type matters. A plain `Uint8Array` view fails
 * inside pdfjs with "Cannot transfer object of unsupported type" when it hands
 * the data to its worker; a Node `Buffer` goes through. `readFile` already
 * returns one — the fetch path has to be converted rather than wrapped.
 */
export async function load(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Could not fetch the PDF: ${response.status} ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(source);
}

export async function firstPage(data, scale) {
  const document = await pdf(data, { scale });
  return { image: await document.getPage(1), pages: document.length };
}

/**
 * Writes `public/reports/<slug>-cover.png` and reports what it found.
 *
 * The PNG stays a committed authoring artifact rather than a build output: the
 * deployed site reads the copy uploaded to storage, but a cover that cannot be
 * produced should be a failed command on someone's machine rather than a red
 * deploy, and the result is reviewable in a diff.
 */
export async function renderCover(source, slug, width = TARGET_WIDTH) {
  const data = await load(source);

  // Two passes rather than arithmetic on the page box. `scale` is relative to
  // the PDF's own 72dpi geometry, and reports are not reliably US Letter — a
  // deck exported at 16:9 would come out at half the intended width. Rendering
  // once to measure costs a few hundred milliseconds in a command run by hand.
  const probe = await firstPage(data, 1);
  const natural = pngSize(probe.image);
  const { image, pages } = await firstPage(data, width / natural.width);

  const dir = join(process.cwd(), "public", "reports");
  const file = join(dir, `${slug}-cover.png`);
  await mkdir(dir, { recursive: true });
  await writeFile(file, image);

  return {
    file,
    relative: `public/reports/${slug}-cover.png`,
    size: pngSize(image),
    pages,
    bytes: image.byteLength,
    buffer: image,
  };
}
