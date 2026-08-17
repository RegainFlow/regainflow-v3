/**
 * The two rules, enforced.
 *
 * `lib/content/case-studies.ts` states them and says plainly that "nothing
 * enforces them now except whoever is typing":
 *
 *   1. Nothing is named without written client approval.
 *   2. No metric until we can defend it.
 *
 * A generator is not whoever is typing. It writes fluent, plausible prose at a
 * rate nobody proofreads carefully by the fourth study, and the failure mode of
 * rule 1 is a client name on a public page — not a rendering bug, a phone call.
 * So both rules are scans over the resolved payload, and both are hard stops.
 *
 * **Nothing here redacts.** A silent fix teaches the operator the rule does not
 * matter and hides the fact that the draft wanted to say it. Every violation
 * stops the run and names the field.
 */

/** One string in the payload, with the path that reaches it. */
export interface Located {
  path: string;
  text: string;
}

/**
 * Every string reachable in a value, depth-first, with a JSON-ish path.
 *
 * Deliberately structure-blind: it walks whatever it is given rather than the
 * fields we know about today, so a column added next year is scanned without
 * anyone remembering to add it here. That is the whole point — the scan must
 * not have its own idea of which fields are public.
 */
export function walkStrings(value: unknown, path = ""): Located[] {
  if (typeof value === "string") return [{ path: path || "(root)", text: value }];

  if (Array.isArray(value)) {
    return value.flatMap((item, i) => walkStrings(item, `${path}[${i}]`));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      walkStrings(item, path ? `${path}.${key}` : key),
    );
  }

  return [];
}

export interface Violation {
  path: string;
  match: string;
  excerpt: string;
}

/** A 60-character window around a hit, so the operator can see what was said
 *  without opening the file. */
function excerpt(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 24);
  const end = Math.min(text.length, index + length + 24);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ")}${end < text.length ? "…" : ""}`;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * A term, matched however it is spelled.
 *
 * "Acme Corp" has to catch `acme-corp` in a slug, `Acme_Corp` in an image
 * prompt, and `Acme  Corp` in prose — the separator is not the point, the name
 * is. So the term's words are joined by a separator class rather than matched
 * literally, and the whole thing is fenced by non-word lookarounds so `cat`
 * does not fire on `catalogue`.
 */
export function termPattern(term: string): RegExp {
  const words = term
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(escapeRegex);

  if (words.length === 0) throw new Error("Empty deny term");

  return new RegExp(
    `(?<![\\p{L}\\p{N}])${words.join("[-_\\s]+")}(?![\\p{L}\\p{N}])`,
    "giu",
  );
}

/**
 * Every place a forbidden term reached the payload.
 *
 * Scans the resolved payload *and* the image prompt, because a client name in a
 * prompt travels to a third party even when it never renders — which is the
 * same disclosure, minus the evidence.
 */
export function scanDenyTerms(
  scannable: Located[],
  terms: string[],
): Violation[] {
  const violations: Violation[] = [];

  for (const term of terms.map((t) => t.trim()).filter(Boolean)) {
    const pattern = termPattern(term);

    for (const { path, text } of scannable) {
      for (const hit of text.matchAll(pattern)) {
        violations.push({
          path,
          match: term,
          excerpt: excerpt(text, hit.index, hit[0].length),
        });
      }
    }
  }

  return violations;
}

/**
 * Figures that assert a result.
 *
 * Narrow on purpose. A case study is allowed to count what was delivered — "4
 * hrs of live delivery", "2 workshop tracks" — and a scan that flagged every
 * digit would be turned off within a week, which is worse than no scan. What is
 * caught is the shape of a *claim*: a percentage, a currency amount, a
 * multiplier, an order-of-magnitude word, or a benefit verb sitting next to a
 * number.
 */
const CLAIM_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: "percentage", pattern: /\d+(?:\.\d+)?\s*%|%\s*\d/g },
  {
    label: "currency",
    pattern: /[$€£]\s*\d+(?:[\d,.]*)|\b\d[\d,.]*\s*(?:USD|EUR|GBP)\b/gi,
  },
  { label: "multiplier", pattern: /\b\d+(?:\.\d+)?\s*[x×]\b/gi },
  {
    label: "magnitude",
    pattern: /\b\d+(?:\.\d+)?\s*(?:million|billion|bn|trillion)\b/gi,
  },
  {
    label: "benefit claim",
    pattern:
      /\b(?:ROI|saved?|savings?|reduced?|cut|increased?|improved?|faster|slower|boosted?|doubled?|tripled?)\b[^.]{0,40}?\d|\d[^.]{0,40}?\b(?:ROI|saved?|savings?|reduced?|cut|increased?|improved?|faster|slower|boosted?|doubled?|tripled?)\b/gi,
  },
];

/**
 * The `at_a_glance` exception, and its limit.
 *
 * The schema documents `at_a_glance` as the one place a figure may appear
 * without a measurement story, "because it counts what was *delivered* —
 * engagement scope, never impact". A count is safe. A percentage, a currency
 * amount, or a multiplier is not a count, and putting one here would launder an
 * impact claim through the exception — so those three still apply.
 */
const GLANCE_EXEMPT_LABELS = new Set(["magnitude", "benefit claim"]);

function isGlanceValue(path: string): boolean {
  return /^at_a_glance\[\d+\]\.value$/.test(path);
}

export interface MetricViolation extends Violation {
  label: string;
}

/**
 * Unsupported figures.
 *
 * `supported` holds the exact strings the operator said they can defend —
 * `measurement_sources` keys from the intake, plus any `--allow-metric`. A hit
 * is forgiven when it falls inside one of those, which keeps the exemption
 * attached to a specific sentence rather than switching the rule off.
 */
export function scanMetrics(
  scannable: Located[],
  supported: string[],
): MetricViolation[] {
  const allowed = supported.map((entry) => entry.toLowerCase().trim()).filter(Boolean);
  const violations: MetricViolation[] = [];

  for (const { path, text } of scannable) {
    const glance = isGlanceValue(path);
    const declared = declaredRanges(text, allowed);

    for (const { label, pattern } of CLAIM_PATTERNS) {
      if (glance && GLANCE_EXEMPT_LABELS.has(label)) continue;

      for (const hit of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
        const span: Range = [hit.index, hit.index + hit[0].length];

        if (declared.some((range) => overlaps(span, range))) continue;

        violations.push({
          path,
          match: hit[0].trim(),
          label,
          excerpt: excerpt(text, hit.index, hit[0].length),
        });
      }
    }
  }

  return violations;
}

type Range = [start: number, end: number];

/**
 * Where in this text the operator's declared figures actually sit.
 *
 * Forgiveness is positional rather than textual, and the difference matters
 * twice. Comparing whole fields — "does this sentence contain a declared
 * figure" — lets one declared number exempt every other number beside it, so
 * "40% faster and $2M saved" would pass on the strength of the 40%. Comparing
 * the matched strings instead fails the opposite way: the same figure gets
 * caught by two patterns with different spans ("40%" and "cut review time by
 * 4"), and only one of them looks like what was declared.
 *
 * Overlapping ranges get both right — an exemption covers the figure it was
 * written for, and nothing else.
 */
function declaredRanges(text: string, allowed: string[]): Range[] {
  const haystack = text.toLowerCase();
  const ranges: Range[] = [];

  for (const entry of allowed) {
    let at = haystack.indexOf(entry);

    while (at !== -1) {
      ranges.push([at, at + entry.length]);
      at = haystack.indexOf(entry, at + 1);
    }
  }

  return ranges;
}

function overlaps([aStart, aEnd]: Range, [bStart, bEnd]: Range): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Names that look like organizations, as a warning rather than a stop.
 *
 * A suffix match is too noisy to block on — "Inc" appears inside ordinary
 * words and a legitimate sentence can carry "Ltd" — but it is exactly the
 * shape of the mistake rule 1 exists to prevent, so it reaches the human at the
 * approval gate instead of being silently dropped.
 */
export function scanCompanySuffixes(scannable: Located[]): Violation[] {
  const pattern =
    /\b[A-Z][\p{L}&.'-]*(?:\s+[A-Z][\p{L}&.'-]*)*[,\s]+(?:Inc|LLC|L\.L\.C|Corp|Corporation|Ltd|GmbH|PLC|S\.A|N\.V)\b\.?/gu;

  return scannable.flatMap(({ path, text }) =>
    [...text.matchAll(pattern)].map((hit) => ({
      path,
      match: hit[0].trim(),
      excerpt: excerpt(text, hit.index, hit[0].length),
    })),
  );
}
