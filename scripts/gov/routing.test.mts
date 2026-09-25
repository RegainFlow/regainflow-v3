import assert from "node:assert/strict";
import { test } from "node:test";

import { routeGov } from "../../lib/gov-routing";

test("gov host serves its pages from app/gov", () => {
  assert.deepEqual(routeGov("gov.regainflow.com", "/"), { kind: "rewrite", pathname: "/gov" });
  assert.deepEqual(routeGov("gov.regainflow.com", "/past-performance"), {
    kind: "rewrite",
    pathname: "/gov/past-performance",
  });
});

test("gov host strips a typed /gov prefix", () => {
  assert.deepEqual(routeGov("gov.regainflow.com", "/gov/capability-statement"), {
    kind: "redirect",
    url: "https://gov.regainflow.com/capability-statement",
  });
  assert.deepEqual(routeGov("gov.regainflow.com", "/gov"), {
    kind: "redirect",
    url: "https://gov.regainflow.com/",
  });
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

test("main site sends gov URLs to the subdomain", () => {
  assert.deepEqual(routeGov("www.regainflow.com", "/gov/past-performance"), {
    kind: "redirect",
    url: "https://gov.regainflow.com/past-performance",
  });
  assert.deepEqual(routeGov("regainflow.com", "/capability-statement"), {
    kind: "redirect",
    url: "https://gov.regainflow.com/capability-statement",
  });
  assert.deepEqual(routeGov("www.regainflow.com", "/"), { kind: "next" });
  assert.deepEqual(routeGov("www.regainflow.com", "/services"), { kind: "next" });
});

test("preview and localhost serve the documents in place", () => {
  assert.deepEqual(routeGov("localhost:3000", "/capability-statement", "http:"), {
    kind: "rewrite",
    pathname: "/gov/capability-statement",
  });
  assert.deepEqual(routeGov("localhost:3000", "/gov", "http:"), { kind: "next" });
  assert.deepEqual(routeGov("regainflow-git-x.vercel.app", "/"), { kind: "next" });
});
