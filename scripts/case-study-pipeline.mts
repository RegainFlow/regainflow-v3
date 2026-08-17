/**
 * Publishing a case study, in two halves with a person in between.
 *
 *   pnpm case-study bootstrap
 *   pnpm case-study prepare  .case-study/<slug>/intake.yaml
 *   pnpm case-study publish  .case-study/<slug>/preview
 *   pnpm case-study verify   <slug>
 *
 * The split is the whole design. `prepare` validates, generates art, and writes
 * a preview folder while touching nothing that anyone can see; `publish` takes
 * that folder and makes it live. Between them a human reads the copy and looks
 * at the picture, because the two rules this enforces — no unapproved names, no
 * undefendable numbers — are the kind a scan can catch violations of but cannot
 * catch compliance with.
 *
 * `publish` re-hashes the image against the manifest, so an approved preview is
 * the thing that ships. Editing the folder after approval fails the run.
 *
 * Environment: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SECRET_KEY. Loaded from
 * `.env.local` by the pnpm script's `--env-file`; never read from anywhere else
 * and never written into the preview folder.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { parse as parseYaml } from "yaml";

import { SITE_URL } from "@/lib/site";

import {
  EXIT,
  PipelineError,
  RemoteError,
  failValidation,
  one,
  parseFlags,
  type Flags,
} from "./case-study/core.mjs";
import {
  scanCompanySuffixes,
  scanDenyTerms,
  scanMetrics,
  walkStrings,
  type Violation,
} from "./case-study/guards.mjs";
import { generateHero, IMAGE_MODEL, IMAGE_SIZE } from "./case-study/image.mjs";
import {
  IntakeSchema,
  crossCheck,
  resolvePayload,
  type CaseStudyPayload,
  type Intake,
} from "./case-study/intake.mjs";
import {
  assertImageHost,
  deleteObject,
  ensureBucket,
  heroPath,
  nextSortOrder,
  publicUrl,
  publishRow,
  readBack,
  sha256,
  slugExists,
  uploadHero,
  verifyPublicUrl,
} from "./case-study/remote.mjs";

/** Bumped when the preview format changes, so a stale folder fails loudly
 *  rather than publishing under new rules it was never checked against. */
const PIPELINE_VERSION = 1;

interface Manifest {
  pipelineVersion: number;
  slug: string;
  createdAt: string;
  replace: boolean;
  status: "draft" | "published";
  image: {
    model: string;
    size: string;
    sha256: string;
    bytes: number;
    path: string;
    url: string;
  } | null;
  allowedMetrics: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// prepare
// ---------------------------------------------------------------------------

async function prepare(flags: Flags): Promise<void> {
  const intakePath = flags.positionals[0];

  if (!intakePath) {
    throw new PipelineError(
      "prepare needs an intake file: pnpm case-study prepare <intake.yaml>",
      "validation",
    );
  }

  const withImage = !flags.booleans.has("skip-image");
  const replace = flags.booleans.has("replace");
  const status = flags.booleans.has("draft") ? "draft" : "published";

  const intake = await readIntake(intakePath, withImage);

  // Slug availability before spending money on a picture.
  if (await slugExists(intake.slug)) {
    if (!replace) {
      throw new PipelineError(
        `A study with slug "${intake.slug}" already exists.`,
        "validation",
        `Re-run with --replace to overwrite it, or choose another slug.`,
      );
    }
    console.log(`  · replacing existing study "${intake.slug}"`);
  }

  const sortOrder = intake.sort_order ?? (await nextSortOrder());

  // The image path is the content hash, so the final URL is knowable before the
  // upload — which lets the approval gate show the exact row that will be
  // written rather than one with a hole in it.
  let image: Manifest["image"] = null;
  let bytes: Uint8Array | undefined;

  if (withImage) {
    console.log(`  · generating hero with ${IMAGE_MODEL} at ${IMAGE_SIZE}`);
    const generated = await generateHero(intake.image_prompt!);
    const digest = sha256(generated.bytes);
    const path = heroPath(intake.slug, digest);

    bytes = generated.bytes;
    image = {
      model: generated.model,
      size: generated.size,
      sha256: digest,
      bytes: generated.bytes.byteLength,
      path,
      url: publicUrl(path),
    };
  }

  const payload = resolvePayload(intake, {
    imageUrl: image?.url ?? null,
    sortOrder,
    status,
  });

  // Scan the row that will be published, plus the prompt — which never renders
  // but does leave the building.
  const scannable = [
    ...walkStrings(payload),
    ...(intake.image_prompt
      ? [{ path: "image_prompt", text: intake.image_prompt }]
      : []),
  ];

  const denied = scanDenyTerms(scannable, intake.deny_terms ?? []);

  if (denied.length > 0) {
    failValidation(
      denied.map(
        (v) => `${v.path}: forbidden term "${v.match}" — ${v.excerpt}`,
      ),
      "Confidential terms reached the payload",
    );
  }

  const allowedMetrics = [
    ...Object.keys(intake.measurement_sources ?? {}),
    ...(flags.values.get("allow-metric") ?? []),
  ];

  const metrics = scanMetrics(scannable, allowedMetrics);

  if (metrics.length > 0) {
    failValidation(
      metrics.map(
        (v) =>
          `${v.path}: undefended ${v.label} "${v.match}" — ${v.excerpt}\n      Add it to measurement_sources with how it was measured, or remove it.`,
      ),
      "Figures with no measurement story",
    );
  }

  const warnings = scanCompanySuffixes(scannable).map(
    (v: Violation) => `${v.path}: looks like an organization name — ${v.excerpt}`,
  );

  const outDir = resolve(one(flags, "out") ?? defaultPreviewDir(intake.slug));
  await mkdir(outDir, { recursive: true });

  const manifest: Manifest = {
    pipelineVersion: PIPELINE_VERSION,
    slug: intake.slug,
    createdAt: new Date().toISOString(),
    replace,
    status,
    image,
    allowedMetrics,
    warnings,
  };

  await writeFile(join(outDir, "payload.json"), `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  if (bytes && image) {
    await writeFile(join(outDir, "hero.webp"), bytes);
    await writeFile(join(outDir, "prompt.txt"), `${(await generatedPrompt(intake))}\n`);
  }

  await writeFile(join(outDir, "report.md"), renderReport(payload, manifest));

  console.log(`\nPrepared "${intake.slug}" — nothing has been published.\n`);
  console.log(`  ${join(outDir, "report.md")}`);
  if (image) console.log(`  ${join(outDir, "hero.webp")}  (${(image.bytes / 1024).toFixed(0)} KB)`);
  for (const warning of warnings) console.log(`\n  ! ${warning}`);
  console.log(`\nReview it, then:\n  pnpm case-study publish ${outDir}\n`);
}

async function generatedPrompt(intake: Intake): Promise<string> {
  const { buildPrompt } = await import("./case-study/image.mjs");
  return buildPrompt(intake.image_prompt ?? "");
}

async function readIntake(path: string, withImage: boolean): Promise<Intake> {
  let raw: string;

  try {
    raw = await readFile(resolve(path), "utf8");
  } catch {
    throw new PipelineError(`Cannot read intake file: ${path}`, "validation");
  }

  let parsed: unknown;

  try {
    parsed = parseYaml(raw);
  } catch (error) {
    throw new PipelineError(
      `${path} is not valid YAML`,
      "validation",
      error instanceof Error ? error.message : String(error),
    );
  }

  const result = IntakeSchema.safeParse(parsed);

  if (!result.success) {
    failValidation(
      result.error.issues.map(
        (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
      ),
      `${path} does not match the intake schema`,
    );
  }

  const problems = crossCheck(result.data, { image: withImage });

  if (problems.length > 0) failValidation(problems, `${path} is inconsistent`);

  return result.data;
}

function defaultPreviewDir(slug: string): string {
  return join(".case-study", slug, "preview");
}

// ---------------------------------------------------------------------------
// publish
// ---------------------------------------------------------------------------

async function publish(flags: Flags): Promise<void> {
  const dir = flags.positionals[0];

  if (!dir) {
    throw new PipelineError(
      "publish needs a preview directory: pnpm case-study publish <preview-dir>",
      "validation",
    );
  }

  const previewDir = resolve(dir);
  const dryRun = flags.booleans.has("dry-run");

  const manifest = JSON.parse(
    await readFile(join(previewDir, "manifest.json"), "utf8"),
  ) as Manifest;
  const payload = JSON.parse(
    await readFile(join(previewDir, "payload.json"), "utf8"),
  ) as CaseStudyPayload;

  if (manifest.pipelineVersion !== PIPELINE_VERSION) {
    throw new PipelineError(
      `Preview was built by pipeline v${manifest.pipelineVersion}; this is v${PIPELINE_VERSION}.`,
      "validation",
      "Re-run prepare.",
    );
  }

  assertImageHost();

  let bytes: Uint8Array | undefined;

  if (manifest.image) {
    bytes = new Uint8Array(await readFile(join(previewDir, "hero.webp")));

    // The approved bytes are the published bytes. Anything else means the
    // folder changed after the person said yes.
    if (sha256(bytes) !== manifest.image.sha256) {
      throw new PipelineError(
        "hero.webp does not match the manifest hash.",
        "validation",
        "The preview was edited or is stale. Re-run prepare and review it again.",
      );
    }
  }

  // The world may have moved between approval and publish.
  if (!manifest.replace && (await slugExists(manifest.slug))) {
    throw new PipelineError(
      `"${manifest.slug}" was created since this preview was prepared.`,
      "validation",
      "Re-run prepare with --replace if overwriting it is intended.",
    );
  }

  if (dryRun) {
    console.log("\nDry run — nothing was written.\n");
    console.log(`  slug        ${manifest.slug}`);
    console.log(`  status      ${manifest.status}`);
    console.log(`  storage     ${manifest.image?.path ?? "(no image)"}`);
    console.log(`  image_url   ${payload.image_url ?? "null"}`);
    return;
  }

  await ensureBucket();

  let uploadedPath: string | undefined;
  let createdByThisRun = false;

  if (bytes && manifest.image) {
    const upload = await uploadHero(manifest.slug, bytes);
    uploadedPath = upload.path;
    createdByThisRun = upload.createdByThisRun;

    if (upload.url !== payload.image_url) {
      throw new PipelineError(
        `Upload landed at ${upload.url} but the payload names ${payload.image_url}.`,
        "validation",
      );
    }

    await verifyPublicUrl(upload.url, manifest.image.sha256);
    console.log(`  · image live at ${upload.url}`);
  }

  try {
    await publishRow(payload);
  } catch (error) {
    // The image is up and the row is not. Leave nothing behind — but only what
    // this run created, because an object that predates it may belong to a
    // different row.
    if (uploadedPath && createdByThisRun) {
      try {
        await deleteObject(uploadedPath);
        throw new PipelineError(
          `Database write failed; the uploaded image was removed.`,
          "rolled-back",
          error instanceof Error ? error.message : String(error),
        );
      } catch (cleanup) {
        if (cleanup instanceof PipelineError && cleanup.kind === "rolled-back") {
          throw cleanup;
        }
        throw new PipelineError(
          `Database write failed AND the uploaded image could not be removed.`,
          "orphaned",
          `Delete it by hand: ${BUCKET_HINT}${uploadedPath}\n${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    throw error;
  }

  const row = await readBack(manifest.slug);

  if (manifest.status === "published" && !row) {
    throw new PipelineError(
      `The row was written but does not read back as published.`,
      "remote",
    );
  }

  console.log(`\nPublished "${manifest.slug}".\n`);
  console.log(`  ${SITE_URL}/insights/${manifest.slug}`);
  if (payload.image_url) console.log(`  ${payload.image_url}`);
  for (const group of payload.industries) {
    console.log(`  ${SITE_URL}/industries/${group}`);
  }
  console.log("");
}

const BUCKET_HINT = "case-studies/";

// ---------------------------------------------------------------------------
// verify
// ---------------------------------------------------------------------------

async function verify(flags: Flags): Promise<void> {
  const slug = flags.positionals[0];

  if (!slug) {
    throw new PipelineError("verify needs a slug", "validation");
  }

  const origin = (one(flags, "site") ?? SITE_URL).replace(/\/$/, "");
  const row = await readBack(slug);

  if (!row) {
    throw new PipelineError(`No published study with slug "${slug}".`, "remote");
  }

  console.log(`  row         ok (featured=${row.featured})`);

  if (row.image_url) {
    await verifyPublicUrl(row.image_url);
    console.log(`  image       ok`);
  }

  for (const path of [
    `/insights/${slug}`,
    "/insights",
    ...row.industries.map((group) => `/industries/${group}`),
  ]) {
    const response = await fetch(`${origin}${path}`);
    console.log(`  ${response.ok ? "ok  " : "FAIL"}        ${origin}${path} (${response.status})`);

    if (!response.ok) {
      throw new PipelineError(`${origin}${path} returned ${response.status}`, "remote");
    }
  }
}

// ---------------------------------------------------------------------------

function renderReport(payload: CaseStudyPayload, manifest: Manifest): string {
  const lines = [
    `# ${payload.title}`,
    "",
    `**Nothing below is published yet.**`,
    "",
    `| | |`,
    `|---|---|`,
    `| slug | \`${payload.slug}\` |`,
    `| status | ${manifest.status} |`,
    `| featured | ${payload.featured} |`,
    `| sort_order | ${payload.sort_order} |`,
    `| industries | ${payload.industries.join(", ") || "—"} |`,
    `| replaces existing | ${manifest.replace} |`,
    `| image | ${manifest.image ? `${manifest.image.model}, ${(manifest.image.bytes / 1024).toFixed(0)} KB` : "none"} |`,
    "",
  ];

  if (manifest.warnings.length > 0) {
    lines.push("## Warnings — read these", "");
    for (const warning of manifest.warnings) lines.push(`- ${warning}`);
    lines.push("");
  }

  if (manifest.allowedMetrics.length > 0) {
    lines.push(
      "## Figures exempted from the measurement rule",
      "",
      "Each of these was declared defensible by the operator:",
      "",
    );
    for (const metric of manifest.allowedMetrics) lines.push(`- ${metric}`);
    lines.push("");
  }

  lines.push("## Copy", "");
  for (const [label, value] of [
    ["Summary", payload.summary],
    ["Context", payload.context],
    ["Constraints", payload.constraints],
    ["Role", payload.role],
    ["Outcome", payload.outcome],
    ["Next", payload.next_body],
  ] as const) {
    lines.push(`### ${label}`, "", value, "");
  }

  if (payload.image_alt) lines.push(`### Image alt`, "", payload.image_alt, "");

  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  const flags = parseFlags(rest, {
    boolean: ["replace", "skip-image", "dry-run", "draft"],
    string: ["out", "allow-metric", "site"],
  });

  switch (command) {
    case "bootstrap": {
      assertImageHost();
      const result = await ensureBucket();
      console.log(`  bucket case-studies: ${result}`);
      return;
    }
    case "prepare":
      return prepare(flags);
    case "publish":
      return publish(flags);
    case "verify":
      return verify(flags);
    default:
      throw new PipelineError(
        `Unknown command: ${command ?? "(none)"}`,
        "validation",
        "Expected one of: bootstrap, prepare, publish, verify",
      );
  }
}

/**
 * Exit by setting the code, not by calling `process.exit()`.
 *
 * `process.exit()` while the Supabase client still holds a keep-alive socket
 * aborts the process on Windows with a libuv assertion, and an aborted process
 * reports **127** — so every validation failure that had already talked to
 * Supabase exited "command not found" rather than "invalid input". The exit
 * code is the only thing a caller can branch on, so it has to survive.
 *
 * Setting `exitCode` lets the loop drain first. Nothing here holds it open on
 * purpose; what is left is idle sockets, and those close on their own.
 */
main().catch((error: unknown) => {
  if (error instanceof PipelineError) {
    console.error(`\n${error.message}\n`);
    if (error.detail) console.error(`${error.detail}\n`);
    process.exitCode = EXIT[error.kind];
    return;
  }

  // A `RemoteError` that never passed through `withRetry` — a response shape
  // nobody expected, a model that ignored `output_format`. Mapped rather than
  // left to the generic branch below, because that branch exits 1, and 1 is
  // documented as "invalid intake": an operator with a wrong model id would be
  // sent to re-read their YAML file.
  if (error instanceof RemoteError) {
    console.error(`\n${error.message}\n`);
    if (error.detail) console.error(`${error.detail}\n`);
    process.exitCode = EXIT.remote;
    return;
  }

  console.error(`\n${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
