/**
 * The blog intake, and the row it becomes.
 *
 * Two files per post in `.blog/<slug>/` (gitignored): `intake.yaml` carries the
 * metadata and the governance fields, and `post.md` carries the body, because
 * prose is easier to write and diff in its own file than in a YAML block.
 *
 * As with the case studies, the intake and the payload are separate shapes.
 * `deny_terms`, image clearance and the cover prompt exist to be checked and
 * then dropped. The payload is exactly the columns `publish_blog_post` takes.
 *
 * Images are not uploaded when the payload is built, and the target database
 * is not known yet (a preview prepared against local may be published to
 * production), so every image reference is written as `asset:<object name>`
 * and resolved to a public URL by `resolveAssets` at write time.
 */

import { z } from "zod";

/** Mirrors `blog_posts_slug_kebab`, without the `preview--` prefix, which is
 *  the pipeline's and never an author's. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Segments under `/insights/blog/` that a post slug would shadow or collide
 *  with. `feed.xml` cannot match the slug pattern, but is listed so the list
 *  is the whole truth. */
export const RESERVED_SLUGS = ["topics", "authors", "page", "preview", "feed.xml"];

export const ASSET_PREFIX = "asset:";

const nonEmpty = z.string().trim().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date written YYYY-MM-DD");

const cta = z
  .object({
    eyebrow: nonEmpty,
    heading: nonEmpty,
    body: nonEmpty,
    label: nonEmpty,
    href: nonEmpty.refine(
      (href) => href.startsWith("/") || href.startsWith("https://"),
      "a same-site path or an https:// URL (the page drops anything else)",
    ),
  })
  .strict();

/**
 * The cover. A real file (a photo, screenshot or diagram we are cleared to
 * show) or, only when there is none, a `generate` subject for the house
 * illustration. Never both: a file with a prompt beside it is ambiguous about
 * which one was approved.
 */
const cover = z
  .object({
    file: nonEmpty.optional(),
    generate: nonEmpty.optional(),
    alt: nonEmpty,
    credit: nonEmpty.optional(),
    cleared: z.boolean().optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!!value.file === !!value.generate) {
      ctx.addIssue({ code: "custom", message: "give exactly one of `file` or `generate`" });
    }
    if (value.file && value.cleared !== true) {
      ctx.addIssue({
        code: "custom",
        message: "`cleared: true` is required for a cover file: someone has confirmed we may show it",
      });
    }
    if (value.file && !value.credit) {
      ctx.addIssue({ code: "custom", message: "`credit` is required for a cover file" });
    }
  });

/** A body image's clearance. Alt text and caption live in the markdown. */
const image = z
  .object({
    file: nonEmpty,
    cleared: z.literal(true, {
      message: "`cleared: true` is required: someone has confirmed we may show it",
    }),
    credit: nonEmpty.optional(),
  })
  .strict();

export const IntakeSchema = z
  .object({
    slug: z.string().regex(SLUG_PATTERN, "lowercase words joined by single hyphens"),
    title: nonEmpty,
    summary: nonEmpty,
    author: nonEmpty,
    topic: nonEmpty,
    tags: z.array(nonEmpty).max(6).default([]),
    takeaways: z.array(nonEmpty).min(3).max(5),
    related: z.array(z.string().regex(SLUG_PATTERN)).max(5).default([]),
    cta: cta.nullable().default(null),
    featured: z.boolean().default(false),
    pillar: z.boolean().default(false),
    /** First-publish date. Omitted, it is the day `prepare` runs. Ignored on
     *  a replace, which keeps the live row's date. */
    published: isoDate.optional(),
    meta_title: nonEmpty.optional(),
    meta_description: nonEmpty.optional(),
    /** The body file, relative to the intake. */
    body: nonEmpty.default("post.md"),
    cover: cover.optional(),
    images: z.array(image).default([]),
    deny_terms: z.array(nonEmpty).default([]),
  })
  .strict();

export type Intake = z.infer<typeof IntakeSchema>;

export interface BlogPayload {
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated_on: string | null;
  author: string;
  topic: string;
  tags: string[];
  takeaways: string[];
  related: string[];
  cta: Intake["cta"];
  cover_url: string | null;
  cover_alt: string | null;
  cover_credit: string | null;
  featured: boolean;
  pillar: boolean;
  meta_title: string | null;
  meta_description: string | null;
  body: string;
  status: "draft" | "published";
}

/** A markdown image: `![alt](src "caption")`. */
export interface BodyImage {
  alt: string;
  src: string;
  caption?: string;
  /** The whole match, for replacement. */
  raw: string;
}

const IMAGE_PATTERN = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g;

/** Every image in the body, fenced code excluded. */
export function bodyImages(body: string): BodyImage[] {
  return [...stripFences(body).matchAll(IMAGE_PATTERN)].map((match) => ({
    raw: match[0],
    alt: match[1].trim(),
    src: match[2],
    ...(match[3] ? { caption: match[3] } : {}),
  }));
}

/** A path in the post folder, as opposed to a URL or a site path. */
export function isLocalSrc(src: string): boolean {
  return !/^(https?:)?\/\//.test(src) && !src.startsWith("/") && !src.startsWith(ASSET_PREFIX);
}

/**
 * The body with fenced code blocks blanked out, line count preserved, so a
 * scan for headings or images does not trip over an example inside a fence.
 */
export function stripFences(body: string): string {
  return body.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, (block) => block.replace(/[^\n]/g, " "));
}

/**
 * Swaps every `asset:<name>` for its public URL. The `#<w>x<h>` fragment the
 * pipeline appended stays on the URL; the page reads it.
 */
export function resolveAssets(
  payload: BlogPayload,
  urlFor: (name: string) => string,
): BlogPayload {
  const swap = (text: string) =>
    text.replace(/asset:([\w.-]+)/g, (_match, name: string) => urlFor(name));

  return {
    ...payload,
    body: swap(payload.body),
    cover_url: payload.cover_url ? swap(payload.cover_url) : null,
  };
}

/** Today in UTC as YYYY-MM-DD, which is how the table stores post dates. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
