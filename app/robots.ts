import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Answer engines are named explicitly rather than left to the wildcard. The
 * effect is the same today, but it makes the intent legible: we want this site
 * quoted by assistants, and `llms.txt` is written for exactly that.
 */
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

/**
 * Draft previews. They are token-gated and `noindex` already; this keeps
 * crawlers from spending requests on URLs that can only ever 404 for them.
 */
const PRIVATE = ["/insights/blog/preview/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...ANSWER_ENGINES.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
