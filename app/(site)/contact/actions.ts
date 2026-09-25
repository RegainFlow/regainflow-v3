"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import {
  RATE_LIMIT_MESSAGE,
  isBot,
  readContact,
  type FormState,
} from "@/lib/forms";
import { ipHash, isRateLimited } from "@/lib/forms.server";
import { notifyContact } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

const TABLE = "contact_submissions";

/**
 * The contact form.
 *
 * Order matters and is the security model: honeypot, then validation, then rate
 * limit, then write. The cheap checks run before anything touches the network,
 * so bot traffic costs one string comparison each rather than a Postgres round
 * trip each.
 *
 * `redirect()` on success rather than a returned state. That is what makes the
 * form work with JavaScript disabled — the browser's native POST gets a 303 to a
 * static page, and the reader sees a confirmation instead of a blank response.
 * `redirect` throws internally, so it must sit outside any try/catch.
 *
 * Every export from a `"use server"` module is a client-callable endpoint, which
 * is why this file exports exactly one thing. Shared constants live in
 * `lib/forms.ts`.
 */
export async function submitContact(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  // Silently accepted, never written. See `isBot`.
  if (isBot(data)) redirect("/contact/thanks");

  const parsed = readContact(data);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };

  const { fields } = parsed;
  const hash = await ipHash();

  if (await isRateLimited(TABLE, hash)) {
    return { status: "error", errors: {}, formError: RATE_LIMIT_MESSAGE };
  }

  const raw = data.get("source");
  const source = typeof raw === "string" && raw ? raw : null;

  try {
    const { error } = await supabase().from(TABLE).insert({
      name: fields.name,
      email: fields.email,
      organization: fields.organization || null,
      message: fields.message,
      source,
      ip_hash: hash,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    // The one failure the reader has to be told about: nothing was recorded, so
    // "thank you" would be a lie. The address on /company is still live.
    console.error("[contact] submission not recorded", error);
    return {
      status: "error",
      errors: {},
      formError:
        "Something went wrong on our end and your message was not saved. Please email contact@regainflow.com directly.",
    };
  }

  // Deliberately after the write, and deliberately not awaited on the response
  // path: `after()` runs it once the response is committed, so the submitter
  // never waits on a Resend round trip to see the confirmation. Resend being
  // *slow* — not down, slow — would otherwise degrade the conversion this page
  // exists for.
  //
  // `after()` rather than a bare floating promise, because a serverless function
  // can be frozen the moment it responds and would take an un-awaited request
  // down with it. Nothing depends on the result either way: `notifyContact`
  // swallows its own failures, and a lead in the table with no mail sent is
  // recoverable, while a lead rejected because Resend was down is not.
  after(
    notifyContact({
      name: fields.name,
      email: fields.email,
      organization: fields.organization || undefined,
      message: fields.message,
      source: source ?? undefined,
    }),
  );

  redirect("/contact/thanks");
}
