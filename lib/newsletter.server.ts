import "server-only";

import { after } from "next/server";

import { requestOrigin } from "@/lib/forms.server";
import { sendNewsletterConfirm } from "@/lib/mail";
import { requestSubscription, type SubscriberStore } from "@/lib/newsletter";
import { SITE_URL } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export const NEWSLETTER_TABLE = "newsletter_subscribers";

/** `newsletter_subscribers` through the secret-key client. */
const store: SubscriberStore = {
  async status(email) {
    const { data, error } = await supabase()
      .from(NEWSLETTER_TABLE)
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data?.status ?? null;
  },

  async savePending(row) {
    const { error } = await supabase()
      .from(NEWSLETTER_TABLE)
      .upsert(row, { onConflict: "email" });

    if (error) throw new Error(error.message);
  },
};

/**
 * Records a pending signup and mails the confirmation link after the response
 * (see `lib/newsletter.ts` for the rule). Throws when the row could not be
 * written; the mail itself is best-effort, like everything in `lib/mail.ts`.
 *
 * The link points at the origin the request arrived on, so a signup on a
 * preview deployment or `localhost` confirms against that database.
 */
export async function startSubscription(input: {
  email: string;
  source: string | null;
  ipHash: string | null;
}): Promise<void> {
  const request = await requestSubscription(input, store);
  if (request.kind !== "mail") return;

  const origin = await requestOrigin(SITE_URL);
  const link = `${origin}/newsletter/confirm?token=${request.token}`;
  after(sendNewsletterConfirm(request.email, link));
}
