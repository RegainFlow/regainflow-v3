import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { supabase } from "@/lib/supabase";

/**
 * The server-only half of the form handling: who submitted, and how often.
 *
 * Split from `lib/forms.ts` because that module is imported by the client
 * components that render the inputs, and `node:crypto` and `next/headers`
 * cannot follow them into the browser. `server-only` makes that a build error
 * with a useful message rather than a confusing bundler failure, if anyone ever
 * imports this from the wrong side.
 */

const RATE_WINDOW_MINUTES = 10;
const RATE_MAX = 3;

/**
 * A stable, non-reversible identifier for one submitter.
 *
 * The raw address is never stored. `x-forwarded-for` is a list when the request
 * crossed more than one proxy, and the client is the first entry.
 *
 * Returns null without `RF_IP_SALT` rather than hashing an unsalted address,
 * because an unsalted IP hash is an IP — the space is small enough to
 * enumerate. Callers treat null as "cannot identify", never as a rejection.
 */
export async function ipHash(): Promise<string | null> {
  const salt = process.env.RF_IP_SALT;
  if (!salt) return null;

  const list = (await headers()).get("x-forwarded-for");
  const ip = list?.split(",")[0]?.trim();
  if (!ip) return null;

  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

/**
 * True when this address has already spent its allowance in the window.
 *
 * Counted in Postgres rather than in memory: a serverless function is a fresh
 * process often enough that an in-process Map would be a rate limiter in name
 * only.
 *
 * **Any failure returns false.** The limiter exists to blunt a flood, and
 * refusing a genuine message because a count query failed is the worse of the
 * two outcomes by a wide margin.
 */
export async function isRateLimited(
  table: string,
  hash: string | null,
): Promise<boolean> {
  if (!hash) return false;

  const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60 * 1000).toISOString();

  try {
    const { count, error } = await supabase()
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", hash)
      .gte("created_at", since);

    if (error) return false;
    return (count ?? 0) >= RATE_MAX;
  } catch {
    return false;
  }
}

/**
 * The origin this request arrived on, for links mailed back to the submitter.
 * A confirmation link sent from a preview deployment or `localhost` has to
 * point there, not at production, or it confirms against a different
 * database. Falls back to the canonical site when the headers say nothing.
 */
export async function requestOrigin(fallback: string): Promise<string> {
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host");
  if (!host) return fallback;

  const local = /^(localhost|127\.0\.0\.1|[\w-]+\.localhost)(:\d+)?$/.test(host);
  const proto = list.get("x-forwarded-proto") ?? (local ? "http" : "https");
  return `${proto}://${host}`;
}
