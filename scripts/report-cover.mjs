import { renderCover, TARGET_WIDTH } from "./lib/cover.mjs";

/**
 * Renders page 1 of a report PDF to the cover image the listing and detail
 * pages show.
 *
 *   pnpm report:cover <pdf-path-or-url> <slug> [--width 1000]
 *
 * **This is an authoring tool, not a build step, and that is deliberate.** The
 * PNG it writes is committed to the repository, which keeps a cover that cannot
 * be produced a broken commit — caught here, by hand — rather than a red deploy,
 * and keeps the output deterministic and reviewable in a diff.
 *
 * The rendering itself now lives in `scripts/lib/cover.mjs`, shared with
 * `pnpm report:publish`. This command stays because replacing a PDF means
 * re-rendering its cover, and that is worth being able to do on its own.
 */

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

  const { relative, size, pages, bytes } = await renderCover(source, slug, width);
  const kb = Math.round(bytes / 1024);

  console.log(`\nWrote ${relative} — ${size.width}×${size.height}, ${kb} KB`);
  console.log(`The PDF has ${pages} page${pages === 1 ? "" : "s"}.\n`);
  console.log(`Next: upload this PNG, the PDF, and the audio to the \`reports\``);
  console.log(`bucket under ${slug}/, then set on the row in the \`reports\` table:\n`);
  console.log(`  cover_url  <public URL of ${slug}-cover.png>`);
  console.log(`  pages      ${pages}\n`);
  console.log(`Or let \`pnpm report:publish\` do all of that — see the README.\n`);
  // No width or height any more. They were columns on the authored entry back
  // when the cover was a committed file; `.rf-report-cover` declares the aspect
  // ratio in CSS and `<Image fill>` fills it, so there is nothing to measure —
  // which is the point, since nobody can measure a PNG by hand in a table editor.
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
