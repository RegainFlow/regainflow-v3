import "server-only";

import { supabase } from "@/lib/supabase";
import type { Report } from "@/lib/content/reports";

/**
 * Reading reports out of `public.reports`.
 *
 * The server-only half of the pair `lib/content/reports.ts` opens — the same
 * split `lib/forms.ts` and `lib/forms.server.ts` already make, and for the same
 * reason: `ReportCard` and `ReportGate` are client components that need the
 * `Report` type, and the Supabase client here holds the secret key. `server-only`
 * turns a wrong-side import into a build error with a readable message rather
 * than a bundler failure nobody can parse.
 *
 * Every caller reads on the request. That is the deliberate cost of "add a row,
 * hit refresh, it is live" — see the migration for the whole argument.
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
  "slug, title, summary, published, findings, cover_url, pdf_url, pages, audio_url, audio_length";

/** The row as PostgREST returns it. snake_case, and only what `COLUMNS` asks for. */
interface ReportRow {
  slug: string;
  title: string;
  summary: string;
  published: string;
  findings: string[] | null;
  cover_url: string;
  pdf_url: string;
  pages: number | null;
  audio_url: string | null;
  audio_length: string | null;
}

/**
 * The one place snake_case becomes camelCase. Nulls become `undefined` because
 * `Report` marks those fields optional, and `report.pages ? …` has to be false
 * for an empty one — `null` would work, but only by accident.
 */
function toReport(row: ReportRow): Report {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    published: row.published,
    findings: row.findings ?? [],
    cover: row.cover_url,
    pdf: row.pdf_url,
    ...(row.pages ? { pages: row.pages } : {}),
    ...(row.audio_url ? { audio: row.audio_url } : {}),
    ...(row.audio_length ? { audioLength: row.audio_length } : {}),
  };
}

/**
 * Every published report, newest first.
 *
 * **Returns `[]` when the fetch fails, and that default is only correct for a
 * page a human is looking at.** The listing renders its empty state, the visitor
 * sees a page rather than an error, and a refresh a minute later works.
 *
 * `throwOnError` exists for the two callers where that is exactly wrong:
 * `app/sitemap.ts` and `app/llms.txt/route.ts`. An empty array there does not
 * degrade — it emits a well-formed document that *asserts these reports do not
 * exist*. The sitemap drops every report URL and the llms.txt Reports section
 * deletes itself, and a crawler believes both. Failing the request is the honest
 * outcome: a 500 is a retry, a confidently empty sitemap is a de-index.
 */
export async function getReports(
  { throwOnError = false }: { throwOnError?: boolean } = {},
): Promise<Report[]> {
  try {
    const { data, error } = await supabase()
      .from("reports")
      .select(COLUMNS)
      .eq("status", PUBLISHED)
      .order("published", { ascending: false });

    if (error) throw new Error(error.message);

    return (data as ReportRow[]).map(toReport);
  } catch (error) {
    if (throwOnError) throw error;

    console.error("[reports] listing unavailable", error);
    return [];
  }
}

/**
 * One published report, or `null` when there is no such slug.
 *
 * **Not found and fetch-failed are different answers and must stay different.**
 * `null` reaches `notFound()` and a 404, which is right for a slug nobody
 * published. A Supabase outage throws instead, and the 500 is the point: a 404
 * tells a crawler to drop the page, so degrading here would quietly de-index a
 * live report over a transient blip. The asymmetry with `getReports()` is
 * deliberate — an empty listing is a visible, recoverable state; a wrong 404 is
 * neither.
 */
export async function getReport(slug: string): Promise<Report | null> {
  const { data, error } = await supabase()
    .from("reports")
    .select(COLUMNS)
    .eq("status", PUBLISHED)
    .eq("slug", slug)
    // Returns `data: null` for no match instead of erroring, which is what lets
    // "missing" and "broken" be told apart below. `.single()` collapses them.
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? toReport(data as unknown as ReportRow) : null;
}
