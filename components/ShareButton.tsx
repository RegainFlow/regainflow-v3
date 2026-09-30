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
export default function ShareButton({ title, url }: { title: string; url: string }) {
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
      aria-label={canShare ? "Share this post" : "Copy link to this post"}
      onClick={async () => {
        if (canShare) {
          try {
            await navigator.share({ title, url });
            track(RF_EVENTS.blogPostShared, { method: "native" });
          } catch {
            // Dismissing the sheet rejects; nothing to do.
          }
          return;
        }

        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          track(RF_EVENTS.blogPostShared, { method: "copy" });
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
