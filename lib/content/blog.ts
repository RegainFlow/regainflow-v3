/**
 * The shape of a blog post, and nothing else.
 *
 * Posts live in `public.blog_posts` and are fetched per request — see
 * `lib/blog.server.ts`. **This module must stay import-free**, for the reason
 * `lib/content/reports.ts` gives: cards need these types, and a Supabase import
 * here would pull the secret-key client toward a browser bundle.
 */

/** The post-specific next step. Shown inline and again at the end. */
export interface BlogCta {
  eyebrow: string;
  heading: string;
  body: string;
  label: string;
  href: string;
}

/** What a listing needs. No body: a list of posts has no use for it. */
export interface BlogPostSummary {
  slug: string;
  title: string;
  /** The deck. One or two sentences, and the meta description fallback. */
  summary: string;
  /** ISO date. Drives display order and `datePublished`. */
  published: string;
  /**
   * ISO date of the last substantive edit, or undefined if there has been
   * none. Drives the visible "Updated" line and `dateModified`.
   */
  updatedOn?: string;
  /** A founder slug from `TEAM`, or the organization. */
  author: string;
  /** A slug from `BLOG_TOPICS`. */
  topic: string;
  tags: string[];
  /** Absolute URL, or a root-relative path under `/public`. */
  cover?: string;
  coverAlt?: string;
  coverCredit?: string;
  featured: boolean;
  pillar: boolean;
  /** Minutes, computed from the body server-side. */
  readingMinutes: number;
}

export interface BlogPost extends BlogPostSummary {
  /** GitHub-flavoured markdown, plus the fenced figure blocks. */
  body: string;
  wordCount: number;
  takeaways: string[];
  related: string[];
  cta?: BlogCta;
  metaTitle?: string;
  metaDescription?: string;
}

/** "September 12, 2026". Posts are dated to the day, unlike reports. */
export function postDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Words in the prose, ignoring fenced figure blocks and link targets. */
export function countWords(body: string): number {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Whole minutes at 238 words a minute, never less than one. An honest
 * expectation-setter; the research finds no evidence it does more than that.
 */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(countWords(body) / 238));
}

/**
 * True for an image on the local Supabase stack (`pnpm blog stage` against
 * `.env.local`). `next/image` refuses to optimize a loopback URL, so those
 * render `unoptimized`: the draft preview shows the real picture, and nothing
 * served in production is ever on loopback.
 */
export function isLoopbackImage(src: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?\//.test(src);
}
