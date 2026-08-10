/**
 * The shape of a report, and nothing else.
 *
 * Reports used to be authored in this file as a literal array. They now live in
 * the `public.reports` table and are fetched per request — see
 * `lib/reports.server.ts`, and the migration for why. Publishing one is adding a
 * row in the Supabase UI and refreshing the page; it is no longer a commit.
 *
 * **This module must stay import-free.** `components/ReportCard` and
 * `components/ReportGate` are client components and both need `Report`, so a
 * Supabase import here would pull the secret-key client into a browser bundle.
 * That split — a types-and-pure-functions module beside a `.server.ts` one — is
 * the same one `lib/forms.ts` and `lib/forms.server.ts` already make.
 *
 * The two rules that governed the copy when it lived here still govern what goes
 * in the table, and nothing enforces them now except whoever is typing:
 *
 * 1. Nothing is named that the report itself does not name.
 * 2. No figure appears in `summary` or `findings` that the report does not
 *    confirm. A report is the one artifact where an invented number is not just
 *    embarrassing but checkable.
 */

export interface Report {
  slug: string;
  title: string;
  /** One executive-legible line. The only body copy on the card. */
  summary: string;
  /** ISO date. Drives display order and the `datePublished` in structured data. */
  published: string;
  /**
   * Three to five things the report actually claims. This is the substance of
   * the public page — written as conclusions, not as chapter titles.
   *
   * Public, and deliberately so. The page is the lead magnet, not the PDF: it
   * has to be worth reading and worth indexing on its own, or the email ask is
   * being made of someone with no reason to say yes.
   */
  findings: string[];
  /**
   * Absolute public storage URL for the cover image, rendered from page 1 of the
   * PDF by `pnpm report:cover`.
   *
   * Absolute, not a `/public` path, because a row created in a browser cannot
   * reference a file in the repository. That is why `next.config.ts` now carries
   * an `images.remotePatterns` entry — see the comment there. No intrinsic
   * dimensions travel with it: `.rf-report-cover` declares the aspect ratio in
   * CSS and the image fills it, so there is nothing for an editor to measure.
   */
  cover: string;
  /** Absolute public storage URL for the PDF. */
  pdf: string;
  pages?: number;
  /**
   * Absolute public storage URL for the audio overview. Optional: a report
   * without one renders no player rather than an empty frame, so the next
   * report can ship before its audio does.
   */
  audio?: string;
  /** As written on the page — "22:20". Not parsed, but it does seed the player's
   *  duration readout, because iOS often withholds `loadedmetadata` until the
   *  first interaction. */
  audioLength?: string;
}

/** "August 2026". No day: these are dated to the month they were published. */
export function reportDate(published: string): string {
  return new Date(`${published}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
