import { AI_GLYPHS, type AiGlyph } from "@/components/brand/ai-glyphs";
import { RF_EVENTS } from "@/lib/analytics/events";
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
 */

interface AiTarget {
  label: string;
  /** Everything up to and including `=`; the encoded prompt is appended. */
  base: string;
  glyph: AiGlyph;
}

/**
 * None of these query parameters are officially documented — they are observed
 * behaviour, and any vendor can drop one in a release without saying so. This
 * list is therefore the conservative set: the four whose `?q=` handling is
 * widely relied on. Grok (`grok.com/?q=`) and Copilot
 * (`copilot.microsoft.com/?q=`) were left out for want of the same confidence.
 *
 * Re-check these periodically by clicking each. A target that stops prefilling
 * should be deleted from this array, not patched around.
 */
const AI_TARGETS: AiTarget[] = [
  {
    label: "ChatGPT",
    base: "https://chatgpt.com/?q=",
    glyph: AI_GLYPHS.chatgpt,
  },
  { label: "Claude", base: "https://claude.ai/new?q=", glyph: AI_GLYPHS.claude },
  {
    label: "Perplexity",
    base: "https://www.perplexity.ai/search?q=",
    glyph: AI_GLYPHS.perplexity,
  },
  {
    // Google's AI Mode (`udm=50`) rather than `gemini.google.com/app?q=`, which
    // is widely reported not to prefill. AI Mode is the same Gemini models
    // reached through plain search parameters, which also makes it the most
    // durable entry here — so it carries the Gemini mark.
    label: "Gemini",
    base: "https://www.google.com/search?udm=50&q=",
    glyph: AI_GLYPHS.gemini,
  },
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

/** Box the marks are drawn in. The published paths are all on a 24 grid. */
const GRID = 24;

const round = (n: number) => Number(n.toFixed(3));

export default function AskAi() {
  const encoded = encodeURIComponent(PROMPT);

  // No rule and no top margin of its own: this sits inside the footer's closing
  // block, which already carries the only divider down here. Giving it a second
  // one fenced it off as a separate widget rather than part of the footer.
  return (
    <div>
      <p className="rf-utility">Ask AI about {SITE_NAME}</p>

      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {AI_TARGETS.map((target) => {
          // Scaling the viewBox rather than the element keeps every icon in an
          // identically sized box — so the row's spacing stays even while the
          // ink inside it is optically matched. Rounded because the arithmetic
          // is binary floating point and `1.4400000000000013` would otherwise
          // ship in the markup.
          const inset = round((GRID * ((target.glyph.scale ?? 1) - 1)) / 2);
          const extent = round(GRID + inset * 2);

          return (
            <li key={target.label}>
              <a
                href={`${target.base}${encoded}`}
                target="_blank"
                rel="noopener noreferrer"
                data-rf-event={RF_EVENTS.askAiClicked}
                data-rf-assistant={target.label}
                className="rf-ai-link"
              >
                <svg
                  viewBox={`${-inset} ${-inset} ${extent} ${extent}`}
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={target.glyph.d} />
                </svg>
                {/* The marks carry no accessible name of their own, and an
                    `aria-label` on the anchor would leave voice control with
                    nothing to match. Real text, visually hidden. */}
                <span className="sr-only">
                  Ask {target.label} for a summary of {SITE_NAME}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
