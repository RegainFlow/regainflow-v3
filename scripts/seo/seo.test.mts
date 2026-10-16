import assert from "node:assert/strict";
import { test } from "node:test";

import * as robotsModule from "../../app/robots";
import { aiSource } from "../../lib/analytics/ai-source";
import type { Report } from "../../lib/content/reports";
import { withoutTrailingSlash } from "../../lib/gov-routing";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  organizationJsonLd,
  pageMetadata,
  reportJsonLd,
} from "../../lib/seo";
import { SITE_URL } from "../../lib/site";

// `app/robots.ts` is a default export consumed by Next. Under the test loader the
// default can arrive wrapped once more, so unwrap whichever shape it has.
const wrapped = robotsModule.default as unknown;
const robots = (
  typeof wrapped === "function" ? wrapped : (wrapped as { default: unknown }).default
) as typeof robotsModule.default;

/**
 * The search and answer-engine surface, pinned. None of this fails loudly in a
 * browser: a missing canonical or a relative URL in structured data ships as
 * valid HTML and is only noticed weeks later in a results page.
 */

// --- pageMetadata -----------------------------------------------------------

test("a page states its own canonical, absolute Open Graph URL and card", () => {
  const meta = pageMetadata({ title: "Services", description: "What we do.", path: "/services" });

  assert.equal(meta.alternates?.canonical, "/services");
  assert.equal(meta.openGraph?.url, `${SITE_URL}/services`);
  assert.equal(meta.title, "Services", "the layout's template adds the site name");
  assert.match(String(meta.openGraph?.title), /Services \| /);

  const images = meta.openGraph?.images as { url: string; width: number; height: number }[];
  assert.equal(images[0].url, "/opengraph-image");
  assert.equal(images[0].width, 1200);
  assert.equal(images[0].height, 630);
});

test("a page is indexable unless it asks not to be", () => {
  const plain = pageMetadata({ title: "A", description: "B", path: "/a" });
  assert.equal(plain.robots, undefined, "inherits the root layout's robots");

  const empty = pageMetadata({ title: "A", description: "B", path: "/a", noindex: true });
  assert.deepEqual(empty.robots, { index: false, follow: true });
});

test("the RSS feed is advertised only where asked", () => {
  const without = pageMetadata({ title: "A", description: "B", path: "/a" });
  assert.equal(without.alternates?.types, undefined);

  const withFeed = pageMetadata({ title: "A", description: "B", path: "/a", feed: true });
  assert.deepEqual(withFeed.alternates?.types, {
    "application/rss+xml": `${SITE_URL}/insights/blog/feed.xml`,
  });
});

test("a segment with its own card leaves images to the file convention", () => {
  const meta = pageMetadata({ title: "A", description: "B", path: "/a", segmentCard: true });
  assert.equal(meta.openGraph?.images, undefined);
});

// --- structured data ---------------------------------------------------------

const REPORT: Report = {
  slug: "a-report",
  title: "A Report",
  summary: "What it says.",
  published: "2026-08-16",
  findings: ["One thing."],
  cover: "/reports/a-report-cover.png",
  pdf: "https://example.supabase.co/storage/v1/object/public/reports/a-report.pdf",
  pages: 14,
};

test("report structured data carries absolute URLs, even for a relative cover", () => {
  const node = reportJsonLd(REPORT);

  assert.equal(node["@type"], "Report");
  assert.equal(node.url, `${SITE_URL}/insights/reports/a-report`);
  assert.equal(node.mainEntityOfPage, node.url);
  assert.equal(node.image, `${SITE_URL}/reports/a-report-cover.png`);
  assert.equal(node.encoding.contentUrl, REPORT.pdf, "an absolute URL passes through");
  assert.equal(node.encoding.numberOfPages, 14);
  assert.equal("audio" in node, false, "no audio node without an audio file");
});

test("breadcrumbs are absolute, in order, and end on the page", () => {
  const node = breadcrumbJsonLd("A Report", "/insights/reports/a-report", [
    { name: "Insights", path: "/insights" },
    { name: "Reports", path: "/insights/reports" },
  ]);
  const items = node.itemListElement as { position: number; name: string; item: string }[];

  assert.deepEqual(
    items.map((item) => item.position),
    items.map((_, i) => i + 1),
  );
  assert.equal(items.at(-1)?.name, "A Report");
  assert.equal(items.at(-1)?.item, `${SITE_URL}/insights/reports/a-report`);
  for (const item of items) assert.match(item.item, /^https:\/\//);
});

test("a collection lists its items in order with absolute URLs and their types", () => {
  const node = collectionJsonLd({
    path: "/insights/reports",
    name: "Reports",
    description: "All of them.",
    items: [
      { type: "Report", path: "/insights/reports/a", name: "A" },
      { type: "Report", path: "/insights/reports/b", name: "B" },
    ],
  });

  assert.equal(node["@type"], "CollectionPage");
  assert.equal(node.url, `${SITE_URL}/insights/reports`);
  const items = node.mainEntity.itemListElement;
  assert.deepEqual(
    items.map((item) => [item.position, item.item["@type"], item.item.url]),
    [
      [1, "Report", `${SITE_URL}/insights/reports/a`],
      [2, "Report", `${SITE_URL}/insights/reports/b`],
    ],
  );
});

test("the organization's sameAs lists profiles, not the booking link", () => {
  const node = organizationJsonLd();

  assert.ok(node.sameAs.length > 0);
  for (const url of node.sameAs) {
    assert.doesNotMatch(url, /cal\.com/, "a booking page is not a profile of the organization");
  }
  assert.match(node.foundingDate, /^\d{4}-\d{2}$/);
  assert.equal(node.url, SITE_URL);
});

// --- robots -----------------------------------------------------------------

test("robots.txt allows the site, blocks draft previews, and names the sitemap", () => {
  const file = robots();
  const rules = Array.isArray(file.rules) ? file.rules : [file.rules];
  const everyone = rules.find((rule) => rule.userAgent === "*");

  assert.equal(everyone?.allow, "/");
  assert.deepEqual(everyone?.disallow, ["/insights/blog/preview/"]);
  assert.equal(file.sitemap, `${SITE_URL}/sitemap.xml`);
  assert.equal(file.host, undefined, "no legacy Host line");
});

test("robots.txt welcomes the AI search and assistant crawlers by name", () => {
  const file = robots();
  const rules = Array.isArray(file.rules) ? file.rules : [file.rules];
  const named = new Set(rules.map((rule) => rule.userAgent));

  for (const agent of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-User", "ClaudeBot"]) {
    assert.ok(named.has(agent), `${agent} is not named`);
  }
  for (const rule of rules) assert.equal(rule.allow, "/", `${rule.userAgent} is not allowed`);
});

// --- trailing slash -----------------------------------------------------------

test("a trailing slash is stripped from page paths and the root is left alone", () => {
  assert.equal(withoutTrailingSlash("/services/"), "/services");
  assert.equal(withoutTrailingSlash("/insights/blog//"), "/insights/blog");
  assert.equal(withoutTrailingSlash("/services"), null);
  assert.equal(withoutTrailingSlash("/"), null);
});

// --- AI referral --------------------------------------------------------------

test("ChatGPT is recognised from its utm_source when there is no referrer", () => {
  assert.equal(aiSource("", "?utm_source=chatgpt.com"), "chatgpt");
  assert.equal(aiSource("", "utm_source=chatgpt.com&x=1"), "chatgpt");
});

test("assistants are recognised from the referrer's hostname", () => {
  assert.equal(aiSource("https://www.perplexity.ai/search?q=x", ""), "perplexity");
  assert.equal(aiSource("https://claude.ai/chat/abc", ""), "claude");
  assert.equal(aiSource("https://copilot.microsoft.com/", ""), "copilot");
  assert.equal(aiSource("https://gemini.google.com/app", ""), "gemini");
  assert.equal(aiSource("https://chatgpt.com/", ""), "chatgpt");
});

test("ordinary traffic is not mistaken for an assistant", () => {
  assert.equal(aiSource("", ""), null);
  assert.equal(aiSource("https://www.google.com/", ""), null);
  assert.equal(aiSource("https://www.linkedin.com/feed/", "?utm_source=linkedin"), null);
  assert.equal(aiSource("https://notclaude.ai.example.com/", ""), null);
  assert.equal(aiSource("https://evilchatgpt.com/", ""), null, "a lookalike domain does not match");
  assert.equal(aiSource("not a url", ""), null);
});
