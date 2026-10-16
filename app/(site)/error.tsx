"use client";

import Link from "next/link";

import { RF_EVENTS } from "@/lib/analytics/events";

/**
 * A page in the site group that threw while rendering. The detail pages do
 * this on purpose when Supabase is unreachable (a 500 is retried by a crawler;
 * a 404 would de-index a live page), so this is a page a real visitor can
 * reach, and the framework default gives them nothing to do.
 *
 * A client component because Next requires it of an error boundary. It renders
 * inside the site layout, so the header and footer are already there.
 */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="rf-section">
      <div className="rf-shell rf-band-lead">
        <p className="rf-eyebrow">Something went wrong</p>
        <h1 className="rf-h1 mt-5 max-w-[18ch]">This page did not load.</h1>
        <p className="rf-body mt-6 max-w-[52ch]">
          The problem is on our side and is usually brief. Try again, or go
          back to the home page.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" className="rf-cta-primary" onClick={reset}>
            Try again
          </button>
          <Link
            href="/"
            className="rf-cta-secondary"
            data-rf-event={RF_EVENTS.secondaryClicked}
            data-rf-location="error_page"
          >
            Home page
          </Link>
        </div>
      </div>
    </section>
  );
}
