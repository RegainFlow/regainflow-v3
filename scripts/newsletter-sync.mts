/**
 * Copies confirmed newsletter subscribers into Resend.
 *
 * Confirming a subscription adds the address to Resend in the background
 * (`addNewsletterContact` in `lib/mail.ts`), and that call is best-effort: if
 * Resend was down, or the keys were not set yet, the confirmed row is in
 * `newsletter_subscribers` and the contact is not. This puts them back.
 *
 *   pnpm newsletter:sync            list what would be sent, change nothing
 *   pnpm newsletter:sync --apply    add each one to Resend and the segment
 *   pnpm newsletter:sync:prod ...   the same against production (.env)
 *
 * Safe to run more than once. Each address is created as a contact (an
 * existing one is reported and left alone), then added to `RESEND_SEGMENT_ID`,
 * which Resend treats as a no-op when it is already there. It never changes
 * `unsubscribed` on an existing contact, so someone who unsubscribed in Resend
 * stays unsubscribed.
 */

import { requireEnv } from "./case-study/core.mjs";
import { client } from "./case-study/remote.mjs";

const API = "https://api.resend.com";
/** Resend's default limit is two requests a second; each address takes two. */
const PAUSE_MS = 1100;

const apply = process.argv.includes("--apply");

const { data, error } = await client()
  .from("newsletter_subscribers")
  .select("email, confirmed_at")
  .eq("status", "confirmed")
  .order("confirmed_at", { ascending: true });

if (error) throw new Error(`Could not read newsletter_subscribers: ${error.message}`);

const rows = data ?? [];
const target = new URL(requireEnv("SUPABASE_URL")).host;
console.log(`${rows.length} confirmed subscriber(s) in ${target}.`);

if (apply) await sync(rows);
else console.log("Dry run. Re-run with --apply to add them to Resend.");

async function sync(rows: { email: string }[]): Promise<void> {
  const key = requireEnv("RESEND_API_KEY");
  const segment = process.env.RESEND_SEGMENT_ID;
  if (!segment) console.warn("RESEND_SEGMENT_ID is not set: contacts will be created outside any segment.");

  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const tally = { created: 0, existing: 0, segmented: 0, failed: 0 };

  for (const [i, row] of rows.entries()) {
    const created = await fetch(`${API}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email: row.email, unsubscribed: false }),
    });

    if (created.ok) tally.created++;
    else tally.existing++;

    if (segment) {
      const added = await fetch(
        `${API}/contacts/${encodeURIComponent(row.email)}/segments/${segment}`,
        { method: "POST", headers },
      );

      if (added.ok) tally.segmented++;
      else {
        tally.failed++;
        console.error(`  ${i + 1}: not added to the segment: ${added.status} ${await added.text()}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
  }

  console.log(
    `Done. Created ${tally.created}, already in Resend ${tally.existing}, ` +
      `in segment ${tally.segmented}, failed ${tally.failed}.`,
  );
}
