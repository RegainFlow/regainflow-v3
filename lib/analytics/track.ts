import posthog from "posthog-js";

import type { RfEvent } from "@/lib/analytics/events";

/**
 * The imperative half of the analytics integration.
 *
 * Almost everything on this site is counted declaratively: an anchor carries
 * `data-rf-event` and the delegated listener in `instrumentation-client.ts`
 * reads it off the DOM on click. That listener only fires on **click**, which is
 * why a form needs this — a submission that succeeded is not a click on
 * anything, and there is no element to hang an attribute on at the moment it
 * becomes true.
 *
 * **Client components only.** This is the module `lib/analytics/events.ts`
 * refuses to become: it imports `posthog-js`, so importing it from a server
 * component would evaluate the SDK on the server once per importer. `events.ts`
 * stays import-free so server components can keep reading `RF_EVENTS` for their
 * `data-rf-event` values.
 *
 * `posthog.init` already ran in `instrumentation-client.ts` before hydration, so
 * this is the same singleton — there is nothing to initialize here. With
 * `NEXT_PUBLIC_POSTHOG_KEY` unset init is skipped, and `posthog-js` no-ops
 * rather than throwing, so an uninstrumented environment needs no guard.
 */

export function track(event: RfEvent, properties?: Record<string, string>) {
  posthog.capture(event, properties);
}

/**
 * Promote an anonymous visitor to a person, keyed by the email they gave.
 *
 * `person_profiles: "identified_only"` means no person record exists until this
 * runs. Calling it is what retroactively attaches everything the visitor read
 * before submitting — which is the entire reason the gate is worth having.
 *
 * Lower-cased so the same reader arriving twice with different capitalization is
 * one person — matching the normalization the report gate applies before its
 * `(email, report_slug)` dedupe in `supabase/migrations/`.
 */
export function identify(email: string, properties?: Record<string, string>) {
  posthog.identify(email.toLowerCase(), { email: email.toLowerCase(), ...properties });
}
