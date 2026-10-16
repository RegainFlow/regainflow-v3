import assert from "node:assert/strict";
import { test } from "node:test";

import {
  cleanSource,
  requestSubscription,
  tokenHash,
  type PendingRow,
  type SubscriberStore,
} from "../../lib/newsletter";

function memoryStore(initial: Record<string, "pending" | "confirmed"> = {}) {
  const statuses = { ...initial };
  const saved: PendingRow[] = [];
  const store: SubscriberStore = {
    async status(email) {
      return statuses[email] ?? null;
    },
    async savePending(row) {
      saved.push(row);
      statuses[row.email] = "pending";
    },
  };
  return { store, saved };
}

const input = { email: "  Reader@Agency.GOV ", source: "footer", ipHash: "abc" };

test("a new address gets a pending row and a link, lower-cased", async () => {
  const { store, saved } = memoryStore();
  const result = await requestSubscription(input, store, new Date("2026-10-12T00:00:00Z"));

  assert.equal(result.kind, "mail");
  assert.equal(saved.length, 1);
  assert.equal(saved[0].email, "reader@agency.gov");
  assert.equal(saved[0].status, "pending");
  assert.equal(saved[0].source, "footer");
  assert.equal(saved[0].token_sent_at, "2026-10-12T00:00:00.000Z");
  if (result.kind === "mail") {
    assert.equal(result.email, "reader@agency.gov");
    // The row keeps the hash, never the token itself.
    assert.equal(saved[0].confirm_token_hash, tokenHash(result.token));
    assert.notEqual(saved[0].confirm_token_hash, result.token);
  }
});

test("a pending address gets a fresh link", async () => {
  const { store, saved } = memoryStore({ "reader@agency.gov": "pending" });
  const first = await requestSubscription(input, store);
  const second = await requestSubscription(input, store);

  assert.equal(first.kind, "mail");
  assert.equal(second.kind, "mail");
  assert.equal(saved.length, 2);
  assert.notEqual(saved[0].confirm_token_hash, saved[1].confirm_token_hash);
});

test("a confirmed address is left alone and gets no mail", async () => {
  const { store, saved } = memoryStore({ "reader@agency.gov": "confirmed" });
  const result = await requestSubscription(input, store);

  assert.deepEqual(result, { kind: "already" });
  assert.equal(saved.length, 0);
});

test("a store failure is thrown, not swallowed", async () => {
  const store: SubscriberStore = {
    async status() {
      throw new Error("down");
    },
    async savePending() {},
  };
  await assert.rejects(requestSubscription(input, store), /down/);
});

test("source is capped and blank becomes null", () => {
  assert.equal(cleanSource(""), null);
  assert.equal(cleanSource(null), null);
  assert.equal(cleanSource("report_gate:x"), "report_gate:x");
  assert.equal(cleanSource("a".repeat(300))?.length, 200);
});
