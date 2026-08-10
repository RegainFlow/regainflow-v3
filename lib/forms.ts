/**
 * The field contract shared by both forms on this site — the limits, the
 * validators that enforce them, and the honeypot.
 *
 * **This module has no imports and must keep it that way.** It is read by the
 * client components that render the inputs *and* by the Server Actions that
 * validate them; a single `node:crypto` or `next/headers` import here would
 * follow the first into the browser bundle and fail the build. The server-only
 * half — IP hashing and the rate limiter — lives in `lib/forms.server.ts` for
 * exactly that reason. Same rule, same motive, as `lib/analytics/events.ts`.
 *
 * **The limits are exported because the client renders them as HTML
 * attributes.** Browsers run constraint validation with scripting off, so a
 * message that is too short is caught in the browser's own UI before the POST
 * ever happens — the first line of the no-JavaScript story.
 *
 * The second line is that these rules still hold when that one is bypassed.
 * Verified against a running server with a native `multipart/form-data` POST:
 * a submission failing validation re-renders the page with the field error in
 * the response HTML, and never reaches the write. So the duplication is not
 * belt-and-braces — the attributes save a round trip, and these rules are what
 * actually enforce.
 *
 * A rule added here without a matching attribute in the form does not open a
 * hole, then; it just costs the reader a round trip to find out. Add both.
 */

export const LIMITS = {
  name: 120,
  email: 254,
  organization: 160,
  messageMin: 10,
  message: 4000,
} as const;

/**
 * Deliberately loose. This is a shape check, not an address check — the only
 * thing that proves an address is real is mail arriving at it, and every regex
 * strict enough to feel rigorous rejects some valid address a real person owns.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The field name is the disguise. Left generic on purpose: a bot filling every
 *  input it finds trips it, and a password manager has no reason to touch it. */
export const HONEYPOT = "company_website";

export type FormState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string>; formError?: string }
  | { status: "ok"; email: string };

export const IDLE: FormState = { status: "idle" };

export const RATE_LIMIT_MESSAGE =
  "That is a few messages in quick succession. Give it a few minutes, or email us directly.";

function text(data: FormData, field: string): string {
  const value = data.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * A filled honeypot means a bot. Callers return **success** on true, and write
 * nothing.
 *
 * Telling a bot it failed teaches whoever runs it to look for the trap on the
 * next pass. Silence costs nothing and the row was never worth having.
 */
export function isBot(data: FormData): boolean {
  return text(data, HONEYPOT).length > 0;
}

export interface ContactFields {
  name: string;
  email: string;
  organization: string;
  message: string;
}

/** Returns the parsed fields, or the errors. Never both. */
export function readContact(
  data: FormData,
): { ok: true; fields: ContactFields } | { ok: false; errors: Record<string, string> } {
  const fields: ContactFields = {
    name: text(data, "name"),
    email: text(data, "email"),
    organization: text(data, "organization"),
    message: text(data, "message"),
  };

  const errors: Record<string, string> = {};

  if (!fields.name) errors.name = "Tell us who you are.";
  else if (fields.name.length > LIMITS.name)
    errors.name = "That is longer than we can store.";

  if (!fields.email) errors.email = "We need somewhere to reply.";
  else if (fields.email.length > LIMITS.email || !EMAIL.test(fields.email))
    errors.email = "That does not look like an email address.";

  if (fields.organization.length > LIMITS.organization)
    errors.organization = "That is longer than we can store.";

  if (fields.message.length < LIMITS.messageMin)
    errors.message = `A sentence or two, at least — ${LIMITS.messageMin} characters.`;
  else if (fields.message.length > LIMITS.message)
    errors.message = "That is longer than we can store. Send us the short version.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, fields };
}

/** The gate asks for less: an email, and a name if they feel like it. */
export function readEmail(
  data: FormData,
):
  | { ok: true; email: string; name: string }
  | { ok: false; errors: Record<string, string> } {
  const email = text(data, "email");
  const name = text(data, "name");

  if (!email) return { ok: false, errors: { email: "We need an email to send it to." } };
  if (email.length > LIMITS.email || !EMAIL.test(email))
    return { ok: false, errors: { email: "That does not look like an email address." } };
  if (name.length > LIMITS.name)
    return { ok: false, errors: { name: "That is longer than we can store." } };

  return { ok: true, email, name };
}
