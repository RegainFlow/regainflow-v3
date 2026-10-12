import { createHash, randomBytes } from "node:crypto";

/**
 * The newsletter's double opt-in request, shared by every form that can sign
 * someone up: the signup block (`app/(site)/newsletter/actions.ts`) and the
 * report gate's opt-in box (`app/(site)/insights/reports/actions.ts`).
 *
 * Storage is passed in rather than imported, so the decision can be tested
 * without a database. `lib/newsletter.server.ts` supplies the Supabase store
 * and sends the mail.
 *
 * The rule: a new or pending address gets a fresh pending row and a fresh
 * link; a confirmed address gets nothing, so a form cannot be used to mail a
 * subscriber over and over. Callers show the same "check your email" either
 * way, so the outcome does not reveal whether an address is subscribed.
 */

export interface PendingRow {
  email: string;
  status: "pending";
  confirm_token_hash: string;
  token_sent_at: string;
  source: string | null;
  ip_hash: string | null;
}

export interface SubscriberStore {
  /** The address's current status, or null when it has never signed up. Throws on failure. */
  status(email: string): Promise<"pending" | "confirmed" | null>;
  /** Insert or replace the row for `row.email`. Throws on failure. */
  savePending(row: PendingRow): Promise<void>;
}

export type SubscriptionRequest =
  /** Mail `token` in the confirmation link. The row holds only its hash. */
  | { kind: "mail"; email: string; token: string }
  /** Already confirmed: nothing written, nothing to send. */
  | { kind: "already" };

export function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** `source` is capped and blank becomes null, as the column expects. */
export function cleanSource(source: unknown): string | null {
  return typeof source === "string" && source ? source.slice(0, 200) : null;
}

export async function requestSubscription(
  input: { email: string; source: string | null; ipHash: string | null },
  store: SubscriberStore,
  now: Date = new Date(),
): Promise<SubscriptionRequest> {
  const email = input.email.trim().toLowerCase();

  if ((await store.status(email)) === "confirmed") return { kind: "already" };

  // The raw token goes in the email and nowhere else.
  const token = randomBytes(32).toString("base64url");

  await store.savePending({
    email,
    status: "pending",
    confirm_token_hash: tokenHash(token),
    token_sent_at: now.toISOString(),
    source: input.source,
    ip_hash: input.ipHash,
  });

  return { kind: "mail", email, token };
}
