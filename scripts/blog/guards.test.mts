import assert from "node:assert/strict";
import { test } from "node:test";

import { checkPost, type CheckContext } from "./guards.mjs";
import { imageSize, sniffFormat } from "./images.mjs";
import { bodyImages, resolveAssets, stripFences, type BlogPayload } from "./intake.mjs";

const BODY = `We saw the pilot stall. Here is why, and what fixed it.

## What the pilot skipped

A paragraph with a [link to the pillar](/insights/blog/pillar-post) and [another](/services).

![A diagram of the pipeline](images/pipeline.png "The pipeline")

## What we changed

Retrieval improved by 40% on our own evaluation set.[^1]

[^1]: Our measurement, on the aerospace engagement.
`;

function payload(overrides: Partial<BlogPayload> = {}): BlogPayload {
  return {
    slug: "a-new-post",
    title: "A new post",
    summary: "x".repeat(140),
    published: "2026-10-01",
    updated_on: null,
    author: "will-baltus",
    topic: "production-ai",
    tags: [],
    takeaways: ["One claim.", "Two claim.", "Three claim."],
    related: ["pillar-post"],
    cta: null,
    cover_url: null,
    cover_alt: null,
    cover_credit: null,
    featured: false,
    pillar: false,
    meta_title: null,
    meta_description: null,
    body: BODY,
    status: "published",
    ...overrides,
  };
}

const ctx: CheckContext = {
  published: [
    { slug: "pillar-post", title: "The pillar", topic: "production-ai", pillar: true, featured: false },
  ],
  topics: ["production-ai", "retrieval-and-data"],
  authors: ["will-baltus", "leo-ramirez"],
  replace: false,
  clearedImages: ["images/pipeline.png"],
  denyTerms: [],
};

test("a well-formed post has no errors", () => {
  assert.deepEqual(checkPost(payload(), ctx).errors, []);
});

test("identity errors: reserved slug, unknown author and topic, taken slug", () => {
  const { errors } = checkPost(payload({ slug: "topics", author: "someone", topic: "cooking" }), ctx);
  assert.ok(errors.some((e) => e.includes("reserved")));
  assert.ok(errors.some((e) => e.includes("author")));
  assert.ok(errors.some((e) => e.includes("topic")));

  const taken = checkPost(payload({ slug: "pillar-post", related: [] }), ctx).errors;
  assert.ok(taken.some((e) => e.includes("--replace")));
  assert.deepEqual(
    checkPost(payload({ slug: "pillar-post", related: [] }), { ...ctx, replace: true }).errors.filter((e) =>
      e.includes("--replace"),
    ),
    [],
  );
});

test("structure: an H1 and a skipped level are errors", () => {
  const { errors } = checkPost(payload({ body: `# Title\n\n#### Deep\n\ntext\n` }), ctx);
  assert.ok(errors.some((e) => e.includes("owns the one H1")));
  assert.ok(errors.some((e) => e.includes("skips")));
});

test("headings inside a code fence are not headings", () => {
  const body = `${BODY}\n\`\`\`\n# not a heading\n\`\`\`\n`;
  assert.deepEqual(checkPost(payload({ body }), ctx).errors, []);
});

test("a takeaway repeated verbatim in the body is an error", () => {
  const { errors } = checkPost(payload({ takeaways: ["We saw the pilot stall.", "b", "c"] }), ctx);
  assert.ok(errors.some((e) => e.includes("word for word")));
});

test("broken figures, footnotes, images and links are errors", () => {
  const body = [
    "Intro.",
    "",
    "## Section",
    "",
    '```callout\n{"kind":"shout"}\n```',
    "",
    "A claim.[^missing] See [gone](/insights/blog/not-a-post).",
    "",
    "![](images/uncleared.png)",
    "",
    "[^orphan]: never cited",
  ].join("\n");
  const { errors } = checkPost(payload({ body, related: ["also-gone"] }), ctx);
  for (const needle of ["does not parse", "[^missing]", "[^orphan]", "no alt text", "cleared", "not-a-post", "also-gone"]) {
    assert.ok(errors.some((e) => e.includes(needle)), needle);
  }
});

test("deny-listed terms stop the run, in the cover prompt too", () => {
  const { errors } = checkPost(payload(), { ...ctx, denyTerms: ["Acme Corp"], coverPrompt: "an acme-corp hangar" });
  assert.ok(errors.some((e) => e.includes("Acme Corp") && e.includes("cover_prompt")));
});

test("warnings: snippet lengths, sourceless numbers, missing pillar link", () => {
  const body = "Short.\n\n## One\n\nThroughput rose 3x after the change.\n";
  const { warnings, errors } = checkPost(payload({ body, title: "t".repeat(70), summary: "short", related: [] }), ctx);
  assert.deepEqual(errors, []);
  for (const needle of ["Google shows", "search snippet", "unsourced multiplier", "pillar", "internal link"]) {
    assert.ok(warnings.some((w) => w.includes(needle)), needle);
  }
});

test("bodyImages and stripFences ignore fenced examples", () => {
  const body = '![a](x.png "cap")\n\n```\n![b](y.png)\n```\n';
  assert.deepEqual(
    bodyImages(body).map((i) => [i.alt, i.src, i.caption]),
    [["a", "x.png", "cap"]],
  );
  assert.equal(stripFences(body).split("\n").length, body.split("\n").length);
});

test("resolveAssets swaps asset references and keeps the size fragment", () => {
  const out = resolveAssets(
    payload({ body: "![a](asset:abc.png#10x20)", cover_url: "asset:def.webp" }),
    (name) => `https://cdn.test/${name}`,
  );
  assert.equal(out.body, "![a](https://cdn.test/abc.png#10x20)");
  assert.equal(out.cover_url, "https://cdn.test/def.webp");
});

test("image headers: PNG, JPEG and WebP dimensions", () => {
  const png = new Uint8Array(24);
  png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  png.set([0, 0, 6, 0x40, 0, 0, 3, 0x84], 16); // 1600 x 900
  assert.equal(sniffFormat(png), "png");
  assert.deepEqual(imageSize(png), { width: 1600, height: 900 });

  // SOI, an APP0 segment of length 4, then SOF0 with height 300, width 400.
  const jpeg = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x01, 0x2c, 0x01, 0x90, 0, 0, 0, 0, 0,
  ]);
  assert.deepEqual(imageSize(jpeg), { width: 400, height: 300 });

  const webp = new Uint8Array(30);
  webp.set([...Buffer.from("RIFF")], 0);
  webp.set([...Buffer.from("WEBPVP8X")], 8);
  webp.set([0x5f, 0x06, 0x00, 0xff, 0x03, 0x00], 24); // 1632 x 1024
  assert.deepEqual(imageSize(webp), { width: 1632, height: 1024 });

  assert.equal(sniffFormat(new Uint8Array(12)), null);
});
