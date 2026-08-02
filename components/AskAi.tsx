import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * "Ask AI about RegainFlow" — one click into an assistant with the question
 * already written.
 *
 * Worth being clear about what this is: a trust and convenience feature, not an
 * AEO one. It does not make an assistant more likely to cite RegainFlow
 * unprompted. What it does is meet the visitor who was going to ask an AI about
 * us anyway, and hand that assistant a source we actually wrote — which is the
 * only part of the exchange we control.
 *
 * Text labels rather than vendor logos: the site has two hand-authored icons in
 * total and no icon library, so five third-party brand marks would be the
 * largest visual import the design system has taken. Adding a `glyph` field to
 * `AI_TARGETS` is the whole change if that call is ever reversed.
 */

interface AiTarget {
  label: string;
  /** Everything up to and including `=`; the encoded prompt is appended. */
  base: string;
}

/**
 * None of these query parameters are officially documented — they are observed
 * behaviour, and any vendor can drop one in a release without saying so. This
 * list is therefore the conservative set: the four whose `?q=` handling is
 * widely relied on. Grok (`grok.com/?q=`), Copilot
 * (`copilot.microsoft.com/?q=`), and Gemini (`gemini.google.com/app?q=`) were
 * left out — Gemini in particular is widely reported not to prefill, and a link
 * that opens an empty composer is worse than an absent one.
 *
 * Re-check these periodically by clicking each. A target that stops prefilling
 * should be deleted from this array, not patched around.
 */
const AI_TARGETS: AiTarget[] = [
  { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
  { label: "Claude", base: "https://claude.ai/new?q=" },
  { label: "Perplexity", base: "https://www.perplexity.ai/search?q=" },
  // `udm=50` is Google's AI Mode. Plain search parameters, so the most durable
  // entry here.
  { label: "Google AI", base: "https://www.google.com/search?udm=50&q=" },
];

/**
 * Named sources beat an open-ended question: pointing at `/llm-info` gives a
 * retrieving model one page that answers everything the prompt asks, rather than
 * leaving it to assemble a picture from whichever fragment it happens to find.
 *
 * Kept short deliberately — the whole URL has to survive encoding in every
 * target above, and length is where that breaks first.
 */
const PROMPT = `What is ${SITE_NAME}? Summarize what they do, who they work with, and how an engagement starts. Use ${SITE_URL}/llm-info as the source.`;

export default function AskAi() {
  const encoded = encodeURIComponent(PROMPT);

  return (
    <div className="mt-14 border-t border-rf-hairline pt-6">
      <p className="rf-utility">Ask AI about {SITE_NAME}</p>

      <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        {AI_TARGETS.map((target) => (
          <li key={target.label} className="group flex items-center gap-x-3">
            <a
              href={`${target.base}${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              // The visible label is contained in the accessible name, so this
              // adds context for a screen reader without breaking voice control.
              aria-label={`Ask ${target.label} for a summary of ${SITE_NAME}`}
              className="rf-nav-link"
            >
              {target.label}
            </a>
            {/* Scoped to the `li`, not the span — the span is always the last
                child of its own item, so a bare `last:` would hide every
                separator rather than only the trailing one. */}
            <span aria-hidden="true" className="text-rf-line group-last:hidden">
              &middot;
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
