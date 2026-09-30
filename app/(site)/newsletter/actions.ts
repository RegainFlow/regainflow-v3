"use server";

import { createHash, randomBytes } from "node:crypto";

import { redirect } from "next/navigation";
import { after } from "next/server";

import { RATE_LIMIT_MESSAGE, isBot, readEmail, type FormState } from "@/lib/forms";
import { ipHash, isRateLimited, requestOrigin } from "@/lib/forms.server";
import { sendNewsletterConfirm } from "@/lib/mail";
import { SITE_URL } from "@/lib/site";
import { supabase } from "@/lib/supabase";

const TABLE = "newsletter_subscribers";
const DONE = "/newsletter/check-email";

/**
 * The newsletter signup. Same order as `submitContact`, and for the same
 * reasons: honeypot, validation, rate limit, write, then mail in `after()`.
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

  const email = parsed.email.toLowerCase();
  const hash = await ipHash();

  if (await isRateLimited(TABLE, hash)) {
    return { status: "error", errors: {}, formError: RATE_LIMIT_MESSAGE };
  }

  const raw = data.get("source");
  const source = typeof raw === "string" && raw ? raw.slice(0, 200) : null;

  // The raw token goes in the email and nowhere else; the row keeps its hash.
  const token = randomBytes(32).toString("base64url");
  let send = false;

  try {
    const { data: existing, error: readError } = await supabase()
      .from(TABLE)
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (readError) throw new Error(readError.message);

    if (existing?.status !== "confirmed") {
      const { error } = await supabase()
        .from(TABLE)
        .upsert(
          {
            email,
            status: "pending",
            confirm_token_hash: createHash("sha256").update(token).digest("hex"),
            token_sent_at: new Date().toISOString(),
            source,
            ip_hash: hash,
          },
          { onConflict: "email" },
        );

      if (error) throw new Error(error.message);
      send = true;
    }
  } catch (error) {
    console.error("[newsletter] signup not recorded", error);
    return {
      status: "error",
      errors: {},
      formError: "Something went wrong on our end and you were not subscribed. Please try again in a minute.",
    };
  }

  if (send) {
    const origin = await requestOrigin(SITE_URL);
    after(sendNewsletterConfirm(email, `${origin}/newsletter/confirm?token=${token}`));
  }

  redirect(DONE);
}
