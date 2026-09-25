"use server";

import { getReport } from "@/lib/reports.server";
import { RATE_LIMIT_MESSAGE, isBot, readEmail, type FormState } from "@/lib/forms";
import { ipHash, isRateLimited } from "@/lib/forms.server";
import { supabase } from "@/lib/supabase";

const TABLE = "report_leads";

/**
 * The report gate.
 *
 * Unlike the contact form this returns rather than redirects, because the caller
 * has to stay on the page it unlocked — the reveal happens in place. That is
 * also why `components/ReportGate` ships a `<noscript>` link: the returned state
 * is the JavaScript path, and this site's floor is that content is there when
 * JavaScript is not.
 *
 * The reports sit in a **public** bucket, so this captures a lead; it does not
 * control access. Nothing here mints a URL or checks one, and it must stay that
 * way — a gate that looks like access control but is not is worse than one that
 * is honestly a courtesy ask.
 */
export async function captureReader(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  const slugValue = data.get("report");
  const slug = typeof slugValue === "string" ? slugValue : "";

  // The slug decides which report the row is attributed to, and it arrives from
  // the client. Checked against the table so a tampered field cannot write a row
  // for a report that does not exist — and, since `getReport` filters on
  // `published`, cannot attribute a lead to a draft either.
  //
  // `getReport` throws when the *fetch* failed rather than when the report is
  // missing, and those must not collapse here. Treating an outage as "no such
  // report" would leave the gate locked over a Supabase blip — the same thing
  // the upsert below refuses to do, for the reason stated there: the document is
  // public and the reader came for it. A tampered slug is still rejected; only
  // our own failure is forgiven.
  let known = true;

  try {
    known = (await getReport(slug)) !== null;
  } catch (error) {
    console.error("[report gate] slug not validated", error);
  }

  if (!known) {
    return { status: "error", errors: {}, formError: "That report could not be found." };
  }

  const parsed = readEmail(data);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };

  // Checked *after* validation, deliberately: a trapped submission then returns
  // the byte-identical response a genuine one does, and no row is written. The
  // earlier ordering could return `{ ok, email: "" }`, which the client could
  // not act on — so the gate stayed visibly locked and told the bot it had been
  // caught. A malformed submission still gets an ordinary validation error,
  // which reveals nothing about the trap.
  //
  // Revealing the link to a bot costs nothing: the file is public either way.
  if (isBot(data)) return { status: "ok", email: parsed.email };

  const hash = await ipHash();

  if (await isRateLimited(TABLE, hash)) {
    return { status: "error", errors: {}, formError: RATE_LIMIT_MESSAGE };
  }

  try {
    // `ignoreDuplicates` against the `(email, report_slug)` uniqueness in
    // `supabase/migrations/`. The unlock is remembered in `localStorage`, so the
    // same reader on a second device lands here again — `created_at` has to keep
    // meaning first touch, and nobody may be told their email "already exists"
    // for asking twice.
    //
    // Lower-cased on the way in, because that constraint is on the raw column:
    // PostgREST's `on_conflict` names columns and cannot target a functional
    // index, so normalizing here is what makes the dedupe work at all.
    const { error } = await supabase()
      .from(TABLE)
      .upsert(
        {
          email: parsed.email.toLowerCase(),
          report_slug: slug,
          name: parsed.name || null,
          ip_hash: hash,
        },
        { onConflict: "email,report_slug", ignoreDuplicates: true },
      );

    if (error) throw new Error(error.message);
  } catch (error) {
    // Logged, not surfaced. The document is public and the reader came for it;
    // refusing them because our lead capture failed would be charging them for
    // our outage. We lose the row and say nothing.
    console.error("[report gate] lead not recorded", error);
  }

  return { status: "ok", email: parsed.email };
}
