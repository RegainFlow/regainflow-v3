import assert from "node:assert/strict";
import { test } from "node:test";

import { routeGov } from "../../lib/gov-routing";

test("gov host serves the single page from app/gov", () => {
  assert.deepEqual(routeGov("gov.regainflow.com", "/"), { kind: "rewrite", pathname: "/gov" });
});

test("gov host sends retired document paths and /gov to its root", () => {
  for (const path of ["/capability-statement", "/past-performance", "/gov", "/gov/x"]) {
    assert.deepEqual(routeGov("gov.regainflow.com", path), {
      kind: "redirect",
      url: "https://gov.regainflow.com/",
    });
  }
});

test("gov host sends marketing routes to the main site", () => {
  assert.deepEqual(routeGov("gov.regainflow.com", "/services"), {
    kind: "redirect",
    url: "https://www.regainflow.com/services",
  });
  assert.deepEqual(routeGov("gov.localhost:3000", "/services", "http:"), {
    kind: "redirect",
    url: "http://localhost:3000/services",
  });
});

test("gov.localhost behaves like production", () => {
  assert.deepEqual(routeGov("gov.localhost:3000", "/", "http:"), {
    kind: "rewrite",
    pathname: "/gov",
  });
});

test("main site sends gov URLs to the subdomain root", () => {
  for (const path of ["/gov", "/gov/past-performance", "/capability-statement"]) {
    assert.deepEqual(routeGov("www.regainflow.com", path), {
      kind: "redirect",
      url: "https://gov.regainflow.com/",
    });
  }
  assert.deepEqual(routeGov("www.regainflow.com", "/"), { kind: "next" });
  assert.deepEqual(routeGov("regainflow.com", "/services"), { kind: "next" });
});

test("preview and localhost serve /gov in place", () => {
  assert.deepEqual(routeGov("localhost:3000", "/gov", "http:"), { kind: "next" });
  assert.deepEqual(routeGov("localhost:3000", "/past-performance", "http:"), {
    kind: "redirect",
    url: "http://localhost:3000/gov",
  });
  assert.deepEqual(routeGov("regainflow-git-x.vercel.app", "/"), { kind: "next" });
});
