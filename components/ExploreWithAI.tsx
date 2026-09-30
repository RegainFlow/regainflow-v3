import { RF_EVENTS } from "@/lib/analytics/events";

/**
 * "Ask ChatGPT" and "Ask Claude": open the reader's assistant with a prompt
 * about this post, the way Profound's posts do.
 *
 * An answer-engine move as much as a convenience: the reader keeps the
 * conversation in the tool they already use, and the assistant reads the page
 * from its URL. Plain links built from constants and the post's own URL, so
 * nothing about the reader is sent anywhere; the prompt is the same for
 * everyone.
 */
const ASSISTANTS = [
  { name: "ChatGPT", href: (q: string) => `https://chatgpt.com/?q=${q}` },
  { name: "Claude", href: (q: string) => `https://claude.ai/new?q=${q}` },
] as const;

export default function ExploreWithAI({ url }: { url: string }) {
  const prompt = encodeURIComponent(
    `Summarize this article from RegainFlow and answer my questions about it: ${url}`,
  );

  return (
    <p className="rf-explore-ai">
      <span className="rf-utility">Explore with AI</span>
      {ASSISTANTS.map((assistant) => {
        const href = assistant.href(prompt);
        return (
          <a
            key={assistant.name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rf-read-control"
            data-rf-event={RF_EVENTS.blogExploreAi}
            data-rf-target={assistant.name.toLowerCase()}
          >
            Ask {assistant.name} &#8599;
          </a>
        );
      })}
    </p>
  );
}
