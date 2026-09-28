/**
 * Renders page one of the capability statement PDF to
 * `public/files/previews/<pdf name>.png` — the preview the gov page shows
 * beside past performance. Rerun it whenever a new edition goes up in Supabase
 * storage, then point `GOV_PREVIEWS` in `lib/site.ts` at the new file (and its
 * dimensions, if they changed).
 *
 * The PNG is named after the PDF so each edition gets its own URL. Reusing one
 * name leaves the old image in Next's optimizer cache and in browsers.
 *
 *   pnpm gov:preview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { firstPage, load, pngSize } from "./lib/cover.mjs";

/** Same file `GOV_CAPABILITY_PDF` serves through the `/files` rewrite. */
const CAPABILITY_PDF =
  "https://qsnaxtjoyqycpbmmghff.supabase.co/storage/v1/object/public/site/RegainFlow_Capability_Statement_Federal_09_26.pdf";

/** The preview renders up to ~740px wide; this keeps it sharp at 2x and up. */
const PREVIEW_WIDTH = 1800;

const data = await load(CAPABILITY_PDF);
const natural = pngSize((await firstPage(data, 1)).image);
const { image } = await firstPage(data, PREVIEW_WIDTH / natural.width);

const dir = resolve("public/files/previews");
mkdirSync(dir, { recursive: true });
const file = resolve(dir, `${basename(CAPABILITY_PDF, ".pdf")}.png`);
writeFileSync(file, image);

const size = pngSize(image);
console.log(`Wrote ${file} (${size.width}×${size.height})`);
