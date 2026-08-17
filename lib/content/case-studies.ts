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

/**
 * Per-study override for the closing CTA's copy.
 *
 * Copy only. The destinations stay in `lib/site.ts` — they are the same on
 * every page and a field holding a URL is a field that eventually holds a
 * broken one.
 */
export interface CaseStudyCta {
  heading: string;
  body: string;
  /** The secondary button. The primary is always the free assessment. */
  secondaryLabel: string;
}

/**
 * Per-study overrides for the optional sections' headings.
 *
 * Every member is optional and spread over `DEFAULT_SECTION_HEADINGS`, so a
 * study can rename one heading without restating the other two. A member must
 * be **omitted** rather than set to `null` — a null would spread over the
 * default and blank it.
 */
export interface SectionHeadings {
  tracks?: { eyebrow?: string; title?: string; lead?: string };
  artifacts?: { eyebrow?: string; title?: string };
  deliverables?: { title?: string };
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

  cta?: CaseStudyCta;
  atAGlance?: GlanceFact[];
  deliverables?: string[];
  stages?: Stage[];
  tracks?: Track[];
  artifacts?: Artifact[];

  /** Renames the optional sections' headings. See `DEFAULT_SECTION_HEADINGS`. */
  sectionHeadings?: SectionHeadings;

  /**
   * `IndustryGroup` slugs this study is proof for, and **authoritative for
   * whether the study appears on that page** — a study published by the
   * pipeline reaches its industry page without a repository edit.
   *
   * `IndustryGroup.proof` still decides which studies *lead* a page and in what
   * order; this decides who else is on it. See `studiesForIndustry()`.
   */
  industries?: string[];
}

/** The heading for the closing section when a study does not name its own. */
export const DEFAULT_NEXT_LABEL = "What changed next";

/**
 * The headings the optional sections carry when a study does not name its own.
 *
 * These were literals in `app/insights/[slug]/page.tsx`. They read as house
 * voice, and they are — but two of them also assumed the shape of the study
 * that happened to be in front of us when they were written: "Two client
 * contexts" is two, and "What the partner received" is a partner rather than a
 * client. A study with three tracks and a direct client had to accept both.
 *
 * The defaults here are shape-neutral. The study that wants the original
 * wording carries it in its own `section_headings`, which is the right place
 * for a sentence that is true of one engagement.
 */
export const DEFAULT_SECTION_HEADINGS = {
  tracks: {
    eyebrow: "Parallel tracks",
    title: "One engagement, more than one problem.",
    lead: "Each track was built against its own environment. What they share is the method, not the material.",
  },
  artifacts: {
    eyebrow: "Selected artifacts",
    title: "Reconstructed, not screenshotted.",
  },
  deliverables: {
    title: "What the client received",
  },
} as const;

/**
 * Every study that counts as proof for an industry group.
 *
 * Takes the fetched studies rather than reading a module-level array, which is
 * what the move to the table forced and is the better shape anyway: the caller
 * already has the data and this stays a pure function.
 *
 * **Two sources, in this order.** `IndustryGroup.proof` is a curated override —
 * the studies this page should lead with, in the order it should lead with
 * them. Everything after is every published study whose `industries` claims the
 * group, in the `sort_order` the caller already fetched them in.
 *
 * That second half is the change: a study published without a repository edit
 * still reaches its industry page. `proof` survives because "which study leads
 * this page" is an editorial decision a global `sort_order` cannot express, but
 * a group with an empty `proof` is no longer a group with an empty band.
 *
 * Deduped by slug, so naming a study in `proof` *and* in its own `industries`
 * lists it once. That overlap is the normal case rather than a mistake — it is
 * the relationship being declared from both ends.
 */
export function studiesForIndustry(
  group: { slug: string; proof: string[] },
  studies: CaseStudy[],
): CaseStudy[] {
  const curated = group.proof
    .map((slug) => studies.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => study !== undefined);

  const led = new Set(curated.map((study) => study.slug));

  const claimed = studies.filter(
    (study) => !led.has(study.slug) && study.industries?.includes(group.slug),
  );

  return [...curated, ...claimed];
}
