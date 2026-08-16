/**
 * The shape of a case study, and nothing else.
 *
 * Case studies used to be authored in this file as a literal array. They now
 * live in the `public.case_studies` table and are fetched per request — see
 * `lib/case-studies.server.ts`, and the migration for the whole argument.
 * Publishing one is inserting a row; it is no longer a commit.
 *
 * **This module must stay import-free.** It is read by client components, by
 * `lib/seo.ts`, and by the `llms.txt` route — a Supabase import here would pull
 * the secret-key client into a browser bundle. That split, a types-and-pure-
 * functions module beside a `.server.ts` one, is the same one `lib/forms.ts`
 * and `lib/content/reports.ts` already make.
 *
 * ## The rules that govern what goes in the table
 *
 * They used to govern this file, and nothing enforces them now except whoever
 * is typing:
 *
 * 1. **Nothing is named without written client approval.** No company,
 *    customer, internal platform, program, or project name — only the industry
 *    or environment the work ran in. This is a rule we keep, **not a caveat the
 *    UI states**: no page says the studies are anonymized, because naming the
 *    omission is what makes it conspicuous.
 * 2. **No metric until we can defend it.** A number appears only once we can
 *    explain how it was measured and hold that up in a procurement
 *    conversation. `atAGlance` is the one exception and only because it counts
 *    what was *delivered* — engagement scope, never impact.
 *
 * ## The spine, and the optional blocks
 *
 * The six narrative fields are answered by every study, in declaration order.
 * Everything after them is optional and renders only when present, so a study
 * that fills none of them looks exactly like the three that predate the table.
 */

/** One scope fact. Counts what was delivered — never what it returned. */
export interface GlanceFact {
  value: string;
  label: string;
}

/** A named step in a process the study ran. Renders numbered; order matters. */
export interface Stage {
  name: string;
  detail: string;
}

/**
 * One parallel track of an engagement.
 *
 * General on purpose. This is not "one workshop" — it is the shape of work
 * split across two or more contexts that had to be solved differently.
 */
export interface Track {
  /** Short identifier — "A", "B". */
  key: string;
  /** What this track was trying to achieve, as a claim. */
  label: string;
  /** The single idea the track turned on. */
  thesis: string;
  /** The environment that made it specific. */
  context: string[];
  /** What was demonstrated or built. */
  demos: string[];
}

/**
 * Which diagram, not the diagram itself.
 *
 * A closed union resolved to a component in `components/case-study/Artifact`,
 * the same pattern `components/Icon.tsx` uses for its glyph map. An arbitrary
 * diagram cannot be expressed as data; which one, and its labels, can be. A
 * `kind` the site does not know renders nothing rather than breaking the page.
 */
export type ArtifactKind = "spine" | "branch-stack" | "kit";

export interface Artifact {
  kind: ArtifactKind;
  title: string;
  /** The `figcaption`, and the accessible description of the diagram. */
  caption: string;
  /** The labels the diagram lays out. Meaning depends on `kind`. */
  nodes: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  /**
   * Industry or environment. Leads the card and the OG eyebrow, and is `about`
   * in the structured data. Short — it renders in a card's utility register.
   */
  industry: string;
  /**
   * Overrides the page eyebrow where a study wants more than its industry.
   * The card and the OG card always use `industry`, because a compound string
   * does not fit either.
   */
  eyebrow?: string;
  /** One executive-legible line. The card's only body copy, and the page lead. */
  summary: string;
  /** Visible chips on the card; `keywords` in the structured data. */
  capabilityTags: string[];
  /**
   * Search metadata, both falling back to `title` / `summary`. They exist
   * because the audiences differ: an `h1` earns attention from someone already
   * reading, a `<title>` has to win a result page.
   */
  metaTitle?: string;
  metaDescription?: string;

  /** Where the work started: the organization's situation, in their terms. */
  context: string;
  /** What made it hard. The constraints a reader should recognise. */
  constraints: string;
  /** Our exact scope. Says plainly what we did and did not own. */
  role: string;
  /** What we engineered. One line each, concrete. */
  engineered: string[];
  /** What the work produced. */
  outcome: string;
  /** The closing beat. */
  next: string;
  /** Overrides the default "What changed next" heading. */
  nextLabel?: string;

  /** Absolute public storage URL. See the migration for why it is absolute. */
  image?: string;
  /** Required whenever `image` is set — these are content images. */
  imageAlt?: string;

  atAGlance?: GlanceFact[];
  deliverables?: string[];
  stages?: Stage[];
  tracks?: Track[];
  artifacts?: Artifact[];

  /**
   * `IndustryGroup` slugs this study is proof for. **Advisory** — filling it
   * does not put the study on an industry page. `IndustryGroup.proof` is
   * authoritative and lives in the repository; see the migration.
   */
  industries?: string[];
}

/** The heading for the closing section when a study does not name its own. */
export const DEFAULT_NEXT_LABEL = "What changed next";

/**
 * Every study that counts as proof for an industry group, in `proof` order.
 *
 * Takes the fetched studies rather than reading a module-level array, which is
 * what the move to the table forced and is the better shape anyway: the caller
 * already has the data and this stays a pure function.
 *
 * Driven by `IndustryGroup.proof` because the industry page decides which
 * studies lead it and in what order. Returns an empty array for a group with no
 * proof, which is a real state rather than a bug — see `lib/content/industries.ts`.
 */
export function studiesForIndustry(
  proof: string[],
  studies: CaseStudy[],
): CaseStudy[] {
  return proof
    .map((slug) => studies.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => study !== undefined);
}
