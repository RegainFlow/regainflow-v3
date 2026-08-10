"use client";

import { useEffect, useRef } from "react";

import type { RfEvent } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

/**
 * Counts an event that has no click behind it.
 *
 * The delegated listener in `instrumentation-client.ts` handles everything that
 * is a click on an element, which is nearly everything. This covers the one case
 * it structurally cannot: arriving somewhere is the event. `/contact/thanks` is
 * reached only by a submission that was written, so the page view *is* the
 * conversion.
 *
 * The ref guards React's development double-invoke of effects, which would
 * otherwise count every submission twice in local testing and make the
 * production number look like a regression.
 */
export default function TrackOnMount({
  event,
  properties,
}: {
  event: RfEvent;
  properties?: Record<string, string>;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, properties);
  }, [event, properties]);

  return null;
}
