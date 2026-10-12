import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/**
 * What the site collects and why, in plain words.
 *
 * A first version written from the code, not from counsel: every statement here
 * describes something the site actually does (the forms in `app/(site)/**`
 * actions, PostHog in `instrumentation-client.ts`, Resend in `lib/mail.ts`).
 * Change the code and this page has to change with it.
 *
 * `noindex` until the owners have reviewed the wording. It is linked from the
 * footer and from every signup, which is the part that matters now.
 */
export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What the RegainFlow site collects when you contact us, download a report or subscribe to the newsletter, why, and how to have it removed.",
  path: "/privacy",
  noindex: true,
});

/** Shown on the page. Change it whenever the wording changes. */
const UPDATED = "2026-10-12";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "The contact form: your name, email, organization if you give it, your message, and the page you sent it from.",
      "A report download: your email, your name if you give it, and which report you opened.",
      "The newsletter: your email, the page you signed up from, and when you confirmed.",
      "With each of these, a one-way hash of your IP address, used only to slow down floods of automated submissions. We never store the address itself.",
    ],
  },
  {
    heading: "The newsletter",
    body: [
      "Signing up sends a confirmation link. Nothing else is sent until you click it, and an unconfirmed signup expires after seven days.",
      "Once confirmed, we email new posts and reports when they are published, and nothing else. Every email has a one-click unsubscribe.",
      "Ticking the box on a report download is the same signup, with the same confirmation step. Leaving it unticked never subscribes you.",
    ],
  },
  {
    heading: "Analytics",
    body: [
      "We use PostHog to see which pages are read and which links are used. Visitors are not identified by name or email, except when you submit a report download, which links that visit to the address you gave.",
      "Session recording is off. We do not use advertising trackers and do not sell or share data with advertisers.",
    ],
  },
  {
    heading: "Who processes it",
    body: [
      "Submissions are stored in our Supabase database. Email is sent through Resend, which also holds the newsletter list and handles unsubscribes. Analytics go to PostHog. The site is hosted on Vercel.",
      "We do not pass your details to anyone else.",
    ],
  },
  {
    heading: "Removal and questions",
    body: [
      `Email ${CONTACT_EMAIL} to ask what we hold about you or to have it deleted. One of the founders reads every message.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect, and why."
        lead={`${SITE_NAME} collects only what you type into a form on this site, plus anonymous analytics. Here is each piece and what it is used for.`}
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <div className="flex max-w-[64ch] flex-col gap-12">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2 className="rf-h3">{section.heading}</h2>
                {section.body.map((line) => (
                  <p key={line} className="rf-body mt-4">
                    {line}
                  </p>
                ))}
              </div>
            ))}

            <p className="rf-utility">
              Last updated <time dateTime={UPDATED}>{UPDATED}</time>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
