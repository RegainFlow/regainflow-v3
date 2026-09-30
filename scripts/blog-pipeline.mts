/**
 * Publishing a blog post, in three steps with a person looking in between.
 *
 *   pnpm blog list
 *   pnpm blog bootstrap
 *   pnpm blog prepare   .blog/<slug>/intake.yaml [--replace] [--substantive] [--skip-image]
 *   pnpm blog stage     .blog/<slug>/preview
 *   pnpm blog publish   .blog/<slug>/preview
 *   pnpm blog unpublish <slug>
 *   pnpm blog verify    <slug>
 *
 * `prepare` validates against `docs/blogs_seo/` (see `scripts/blog/guards.mts`),
 * measures and hashes every image, generates a cover only when asked, and
 * writes a preview folder. It reads the database but writes nothing.
 *
 * `stage` uploads the images and writes the post as a **draft** under
 * `preview--<slug>`, so it renders at `/insights/blog/preview/<slug>?token=…`
 * exactly as it will ship, while a live post of the same slug is untouched.
 *
 * `publish` re-checks, writes the real row as published, removes the staged
 * draft, reads the row back, and pings IndexNow. It re-hashes every file
 * against the manifest, so what was reviewed is what ships.
 *
 * Environment: SUPABASE_URL and SUPABASE_SECRET_KEY always; OPENAI_API_KEY for
 * a generated cover; BLOG_PREVIEW_TOKEN to print a working preview link;
 * INDEXNOW_KEY to ping. `pnpm blog` loads `.env.local`, `pnpm blog:prod` loads
 * `.env`, which is production.
 */

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { parse as parseYaml } from "yaml";

import { BLOG_TOPICS } from "@/lib/content/blog-topics";
import { TEAM } from "@/lib/content/company";
import { SITE_URL } from "@/lib/site";

import { EXIT, PipelineError, RemoteError, failValidation, parseFlags } from "./case-study/core.mjs";
import { sha256 } from "./case-study/remote.mjs";
import { generateHero } from "./case-study/image.mjs";
import { checkPost, type Findings } from "./blog/guards.mjs";
import {
  BLOG_COVER_PREAMBLE,
  CONTENT_TYPES,
  MAX_BYTES,
  WARN_BYTES,
  imageSize,
  sniffFormat,
} from "./blog/images.mjs";
import {
  ASSET_PREFIX,
  IntakeSchema,
  bodyImages,
  isLocalSrc,
  resolveAssets,
  today,
  type BlogPayload,
  type Intake,
} from "./blog/intake.mjs";
import {
  PREVIEW_PREFIX,
  assertImageHost,
  deleteObjects,
  discardPreview,
  ensureBucket,
  isLocalTarget,
  liveDates,
  objectPath,
  pingIndexNow,
  publicUrl,
  publishedPosts,
  readRow,
  setStatus,
  uploadAsset,
  verifyAsset,
  writeRow,
} from "./blog/remote.mjs";

/** Bumped when the preview format changes, so a stale folder fails loudly. */
const PIPELINE_VERSION = 1;

interface Asset {
  name: string;
  sha256: string;
  contentType: string;
  role: "cover" | "body";
  width?: number;
  height?: number;
  bytes: number;
}

interface Manifest {
  pipelineVersion: number;
  slug: string;
  createdAt: string;
  replace: boolean;
  substantive: boolean;
  denyTerms: string[];
  coverPrompt?: string;
  assets: Asset[];
  warnings: string[];
}

const EXT: Record<string, string> = { png: "png", jpeg: "jpg", webp: "webp" };

/** Where the site under test is, for printed links. */
function siteOrigin(): string {
  return process.env.RF_SITE_ORIGIN ?? (isLocalTarget() ? "http://localhost:3000" : SITE_URL);
}

function knownContext() {
  return {
    topics: BLOG_TOPICS.map((topic) => topic.slug),
    authors: TEAM.map((member) => member.slug),
  };
}

// ---------------------------------------------------------------------------
// prepare
// ---------------------------------------------------------------------------

async function readAsset(
  path: string,
  role: Asset["role"],
  problems: string[],
  warnings: string[],
): Promise<{ asset: Asset; data: Uint8Array } | null> {
  let data: Uint8Array;
  try {
    data = new Uint8Array(await readFile(path));
  } catch {
    problems.push(`image file not found: ${path}`);
    return null;
  }

  const format = sniffFormat(data);
  if (!format) {
    problems.push(`${path} is not a PNG, JPEG or WebP (checked by content, not extension)`);
    return null;
  }
  if (data.byteLength > MAX_BYTES) {
    problems.push(`${path} is ${(data.byteLength / 1048576).toFixed(1)} MB; export it under ${MAX_BYTES / 1048576} MB (about 2000px wide is plenty)`);
    return null;
  }
  if (data.byteLength > WARN_BYTES) {
    warnings.push(`${path} is ${(data.byteLength / 1048576).toFixed(1)} MB; a smaller export uploads and stores less`);
  }

  const size = imageSize(data);
  if (!size) {
    problems.push(`could not read the dimensions of ${path}; re-export it`);
    return null;
  }

  const digest = sha256(data);
  return {
    data,
    asset: {
      name: `${digest.slice(0, 16)}.${EXT[format]}`,
      sha256: digest,
      contentType: CONTENT_TYPES[format],
      role,
      width: size.width,
      height: size.height,
      bytes: data.byteLength,
    },
  };
}

async function prepare(intakeArg: string, flags: Set<string>) {
  const intakePath = resolve(intakeArg);
  const dir = dirname(intakePath);
  const replace = flags.has("replace");
  const substantive = flags.has("substantive");

  const parsed = IntakeSchema.safeParse(parseYaml(await readFile(intakePath, "utf8")));
  if (!parsed.success) {
    failValidation(
      parsed.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
      "The intake is invalid",
    );
  }
  const intake: Intake = parsed.data;

  if (substantive && !replace) {
    failValidation(["--substantive only applies to --replace of a published post"], "Flags");
  }

  let body: string;
  try {
    body = (await readFile(join(dir, intake.body), "utf8")).replace(/\r\n/g, "\n").trim() + "\n";
  } catch {
    failValidation([`body file not found: ${join(dir, intake.body)}`], "The intake is invalid");
  }

  console.log(`\nPreparing ${intake.slug}`);
  const published = (await publishedPosts()).filter((post) => !post.slug.startsWith(PREVIEW_PREFIX));

  // Dates. A replace keeps the live first-publish date, and moves "Updated"
  // only when the edit is substantive: Google is explicit that a bumped date
  // on unchanged content is noise.
  let publishedOn = intake.published ?? today();
  let updatedOn: string | null = null;
  if (replace) {
    const live = await liveDates(intake.slug);
    if (live) {
      publishedOn = live.published;
      updatedOn = substantive ? today() : live.updated_on;
    }
  }

  const draft: BlogPayload = {
    slug: intake.slug,
    title: intake.title,
    summary: intake.summary,
    published: publishedOn,
    updated_on: updatedOn,
    author: intake.author,
    topic: intake.topic,
    tags: intake.tags,
    takeaways: intake.takeaways,
    related: intake.related,
    cta: intake.cta,
    cover_url: intake.cover ? `${ASSET_PREFIX}pending` : null,
    cover_alt: intake.cover?.alt ?? null,
    cover_credit: intake.cover?.credit ?? (intake.cover?.generate ? "Illustration generated for this post." : null),
    featured: intake.featured,
    pillar: intake.pillar,
    meta_title: intake.meta_title ?? null,
    meta_description: intake.meta_description ?? null,
    body,
    status: "published",
  };

  // Checks first: an image generation is paid for, a failed check is not.
  const findings: Findings = checkPost(draft, {
    ...knownContext(),
    published,
    replace,
    clearedImages: intake.images.map((image) => image.file),
    denyTerms: intake.deny_terms,
    coverPrompt: intake.cover?.generate,
  });
  if (findings.errors.length > 0) failValidation(findings.errors, "The post does not pass");

  // Images: measure, hash, rewrite references to `asset:<name>#<w>x<h>`.
  const problems: string[] = [];
  const warnings = [...findings.warnings];
  const files = new Map<string, Uint8Array>();
  const assets: Asset[] = [];

  for (const image of bodyImages(body)) {
    if (!isLocalSrc(image.src)) continue;
    const read = await readAsset(join(dir, image.src), "body", problems, warnings);
    if (!read) continue;
    files.set(read.asset.name, read.data);
    if (!assets.some((a) => a.name === read.asset.name)) assets.push(read.asset);
    const src = `${ASSET_PREFIX}${read.asset.name}#${read.asset.width}x${read.asset.height}`;
    draft.body = draft.body.replace(
      image.raw,
      `![${image.alt}](${src}${image.caption ? ` "${image.caption}"` : ""})`,
    );
  }

  let coverPrompt: string | undefined;
  if (intake.cover?.file) {
    const read = await readAsset(join(dir, intake.cover.file), "cover", problems, warnings);
    if (read) {
      files.set(read.asset.name, read.data);
      assets.push(read.asset);
      draft.cover_url = `${ASSET_PREFIX}${read.asset.name}`;
    }
  }
  if (problems.length > 0) failValidation(problems, "Images");

  if (intake.cover?.generate) {
    if (flags.has("skip-image")) {
      warnings.push("--skip-image: no cover was generated, so the post has none until prepare runs without it");
      draft.cover_url = null;
      draft.cover_alt = null;
      draft.cover_credit = null;
    } else {
      console.log("  generating the cover…");
      const generated = await generateHero(intake.cover.generate, BLOG_COVER_PREAMBLE);
      coverPrompt = generated.prompt;
      const digest = sha256(generated.bytes);
      const size = imageSize(generated.bytes);
      const asset: Asset = {
        name: `${digest.slice(0, 16)}.webp`,
        sha256: digest,
        contentType: "image/webp",
        role: "cover",
        ...(size ?? {}),
        bytes: generated.bytes.byteLength,
      };
      files.set(asset.name, generated.bytes);
      assets.push(asset);
      draft.cover_url = `${ASSET_PREFIX}${asset.name}`;
    }
  }

  // The preview folder, rebuilt from scratch every run.
  const previewDir = join(dir, "preview");
  await rm(previewDir, { recursive: true, force: true });
  await mkdir(join(previewDir, "assets"), { recursive: true });
  for (const [name, data] of files) await writeFile(join(previewDir, "assets", name), data);

  const manifest: Manifest = {
    pipelineVersion: PIPELINE_VERSION,
    slug: intake.slug,
    createdAt: new Date().toISOString(),
    replace,
    substantive,
    denyTerms: intake.deny_terms,
    ...(coverPrompt ? { coverPrompt } : {}),
    assets,
    warnings,
  };
  await writeFile(join(previewDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  await writeFile(join(previewDir, "payload.json"), JSON.stringify(draft, null, 2));
  await writeFile(join(previewDir, "report.md"), report(draft, manifest));

  console.log(`\n  preview: ${previewDir}`);
  console.log(`  ${assets.length} image(s), ${warnings.length} warning(s)`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
  console.log(`\nNext: pnpm blog stage ${join(dirname(intakeArg), "preview")}`);
}

function report(payload: BlogPayload, manifest: Manifest): string {
  const cover = manifest.assets.find((asset) => asset.role === "cover");
  const lines = [
    `# ${payload.title}`,
    "",
    `> ${payload.summary}`,
    "",
    "| Field | Value |",
    "|---|---|",
    `| URL | /insights/blog/${payload.slug} |`,
    `| Author | ${payload.author} |`,
    `| Topic | ${payload.topic}${payload.pillar ? " (pillar)" : ""}${payload.featured ? ", featured" : ""} |`,
    `| Published | ${payload.published}${payload.updated_on ? `, updated ${payload.updated_on}` : ""} |`,
    `| Search title | ${payload.meta_title ?? payload.title} |`,
    `| Search description | ${payload.meta_description ?? payload.summary} |`,
    `| Tags | ${payload.tags.join(", ") || "—"} |`,
    `| Related | ${payload.related.join(", ") || "—"} |`,
    `| CTA | ${payload.cta ? `${payload.cta.heading} → ${payload.cta.href}` : "default (free assessment)"} |`,
    `| Cover | ${cover ? `assets/${cover.name} (${cover.width}×${cover.height}), alt: "${payload.cover_alt}", credit: ${payload.cover_credit}` : "none"} |`,
    `| Mode | ${manifest.replace ? `replace${manifest.substantive ? ", substantive (Updated date moves)" : " (dates unchanged)"}` : "new post"} |`,
    "",
    "## Key takeaways",
    "",
    ...payload.takeaways.map((t) => `- ${t}`),
    "",
    "## Warnings",
    "",
    ...(manifest.warnings.length ? manifest.warnings.map((w) => `- ${w}`) : ["None."]),
    "",
    "## Body",
    "",
    payload.body,
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// stage and publish
// ---------------------------------------------------------------------------

async function loadPreview(previewArg: string) {
  const previewDir = resolve(previewArg);
  let manifest: Manifest;
  let payload: BlogPayload;

  try {
    manifest = JSON.parse(await readFile(join(previewDir, "manifest.json"), "utf8"));
    payload = JSON.parse(await readFile(join(previewDir, "payload.json"), "utf8"));
  } catch {
    throw new PipelineError(`No preview at ${previewDir}.`, "validation", "Run `pnpm blog prepare` first.");
  }

  if (manifest.pipelineVersion !== PIPELINE_VERSION) {
    throw new PipelineError("This preview was made by a different pipeline version.", "validation", "Run prepare again.");
  }

  const files = new Map<string, Uint8Array>();
  for (const asset of manifest.assets) {
    const data = new Uint8Array(await readFile(join(previewDir, "assets", asset.name)));
    if (sha256(data) !== asset.sha256) {
      throw new PipelineError(
        `assets/${asset.name} changed after prepare.`,
        "validation",
        "The preview folder is not edited by hand. Change the intake or the source image and run prepare again.",
      );
    }
    files.set(asset.name, data);
  }

  return { manifest, payload, files };
}

async function uploadAll(
  slug: string,
  manifest: Manifest,
  files: Map<string, Uint8Array>,
): Promise<string[]> {
  const created: string[] = [];
  for (const asset of manifest.assets) {
    const result = await uploadAsset(slug, asset.name, files.get(asset.name)!, asset.contentType);
    if (result.created) created.push(result.path);
    await verifyAsset(result.path, asset.sha256);
  }
  return created;
}

const urlFor = (slug: string) => (name: string) => publicUrl(objectPath(slug, name));

async function stage(previewArg: string) {
  const { manifest, payload, files } = await loadPreview(previewArg);
  assertImageHost();

  console.log(`\nStaging ${payload.slug} as a draft`);
  await uploadAll(payload.slug, manifest, files);

  await writeRow({
    ...resolveAssets(payload, urlFor(payload.slug)),
    slug: `${PREVIEW_PREFIX}${payload.slug}`,
    status: "draft",
  });

  const token = process.env.BLOG_PREVIEW_TOKEN;
  const url = `${siteOrigin()}/insights/blog/preview/${payload.slug}`;
  console.log(`\n  staged under ${PREVIEW_PREFIX}${payload.slug} (draft; the live post, if any, is untouched)`);
  console.log(
    token
      ? `  preview: ${url}?token=${token}`
      : `  preview: ${url}?token=<BLOG_PREVIEW_TOKEN>  (unset in this env file; the page 404s without it)`,
  );
  console.log(`\nAfter approval: pnpm blog${isLocalTarget() ? "" : ":prod"} publish ${previewArg}`);
}

async function publish(previewArg: string) {
  const { manifest, payload, files } = await loadPreview(previewArg);
  assertImageHost();

  console.log(`\nPublishing ${payload.slug}${isLocalTarget() ? " (local database)" : " to PRODUCTION"}`);

  // Re-checked against the database as it is now: a related post may have
  // been unpublished, or the slug taken, since prepare ran.
  const published = (await publishedPosts()).filter((post) => !post.slug.startsWith(PREVIEW_PREFIX));
  const findings = checkPost(payload, {
    ...knownContext(),
    published,
    replace: manifest.replace,
    clearedImages: [],
    denyTerms: manifest.denyTerms,
    coverPrompt: manifest.coverPrompt,
  });
  if (findings.errors.length > 0) failValidation(findings.errors, "The post no longer passes");

  const created = await uploadAll(payload.slug, manifest, files);

  try {
    await writeRow({ ...resolveAssets(payload, urlFor(payload.slug)), status: "published" });
  } catch (error) {
    // A failed cleanup throws its own "orphaned" error, listing the paths.
    await deleteObjects(created);
    throw new PipelineError(
      error instanceof Error ? error.message : String(error),
      "rolled-back",
      "Files this run uploaded were removed. Safe to re-run.",
    );
  }

  await discardPreview(payload.slug);

  const row = await readRow(payload.slug);
  if (row?.status !== "published") {
    throw new PipelineError("The row did not read back as published.", "remote");
  }

  const live = `${SITE_URL}/insights/blog/${payload.slug}`;
  const ping = await pingIndexNow(SITE_URL, [live, `${SITE_URL}/insights/blog`]);

  console.log(`\n  live: ${siteOrigin()}/insights/blog/${payload.slug}`);
  console.log(`  IndexNow: ${ping}`);
  console.log("  staged draft removed");
}

async function unpublish(slug: string) {
  if (!(await setStatus(slug, "draft"))) {
    throw new PipelineError(`No post "${slug}".`, "validation");
  }
  await discardPreview(slug);
  const ping = await pingIndexNow(SITE_URL, [`${SITE_URL}/insights/blog/${slug}`]);
  console.log(`\n  ${slug} is now a draft: its URL 404s on the next request.`);
  console.log(`  IndexNow: ${ping}`);
}

async function verify(slug: string) {
  const row = await readRow(slug);
  if (!row) throw new PipelineError(`No post "${slug}".`, "validation");

  const urls = [row.cover_url, ...[...row.body.matchAll(/\]\((https?:\/\/[^)\s#]+)/g)].map((m) => m[1])]
    .filter((url): url is string => !!url && url.includes(`/object/public/blog/`));

  for (const url of urls) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new PipelineError(`${url} returned ${response.status}`, "remote");
  }

  console.log(`\n  ${slug}: ${row.status}, ${urls.length} stored image(s) served`);
  if (row.status !== "published") process.exitCode = EXIT.validation;
}

/** Published posts, grouped by topic, for the interview: what exists to link,
 *  which pillar each topic has, and what is featured. */
async function list() {
  const posts = (await publishedPosts()).filter((post) => !post.slug.startsWith(PREVIEW_PREFIX));
  for (const topic of BLOG_TOPICS) {
    console.log(`
${topic.name} (${topic.slug})`);
    const inTopic = posts.filter((post) => post.topic === topic.slug);
    if (inTopic.length === 0) console.log("  (no posts)");
    for (const post of inTopic) {
      const marks = [post.pillar ? "pillar" : "", post.featured ? "featured" : ""].filter(Boolean).join(", ");
      console.log(`  ${post.slug}${marks ? `  [${marks}]` : ""}
    ${post.title}`);
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest, { boolean: ["replace", "substantive", "skip-image"] });
  const [target] = flags.positionals;

  const needs = (what: string) => {
    if (!target) throw new PipelineError(`Usage: pnpm blog ${command} <${what}>`, "validation");
    return target;
  };

  switch (command) {
    case "list":
      return list();
    case "bootstrap":
      console.log(`bucket "blog": ${await ensureBucket()}`);
      return;
    case "prepare":
      return prepare(needs("intake.yaml"), flags.booleans);
    case "stage":
      return stage(needs("preview folder"));
    case "publish":
      return publish(needs("preview folder"));
    case "unpublish":
      return unpublish(needs("slug"));
    case "verify":
      return verify(needs("slug"));
    default:
      throw new PipelineError(
        `Unknown command "${command ?? ""}".`,
        "validation",
        "list | bootstrap | prepare <intake.yaml> | stage <preview> | publish <preview> | unpublish <slug> | verify <slug>",
      );
  }
}

// `exitCode`, not `process.exit()`, for the reason the case-study pipeline
// gives: exiting while a keep-alive socket is closing trips a libuv assertion
// on Windows and exits 127, hiding the documented codes.
main().catch((error: unknown) => {
  if (error instanceof PipelineError) {
    console.error(`\n✗ ${error.message}`);
    if (error.detail) console.error(error.detail);
    process.exitCode = EXIT[error.kind];
    return;
  }
  // A remote failure that never passed through `withRetry` (an image model
  // ignoring `output_format`, say). Exit 1 is "fix the intake", which would
  // send the operator to the wrong file.
  if (error instanceof RemoteError) {
    console.error(`\n✗ ${error.message}`);
    if (error.detail) console.error(error.detail);
    process.exitCode = EXIT.remote;
    return;
  }
  console.error(error);
  process.exitCode = 1;
});
