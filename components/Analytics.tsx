"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { Suspense, useEffect } from "react";

/**
 * PostHog, mounted as narrowly as possible.
 *
 * The reason this exists at all is measurement of AI referrals: traffic sent by
 * ChatGPT, Perplexity, or Claude arrives as ordinary referrer traffic, and until
 * now the site had no instrument of any kind — so there was no way to tell
 * whether `/llm-info`, the structured data, or any of the rest of it did
 * anything. PostHog records `$referrer` and `$referring_domain` by default,
 * which is the whole signal.
 *
 * This is the only client component in the layout. It renders nothing, so it
 * adds a script but no markup and nothing below it is pulled client-side.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * The App Router does not fire a pageview on client-side navigation — the SDK's
 * automatic capture listens for full page loads, so every soft navigation after
 * the first would be invisible. Hence capturing manually on route change with
 * `capture_pageview` turned off, rather than both firing on the initial load.
 */
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!KEY) return;

    const query = searchParams.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  useEffect(() => {
    // Absent in local development and in any environment where the key has not
    // been set. Bailing keeps the console clean rather than initialising an SDK
    // that will fail every request.
    if (!KEY) return;
    // Strict mode runs effects twice in development; re-initialising throws.
    if (posthog.__loaded) return;

    posthog.init(KEY, {
      // Same-origin, via the rewrite in `next.config.ts` — a direct call to
      // posthog.com is blocked by the content blockers a meaningful share of
      // this audience runs, which would bias exactly the measurement this is
      // here to take.
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      // Needed for bounce and time-on-page to mean anything once pageviews are
      // captured by hand.
      capture_pageleave: true,
      // This is a marketing site with no accounts; profiling every anonymous
      // visitor would spend the person allowance on people we can never
      // identify.
      person_profiles: "identified_only",
    });
  }, []);

  if (!KEY) return null;

  return (
    // `useSearchParams` forces the nearest boundary to render on the client;
    // without this Suspense the whole route would opt out of static generation.
    <Suspense fallback={null}>
      <PageViews />
    </Suspense>
  );
}
