/**
 * What `docs/blogs_seo/` asks of a post, checked before anything is uploaded.
 *
 * Two severities. An **error** stops `prepare`: a broken page, a broken link,
 * a missing alt, a client name. A **warning** is printed in the preview report
 * for the person at the approval gate: a meta description that will be
 * truncated, a number with no source, too few internal links. Warnings exist
 * because each one is a judgment the research informs but cannot make; turning
 * them into errors would get the scan switched off.
 *
 * Pure: everything it needs is passed in, so `guards.test.mts` exercises it
 * without a database.
 */

import { walkStrings, scanDenyTerms, CLAIM_PATTERNS } from "../case-study/guards.mjs";
import {
  parseBars,
  parseCallout,
  parseSteps,
  parseVideo,
} from "../../lib/blog-figures";

import {
  RESERVED_SLUGS,
  bodyImages,
  isLocalSrc,
  stripFences,
  type BlogPayload,
} from "./intake.mjs";

export interface Findings {
  errors: string[];
  warnings: string[];
}

/** A published post, as much of it as the checks need. */
export interface KnownPost {
  slug: string;
  title: string;
  topic: string;
  pillar: boolean;
  featured: boolean;
}

export interface CheckContext {
  /** Published posts, excluding the preview rows. */
  published: KnownPost[];
  topics: string[];
  authors: string[];
  /** `--replace` was passed. */
  replace: boolean;
  /** Local body images the intake lists as cleared. */
  clearedImages: string[];
  denyTerms: string[];
  /** The cover generation prompt, scanned for deny terms: it goes to a third
   *  party even though it never renders. */
  coverPrompt?: string;
}

const FIGURE_PARSERS: Record<string, (text: string) => unknown> = {
  callout: parseCallout,
  steps: parseSteps,
  bars: parseBars,
  video: parseVideo,
};

/** Search snippet limits. Google truncates by pixel width, so these are the
 *  common character approximations, and a miss is a warning. */
export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_RANGE = [120, 160] as const;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[*_`[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function checkPost(payload: BlogPayload, ctx: CheckContext): Findings {
  const errors: string[] = [];
  const warnings: string[] = [];
  const body = payload.body;
  const prose = stripFences(body);
  const others = ctx.published.filter((post) => post.slug !== payload.slug);
  const existing = ctx.published.find((post) => post.slug === payload.slug);

  // --- Identity ------------------------------------------------------------

  if (RESERVED_SLUGS.includes(payload.slug)) {
    errors.push(`slug "${payload.slug}" is a reserved path under /insights/blog/`);
  }
  if (payload.slug.length > 60) {
    warnings.push(`slug is ${payload.slug.length} characters; short, readable slugs are the recommendation`);
  }
  if (/(^|-)(19|20)\d{2}(-|$)/.test(payload.slug)) {
    warnings.push("slug contains a year; a dated slug reads stale after a refresh, and changing a URL needs a redirect");
  }
  if (existing && !ctx.replace) {
    errors.push(`"${payload.slug}" is already published. Pass --replace to overwrite it (the whole row is rewritten).`);
  }
  if (!existing && ctx.replace) {
    errors.push(`--replace was passed but "${payload.slug}" is not published; drop the flag for a new post`);
  }
  if (!ctx.authors.includes(payload.author)) {
    errors.push(`author "${payload.author}" is not a founder slug (${ctx.authors.join(", ")}); a post needs a real byline with an author page`);
  }
  if (!ctx.topics.includes(payload.topic)) {
    errors.push(`topic "${payload.topic}" is not one of ${ctx.topics.join(", ")}; a new cluster is a change to lib/content/blog-topics.ts`);
  }

  const sameTitle = others.find((post) => normalize(post.title) === normalize(payload.title));
  if (sameTitle) errors.push(`title duplicates the published post "${sameTitle.slug}"`);

  // --- Search snippet ------------------------------------------------------

  const titleForSearch = payload.meta_title ?? payload.title;
  if (titleForSearch.length > META_TITLE_MAX) {
    warnings.push(
      `${payload.meta_title ? "meta_title" : "title (no meta_title set)"} is ${titleForSearch.length} characters; Google shows roughly ${META_TITLE_MAX}`,
    );
  }
  const description = payload.meta_description ?? payload.summary;
  const [low, high] = META_DESCRIPTION_RANGE;
  if (description.length < low || description.length > high) {
    warnings.push(
      `${payload.meta_description ? "meta_description" : "summary (no meta_description set)"} is ${description.length} characters; ${low}–${high} fits a search snippet`,
    );
  }

  // --- Takeaways -----------------------------------------------------------

  const normalBody = normalize(prose);
  for (const takeaway of payload.takeaways) {
    if (normalBody.includes(normalize(takeaway))) {
      errors.push(`takeaway repeated word for word in the body: "${takeaway.slice(0, 60)}…" (the research finds repetition costs attention)`);
    }
  }

  // --- Structure -----------------------------------------------------------

  const headings = [...prose.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length,
    text: m[2].trim(),
  }));

  if (headings.some((h) => h.level === 1)) {
    errors.push("the body uses a `#` heading; the page owns the one H1, so start sections at `##`");
  }
  let previous = 1;
  for (const heading of headings) {
    if (heading.level > previous + 1) {
      errors.push(`heading "${heading.text}" skips from H${previous} to H${heading.level}`);
    }
    previous = heading.level;
  }

  const words = prose.split(/\s+/).filter(Boolean).length;
  const h2s = headings.filter((h) => h.level === 2).length;
  if (words < 500) {
    warnings.push(`${words} words. Google has no preferred length, but check the post answers its question and its likely follow-ups`);
  }
  if (words > 800 && h2s < Math.floor(words / 450)) {
    warnings.push(`${h2s} H2 section(s) for ${words} words; a descriptive H2 every 200–400 words is what readers scan by`);
  }

  const firstParagraph = prose.split(/\n\s*\n/).find((block) => block.trim() && !block.trim().startsWith("#")) ?? "";
  const leadWords = firstParagraph.split(/\s+/).filter(Boolean).length;
  if (leadWords > 90) {
    warnings.push(`the first paragraph is ${leadWords} words; lead with the answer or the stakes in a short one`);
  }

  // --- Figures -------------------------------------------------------------

  for (const fence of body.matchAll(/^```(\w+)\s*\n([\s\S]*?)^```/gm)) {
    const parse = FIGURE_PARSERS[fence[1]];
    if (parse && parse(fence[2].trim()) === null) {
      errors.push(`a \`\`\`${fence[1]} figure does not parse and would render as raw code; see references/figures.md`);
    }
  }

  // --- Footnotes -----------------------------------------------------------

  const defined = new Set([...prose.matchAll(/^\[\^([^\]]+)\]:/gm)].map((m) => m[1]));
  const referenced = new Set([...prose.matchAll(/\[\^([^\]]+)\](?!:)/g)].map((m) => m[1]));
  for (const ref of referenced) {
    if (!defined.has(ref)) errors.push(`footnote [^${ref}] is cited but never defined`);
  }
  for (const def of defined) {
    if (!referenced.has(def)) errors.push(`footnote [^${def}] is defined but never cited`);
  }

  // --- Images --------------------------------------------------------------

  for (const img of bodyImages(body)) {
    if (!img.alt) errors.push(`image ${img.src} has no alt text`);
    if (isLocalSrc(img.src)) {
      if (!ctx.clearedImages.includes(img.src)) {
        errors.push(`image ${img.src} is not listed under \`images\` with \`cleared: true\``);
      }
    } else if (/^https?:/.test(img.src)) {
      warnings.push(`image ${img.src} is remote, so it is not measured and will be letterboxed, and it must be on an allowed host; put the file in the post folder instead`);
    }
  }

  // --- Links ---------------------------------------------------------------

  const publishedSlugs = new Set(others.map((post) => post.slug));

  for (const slug of payload.related) {
    if (slug === payload.slug) errors.push("`related` lists the post itself");
    else if (!publishedSlugs.has(slug)) errors.push(`related post "${slug}" is not published`);
  }
  if (payload.related.length === 0 && others.length > 0) {
    warnings.push("`related` is empty; the page falls back to the topic, but a curated list reads better");
  }

  const links = [...prose.matchAll(/\]\(\s*(\/[^)\s]*)/g)].map((m) => m[1].split("#")[0]);
  for (const link of links) {
    const match = /^\/insights\/blog\/([a-z0-9-]+)$/.exec(link);
    if (match && !RESERVED_SLUGS.includes(match[1]) && match[1] !== payload.slug && !publishedSlugs.has(match[1])) {
      errors.push(`link to ${link} points at a post that is not published`);
    }
  }
  const internal = new Set(links).size;
  if (internal < 2) {
    warnings.push(`${internal} internal link(s) in the body; link the topic's pillar and two to five related posts or pages`);
  }

  const pillar = others.find((post) => post.topic === payload.topic && post.pillar);
  if (pillar && !payload.pillar && !links.includes(`/insights/blog/${pillar.slug}`)) {
    warnings.push(`the body does not link this topic's pillar, /insights/blog/${pillar.slug}`);
  }
  if (payload.pillar && pillar) {
    warnings.push(`"${pillar.slug}" is already this topic's pillar; the hub leads with only one`);
  }
  if (payload.featured && others.filter((post) => post.featured).length >= 3) {
    warnings.push("three posts are already featured, and \"Start here\" shows three: one of them will drop off");
  }

  // --- Sources and names ---------------------------------------------------

  for (const block of prose.split(/\n\s*\n/)) {
    if (/\[\^[^\]]+\]/.test(block) || /^\[\^/.test(block.trim())) continue;
    for (const { label, pattern } of CLAIM_PATTERNS) {
      const hit = block.match(new RegExp(pattern.source, pattern.flags.replace("g", "")));
      if (hit) {
        warnings.push(`unsourced ${label} "${hit[0].trim()}" in a paragraph with no footnote; cite it or say it is our own measurement`);
        break;
      }
    }
  }

  const scannable = walkStrings({ ...payload, cover_prompt: ctx.coverPrompt });
  for (const violation of scanDenyTerms(scannable, ctx.denyTerms)) {
    errors.push(`deny-listed term "${violation.match}" in ${violation.path}: ${violation.excerpt}`);
  }

  return { errors, warnings };
}
