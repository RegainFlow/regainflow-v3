/**
 * The intake file, and the row it becomes.
 *
 * Two shapes, deliberately not one. The intake is what a person answers: YAML,
 * prose-shaped, with the governance fields (`deny_terms`, `measurement_sources`)
 * that exist to be checked and then thrown away. The payload is what the table
 * takes: snake_case, exactly the columns, nothing else.
 *
 * Keeping them apart is what lets the intake carry `image_prompt` — which must
 * be scanned for client names and must never be published — without a rule
 * somewhere remembering to strip it.
 */

import { z } from "zod";

import { INDUSTRY_GROUPS } from "@/lib/content/industries";

/** Mirrors `case_studies_slug_kebab`. Duplicated so the failure is a sentence
 *  rather than a Postgres constraint name after an image has been paid for. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const GROUP_SLUGS = INDUSTRY_GROUPS.map((group) => group.slug);

const nonEmpty = z.string().trim().min(1);

const glanceFact = z
  .object({ value: nonEmpty, label: nonEmpty })
  .strict();

const stage = z.object({ name: nonEmpty, detail: nonEmpty }).strict();

const track = z
  .object({
    key: nonEmpty,
    label: nonEmpty,
    thesis: nonEmpty,
    context: z.array(nonEmpty).min(1),
    demos: z.array(nonEmpty).min(1),
  })
  .strict();

/**
 * `kind` is a closed union resolved to a React component. An unknown kind
 * renders **nothing** rather than erroring, so the study would publish with a
 * silently missing diagram — which is exactly the failure that has to happen
 * here instead.
 */
const artifact = z
  .object({
    kind: z.enum(["spine", "branch-stack", "kit"]),
    title: nonEmpty,
    caption: nonEmpty,
    nodes: z.array(nonEmpty).min(1),
  })
  .strict();

const cta = z
  .object({ heading: nonEmpty, body: nonEmpty, secondaryLabel: nonEmpty })
  .strict();

const sectionHeadings = z
  .object({
    tracks: z
      .object({
        eyebrow: nonEmpty.optional(),
        title: nonEmpty.optional(),
        lead: nonEmpty.optional(),
      })
      .strict()
      .optional(),
    artifacts: z
      .object({ eyebrow: nonEmpty.optional(), title: nonEmpty.optional() })
      .strict()
      .optional(),
    deliverables: z.object({ title: nonEmpty.optional() }).strict().optional(),
  })
  .strict();

export const IntakeSchema = z
  .object({
    slug: nonEmpty.regex(
      SLUG_PATTERN,
      "must be kebab-case: lowercase letters, digits, single hyphens",
    ),
    title: nonEmpty,
    industry: nonEmpty,
    eyebrow: nonEmpty.optional(),
    summary: nonEmpty,
    capability_tags: z.array(nonEmpty).min(1),

    meta_title: nonEmpty.max(70).optional(),
    meta_description: nonEmpty.max(165).optional(),

    // The narrative spine. Every study answers these.
    context: nonEmpty,
    constraints: nonEmpty,
    role: nonEmpty,
    outcome: nonEmpty,
    next_label: nonEmpty.optional(),
    next_body: nonEmpty,

    // Exactly one of these two. Checked below, because zod cannot express it
    // without turning the whole object into a union and wrecking the errors.
    engineered: z.array(nonEmpty).optional(),
    stages: z.array(stage).optional(),

    // Art direction. `image_prompt` never reaches the table.
    image_alt: nonEmpty.max(160).optional(),
    image_prompt: nonEmpty.optional(),

    at_a_glance: z.array(glanceFact).optional(),
    deliverables: z.array(nonEmpty).optional(),
    tracks: z.array(track).optional(),
    cta: cta.optional(),
    artifacts: z.array(artifact).optional(),
    section_headings: sectionHeadings.optional(),

    industries: z.array(z.enum(GROUP_SLUGS as [string, ...string[]])).optional(),
    sort_order: z.number().int().min(0).optional(),
    featured: z.boolean().optional(),

    // Governance. Checked, then dropped.
    deny_terms: z.array(nonEmpty).optional(),
    measurement_sources: z.record(z.string(), nonEmpty).optional(),
  })
  .strict();

export type Intake = z.infer<typeof IntakeSchema>;

/** Exactly the columns `publish_case_study(payload)` reads. */
export interface CaseStudyPayload {
  slug: string;
  title: string;
  industry: string;
  eyebrow?: string;
  summary: string;
  capability_tags: string[];
  meta_title?: string;
  meta_description?: string;
  context: string;
  constraints: string;
  role: string;
  engineered: string[];
  outcome: string;
  next_label?: string;
  next_body: string;
  image_url: string | null;
  image_alt: string | null;
  at_a_glance?: { value: string; label: string }[];
  deliverables?: string[];
  stages?: { name: string; detail: string }[];
  tracks?: z.infer<typeof track>[];
  cta?: z.infer<typeof cta>;
  artifacts?: z.infer<typeof artifact>[];
  section_headings?: Record<string, Record<string, string>>;
  industries: string[];
  sort_order: number;
  status: "draft" | "published";
  featured: boolean;
}

/**
 * Drop empty members from `section_headings`.
 *
 * The page spreads these over `DEFAULT_SECTION_HEADINGS`, so a member present
 * with an empty value overwrites a good default with nothing. Absent is the
 * only way to say "use the default", and this is where that becomes true.
 */
function pruneHeadings(
  headings: Intake["section_headings"],
): CaseStudyPayload["section_headings"] {
  if (!headings) return undefined;

  const pruned: Record<string, Record<string, string>> = {};

  for (const [section, members] of Object.entries(headings)) {
    if (!members) continue;

    const kept = Object.fromEntries(
      Object.entries(members).filter(
        ([, value]) => typeof value === "string" && value.trim() !== "",
      ),
    ) as Record<string, string>;

    if (Object.keys(kept).length > 0) pruned[section] = kept;
  }

  return Object.keys(pruned).length > 0 ? pruned : undefined;
}

/**
 * The rules zod cannot state, checked as a batch.
 *
 * Returned rather than thrown so the caller can print every problem at once —
 * a run that reports one error, gets fixed, and reports the next is the reason
 * people stop reading error output.
 */
export function crossCheck(intake: Intake, opts: { image: boolean }): string[] {
  const problems: string[] = [];

  const hasEngineered = (intake.engineered?.length ?? 0) > 0;
  const hasStages = (intake.stages?.length ?? 0) > 0;

  if (hasEngineered && hasStages) {
    problems.push(
      "engineered and stages are both set. The page renders the staged version, so both means the same content twice under one heading. Pick one.",
    );
  }

  if (!hasEngineered && !hasStages) {
    problems.push(
      "one of engineered or stages is required — the study has to say what was built.",
    );
  }

  if (opts.image && !intake.image_prompt) {
    problems.push(
      "image_prompt is required. Pass --skip-image to publish without art.",
    );
  }

  if (opts.image && !intake.image_alt) {
    problems.push(
      "image_alt is required whenever there is an image. These are content images, so an empty alt is wrong rather than economical.",
    );
  }

  if (intake.image_alt && /^(an?\s+)?(image|picture|photo|graphic)\s+of\b/i.test(intake.image_alt)) {
    problems.push(
      `image_alt should describe the image, not announce it: "${intake.image_alt.slice(0, 48)}…"`,
    );
  }

  if ((intake.tracks?.length ?? 0) === 1) {
    problems.push(
      "tracks has one entry. Tracks are for work split across two or more contexts; a single track is the study itself.",
    );
  }

  return problems;
}

/** Intake to row. Governance fields and `image_prompt` are dropped here. */
export function resolvePayload(
  intake: Intake,
  opts: { imageUrl: string | null; sortOrder: number; status: "draft" | "published" },
): CaseStudyPayload {
  const headings = pruneHeadings(intake.section_headings);

  return {
    slug: intake.slug,
    title: intake.title,
    industry: intake.industry,
    ...(intake.eyebrow ? { eyebrow: intake.eyebrow } : {}),
    summary: intake.summary,
    capability_tags: intake.capability_tags,
    ...(intake.meta_title ? { meta_title: intake.meta_title } : {}),
    ...(intake.meta_description
      ? { meta_description: intake.meta_description }
      : {}),
    context: intake.context,
    constraints: intake.constraints,
    role: intake.role,
    engineered: intake.engineered ?? [],
    outcome: intake.outcome,
    ...(intake.next_label ? { next_label: intake.next_label } : {}),
    next_body: intake.next_body,

    // Paired, always. `case_studies_image_alt_paired` rejects one without the
    // other, so an image that failed to generate clears the alt text too.
    image_url: opts.imageUrl,
    image_alt: opts.imageUrl ? (intake.image_alt ?? null) : null,

    ...(intake.at_a_glance?.length ? { at_a_glance: intake.at_a_glance } : {}),
    ...(intake.deliverables?.length
      ? { deliverables: intake.deliverables }
      : {}),
    ...(intake.stages?.length ? { stages: intake.stages } : {}),
    ...(intake.tracks?.length ? { tracks: intake.tracks } : {}),
    ...(intake.cta ? { cta: intake.cta } : {}),
    ...(intake.artifacts?.length ? { artifacts: intake.artifacts } : {}),
    ...(headings ? { section_headings: headings } : {}),

    industries: intake.industries ?? [],
    sort_order: opts.sortOrder,
    status: opts.status,
    featured: intake.featured ?? false,
  };
}
