import type { Metadata } from "next";
import Link from "next/link";

import NewsletterSignup from "@/components/NewsletterSignup";
import PageHeader from "@/components/PageHeader";
import TrackOnMount from "@/components/TrackOnMount";
import { RF_EVENTS } from "@/lib/analytics/events";

export const metadata: Metadata = {
  title: "Subscription",
  robots: { index: false, follow: false },
};

type Search = { state?: string | string[] };

/**
 * Where a confirmation lands. `?state=expired` covers an unknown, used or
 * stale link without saying which; `?state=error` is our failure, not theirs.
 */
export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { state } = await searchParams;

  if (state === "expired" || state === "error") {
    return (
      <>
        <PageHeader
          eyebrow="Newsletter"
          title={
            state === "error"
              ? "That did not go through on our end."
              : "That link has expired or was already used."
          }
          lead={
            state === "error"
              ? "Nothing was changed. Press the link in your email again in a minute, or sign up again below."
              : "If you already confirmed, you are subscribed and there is nothing to do. Otherwise, sign up again and we will send a fresh link."
          }
        />
        <section className="rf-section">
          <div className="rf-shell py-14 md:py-18 max-w-[44rem]">
            <NewsletterSignup source="newsletter_retry" />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <TrackOnMount event={RF_EVENTS.newsletterConfirmed} />

      <PageHeader
        eyebrow="Newsletter"
        title="You are subscribed."
        lead="New posts and reports will arrive as they are published. Every issue has a one-click unsubscribe."
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <Link href="/insights/blog" className="rf-nav-link">
            Read the latest posts &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
