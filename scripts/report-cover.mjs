import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { pdf } from "pdf-to-img";

/**
 * Renders page 1 of a report PDF to the cover image the listing and detail
 * pages show.
 *
 *   pnpm report:cover <pdf-path-or-url> <slug> [--width 1000]
 *
 * **This is an authoring tool, not a build step, and that is deliberate.** The
 * PNG it writes is committed to the repository, which buys three things a
 * build-time render would cost us:
 *
 *   1. `next/image` optimizes a local file, and `next.config.ts` needs no
 *      `images.remotePatterns` entry — the site would otherwise be trusting its
 *      first remote image origin to render a thumbnail.
 *   2. The Vercel build never fetches a PDF over the network or loads a native
 *      canvas. A cover that cannot be produced is a broken commit, caught here,
 *      rather than a red deploy.
 *   3. The output is deterministic and reviewable in a diff.
 *
 * `pdf-to-img` is a devDependency for the same reason. It never ships.
 */

const TARGET_WIDTH = 1000;

/**
 * PNG dimensions, straight out of the IHDR chunk — width and height are two
 * big-endian uint32s at a fixed offset in every PNG ever written. A whole image
 * library to read eight bytes would not be worth the install.
 */
function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * Returns a `Buffer`, and the type matters. A plain `Uint8Array` view fails
 * inside pdfjs with "Cannot transfer object of unsupported type" when it hands
 * the data to its worker; a Node `Buffer` goes through. `readFile` already
 * returns one — the fetch path has to be converted rather than wrapped.
 */
async function load(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Could not fetch the PDF: ${response.status} ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(source);
}

async function firstPage(data, scale) {
  const document = await pdf(data, { scale });
  return { image: await document.getPage(1), pages: document.length };
}

async function main() {
  const args = process.argv.slice(2);
  const flag = args.indexOf("--width");
  const width = flag === -1 ? TARGET_WIDTH : Number(args[flag + 1]);
  const [source, slug] = args.filter(
    (arg, i) => arg !== "--width" && (flag === -1 || i !== flag + 1),
  );

  if (!source || !slug) {
    console.error(
      "Usage: pnpm report:cover <pdf-path-or-url> <slug> [--width 1000]\n" +
        "  <slug> must match the `slug` on the row in the `reports` table.",
    );
    process.exit(1);
  }

  if (!Number.isFinite(width) || width < 200) {
    console.error(`--width must be a number of at least 200; got ${args[flag + 1]}`);
    process.exit(1);
  }

  const data = await load(source);

  // Two passes rather than arithmetic on the page box. `scale` is relative to
  // the PDF's own 72dpi geometry, and reports are not reliably US Letter — a
  // deck exported at 16:9 would come out at half the intended width. Rendering
  // once to measure costs a few hundred milliseconds in a command run by hand.
  const probe = await firstPage(data, 1);
  const natural = pngSize(probe.image);
  const { image, pages } = await firstPage(data, width / natural.width);
  const size = pngSize(image);

  const dir = join(process.cwd(), "public", "reports");
  const file = join(dir, `${slug}-cover.png`);
  await mkdir(dir, { recursive: true });
  await writeFile(file, image);

  const kb = Math.round(image.byteLength / 1024);

  console.log(`\nWrote public/reports/${slug}-cover.png — ${size.width}×${size.height}, ${kb} KB`);
  console.log(`The PDF has ${pages} page${pages === 1 ? "" : "s"}.\n`);
  console.log(`Next: upload this PNG, the PDF, and the audio to the \`reports\``);
  console.log(`bucket under ${slug}/, then set on the row in the \`reports\` table:\n`);
  console.log(`  cover_url  <public URL of ${slug}-cover.png>`);
  console.log(`  pages      ${pages}\n`);
  // No width or height any more. They were columns on the authored entry back
  // when the cover was a committed file; `.rf-report-cover` declares the aspect
  // ratio in CSS and `<Image fill>` fills it, so there is nothing to measure —
  // which is the point, since nobody can measure a PNG by hand in a table editor.
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
