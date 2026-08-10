import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/**
 * Outbound notification mail, via Resend.
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
