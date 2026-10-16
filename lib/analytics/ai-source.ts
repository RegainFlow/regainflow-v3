/**
 * Which AI assistant sent a visitor, if one did.
 *
 * Pure and import-free, so it runs in `instrumentation-client.ts` and under
 * `node --test` alike.
 *
 * Two signals, checked in this order:
 *
 * 1. `utm_source`. ChatGPT appends `utm_source=chatgpt.com` to the links it
 *    shows, and its apps often send no referrer at all, so the parameter is the
 *    only trace of the visit.
 * 2. The referrer's hostname. Perplexity, Claude, Copilot and Gemini pass one
 *    from their web apps.
 *
 * What this cannot see: a click from a native app that strips the referrer and
 * adds no parameter arrives as direct traffic, and a click from Google's AI
 * Overviews or AI Mode arrives as ordinary Google search. Read the counts as a
 * floor.
 */

export type AiSource =
  | "chatgpt"
  | "perplexity"
  | "claude"
  | "gemini"
  | "copilot"
  | "grok"
  | "mistral"
  | "meta_ai"
  | "deepseek"
  | "you";

/** Hostnames, matched exactly or as a parent domain (`www.perplexity.ai`). */
const HOSTS: [string, AiSource][] = [
  ["chatgpt.com", "chatgpt"],
  ["chat.openai.com", "chatgpt"],
  ["perplexity.ai", "perplexity"],
  ["claude.ai", "claude"],
  ["gemini.google.com", "gemini"],
  ["copilot.microsoft.com", "copilot"],
  ["grok.com", "grok"],
  ["chat.mistral.ai", "mistral"],
  ["meta.ai", "meta_ai"],
  ["chat.deepseek.com", "deepseek"],
  ["you.com", "you"],
];

function fromHost(hostname: string): AiSource | null {
  const host = hostname.toLowerCase().replace(/^www\./, "");

  for (const [domain, source] of HOSTS) {
    if (host === domain || host.endsWith(`.${domain}`)) return source;
  }

  return null;
}

/**
 * @param referrer `document.referrer`: a full URL, or empty.
 * @param search `location.search`, with or without the leading `?`.
 */
export function aiSource(referrer: string, search: string): AiSource | null {
  const utm = new URLSearchParams(search).get("utm_source");
  if (utm) {
    // The value is a bare hostname (`chatgpt.com`), not a URL.
    const tagged = fromHost(utm.trim());
    if (tagged) return tagged;
  }

  if (!referrer) return null;

  try {
    return fromHost(new URL(referrer).hostname);
  } catch {
    return null;
  }
}
