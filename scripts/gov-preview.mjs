/**
 * Renders page one of the capability statement PDF to
 * `public/files/previews/capability-statement.png` — the preview the gov page
 * shows beside past performance. Rerun it whenever the PDF in Supabase
 * storage is replaced, then update `GOV_PREVIEWS` in `lib/site.ts` if the
 * printed dimensions changed.
 *
 *   pnpm gov:preview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { firstPage, load, pngSize } from "./lib/cover.mjs";

/** Same file `GOV_CAPABILITY_PDF` serves through the `/files` rewrite. */
const CAPABILITY_PDF =
  "https://qsnaxtjoyqycpbmmghff.supabase.co/storage/v1/object/public/site/RegainFlow_Capability_Statement_2026.pdf";

/** Wide enough to stay sharp at the preview's largest rendered size, 2x. */
const PREVIEW_WIDTH = 1200;

const data = await load(CAPABILITY_PDF);
const natural = pngSize((await firstPage(data, 1)).image);
const { image } = await firstPage(data, PREVIEW_WIDTH / natural.width);

const dir = resolve("public/files/previews");
mkdirSync(dir, { recursive: true });
const file = resolve(dir, "capability-statement.png");
writeFileSync(file, image);

const size = pngSize(image);
console.log(`Wrote ${file} (${size.width}×${size.height})`);
