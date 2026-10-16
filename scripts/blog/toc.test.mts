import assert from "node:assert/strict";
import { test } from "node:test";

import { toHtml } from "hast-util-to-html";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { buildToc } from "../../lib/blog-toc";

const SAMPLE = [
  "Intro paragraph.",
  "## What the demo *skipped*",
  "### Data access",
  "```steps",
  "## not a heading",
  "```",
  "## Data access",
  "## The [handoff](/x) nobody scheduled",
  "## What the demo skipped",
].join("\n");

test("TOC ids match the ids rehype-slug renders", async () => {
  const tree = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .run(unified().use(remarkParse).parse(SAMPLE));
  const html = toHtml(tree);
  const rendered = [...html.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);

  assert.deepEqual(
    buildToc(SAMPLE).map((entry) => entry.id),
    rendered,
  );
});

test("TOC labels drop inline markdown and ignore fenced lines", () => {
  assert.deepEqual(
    buildToc(SAMPLE).map((entry) => entry.text),
    [
      "What the demo skipped",
      "Data access",
      "The handoff nobody scheduled",
      "What the demo skipped",
    ],
  );
});
