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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...ANSWER_ENGINES.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
