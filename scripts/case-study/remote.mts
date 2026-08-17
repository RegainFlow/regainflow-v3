/**
 * Everything that touches Supabase.
 *
 * Two things here are load-bearing and easy to get subtly wrong:
 *
 * 1. **The write goes through `publish_case_study`, not the table.** The secret
 *    key holds `select` on `case_studies` and nothing else — a `.upsert()` here
 *    would fail with "permission denied", and the fix is not to widen the grant.
 *    See `20260816180000_case_studies_publisher.sql`.
 *
 * 2. **A 409 on upload is usually success.** The object path is the content
 *    hash, so re-publishing an unchanged image lands on bytes that are already
 *    correct. Treating that as an error would break `--replace` for every study
 *    whose art did not change.
 */

import { createHash } from "node:crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { PipelineError, RemoteError, requireEnv, withRetry } from "./core.mjs";
import type { CaseStudyPayload } from "./intake.mjs";

export const BUCKET = "case-studies";

/**
 * The only host `next/image` will load a study image from.
 *
 * Hardcoded in `next.config.ts` under `images.remotePatterns`, and duplicated
 * here on purpose: publishing to a project whose host is not in that list
 * produces a study page that throws on render, and catching it at publish time
 * costs one comparison.
 */
const IMAGE_HOST = "qsnaxtjoyqycpbmmghff.supabase.co";

let cached: SupabaseClient | undefined;

export function client(): SupabaseClient {
  if (cached) return cached;

  cached = createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  return cached;
}

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function heroPath(slug: string, digest: string): string {
  return `hero/${slug}/${digest.slice(0, 16)}.webp`;
}

export function publicUrl(path: string): string {
  const base = requireEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Refuse to publish somewhere the site cannot render from.
 *
 * A loopback host is the local stack and is allowed through with a warning —
 * that is the test path, and its images are never meant to reach a page.
 */
export function assertImageHost(): void {
  const host = new URL(requireEnv("SUPABASE_URL")).hostname;

  if (host === IMAGE_HOST) return;

  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    console.warn(
      `  ! Local Supabase (${host}). Images published here will not render on the deployed site.`,
    );
    return;
  }

  throw new PipelineError(
    `SUPABASE_URL points at ${host}, which next/image will not load.`,
    "config",
    `images.remotePatterns in next.config.ts allows ${IMAGE_HOST} only. Publishing here would produce a study page that throws on render.`,
  );
}

/** Idempotent. An existing bucket is the expected state, not a failure. */
export async function ensureBucket(): Promise<"created" | "exists"> {
  const supabase = client();

  const { data: existing } = await supabase.storage.getBucket(BUCKET);

  if (existing) return "exists";

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/webp"],
    fileSizeLimit: "4MB",
  });

  if (error) {
    throw new PipelineError(
      `Could not create the ${BUCKET} bucket: ${error.message}`,
      "remote",
    );
  }

  return "created";
}

export async function slugExists(slug: string): Promise<boolean> {
  const { data, error } = await client()
    .from("case_studies")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new PipelineError(`Could not read case_studies: ${error.message}`, "remote");
  }

  return data !== null;
}

/** Where a new study lands in the listing when the intake does not say. */
export async function nextSortOrder(): Promise<number> {
  const { data, error } = await client()
    .from("case_studies")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new PipelineError(`Could not read sort_order: ${error.message}`, "remote");
  }

  return ((data?.sort_order as number | undefined) ?? -1) + 1;
}

export interface Upload {
  path: string;
  url: string;
  /** False when the object was already there with identical bytes. Decides
   *  whether a failed database write is allowed to delete it. */
  createdByThisRun: boolean;
}

/**
 * Upload, treating an identical existing object as success.
 *
 * `upsert: false` on purpose — the path is a content hash, so the only way to
 * collide is with the same bytes or with somebody else's. The first is fine and
 * the second must never be overwritten, which is why the collision is resolved
 * by comparing hashes rather than by forcing the write.
 */
export async function uploadHero(
  slug: string,
  bytes: Uint8Array,
): Promise<Upload> {
  const digest = sha256(bytes);
  const path = heroPath(slug, digest);
  const url = publicUrl(path);

  const { error } = await client()
    .storage.from(BUCKET)
    .upload(path, bytes, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (!error) return { path, url, createdByThisRun: true };

  const duplicate =
    (error as { statusCode?: string | number }).statusCode === "409" ||
    (error as { statusCode?: string | number }).statusCode === 409 ||
    /exists/i.test(error.message);

  if (!duplicate) {
    throw new PipelineError(`Upload failed: ${error.message}`, "remote");
  }

  // Something is already at our content-addressed path. If it is our bytes,
  // nothing needs doing. If it is not, we are about to point a study at a file
  // we did not write.
  const existing = await downloadPublic(url);

  if (sha256(existing) !== digest) {
    throw new PipelineError(
      `A different file already occupies ${path}.`,
      "remote",
      "The path is a content hash, so this should be impossible. Investigate before republishing; do not overwrite it.",
    );
  }

  console.log("  · image already published with identical bytes");

  return { path, url, createdByThisRun: false };
}

/**
 * Confirm the object is actually served before a row points at it.
 *
 * Retried, because object storage behind a CDN is not always readable the
 * instant the upload returns, and a study whose image 404s for the first ten
 * seconds is worse than a publish that takes ten seconds longer. GET rather
 * than HEAD: HEAD is the request most likely to be handled differently.
 */
export async function verifyPublicUrl(
  url: string,
  expectedDigest?: string,
): Promise<void> {
  const bytes = await downloadPublic(url);

  if (expectedDigest && sha256(bytes) !== expectedDigest) {
    throw new PipelineError(
      `The published image at ${url} does not match what was uploaded.`,
      "remote",
    );
  }
}

async function downloadPublic(url: string): Promise<Uint8Array> {
  return withRetry("image fetch", async () => {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new RemoteError(`${url} returned ${response.status}`, response.status);
    }

    const type = response.headers.get("content-type") ?? "";

    if (!type.startsWith("image/")) {
      throw new RemoteError(
        `${url} served ${type || "no content-type"}, not an image`,
        undefined,
      );
    }

    return new Uint8Array(await response.arrayBuffer());
  });
}

export async function deleteObject(path: string): Promise<void> {
  const { error } = await client().storage.from(BUCKET).remove([path]);

  if (error) {
    throw new PipelineError(
      `Could not remove ${path}: ${error.message}`,
      "orphaned",
    );
  }
}

/**
 * The write. One RPC, because the table does not accept writes from this key.
 */
export async function publishRow(payload: CaseStudyPayload): Promise<void> {
  const { error } = await client().rpc("publish_case_study", { payload });

  if (error) {
    throw new PipelineError(
      `Database write failed: ${error.message}`,
      "remote",
      error.hint ?? error.details ?? undefined,
    );
  }
}

/** Read the row back through the site's own filter, so "published" means what
 *  the site means by it. */
export async function readBack(slug: string): Promise<{
  slug: string;
  image_url: string | null;
  featured: boolean;
  industries: string[];
} | null> {
  const { data, error } = await client()
    .from("case_studies")
    .select("slug, image_url, featured, industries")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new PipelineError(`Read-back failed: ${error.message}`, "remote");
  }

  return data as {
    slug: string;
    image_url: string | null;
    featured: boolean;
    industries: string[];
  } | null;
}
