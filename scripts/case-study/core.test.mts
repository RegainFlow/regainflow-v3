/**
 * The plumbing: retry classification, flag parsing, and the WebP sniff.
 *
 * None of it is clever, and all of it decides something the operator sees — an
 * exit code, a rejected flag, or whether a file that is not a WebP gets
 * uploaded as one.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isRetryable, one, parseFlags, PipelineError } from "./core.mjs";
import { buildPrompt, isWebp, PROMPT_PREAMBLE } from "./image.mjs";

describe("isRetryable", () => {
  it("retries a rate limit and a server error", () => {
    assert.equal(isRetryable(429), true);
    assert.equal(isRetryable(500), true);
    assert.equal(isRetryable(503), true);
  });

  it("does not retry the client errors that will not change", () => {
    for (const status of [400, 401, 403, 404, 409, 422]) {
      assert.equal(isRetryable(status), false, String(status));
    }
  });

  it("retries when there is no status at all", () => {
    // A dropped socket has no status and is the same class of problem as a
    // 503. The cost of the assumption is that a genuinely malformed response
    // is retried too, which is why the shape checks throw PipelineError
    // instead of going through the retry wrapper.
    assert.equal(isRetryable(undefined), true);
  });
});

describe("parseFlags", () => {
  const spec = {
    boolean: ["replace", "dry-run"],
    string: ["out", "allow-metric"],
  };

  it("collects positionals in order", () => {
    const flags = parseFlags(["a.yaml", "b"], spec);
    assert.deepEqual(flags.positionals, ["a.yaml", "b"]);
  });

  it("reads a boolean flag", () => {
    assert.equal(parseFlags(["--replace"], spec).booleans.has("replace"), true);
  });

  it("reads a value both ways round", () => {
    assert.equal(one(parseFlags(["--out", "dir"], spec), "out"), "dir");
    assert.equal(one(parseFlags(["--out=dir"], spec), "out"), "dir");
  });

  it("keeps every occurrence of a repeatable flag", () => {
    const flags = parseFlags(
      ["--allow-metric", "40%", "--allow-metric", "$2M"],
      spec,
    );
    assert.deepEqual(flags.values.get("allow-metric"), ["40%", "$2M"]);
  });

  it("rejects an unknown flag rather than ignoring it", () => {
    // Silently dropping --repalce would publish without the replace the
    // operator asked for.
    assert.throws(() => parseFlags(["--repalce"], spec), PipelineError);
  });

  it("rejects a value flag with nothing after it", () => {
    assert.throws(() => parseFlags(["--out"], spec), PipelineError);
  });

  it("stops parsing at --", () => {
    const flags = parseFlags(["--replace", "--", "--out"], spec);
    assert.deepEqual(flags.positionals, ["--out"]);
  });

  it("does not confuse a positional that starts with a digit", () => {
    assert.deepEqual(parseFlags(["2026-study"], spec).positionals, [
      "2026-study",
    ]);
  });
});

describe("isWebp", () => {
  function riff(format: string): Uint8Array {
    const bytes = new Uint8Array(16);
    bytes.set([..."RIFF"].map((c) => c.charCodeAt(0)), 0);
    bytes.set([...format].map((c) => c.charCodeAt(0)), 8);
    return bytes;
  }

  it("accepts a RIFF/WEBP container", () => {
    assert.equal(isWebp(riff("WEBP")), true);
  });

  it("rejects a PNG, which is the failure that matters", () => {
    // A model that ignores output_format returns PNG. Written under a .webp
    // name it uploads with a lying Content-Type and renders as a broken image.
    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    assert.equal(isWebp(png), false);
  });

  it("rejects a RIFF container that is not WebP", () => {
    assert.equal(isWebp(riff("WAVE")), false);
  });

  it("rejects something too short to tell", () => {
    assert.equal(isWebp(new Uint8Array([0x52, 0x49])), false);
  });
});

describe("buildPrompt", () => {
  it("puts the house rules ahead of the subject", () => {
    const prompt = buildPrompt("concentric arcs");
    assert.equal(prompt.startsWith(PROMPT_PREAMBLE), true);
    assert.match(prompt, /concentric arcs/);
  });

  it("carries the crop constraint, which is the one that matters", () => {
    assert.match(buildPrompt("x"), /middle 60%/);
    assert.match(buildPrompt("x"), /FORBIDDEN: text/);
  });
});
