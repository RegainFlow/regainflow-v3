/**
 * Everything the blog pipeline sends to Supabase and to IndexNow.
 *
 * Shares the case-study pipeline's client and its reasoning (see
 * `scripts/case-study/remote.mts`): writes go through SECURITY DEFINER
 * functions because the secret key holds `select` only on the table, and
 * object paths are content hashes, so a 409 on an identical file is success.
 */

import { client, sha256 } from "../case-study/remote.mjs";
import { PipelineError, RemoteError, requireEnv, withRetry } from "../case-study/core.mjs";

import type { BlogPayload } from "./intake.mjs";
import type { KnownPost } from "./guards.mjs";

export const BUCKET = "blog";

/** The production image host, mirrored from `next.config.ts`. */
const IMAGE_HOST = "qsnaxtjoyqycpbmmghff.supabase.co";

export const PREVIEW_PREFIX = "preview--";

export function objectPath(slug: string, name: string): string {
  return `post/${slug}/${name}`;
}

export function publicUrl(path: string): string {
  const base = requireEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** True when SUPABASE_URL is the local stack. Loopback images render through
 *  `unoptimized` on the preview page and never reach production. */
export function isLocalTarget(): boolean {
  const host = new URL(requireEnv("SUPABASE_URL")).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/** Refuse a target whose images the deployed site could not load. */
export function assertImageHost(): void {
  const host = new URL(requireEnv("SUPABASE_URL")).hostname;
  if (host === IMAGE_HOST || isLocalTarget()) return;

  throw new PipelineError(
    `SUPABASE_URL points at ${host}, which next/image will not load.`,
    "config",
    `images.remotePatterns in next.config.ts allows ${IMAGE_HOST} only.`,
  );
}

export async function ensureBucket(): Promise<"created" | "exists"> {
  const supabase = client();
  const { data: existing } = await supabase.storage.getBucket(BUCKET);
  if (existing) return "exists";

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/webp", "image/png", "image/jpeg"],
    fileSizeLimit: "5MB",
  });

  if (error) {
    throw new PipelineError(`Could not create the ${BUCKET} bucket: ${error.message}`, "remote");
  }
  return "created";
}

/** Published posts, for the guards: slugs, titles, pillars, featured. */
export async function publishedPosts(): Promise<KnownPost[]> {
  const { data, error } = await client()
    .from("blog_posts")
    .select("slug, title, topic, pillar, featured")
    .eq("status", "published");

  if (error) {
    throw new PipelineError(`Could not read blog_posts: ${error.message}`, "remote");
  }
  return (data ?? []) as KnownPost[];
}

/** The live row's dates, which a replace keeps. */
export async function liveDates(
  slug: string,
): Promise<{ published: string; updated_on: string | null } | null> {
  const { data, error } = await client()
    .from("blog_posts")
    .select("published, updated_on")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new PipelineError(`Could not read blog_posts: ${error.message}`, "remote");
  return data as { published: string; updated_on: string | null } | null;
}

/**
 * Uploads one asset, treating identical bytes already at the path as success.
 * Returns whether this run created it, so a failed write can clean up only
 * what it added.
 */
export async function uploadAsset(
  slug: string,
  name: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<{ path: string; created: boolean }> {
  const path = objectPath(slug, name);

  const { error } = await client().storage.from(BUCKET).upload(path, bytes, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (!error) return { path, created: true };

  const status = (error as { statusCode?: string | number }).statusCode;
  const duplicate = status === "409" || status === 409 || /exists/i.test(error.message);
  if (!duplicate) throw new PipelineError(`Upload of ${name} failed: ${error.message}`, "remote");

  const existing = await download(publicUrl(path));
  if (sha256(existing) !== sha256(bytes)) {
    throw new PipelineError(
      `A different file already occupies ${path}.`,
      "remote",
      "The name is a content hash, so this should be impossible. Investigate; do not overwrite it.",
    );
  }
  return { path, created: false };
}

export async function deleteObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await client().storage.from(BUCKET).remove(paths);
  if (error) {
    throw new PipelineError(
      `Could not remove uploaded files: ${error.message}`,
      "orphaned",
      paths.map((p) => `  ${BUCKET}/${p}`).join("\n"),
    );
  }
}

/** Confirms an uploaded object is served, byte for byte. */
export async function verifyAsset(path: string, digest: string): Promise<void> {
  const bytes = await download(publicUrl(path));
  if (sha256(bytes) !== digest) {
    throw new PipelineError(`The served file at ${path} does not match what was uploaded.`, "remote");
  }
}

async function download(url: string): Promise<Uint8Array> {
  return withRetry("image fetch", async () => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new RemoteError(`${url} returned ${response.status}`, response.status);
    return new Uint8Array(await response.arrayBuffer());
  });
}

export async function writeRow(payload: BlogPayload): Promise<void> {
  const { error } = await client().rpc("publish_blog_post", { payload });
  if (error) {
    throw new PipelineError(
      `Database write failed: ${error.message}`,
      "remote",
      error.hint ?? error.details ?? undefined,
    );
  }
}

export async function setStatus(slug: string, status: "draft" | "published"): Promise<boolean> {
  const { data, error } = await client().rpc("set_blog_post_status", {
    p_slug: slug,
    p_status: status,
  });
  if (error) throw new PipelineError(`Status change failed: ${error.message}`, "remote");
  return Boolean(data && (data as { slug?: string }).slug);
}

export async function discardPreview(slug: string): Promise<void> {
  const { error } = await client().rpc("discard_blog_preview", { p_slug: slug });
  if (error) throw new PipelineError(`Could not remove the staged draft: ${error.message}`, "remote");
}

/** The row as the site would read it, published or not. */
export async function readRow(
  slug: string,
): Promise<{ slug: string; status: string; cover_url: string | null; body: string } | null> {
  const { data, error } = await client()
    .from("blog_posts")
    .select("slug, status, cover_url, body")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new PipelineError(`Read-back failed: ${error.message}`, "remote");
  return data as { slug: string; status: string; cover_url: string | null; body: string } | null;
}

/**
 * Tells Bing (and the other IndexNow engines) that URLs changed, which Bing's
 * webmaster guidance recommends alongside the sitemap. Best-effort: a failed
 * ping is printed, never fatal, because the post is already live and the
 * sitemap will be crawled anyway.
 *
 * The key file is served by `app/indexnow.txt/route.ts` from `INDEXNOW_KEY`,
 * which is why the ping names `keyLocation` rather than a `/<key>.txt` file.
 */
export async function pingIndexNow(siteUrl: string, urls: string[]): Promise<string> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return "skipped (INDEXNOW_KEY unset)";
  if (isLocalTarget()) return "skipped (local database)";

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key,
        keyLocation: `${siteUrl}/indexnow.txt`,
        urlList: urls,
      }),
    });
    return response.ok ? `sent (${response.status})` : `refused (${response.status} ${await response.text()})`;
  } catch (error) {
    return `failed (${error instanceof Error ? error.message : String(error)})`;
  }
}
