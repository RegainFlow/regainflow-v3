import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";

import { confirmSubscription } from "./actions";

export const metadata: Metadata = {
  title: "Confirm your subscription",
  robots: { index: false, follow: false },
};

type Search = { token?: string | string[] };

/**
 * The page the confirmation email links to. It confirms nothing on load: mail
 * gateways fetch every link in a message, so the reader presses a button and
 * that POST confirms. The token rides along in a hidden field.
 */
export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { token } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Newsletter"
        title="One click to confirm."
        lead="Confirm and you will get new posts and reports by email as they are published. Every issue has a one-click unsubscribe."
      />

      <section className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <form action={confirmSubscription}>
            <input type="hidden" name="token" value={typeof token === "string" ? token : ""} />
            <button type="submit" className="rf-cta-primary">
              Confirm subscription
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
