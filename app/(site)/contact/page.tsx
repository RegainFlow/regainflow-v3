import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { RF_EVENTS } from "@/lib/analytics/events";
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import {
  FREE_ASSESSMENT_CTA,
  FREE_ASSESSMENT_HREF,
  CONTACT_EMAIL,
  CONTACT_HREF,
  LOCATION,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell RegainFlow what you are trying to move into production. We reply to everything, usually within one business day — or book a call directly.",
  path: "/contact",
});

/**
 * The canonical contact route.
 *
 * It replaced a `mailto:` that opened a client many visitors in this audience do
 * not have configured and left no record anywhere we could query. The booking
 * link is still here, and still the primary conversion — the form is for the
 * visitor who is not ready to put something in a calendar.
 *
 * Statically rendered. The Server Action behind the form is a POST to this same
 * route; nothing here reads `cookies()` or `searchParams`, so the page itself
 * stays prerendered and cacheable.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Bring us your ambitions."
        lead="We will help you clarify where to focus, what it will take, and whether RegainFlow is the right partner for it."
      />

      <section className="rf-section">
        <div className="rf-shell rf-grid gap-y-14 py-14 md:py-18">
          <div className="col-span-full lg:col-span-6">
            <ContactForm source="/contact" />
          </div>

          <div className="col-span-full lg:col-span-4 lg:col-start-9">
            <p className="rf-eyebrow">Or skip the form</p>
            <h2 className="rf-h3 mt-5 max-w-[24ch]">
              Put thirty minutes on the calendar instead.
            </h2>
            <p className="rf-body mt-4 max-w-[38ch]">
              Same conversation, sooner. No preparation needed on your side.
            </p>

            <div className="mt-7">
              <a
                href={FREE_ASSESSMENT_HREF}
                className="rf-cta-secondary"
                data-rf-event={RF_EVENTS.bookingClicked}
                data-rf-location="contact_page"
              >
                {FREE_ASSESSMENT_CTA}
              </a>
            </div>

            {/* The address, still as a fact and still clickable. The form is the
                route we ask for; this is the one a visitor who only trusts
                their own mail client will use anyway. */}
            <dl className="mt-12">
              <dt className="rf-utility border-t border-rf-hairline pt-4">
                Email
              </dt>
              <dd className="rf-body mt-2 break-words">
                <a
                  href={CONTACT_HREF}
                  className="rf-text-link"
                  data-rf-event={RF_EVENTS.contactClicked}
                  data-rf-location="contact_page"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>

              <dt className="rf-utility mt-8 border-t border-rf-hairline pt-4">
                Location
              </dt>
              <dd className="rf-body mt-2">{LOCATION}</dd>
            </dl>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd("Contact", "/contact")),
        }}
      />
    </>
  );
}
