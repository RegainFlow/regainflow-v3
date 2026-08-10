import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The one Supabase client on this site, and it is server-only.
 *
 * It holds the **secret key** (`sb_secret_…`, Supabase's replacement for the
 * legacy `service_role` key), which carries `BYPASSRLS` and therefore skips
 * every row-level security policy. Nothing in `components/` may import this
 * module — the boundary is enforced by the `"use server"` action files being its
 * only callers, and by the key having no `NEXT_PUBLIC_` prefix, so a client
 * bundle referencing it would read `undefined` rather than leak it.
 *
 * There is deliberately no publishable key here and no browser client anywhere.
 * The site never queries Supabase from the client: forms post to Server Actions,
 * and the report PDFs are public storage objects that need no key to fetch. A
 * publishable key would be an unused credential shipped to every visitor.
 *
 * Constructed lazily rather than at module scope on purpose. `next build`
 * evaluates every imported module while prerendering, so a top-level
 * `createClient` would make a checkout without credentials fail the build
 * instead of failing the one form submission that actually needs them.
 */

let client: SupabaseClient | null = null;

/** Thrown rather than returned: every caller treats missing config as a bug. */
export class SupabaseConfigError extends Error {
  constructor(missing: string) {
    super(
      `${missing} is not set. Contact and report submissions cannot be recorded. See .env.example.`,
    );
    this.name = "SupabaseConfigError";
  }
}

export function supabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url) throw new SupabaseConfigError("SUPABASE_URL");
  if (!key) throw new SupabaseConfigError("SUPABASE_SECRET_KEY");

  client = createClient(url, key, {
    // No session to persist and no token to refresh — this client is a request
    // handler, not a logged-in user. Left on, `supabase-js` keeps a refresh
    // timer alive in a serverless function that is about to be frozen.
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
