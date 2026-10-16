import GithubSlugger from "github-slugger";

/**
 * A post's table of contents, built from its markdown on the server.
 *
 * The ids come from `github-slugger`, the same slugger `rehype-slug` uses when
 * it stamps ids onto the rendered headings — so a TOC link and the heading it
 * points at are produced by one algorithm and cannot disagree. The test in
 * `scripts/blog/toc.test.mts` holds that.
 *
 * Only `##` headings. A TOC listing every `###` turns into a second copy of the
 * post; the research asks for a navigation aid, not a transcript.
 */

export interface TocEntry {
  id: string;
  text: string;
}

/** Strip inline markdown so the TOC label is the heading's visible text. */
function plain(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

export function buildToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let fenced = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = plain(match[2]);
    // Every heading advances the slugger, so a repeated `###` title shifts the
    // suffix of a later `##` exactly as rehype-slug does.
    const id = slugger.slug(text);
    if (match[1].length <= 2) entries.push({ id, text });
  }

  return entries;
}
