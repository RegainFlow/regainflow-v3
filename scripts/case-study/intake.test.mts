/**
 * The intake schema and the row it resolves to.
 *
 * The cases worth writing down are the ones the database would also catch —
 * slug shape, the image pair — because catching them here is the difference
 * between a sentence naming the field and a Postgres constraint name arriving
 * after an image has already been generated and paid for.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  IntakeSchema,
  crossCheck,
  resolvePayload,
  type Intake,
} from "./intake.mjs";

/** The smallest intake that should pass. Spread over to make one thing wrong. */
const valid = {
  slug: "a-real-study",
  title: "A title that reads as a claim",
  industry: "Government & Energy",
  summary: "One executive-legible line.",
  capability_tags: ["Retrieval-augmented generation"],
  context: "Where the work started.",
  constraints: "What made it hard.",
  role: "What we owned.",
  engineered: ["A thing we built."],
  outcome: "What it produced.",
  next_body: "The closing beat.",
} satisfies Record<string, unknown>;

function parse(overrides: Record<string, unknown> = {}) {
  return IntakeSchema.safeParse({ ...valid, ...overrides });
}

describe("IntakeSchema", () => {
  it("accepts a minimal study", () => {
    assert.equal(parse().success, true);
  });

  describe("slug", () => {
    for (const bad of [
      "Bad_Slug",
      "bad--slug",
      "-leading",
      "trailing-",
      "has space",
      "UPPER",
      "trailing.dot",
    ]) {
      it(`rejects "${bad}"`, () => {
        assert.equal(parse({ slug: bad }).success, false);
      });
    }

    for (const good of ["a", "a-b", "a-b-c", "rag-2-platform"]) {
      it(`accepts "${good}"`, () => {
        assert.equal(parse({ slug: good }).success, true);
      });
    }
  });

  it("rejects a missing required field", () => {
    const withoutSlug: Record<string, unknown> = { ...valid };
    delete withoutSlug.slug;
    assert.equal(IntakeSchema.safeParse(withoutSlug).success, false);
  });

  it("rejects an empty required string", () => {
    assert.equal(parse({ summary: "   " }).success, false);
  });

  it("rejects an unknown field rather than silently dropping it", () => {
    // A typo'd key that parsed cleanly would publish a study missing whatever
    // it was meant to set, with nothing to show for it.
    assert.equal(parse({ next_lable: "typo" }).success, false);
  });

  it("rejects an artifact kind the site cannot render", () => {
    // The union is closed and resolves to a component; an unknown kind renders
    // nothing, so the study would publish with a silently missing diagram.
    const artifacts = [
      { kind: "flowchart", title: "t", caption: "c", nodes: ["a"] },
    ];
    assert.equal(parse({ artifacts }).success, false);
  });

  it("accepts the three kinds the site does render", () => {
    for (const kind of ["spine", "branch-stack", "kit"]) {
      const artifacts = [{ kind, title: "t", caption: "c", nodes: ["a"] }];
      assert.equal(parse({ artifacts }).success, true, kind);
    }
  });

  it("rejects an industry slug that is not a real group", () => {
    assert.equal(parse({ industries: ["healthcare"] }).success, false);
    assert.equal(parse({ industries: ["defense-aerospace"] }).success, true);
  });

  it("holds meta fields to their search-result lengths", () => {
    assert.equal(parse({ meta_title: "x".repeat(71) }).success, false);
    assert.equal(parse({ meta_description: "x".repeat(166) }).success, false);
  });
});

describe("crossCheck", () => {
  const noImage = { image: false };

  it("passes a study with engineered and no stages", () => {
    assert.deepEqual(crossCheck(parse().data as Intake, noImage), []);
  });

  it("rejects engineered and stages together", () => {
    const intake = parse({
      stages: [{ name: "Discover", detail: "d" }],
    }).data as Intake;

    const problems = crossCheck(intake, noImage);
    assert.equal(problems.length, 1);
    assert.match(problems[0], /both set/);
  });

  it("rejects a study that says neither", () => {
    const intake = parse({ engineered: [] }).data as Intake;
    assert.match(crossCheck(intake, noImage)[0], /one of engineered or stages/);
  });

  it("accepts stages alone", () => {
    const intake = parse({
      engineered: [],
      stages: [{ name: "Discover", detail: "d" }],
    }).data as Intake;

    assert.deepEqual(crossCheck(intake, noImage), []);
  });

  it("requires a prompt and alt text when there is an image", () => {
    const problems = crossCheck(parse().data as Intake, { image: true });
    assert.equal(problems.length, 2);
  });

  it("rejects alt text that announces itself", () => {
    const intake = parse({
      image_alt: "Image of a diagram",
      image_prompt: "a diagram",
    }).data as Intake;

    assert.match(crossCheck(intake, { image: true })[0], /describe the image/);
  });

  it("rejects a single track, which is just the study", () => {
    const intake = parse({
      tracks: [
        { key: "A", label: "l", thesis: "t", context: ["c"], demos: ["d"] },
      ],
    }).data as Intake;

    assert.match(crossCheck(intake, noImage)[0], /one entry/);
  });
});

describe("resolvePayload", () => {
  const opts = { imageUrl: null, sortOrder: 3, status: "published" as const };

  it("drops the governance fields and the prompt", () => {
    const intake = parse({
      deny_terms: ["Northwind"],
      measurement_sources: { "40%": "measured over six weeks" },
      image_prompt: "never publish me",
      image_alt: "alt",
    }).data as Intake;

    const payload = resolvePayload(intake, opts);
    const keys = Object.keys(payload);

    for (const leaked of [
      "deny_terms",
      "measurement_sources",
      "image_prompt",
    ]) {
      assert.equal(keys.includes(leaked), false, `${leaked} leaked`);
    }
  });

  it("clears alt text when there is no image, so the pair constraint holds", () => {
    const intake = parse({ image_alt: "alt text" }).data as Intake;
    const payload = resolvePayload(intake, opts);

    assert.equal(payload.image_url, null);
    assert.equal(payload.image_alt, null);
  });

  it("keeps them together when there is an image", () => {
    const intake = parse({ image_alt: "alt text" }).data as Intake;
    const payload = resolvePayload(intake, {
      ...opts,
      imageUrl: "https://example.test/a.webp",
    });

    assert.equal(payload.image_url, "https://example.test/a.webp");
    assert.equal(payload.image_alt, "alt text");
  });

  it("omits optional blocks rather than writing empty ones", () => {
    const payload = resolvePayload(parse().data as Intake, opts);

    for (const key of ["stages", "tracks", "artifacts", "cta", "at_a_glance"]) {
      assert.equal(key in payload, false, `${key} should be absent`);
    }
  });

  it("prunes empty section heading members", () => {
    // An empty member would spread over DEFAULT_SECTION_HEADINGS and blank a
    // good default; absent is the only way to say "use the default".
    const intake = parse({
      section_headings: { tracks: { eyebrow: "Kept" } },
    }).data as Intake;

    const payload = resolvePayload(intake, opts);
    assert.deepEqual(payload.section_headings, { tracks: { eyebrow: "Kept" } });
  });

  it("defaults featured to false rather than leaving it undefined", () => {
    // The RPC coalesces a missing key to false, so an omitted `featured` on a
    // replace would quietly unfeature a study. Being explicit here means the
    // approval gate shows what will actually happen.
    assert.equal(resolvePayload(parse().data as Intake, opts).featured, false);
  });
});
