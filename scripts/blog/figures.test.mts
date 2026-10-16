import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseBars,
  parseCallout,
  parseImageSize,
  parseSteps,
  parseVideo,
} from "../../lib/blog-figures";

test("a well-formed callout parses", () => {
  assert.deepEqual(
    parseCallout('{"kind":"note","title":"T","body":"B"}'),
    { kind: "note", title: "T", body: "B" },
  );
});

test("malformed figures return null rather than throwing", () => {
  for (const bad of ["", "not json", "[]", '{"kind":"shout","title":"T","body":"B"}', '{"kind":"note","title":"","body":"B"}']) {
    assert.equal(parseCallout(bad), null, bad);
  }
  assert.equal(parseSteps('{"caption":"C","steps":[{"title":"A","detail":"a"}]}'), null);
  assert.equal(
    parseSteps('{"caption":"C","steps":[{"title":"A","detail":"a"},{"title":"B"}]}'),
    null,
    "a dropped step invalidates the figure",
  );
  assert.equal(parseBars('{"caption":"C","source":"S","bars":[{"label":"x","value":-1}]}'), null);
  assert.equal(parseBars('{"caption":"C","bars":[{"label":"x","value":1}]}'), null, "source is required");
});

test("bars keep their order, unit and notes", () => {
  assert.deepEqual(
    parseBars('{"caption":"C","unit":"%","source":"S","bars":[{"label":"a","value":39.8,"note":"n"},{"label":"b","value":61}]}'),
    {
      caption: "C",
      unit: "%",
      source: "S",
      bars: [
        { label: "a", value: 39.8, note: "n" },
        { label: "b", value: 61 },
      ],
    },
  );
});

test("a video takes an 11-character id and nothing else", () => {
  assert.deepEqual(parseVideo('{"youtube":"dQw4w9WgXcQ","title":"T","caption":"C"}'), {
    youtube: "dQw4w9WgXcQ",
    title: "T",
    caption: "C",
  });
  assert.deepEqual(parseVideo('{"youtube":"dQw4w9WgXcQ","title":"T"}'), {
    youtube: "dQw4w9WgXcQ",
    title: "T",
  });
  for (const bad of [
    '{"youtube":"https://youtu.be/dQw4w9WgXcQ","title":"T"}',
    '{"youtube":"short","title":"T"}',
    '{"youtube":"dQw4w9WgXc\\"","title":"T"}',
    '{"youtube":"dQw4w9WgXcQ"}',
    '{"youtube":"dQw4w9WgXcQ","title":"T","caption":3}',
  ]) {
    assert.equal(parseVideo(bad), null, bad);
  }
});

test("an image size comes off the fragment and the URL is left bare", () => {
  assert.deepEqual(parseImageSize("https://x.test/a.png#1600x900"), {
    src: "https://x.test/a.png",
    width: 1600,
    height: 900,
  });
  assert.deepEqual(parseImageSize("/blog/a.jpg"), { src: "/blog/a.jpg" });
  assert.deepEqual(parseImageSize("/blog/a.jpg#0x900"), { src: "/blog/a.jpg" });
  assert.deepEqual(parseImageSize("/blog/a.jpg#section"), { src: "/blog/a.jpg#section" });
});
