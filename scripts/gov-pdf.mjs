/**
 * Prints the gov page to `public/files/…pdf` — the past performance PDF behind
 * the page's download button. The print stylesheet reduces the page to the past
 * performance sheet. One page, and the script fails if it is not.
 *
 * Then renders page one of the capability statement to
 * `public/files/previews/capability-statement.png`, the preview the page shows
 * beside past performance. Rerun it whenever either PDF changes.
 *
 * The PDF is generated from the page, not maintained beside it, so the two
 * cannot disagree. The print stylesheet in `app/globals.css` does the layout.
 *
 * Run it against a **production** server (`pnpm build && pnpm start`), never
 * `pnpm dev`: development renders `draft` entries from `lib/content/gov.ts`,
 * and those must not reach a published PDF.
 *
 *   pnpm gov:pdf                       # http://localhost:3000
 *   pnpm gov:pdf http://localhost:3210
 *
 * Needs Chrome or Edge. Set CHROME_PATH if neither is in a standard place.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { firstPage, load, pngSize } from "./lib/cover.mjs";

/** Same file `GOV_CAPABILITY_PDF` serves through the `/files` rewrite. */
const CAPABILITY_PDF =
  "https://qsnaxtjoyqycpbmmghff.supabase.co/storage/v1/object/public/site/RegainFlow_Capability_Statement_2026.pdf";

/** Wide enough to stay sharp at the preview's largest rendered size, 2x. */
const PREVIEW_WIDTH = 1200;

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const out = resolve("public/files/RegainFlow_Past_Performance_2026.pdf");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browser = candidates.find((path) => existsSync(path));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH.");
  process.exit(1);
}

const url = `${base}/gov`;
const res = await fetch(url);
if (!res.ok) {
  console.error(`${url} returned ${res.status}. Is the server running?`);
  process.exit(1);
}
if ((await res.text()).includes("Draft, dev only")) {
  console.error("The page is rendering drafts, so this is a dev server. Use `pnpm start`.");
  process.exit(1);
}

execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=10000",
  `--print-to-pdf=${out}`,
  url,
]);

// The sheet is a one-pager by design. Counting page objects is crude but is
// exact for Chrome's output, and it is the check that matters: an entry that
// pushes the sheet onto a second page should fail here, not in a buyer's inbox.
const pages = (readFileSync(out, "latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB, ${pages} page${pages === 1 ? "" : "s"})`);
if (pages !== 1) {
  console.error("Expected one page. Tighten the copy or the print scale in app/globals.css.");
  process.exit(1);
}

const previews = resolve("public/files/previews");
mkdirSync(previews, { recursive: true });

for (const [name, source] of [["capability-statement", CAPABILITY_PDF]]) {
  const data = await load(source);
  const natural = pngSize((await firstPage(data, 1)).image);
  const { image } = await firstPage(data, PREVIEW_WIDTH / natural.width);
  const file = resolve(previews, `${name}.png`);
  writeFileSync(file, image);
  const size = pngSize(image);
  // `GOV_PREVIEWS` in lib/site.ts holds these dimensions for layout.
  console.log(`Wrote ${file} (${size.width}×${size.height})`);
}
