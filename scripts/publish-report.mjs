import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import { parseFile } from "music-metadata";

import { renderCover, TARGET_WIDTH } from "./lib/cover.mjs";

/**
 * Publishing a report: cover, uploads, URLs, and the row, in one command.
 *
 *   pnpm report:publish --pdf <path> --meta <path> [--audio <path>]
 *                       [--slug <slug>] [--width 1000] [--dry-run]
 *   pnpm report:publish --slug <slug> --publish
 *   pnpm report:publish --slug <slug> --unpublish
 *
 * Everything mechanical is derived rather than typed: the cover is rendered from
 * page 1 of the PDF, `pages` is counted against the file, `audio_length` is
 * measured off the audio, and the three storage URLs are read back from the API
 * rather than string-built. The three columns nobody can verify by eye were the
 * three most likely to be wrong.
 *
 * **The row lands as a draft and this command will not publish it in the same
 * run.** `--publish` is a separate invocation, so approving copy is an act
 * someone takes rather than a flag someone forgets. The site reads this table on
 * every request; there is no build step between a half-checked row and a reader.
 *
 * Idempotent throughout — uploads upsert, the row upserts on `slug`, and
 * `status` is never written by a content run. Re-running against a corrected PDF
 * replaces the objects and updates the row in place without changing whether it
 * is live.
 */

/** Where the site's reports live. Public, and the gate is a courtesy ask. */
const BUCKET = "reports";

/**
 * Defaults to the remote project, not to `.env.local`.
 *
 * `.env.local` points at the local Supabase stack and takes precedence in
 * `next dev` — correct for development, wrong for this. Publishing is a
 * production act, so the default target is the production one and the host is
 * printed on every run rather than assumed.
 */
const DEFAULT_ENV_FILE = ".env";

const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".mp4": "audio/mp4",
  ".wav": "audio/wav",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".oga": "audio/ogg",
  ".opus": "audio/opus",
  ".flac": "audio/flac",
};

/** A slug is a primary key and a URL. Two rows sharing one is two pages at one address. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

class Abort extends Error {}

const fail = (message) => {
  throw new Abort(message);
};

/* ---------------------------------------------------------------- arguments */

function parseArgs(argv) {
  const flags = { width: TARGET_WIDTH, env: DEFAULT_ENV_FILE };
  const booleans = new Set(["dry-run", "publish", "unpublish"]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) fail(`Unexpected argument \`${arg}\`. Every input is a --flag.`);

    const name = arg.slice(2);
    if (booleans.has(name)) {
      flags[name] = true;
      continue;
    }

    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) fail(`--${name} needs a value.`);
    flags[name] = value;
    i += 1;
  }

  return flags;
}

/* ---------------------------------------------------------------------- env */

/**
 * A dotenv parse small enough to not be worth a dependency.
 *
 * `process.loadEnvFile` would do this, but it landed in 20.12 and the project
 * only asks for 20.9 — a runtime error on a supported Node is a worse trade than
 * twelve lines.
 */
async function loadEnv(file) {
  // Already in the environment wins, and nothing is read from disk. That is the
  // normal shape in CI and for anyone who exports credentials in their shell —
  // demanding a file there would be asking for a copy of something already held.
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    return { ...process.env, __source: "the environment" };
  }

  const path = resolve(process.cwd(), file);

  let text;
  try {
    text = await readFile(path, "utf8");
  } catch {
    fail(
      `No SUPABASE_URL / SUPABASE_SECRET_KEY in the environment, and could not read ${file}.\n` +
        `Pass --env <file>, or export them.`,
    );
  }

  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }

  return env;
}

function connect(env, file) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY;

  if (!url || !key) fail(`${file} is missing SUPABASE_URL or SUPABASE_SECRET_KEY.`);

  return {
    host: new URL(url).host,
    db: createClient(url, key, {
      // No session to persist and no token to refresh — this is a one-shot
      // command, not a logged-in user.
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

/* -------------------------------------------------------------------- input */

async function readablePdf(path) {
  if (!path) fail("--pdf is required. It is the source of truth for the cover and the page count.");

  // `report:cover` takes a URL because it only reads. This uploads the bytes, so
  // a URL would mean downloading a file the operator is meant to be holding.
  if (/^https?:\/\//.test(path)) {
    fail("--pdf must be a local file here — the bytes get uploaded. Download it first.");
  }

  const full = resolve(process.cwd(), path);
  const info = await stat(full).catch(() => null);
  if (!info?.isFile()) fail(`No file at ${path}`);

  // Cheaper than parsing, and it catches the mistake that actually happens:
  // a path that points at the wrong file rather than at no file.
  const handle = await readFile(full);
  if (handle.subarray(0, 5).toString("latin1") !== "%PDF-") {
    fail(`${path} does not start with %PDF- — is that really the report?`);
  }

  return full;
}

async function readableAudio(path) {
  if (!path) return null;

  const full = resolve(process.cwd(), path);
  const info = await stat(full).catch(() => null);
  if (!info?.isFile()) fail(`No file at ${path}`);

  const extension = extname(full).toLowerCase();
  if (!CONTENT_TYPES[extension]) {
    fail(`Unrecognised audio extension \`${extension}\`. Convert it, or add it to CONTENT_TYPES.`);
  }

  return full;
}

/**
 * "22:20" — as written on the page, never parsed back.
 *
 * It also seeds the player's duration readout, because iOS frequently withholds
 * `loadedmetadata` until the first interaction, so a wrong value here is visible
 * before anyone presses play.
 */
function clock(seconds) {
  // Floor, not round. A player counting up stops at the floored total, so
  // rounding up prints a duration the scrubber never reaches.
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
    : `${minutes}:${String(rest).padStart(2, "0")}`;
}

async function readMeta(path) {
  if (!path) fail("--meta is required: the JSON holding title, summary, and findings.");

  const full = resolve(process.cwd(), path);
  let parsed;
  try {
    parsed = JSON.parse(await readFile(full, "utf8"));
  } catch (error) {
    fail(`Could not read ${path} as JSON — ${error.message}`);
  }

  for (const field of ["title", "summary"]) {
    if (typeof parsed[field] !== "string" || !parsed[field].trim()) {
      fail(`${path} needs a non-empty \`${field}\`.`);
    }
  }

  if (!Array.isArray(parsed.findings) || parsed.findings.length === 0) {
    fail(`${path} needs \`findings\` — an array of the conclusions the report reaches.`);
  }
  if (parsed.findings.some((f) => typeof f !== "string" || !f.trim())) {
    fail(`Every entry in \`findings\` must be a non-empty string.`);
  }
  // Three to five is the shape the detail page is built around. A warning
  // rather than an error: the page will render whatever it is given.
  if (parsed.findings.length < 3 || parsed.findings.length > 5) {
    console.warn(`  ! ${parsed.findings.length} findings. The page is designed around three to five.`);
  }

  if (parsed.published !== undefined && !ISO_DATE.test(parsed.published)) {
    fail(`\`published\` must be YYYY-MM-DD; got ${JSON.stringify(parsed.published)}.`);
  }

  return parsed;
}

/** Falls back to the PDF's filename, which is usually already close. */
function slugify(source) {
  return basename(source, extname(source))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ storage */

/**
 * Uploads, then returns a URL that changes whenever the bytes do.
 *
 * **The version suffix is load-bearing, not decoration.** Object paths here are
 * stable (`<slug>/<slug>.pdf`), so replacing a file leaves the URL identical and
 * every cache downstream keeps serving the old one: storage sends
 * `cache-control: public, max-age=3600`, and Cloudflare, the browser, and the
 * Next image optimizer all honour it. A replaced cover would go on rendering as
 * the previous cover for an hour, which is exactly the bug the committed-PNG
 * design used to avoid by having a deploy invalidate everything.
 *
 * A short content hash on the query string makes the URL content-addressed:
 * identical bytes produce an identical URL, so an unchanged file causes no churn
 * in the row, while new bytes produce a URL nothing has ever cached.
 *
 * `next.config.ts` needs no change for this. Next implies `search: '**'` when the
 * key is omitted from a `remotePatterns` entry, and that entry omits it.
 */
async function upload(db, path, body, contentType) {
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, body, { contentType, upsert: true });

  if (error) fail(`Upload of ${path} failed — ${error.message}`);

  // Read the URL back rather than building it. The row should hold the address
  // storage actually serves, not the one this script believes it should.
  const { publicUrl } = db.storage.from(BUCKET).getPublicUrl(path).data;
  const version = createHash("sha256").update(body).digest("hex").slice(0, 8);

  return `${publicUrl}?v=${version}`;
}

/* -------------------------------------------------------------- status flip */

async function setStatus(db, slug, status) {
  const { data, error } = await db
    .from("reports")
    .update({ status })
    .eq("slug", slug)
    .select("slug, title, status")
    .maybeSingle();

  if (error) fail(`Could not set status — ${error.message}`);
  if (!data) fail(`No row with slug \`${slug}\`. Publish its content first.`);

  return data;
}

/* --------------------------------------------------------------------- main */

async function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.publish && flags.unpublish) fail("--publish and --unpublish are opposites.");

  const env = await loadEnv(flags.env);
  const source = env.__source ?? flags.env;
  const { db, host } = connect(env, source);
  console.log(`\nTarget: ${host}  (from ${source})`);

  /* A status flip is its own errand and touches nothing else. */
  if (flags.publish || flags.unpublish) {
    if (!flags.slug) fail("--slug is required with --publish / --unpublish.");

    const status = flags.publish ? "published" : "draft";
    const row = await setStatus(db, flags.slug, status);

    console.log(`\n  ${row.title}`);
    console.log(`  status → ${row.status}\n`);
    console.log(
      flags.publish
        ? `Live on the next request: /insights/reports/${row.slug}\n`
        : `Off the site on the next request. The row and its files are untouched.\n`,
    );
    return;
  }

  /* Otherwise: the content run. */
  const pdf = await readablePdf(flags.pdf);
  const audio = await readableAudio(flags.audio);
  const meta = await readMeta(flags.meta);

  const slug = flags.slug ?? slugify(pdf);
  if (!SLUG.test(slug)) {
    fail(`\`${slug}\` is not a usable slug. Lowercase letters, digits, single hyphens.`);
  }

  const width = Number(flags.width);
  if (!Number.isFinite(width) || width < 200) fail(`--width must be at least 200; got ${flags.width}`);

  const published = meta.published ?? new Date().toISOString().slice(0, 10);

  // Before doing any work: is this slug already taken by a different report?
  // Cheaper to find out now than after three uploads.
  const existing = await db
    .from("reports")
    .select("slug, title, status")
    .eq("slug", slug)
    .maybeSingle();

  if (existing.error) fail(`Could not read the reports table — ${existing.error.message}`);
  if (existing.data) {
    console.log(`\n  Slug \`${slug}\` already exists: "${existing.data.title}" (${existing.data.status}).`);
    console.log(`  This run will update it in place and leave its status alone.`);
  }

  console.log(`\nRendering the cover from page 1…`);
  const cover = await renderCover(pdf, slug, width);
  console.log(
    `  ${cover.relative} — ${cover.size.width}×${cover.size.height}, ` +
      `${Math.round(cover.bytes / 1024)} KB`,
  );
  console.log(`  The PDF has ${cover.pages} page${cover.pages === 1 ? "" : "s"}.`);

  let audioLength = meta.audioLength ?? null;
  if (audio) {
    const { format } = await parseFile(audio);
    if (format.duration) audioLength = meta.audioLength ?? clock(format.duration);
    console.log(`  Audio runs ${audioLength ?? "an unreadable length"}.`);
  }

  const names = {
    cover: `${slug}/${slug}-cover.png`,
    pdf: `${slug}/${slug}.pdf`,
    audio: audio ? `${slug}/${slug}${extname(audio).toLowerCase()}` : null,
  };

  const row = {
    slug,
    title: meta.title.trim(),
    summary: meta.summary.trim(),
    published,
    findings: meta.findings.map((f) => f.trim()),
    pages: cover.pages,
    ...(audioLength ? { audio_length: audioLength } : {}),
  };

  if (flags["dry-run"]) {
    console.log(`\nDry run — nothing uploaded, nothing written.\n`);
    console.log(`Would upload to ${BUCKET}/:`);
    for (const name of Object.values(names).filter(Boolean)) console.log(`  ${name}`);
    console.log(`\nWould upsert:\n`);
    console.log(JSON.stringify({ ...row, status: "(left at draft)" }, null, 2));
    console.log();
    return;
  }

  console.log(`\nUploading to the \`${BUCKET}\` bucket…`);
  row.cover_url = await upload(db, names.cover, cover.buffer, "image/png");
  console.log(`  ${names.cover}`);

  row.pdf_url = await upload(db, names.pdf, await readFile(pdf), "application/pdf");
  console.log(`  ${names.pdf}`);

  if (audio) {
    const type = CONTENT_TYPES[extname(audio).toLowerCase()];
    row.audio_url = await upload(db, names.audio, await readFile(audio), type);
    console.log(`  ${names.audio}`);
  }

  // `status` is deliberately absent. On insert the column default makes this a
  // draft; on update the existing value survives. Neither path can flip a
  // report's visibility as a side effect of fixing a typo.
  const { data, error } = await db
    .from("reports")
    .upsert(row, { onConflict: "slug" })
    .select("slug, title, status, pages, audio_length")
    .single();

  if (error) fail(`Could not write the row — ${error.message}`);

  console.log(`\nRow written.\n`);
  console.log(`  slug          ${data.slug}`);
  console.log(`  title         ${data.title}`);
  console.log(`  status        ${data.status}`);
  console.log(`  pages         ${data.pages}`);
  console.log(`  audio_length  ${data.audio_length ?? "—"}`);
  console.log(`  cover_url     ${row.cover_url}`);
  console.log(`  pdf_url       ${row.pdf_url}`);
  console.log(`  audio_url     ${row.audio_url ?? "—"}`);

  if (data.status === "published") {
    console.log(`\nAlready published — the update is live on the next request.\n`);
  } else {
    console.log(`\nStill a draft, so no page renders it yet. Check the copy above, then:\n`);
    console.log(`  pnpm report:publish --slug ${slug} --publish\n`);
  }
}

main().catch((error) => {
  console.error(`\n${error instanceof Abort ? error.message : (error.stack ?? error.message)}\n`);
  process.exit(1);
});
