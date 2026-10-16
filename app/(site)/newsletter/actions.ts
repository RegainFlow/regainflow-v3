"use server";

import { redirect } from "next/navigation";

import { RATE_LIMIT_MESSAGE, isBot, readEmail, type FormState } from "@/lib/forms";
import { ipHash, isRateLimited } from "@/lib/forms.server";
import { cleanSource } from "@/lib/newsletter";
import { NEWSLETTER_TABLE, startSubscription } from "@/lib/newsletter.server";

const DONE = "/newsletter/check-email";

/**
 * The newsletter signup. Same order as `submitContact`, and for the same
 * reasons: honeypot, validation, rate limit, write, then mail in `after()`.
 * The write and the mail are `startSubscription`, shared with the report
 * gate's opt-in box.
 *
 * Every outcome a visitor could use to learn about someone else's address
 * looks the same from outside: a new address, a pending one and an already
 * confirmed one all land on "check your email". Only a new or pending address
 * actually gets mail, so this cannot be used to spam a confirmed subscriber.
 *
 * The one export, because every export of a `"use server"` module is an
 * endpoint.
 */
export async function subscribe(_previous: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) redirect(DONE);

  const parsed = readEmail(data);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };

  const hash = await ipHash();

  if (await isRateLimited(NEWSLETTER_TABLE, hash)) {
    return { status: "error", errors: {}, formError: RATE_LIMIT_MESSAGE };
  }

  try {
    await startSubscription({
      email: parsed.email,
      source: cleanSource(data.get("source")),
      ipHash: hash,
    });
  } catch (error) {
    console.error("[newsletter] signup not recorded", error);
    return {
      status: "error",
      errors: {},
      formError: "Something went wrong on our end and you were not subscribed. Please try again in a minute.",
    };
  }

  redirect(DONE);
}
