import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/PageHeader";
import TrackOnMount from "@/components/TrackOnMount";
import { RF_EVENTS } from "@/lib/analytics/events";
import { CONFIRM_WINDOW_DAYS } from "@/lib/content/newsletter";

/** Reached only by submitting the signup form, so `noindex`, like `/contact/thanks`. */
export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

export default function NewsletterCheckEmailPage() {
  return (
    <>
      <TrackOnMount event={RF_EVENTS.newsletterSubmitted} />

      <PageHeader
        eyebrow="Newsletter"
        title="Check your email to confirm."
        lead={`We sent a link to the address you gave. Nothing is sent until you confirm, and the link works for ${CONFIRM_WINDOW_DAYS} days. If it is not there in a few minutes, check spam or quarantine.`}
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <Link href="/insights/blog" className="rf-nav-link">
            Back to the blog &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
