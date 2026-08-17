import "server-only";

import { supabase } from "@/lib/supabase";
import type {
  Artifact,
  CaseStudy,
  CaseStudyCta,
  GlanceFact,
  SectionHeadings,
  Stage,
  Track,
} from "@/lib/content/case-studies";

/**
 * Reading case studies out of `public.case_studies`.
 *
 * The server-only half of the pair `lib/content/case-studies.ts` opens — the
 * same split `lib/reports.server.ts` makes, and for the same reason: client
 * components need the `CaseStudy` type, and the Supabase client here holds the
 * secret key. `server-only` turns a wrong-side import into a build error with a
 * readable message rather than a bundler failure nobody can parse.
 *
 * Every caller reads on the request. See the migration for what that costs
 * here — it is more than it cost for reports, because the home page is one of
 * the callers.
 */

/** Only ever the published ones. A draft is a row someone is still typing. */
const PUBLISHED = "published";

/**
 * The columns, named rather than `*`.
 *
 * A `select("*")` would silently start shipping whatever column is added next —
 * including one added for internal notes — into a page and its structured data.
 */
const COLUMNS =
  "slug, title, industry, eyebrow, summary, capability_tags, meta_title, meta_description, context, constraints, role, engineered, outcome, next_label, next_body, image_url, image_alt, cta, at_a_glance, deliverables, stages, tracks, artifacts, section_headings, industries, sort_order";

/** The row as PostgREST returns it. snake_case, and only what `COLUMNS` asks for. */
interface CaseStudyRow {
  slug: string;
  title: string;
  industry: string;
  eyebrow: string | null;
  summary: string;
  capability_tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  context: string;
  constraints: string;
  role: string;
  engineered: string[] | null;
  outcome: string;
  next_label: string | null;
  next_body: string;
  image_url: string | null;
  image_alt: string | null;
  // `jsonb` arrives parsed. Typed as the shape we author and not validated at
  // runtime — the same trust `reports.findings` places in the table. A
  // malformed block renders wrong; it does not crash the page, because every
  // consumer guards on presence and maps over an array.
  cta: CaseStudyCta | null;
  at_a_glance: GlanceFact[] | null;
  deliverables: string[] | null;
  stages: Stage[] | null;
  tracks: Track[] | null;
  artifacts: Artifact[] | null;
  section_headings: SectionHeadings | null;
  industries: string[] | null;
  sort_order: number;
}

/**
 * The one place snake_case becomes camelCase.
 *
 * Nulls become `undefined` because `CaseStudy` marks those fields optional, and
 * every render guard is `study.tracks?.length ? … : null` — `null` would work,
 * but only by accident. The two required arrays fall back to `[]` instead,
 * because they are not optional in the type and a missing one is a data problem
 * rather than a valid absence.
 */
function toCaseStudy(row: CaseStudyRow): CaseStudy {
  return {
    slug: row.slug,
    title: row.title,
    industry: row.industry,
    summary: row.summary,
    capabilityTags: row.capability_tags ?? [],
    ...(row.eyebrow ? { eyebrow: row.eyebrow } : {}),
    ...(row.meta_title ? { metaTitle: row.meta_title } : {}),
    ...(row.meta_description ? { metaDescription: row.meta_description } : {}),
    context: row.context,
    constraints: row.constraints,
    role: row.role,
    engineered: row.engineered ?? [],
    outcome: row.outcome,
    next: row.next_body,
    ...(row.next_label ? { nextLabel: row.next_label } : {}),
    ...(row.image_url ? { image: row.image_url } : {}),
    ...(row.image_alt ? { imageAlt: row.image_alt } : {}),
    ...(row.cta ? { cta: row.cta } : {}),
    ...(row.at_a_glance?.length ? { atAGlance: row.at_a_glance } : {}),
    ...(row.deliverables?.length ? { deliverables: row.deliverables } : {}),
    ...(row.stages?.length ? { stages: row.stages } : {}),
    ...(row.tracks?.length ? { tracks: row.tracks } : {}),
    ...(row.artifacts?.length ? { artifacts: row.artifacts } : {}),
    ...(row.section_headings ? { sectionHeadings: row.section_headings } : {}),
    ...(row.industries?.length ? { industries: row.industries } : {}),
  };
}

/**
 * Every published study, in display order.
 *
 * **Returns `[]` when the fetch fails, and that default matters more here than
 * it did for reports.** The home page renders these. A Supabase blip costing
 * the proof section is recoverable; the same blip costing the home page is not.
 *
 * `throwOnError` exists for the two callers where an empty array is exactly
 * wrong: `app/sitemap.ts` and `app/llms.txt/route.ts`. An empty array there
 * emits a well-formed document that *asserts these studies do not exist*, and a
 * crawler believes it. A 500 is a retry; a confidently empty sitemap is a
 * de-index.
 *
 * `featuredOnly` and `limit` exist for the home page, which leads with a fixed
 * few rather than everything — see `components/ProofStrip.tsx`. `featured` is
 * deliberately **not** in `COLUMNS` and not on `CaseStudy`: it decides which
 * rows come back, and nothing renders it, so a page has no reason to hold it.
 */
export async function getCaseStudies(
  {
    throwOnError = false,
    featuredOnly = false,
    limit,
  }: { throwOnError?: boolean; featuredOnly?: boolean; limit?: number } = {},
): Promise<CaseStudy[]> {
  try {
    // Built in stages rather than one chain, because `.order()` returns a
    // transform builder that no longer offers `.eq()` — filters have to be
    // applied while this is still a filter builder.
    let filtered = supabase()
      .from("case_studies")
      .select(COLUMNS)
      .eq("status", PUBLISHED);

    if (featuredOnly) filtered = filtered.eq("featured", true);

    let shaped = filtered.order("sort_order", { ascending: true });

    if (limit !== undefined) shaped = shaped.limit(limit);

    const { data, error } = await shaped;

    if (error) throw new Error(error.message);

    return (data as unknown as CaseStudyRow[]).map(toCaseStudy);
  } catch (error) {
    if (throwOnError) throw error;

    console.error("[case-studies] listing unavailable", error);
    return [];
  }
}

/**
 * One published study, or `null` when there is no such slug.
 *
 * **Not found and fetch-failed are different answers and must stay different.**
 * `null` reaches `notFound()` and a 404, which is right for a slug nobody
 * published. A Supabase outage throws instead, and the 500 is the point: a 404
 * tells a crawler to drop the page, so degrading here would quietly de-index a
 * live study over a transient blip. The asymmetry with `getCaseStudies()` is
 * deliberate — an empty listing is a visible, recoverable state; a wrong 404 is
 * neither. Same reasoning as `lib/reports.server.ts`.
 */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const { data, error } = await supabase()
    .from("case_studies")
    .select(COLUMNS)
    .eq("status", PUBLISHED)
    .eq("slug", slug)
    // Returns `data: null` for no match instead of erroring, which is what lets
    // "missing" and "broken" be told apart above. `.single()` collapses them.
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? toCaseStudy(data as unknown as CaseStudyRow) : null;
}
