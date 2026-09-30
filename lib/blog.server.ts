import "server-only";

import { supabase } from "@/lib/supabase";
import {
  countWords,
  readingMinutes,
  type BlogCta,
  type BlogPost,
  type BlogPostSummary,
} from "@/lib/content/blog";

/**
 * Reading blog posts out of `public.blog_posts`.
 *
 * The server-only half of `lib/content/blog.ts`, built the same way as
 * `lib/reports.server.ts` — read that file for the reasoning behind named
 * columns, the `throwOnError` option, and the null-versus-throw split on the
 * single-row read. It all applies here unchanged.
 */

const PUBLISHED = "published";

/**
 * The listing still selects `body`, because reading time is computed from it.
 * Posts are a few thousand words at most, so that is cheaper than a second
 * column that has to be kept in step with the text.
 */
const LIST_COLUMNS =
  "slug, title, summary, published, updated_on, author, topic, tags, cover_url, cover_alt, cover_credit, featured, pillar, body";

const POST_COLUMNS = `${LIST_COLUMNS}, takeaways, related, cta, meta_title, meta_description`;

interface BlogPostRow {
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated_on: string | null;
  author: string;
  topic: string;
  tags: string[] | null;
  cover_url: string | null;
  cover_alt: string | null;
  cover_credit: string | null;
  featured: boolean;
  pillar: boolean;
  body: string;
  takeaways?: string[] | null;
  related?: string[] | null;
  cta?: unknown;
  meta_title?: string | null;
  meta_description?: string | null;
}

function toSummary(row: BlogPostRow): BlogPostSummary {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    published: row.published,
    ...(row.updated_on ? { updatedOn: row.updated_on } : {}),
    author: row.author,
    topic: row.topic,
    tags: row.tags ?? [],
    ...(row.cover_url ? { cover: row.cover_url } : {}),
    ...(row.cover_alt ? { coverAlt: row.cover_alt } : {}),
    ...(row.cover_credit ? { coverCredit: row.cover_credit } : {}),
    featured: row.featured,
    pillar: row.pillar,
    readingMinutes: readingMinutes(row.body),
  };
}

/**
 * The CTA is jsonb, typed by nobody. Accepted only when every field is a
 * non-empty string and the link is same-site or https — a half-filled object
 * renders the default offer instead of a button to nowhere.
 */
function toCta(value: unknown): BlogCta | undefined {
  if (!value || typeof value !== "object") return undefined;

  const cta = value as Record<string, unknown>;
  const fields = ["eyebrow", "heading", "body", "label", "href"] as const;

  if (!fields.every((key) => typeof cta[key] === "string" && cta[key])) {
    return undefined;
  }

  const href = cta.href as string;
  if (!href.startsWith("/") && !href.startsWith("https://")) return undefined;

  return Object.fromEntries(fields.map((key) => [key, cta[key]])) as unknown as BlogCta;
}

function toPost(row: BlogPostRow): BlogPost {
  return {
    ...toSummary(row),
    body: row.body,
    wordCount: countWords(row.body),
    takeaways: row.takeaways ?? [],
    related: row.related ?? [],
    ...(toCta(row.cta) ? { cta: toCta(row.cta) } : {}),
    ...(row.meta_title ? { metaTitle: row.meta_title } : {}),
    ...(row.meta_description
      ? { metaDescription: row.meta_description }
      : {}),
  };
}

export interface PostFilter {
  throwOnError?: boolean;
  topic?: string;
  author?: string;
  featured?: boolean;
  limit?: number;
}

/**
 * Published posts, newest first, optionally narrowed. `[]` on failure unless
 * `throwOnError`, which the sitemap and llms.txt pass — see `getReports`.
 */
export async function getPosts({
  throwOnError = false,
  topic,
  author,
  featured,
  limit,
}: PostFilter = {}): Promise<BlogPostSummary[]> {
  try {
    let query = supabase()
      .from("blog_posts")
      .select(LIST_COLUMNS)
      .eq("status", PUBLISHED);

    if (topic) query = query.eq("topic", topic);
    if (author) query = query.eq("author", author);
    if (featured) query = query.eq("featured", true);

    query = query.order("published", { ascending: false });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data as BlogPostRow[]).map(toSummary);
  } catch (error) {
    if (throwOnError) throw error;

    console.error("[blog] listing unavailable", error);
    return [];
  }
}

/**
 * One published post, or `null` for a slug nobody published. An outage throws,
 * so it becomes a 500 rather than a 404 that would de-index a live post.
 *
 * `includeDrafts` is for the token-gated preview route and nothing else: it is
 * the only thing standing between a half-written row and a visitor.
 */
export async function getPost(
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<BlogPost | null> {
  let query = supabase().from("blog_posts").select(POST_COLUMNS).eq("slug", slug);
  if (!includeDrafts) query = query.eq("status", PUBLISHED);

  const { data, error } = await query.maybeSingle();

  if (error) throw new Error(error.message);

  return data ? toPost(data as unknown as BlogPostRow) : null;
}

/**
 * What to read next: the post's own curated list first, in the order written,
 * then the rest of its topic, then whatever is newest. Relevance beats volume
 * (`docs/blogs_seo/blog_ui_ux.md`, Part 5.2), so the curated list leads and
 * the fallbacks only fill gaps.
 */
export function pickRelated(
  post: BlogPost,
  all: BlogPostSummary[],
  count = 3,
): BlogPostSummary[] {
  const others = all.filter((other) => other.slug !== post.slug);
  const bySlug = new Map(others.map((other) => [other.slug, other]));

  const picked: BlogPostSummary[] = [];
  const take = (candidate: BlogPostSummary | undefined) => {
    if (candidate && !picked.includes(candidate) && picked.length < count) {
      picked.push(candidate);
    }
  };

  post.related.forEach((slug) => take(bySlug.get(slug)));
  others.filter((other) => other.topic === post.topic).forEach(take);
  others.forEach(take);

  return picked;
}
