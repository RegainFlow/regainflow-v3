import { CONFIRM_WINDOW_DAYS } from "@/lib/content/newsletter";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/**
 * Outbound mail via Resend: contact notifications and the newsletter opt-in.
 *
 * The account is held directly with Resend — not through a reseller or an
 * integration — so `RESEND_API_KEY` is pasted from resend.com. `RESEND_FROM` has
 * to be an address on a domain verified there; the sandbox sender only delivers
 * to the account owner, so a real `from` is what makes this work for anyone else.
 *
 * Called over `fetch` rather than through the `resend` SDK. This is one POST to
 * one endpoint, and the site ships five runtime dependencies; a package to build
 * a JSON body is not worth being the sixth. It also means this module has no
 * host-specific binding of any kind — moving the site off Vercel would not touch
 * this file.
 *
 * **Sending is best-effort and must stay that way.** The Supabase row is the
 * durable record. A lead that arrived and was not emailed is sitting in a table
 * we can query; a lead rejected because Resend was down is gone. Every function
 * here therefore reports failure by returning rather than throwing.
 */

const ENDPOINT = "https://api.resend.com/emails";

export interface ContactSubmission {
  name: string;
  email: string;
  organization?: string;
  message: string;
  source?: string;
}

/** Plain text, not HTML. This is an internal notification, not a campaign. */
function body(submission: ContactSubmission): string {
  const lines = [
    `From:         ${submission.name} <${submission.email}>`,
    `Organization: ${submission.organization || "—"}`,
    `Page:         ${submission.source || "—"}`,
    "",
    submission.message,
    "",
    "—",
    `Reply directly to this message to answer ${submission.name}.`,
  ];

  return lines.join("\n");
}

export async function notifyContact(
  submission: ContactSubmission,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!key || !from) {
    console.warn(
      "[mail] RESEND_API_KEY or RESEND_FROM unset — contact notification skipped. The submission was still recorded.",
    );
    return;
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} site <${from}>`,
        to: [CONTACT_EMAIL],
        // So hitting reply in the inbox answers the person who wrote in, rather
        // than the sending domain. The whole point of the notification.
        reply_to: submission.email,
        subject: `${submission.name}${submission.organization ? ` · ${submission.organization}` : ""}`,
        text: body(submission),
      }),
    });

    if (!response.ok) {
      console.error(
        `[mail] Resend rejected the notification: ${response.status} ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("[mail] Resend request failed", error);
  }
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

const CONTACTS_ENDPOINT = "https://api.resend.com/contacts";

/**
 * The double opt-in mail. Plain text, one link, nothing else.
 *
 * The link opens a page with a confirm button rather than confirming on load.
 * Corporate and government mail gateways (Outlook Safe Links, Mimecast) fetch
 * every link in an inbound message to scan it, and a GET that confirmed would
 * sign up everyone whose gateway scans, whether they meant to subscribe or not.
 */
export async function sendNewsletterConfirm(
  email: string,
  confirmUrl: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!key || !from) {
    console.warn(
      "[mail] RESEND_API_KEY or RESEND_FROM unset — newsletter confirmation skipped. The pending row was still recorded.",
    );
    // Without mail, a local signup could never be confirmed. A link back to a
    // local server goes to the console so it can be opened by hand; nothing
    // that points at a real deployment is ever printed.
    if (/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(confirmUrl)) {
      console.warn(`[mail] local confirmation link: ${confirmUrl}`);
    }
    return;
  }

  const text = [
    `Someone, hopefully you, asked to get the ${SITE_NAME} newsletter at this address.`,
    "",
    "Confirm here:",
    confirmUrl,
    "",
    `The link works for ${CONFIRM_WINDOW_DAYS} days. If this wasn't you, ignore this email and nothing will be sent.`,
  ].join("\n");

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <${from}>`,
        to: [email],
        subject: `Confirm your ${SITE_NAME} newsletter subscription`,
        text,
      }),
    });

    if (!response.ok) {
      console.error(
        `[mail] Resend rejected the newsletter confirmation: ${response.status} ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("[mail] Resend request failed", error);
  }
}

/**
 * Adds a confirmed subscriber to Resend's contacts, in the newsletter segment
 * when `RESEND_SEGMENT_ID` is set. Resend then owns sending and unsubscribes.
 *
 * Best-effort like everything here: the confirmed row in
 * `newsletter_subscribers` is the record, and a contact that failed to sync
 * can be added from it later. An address Resend already holds comes back as an
 * error and is logged, not retried.
 */
export async function addNewsletterContact(email: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.warn(
      "[mail] RESEND_API_KEY unset — newsletter contact not synced. The confirmed row was still recorded.",
    );
    return;
  }

  const segment = process.env.RESEND_SEGMENT_ID;

  try {
    const response = await fetch(CONTACTS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        ...(segment ? { segments: [{ id: segment }] } : {}),
      }),
    });

    if (!response.ok) {
      console.error(
        `[mail] Resend did not add the newsletter contact: ${response.status} ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("[mail] Resend request failed", error);
  }
}
