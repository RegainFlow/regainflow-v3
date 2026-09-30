"use server";

import { createHash } from "node:crypto";

import { redirect } from "next/navigation";
import { after } from "next/server";

import { CONFIRM_WINDOW_DAYS } from "@/lib/content/newsletter";
import { addNewsletterContact } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

/**
 * Confirms the subscription the token belongs to, then adds the address to
 * Resend. Posted from the confirm page's button, never run on a GET; see
 * `sendNewsletterConfirm` for why.
 *
 * An unknown, used or expired token lands on the expired state, which offers
 * to sign up again. It does not say which of the three it was.
 */
export async function confirmSubscription(data: FormData): Promise<void> {
  const token = data.get("token");
  if (typeof token !== "string" || token.length < 20 || token.length > 100) {
    redirect("/newsletter/confirmed?state=expired");
  }

  const since = new Date(Date.now() - CONFIRM_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  let email: string | null = null;

  try {
    const { data: row, error } = await supabase()
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirm_token_hash: null,
      })
      .eq("confirm_token_hash", createHash("sha256").update(token).digest("hex"))
      .eq("status", "pending")
      .gte("token_sent_at", since)
      .select("email")
      .maybeSingle();

    if (error) throw new Error(error.message);
    email = row?.email ?? null;
  } catch (error) {
    console.error("[newsletter] confirmation failed", error);
    redirect("/newsletter/confirmed?state=error");
  }

  if (!email) redirect("/newsletter/confirmed?state=expired");

  after(addNewsletterContact(email));
  redirect("/newsletter/confirmed");
}
