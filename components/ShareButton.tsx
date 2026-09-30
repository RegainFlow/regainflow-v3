"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import { RF_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

/**
 * One share control, not a row of network buttons.
 *
 * Chartbeat found no relationship between how much an article is shared and
 * how much it is read, and every network widget is third-party script against
 * INP. So: the native share sheet where the platform has one (phones), and
 * copy-link everywhere else. No counts.
 */
export default function ShareButton({
  title,
  url,
  kind = "blog_post",
}: {
  title: string;
  url: string;
  /** The kind of page, for analytics and the accessible name. */
  kind?: "blog_post" | "report" | "case_study";
}) {
  const noun = kind === "blog_post" ? "post" : kind === "report" ? "report" : "case study";
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Feature detection has to wait for the client; the server renders the
    // copy-link form, which is the right fallback without JS.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className="rf-read-control"
      aria-label={canShare ? `Share this ${noun}` : `Copy link to this ${noun}`}
      onClick={async () => {
        if (canShare) {
          try {
            await navigator.share({ title, url });
            track(RF_EVENTS.pageShared, { method: "native", page: kind });
          } catch {
            // Dismissing the sheet rejects; nothing to do.
          }
          return;
        }

        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          track(RF_EVENTS.pageShared, { method: "copy", page: kind });
        } catch {
          // Clipboard blocked: the URL bar still has it.
        }
      }}
    >
      <Icon name={copied ? "check" : canShare ? "share" : "link"} className="h-4 w-4" />
      <span className="rf-read-control-label" aria-live="polite">
        {copied ? "Copied" : canShare ? "Share" : "Copy link"}
      </span>
    </button>
  );
}
