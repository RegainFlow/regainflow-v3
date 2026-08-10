import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/PageHeader";
import TrackOnMount from "@/components/TrackOnMount";
import { RF_EVENTS } from "@/lib/analytics/events";
import { CAPABILITY_STATEMENT_HREF } from "@/lib/site";

/**
 * `noindex`, and it has no `pageMetadata` call for the same reason: this page is
 * reachable only by having submitted the form, so a canonical URL and an OG card
 * would be advertising a destination nobody should arrive at cold.
 */
export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <>
      {/* The only page on the site reached exclusively by succeeding, which is
          what makes the page view a safe stand-in for the conversion — the
          action redirects, so the form component never observes its own
          success. */}
      <TrackOnMount event={RF_EVENTS.contactSubmitted} />

      <PageHeader
        eyebrow="Message sent"
        title="We have it. You will hear back."
        lead="One of the two founders reads every message that comes in — there is no queue and no one it gets passed to. Expect a reply within one business day."
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <h2 className="rf-h3">While you wait</h2>

          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <Link href="/insights" className="rf-nav-link">
                Selected work &rarr;
              </Link>
            </li>
            <li>
              <Link href="/services#assessment" className="rf-nav-link">
                What the free assessment covers &rarr;
              </Link>
            </li>
            <li>
              <a
                href={CAPABILITY_STATEMENT_HREF}
                className="rf-nav-link"
                target="_blank"
                rel="noopener noreferrer"
                data-rf-event={RF_EVENTS.capabilityStatementOpened}
              >
                Capability statement (PDF) &#8599;
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
