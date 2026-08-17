/**
 * The scanners, which are the part of this pipeline that has to be right.
 *
 * Everything else fails loudly when it breaks — a bad upload 404s, a bad row
 * throws. These two fail *quietly*: a missed client name publishes and looks
 * exactly like a study that never had one. So the cases here are mostly about
 * the ways a term can hide, and the ways a scan can cry wolf until someone
 * turns it off.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  scanCompanySuffixes,
  scanDenyTerms,
  scanMetrics,
  termPattern,
  walkStrings,
} from "./guards.mjs";

describe("walkStrings", () => {
  it("reaches strings nested in arrays of objects", () => {
    const found = walkStrings({
      title: "top",
      tracks: [{ context: ["deep one", "deep two"] }],
    });

    assert.deepEqual(
      found.map((f) => f.path),
      ["title", "tracks[0].context[0]", "tracks[0].context[1]"],
    );
  });

  it("ignores non-strings rather than stringifying them", () => {
    const found = walkStrings({ sort_order: 3, featured: true, slug: "a-b" });
    assert.deepEqual(found, [{ path: "slug", text: "a-b" }]);
  });
});

describe("termPattern", () => {
  it("matches across whatever separator was used", () => {
    for (const text of ["Acme Corp", "acme-corp", "ACME_CORP", "acme  corp"]) {
      assert.match(text, termPattern("Acme Corp"), `should match ${text}`);
    }
  });

  it("does not fire inside a longer word", () => {
    assert.doesNotMatch("catalogue", termPattern("cat"));
    assert.doesNotMatch("Northwind's", termPattern("wind"));
  });

  it("still matches at a possessive or punctuation boundary", () => {
    assert.match("the Northwind's platform", termPattern("Northwind"));
    assert.match("built for Northwind.", termPattern("Northwind"));
  });
});

describe("scanDenyTerms", () => {
  const payload = {
    slug: "a-study",
    summary: "Work for a large operator.",
    tracks: [
      { context: ["clean", "ran on the Northwind platform"], demos: ["fine"] },
    ],
  };

  it("finds a term buried deep in a nested array", () => {
    const hits = scanDenyTerms(walkStrings(payload), ["Northwind"]);

    assert.equal(hits.length, 1);
    assert.equal(hits[0].path, "tracks[0].context[1]");
    assert.equal(hits[0].match, "Northwind");
  });

  it("finds a term in the image prompt, which never renders", () => {
    const hits = scanDenyTerms(
      [{ path: "image_prompt", text: "in the style of Northwind's branding" }],
      ["Northwind"],
    );

    assert.equal(hits.length, 1);
    assert.equal(hits[0].path, "image_prompt");
  });

  it("catches a term hyphenated into the slug", () => {
    const hits = scanDenyTerms(
      [{ path: "slug", text: "northwind-rag-platform" }],
      ["Northwind"],
    );

    assert.equal(hits.length, 1);
  });

  it("reports every occurrence rather than stopping at the first", () => {
    const hits = scanDenyTerms(
      [
        { path: "a", text: "Northwind" },
        { path: "b", text: "Northwind again" },
      ],
      ["Northwind"],
    );

    assert.equal(hits.length, 2);
  });

  it("is silent on a clean payload", () => {
    assert.deepEqual(scanDenyTerms(walkStrings(payload), ["Contoso"]), []);
  });

  it("never rewrites the text it scans", () => {
    const before = JSON.stringify(payload);
    scanDenyTerms(walkStrings(payload), ["Northwind"]);
    assert.equal(JSON.stringify(payload), before);
  });
});

describe("scanMetrics", () => {
  const at = (text: string, path = "summary") => [{ path, text }];

  it("rejects a percentage", () => {
    const hits = scanMetrics(at("cut review time by 40%"), []);
    assert.equal(hits.length > 0, true);
    assert.equal(hits.some((h) => h.label === "percentage"), true);
  });

  it("rejects currency and multipliers", () => {
    assert.equal(scanMetrics(at("saved $1.2M"), []).length > 0, true);
    assert.equal(scanMetrics(at("3x faster retrieval"), []).length > 0, true);
  });

  it("rejects a benefit verb sitting next to a number", () => {
    const hits = scanMetrics(at("reduced onboarding to 2 days"), []);
    assert.equal(hits.some((h) => h.label === "benefit claim"), true);
  });

  it("allows plain counts, which is what keeps it switched on", () => {
    for (const clean of [
      "Two workshop tracks over four hours.",
      "Ingested 12 document types.",
      "A 90-minute session.",
    ]) {
      assert.deepEqual(scanMetrics(at(clean), []), [], clean);
    }
  });

  it("forgives a figure the operator declared", () => {
    assert.deepEqual(
      scanMetrics(at("cut review time by 40%"), ["40%"]),
      [],
    );
  });

  it("does not let one declared figure forgive a different one", () => {
    const hits = scanMetrics(at("40% faster and $2M saved"), ["40%"]);
    assert.equal(hits.some((h) => h.label === "currency"), true);
  });

  describe("the at_a_glance exception", () => {
    const glance = (text: string) => [
      { path: "at_a_glance[0].value", text },
    ];

    it("allows counts, which is what the exception is for", () => {
      assert.deepEqual(scanMetrics(glance("4 hrs"), []), []);
      assert.deepEqual(scanMetrics(glance("2"), []), []);
    });

    it("still rejects a percentage laundered through it", () => {
      assert.equal(scanMetrics(glance("40%"), []).length > 0, true);
    });

    it("still rejects currency and multipliers", () => {
      assert.equal(scanMetrics(glance("$1.2M"), []).length > 0, true);
      assert.equal(scanMetrics(glance("3x"), []).length > 0, true);
    });

    it("does not extend the exception to the label", () => {
      const hits = scanMetrics(
        [{ path: "at_a_glance[0].label", text: "40% faster" }],
        [],
      );
      assert.equal(hits.length > 0, true);
    });
  });
});

describe("scanCompanySuffixes", () => {
  it("flags an organization-shaped name", () => {
    const hits = scanCompanySuffixes([
      { path: "context", text: "delivered for Northwind Systems, Inc." },
    ]);

    assert.equal(hits.length, 1);
  });

  it("stays quiet on ordinary prose", () => {
    assert.deepEqual(
      scanCompanySuffixes([
        { path: "context", text: "A government energy organization." },
      ]),
      [],
    );
  });
});
