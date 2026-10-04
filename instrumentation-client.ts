import posthog from "posthog-js";

import { aiSource } from "@/lib/analytics/ai-source";
import { RF_EVENTS } from "@/lib/analytics/events";

/**
 * PostHog, and the whole of the site's client-side analytics.
 *
 * Next runs this file once on the client before hydration, which is why there
 * is no provider component and why `app/layout.tsx` is untouched. Everything
 * below is plain DOM — the site gains no new `"use client"` boundary and every
 * CTA stays inside the server component that renders it.
 *
 * **Do not add the older `usePathname` + `useSearchParams` pageview component.**
 * It is what most PostHog/Next tutorials still show, and it is wrong twice
 * here: `defaults` already puts `capture_pageview` in `'history_change'` mode,
 * which handles App Router client navigation on its own, and `useSearchParams`
 * would opt every route that mounted it into dynamic rendering. This site is
 * fully static and needs to stay that way.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * `data-rf-*` attributes, minus the one naming the event, become event
 * properties: `data-rf-location` arrives as `location`, `data-rf-case-study` as
 * `case_study`. `dataset` has already camel-cased them, so this undoes that.
 */
function properties(data: DOMStringMap, nameKey: string) {
  const props: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === nameKey || !key.startsWith("rf") || value === undefined) continue;

    props[
      key
        .slice(2)
        .replace(/^./, (c) => c.toLowerCase())
        .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
    ] = value;
  }

  return props;
}

/**
 * One delegated listener for every tracked click on the site.
 *
 * `sendBeacon` plus `send_instantly` because the booking and contact CTAs leave
 * the page: `transport` alone only picks the network API, it does not bypass
 * the batching queue, so the event would still be sitting in it when the
 * document unloads. The alternative — `preventDefault` and a `setTimeout`
 * before navigating — breaks modified clicks and keyboard activation, so it is
 * not an alternative.
 */
function onActivate(event: MouseEvent) {
  // Primary button for `click`, middle button for `auxclick`. Without this the
  // two listeners can both answer one middle click and double-count it, and
  // `auxclick` would additionally count right-clicks — opening a context menu
  // over a CTA is not clicking it. Inflating the conversion metric is the one
  // failure mode this integration cannot afford.
  if (event.button !== (event.type === "auxclick" ? 1 : 0)) return;

  const target = event.target instanceof Element ? event.target : null;
  const el = target?.closest<HTMLElement>("[data-rf-event]");
  const name = el?.dataset.rfEvent;
  if (!name) return;

  posthog.capture(name, properties(el.dataset, "rfEvent"), {
    transport: "sendBeacon",
    send_instantly: true,
  });
}

/**
 * `<details>` disclosures — currently the "see all twelve" list on `/insights`,
 * which is the clearest signal on the site that someone is reading past the
 * featured work.
 *
 * Two things here are load-bearing. `toggle` does not bubble, so this must be
 * registered on the capture phase (`true`) or it never fires at all. And it
 * uses `data-rf-toggle` rather than `data-rf-event` so that the click listener
 * above does not also match the `<details>` element and double-count every
 * open — clicks on cards *inside* the disclosure already resolve to the card,
 * because `closest` stops at the nearest match.
 */
function onDisclosure(event: Event) {
  const el = event.target;
  if (!(el instanceof HTMLDetailsElement) || !el.open) return;

  const name = el.dataset.rfToggle;
  if (!name) return;

  posthog.capture(name, properties(el.dataset, "rfToggle"));
}

/**
 * Marks a session that came from an AI assistant.
 *
 * PostHog already records `$referring_domain`, but ChatGPT often sends no
 * referrer and identifies itself only by `utm_source=chatgpt.com`, and nobody
 * wants to rebuild the list of assistant hostnames in every insight. So the
 * answer is computed once, here, and registered for the session: every event
 * afterwards carries `ai_source`, including the booking click.
 *
 * `sessionStorage` keeps a reload, or a second tab opened from the first, from
 * counting the landing twice. It can throw in a locked-down browser; then the
 * landing may be counted again, which is the lesser error.
 */
function tagAiReferral() {
  const source = aiSource(document.referrer, window.location.search);
  if (!source) return;

  posthog.register_for_session({ ai_source: source });

  try {
    if (window.sessionStorage.getItem("rf_ai_landing")) return;
    window.sessionStorage.setItem("rf_ai_landing", source);
  } catch {
    // Counted without the guard.
  }

  posthog.capture(RF_EVENTS.aiReferralLanded, { ai_source: source });
}

if (KEY) {
  posthog.init(KEY, {
    // The proxy path from `next.config.ts`, not a PostHog domain: this audience
    // runs ad blockers and sits behind corporate filters, and first-party
    // ingestion is the difference between measuring them and not.
    api_host: "/relay",
    // Required whenever `api_host` is a proxy — it is where the toolbar and
    // "view in PostHog" links point, which is not somewhere we can proxy.
    ui_host: "https://us.posthog.com",
    // Pins the behaviour snapshot rather than inheriting whatever a future
    // release decides. This is the one that puts pageviews in 'history_change'
    // mode; newer snapshots exist but their deltas are not documented yet.
    defaults: "2026-05-30",
    // Anonymous visitors are captured but create no person record. When the
    // gated white paper ships, `identify(email)` on submit retroactively
    // stitches everything the visitor read beforehand onto that person.
    person_profiles: "identified_only",
    // Set explicitly, not assumed: the bundled defaults snapshot moved session
    // recording behaviour, and this site has no consent banner. Removing this
    // line is how replay gets turned on, deliberately.
    disable_session_recording: true,
  });

  tagAiReferral();

  document.addEventListener("click", onActivate);
  // Middle-click and open-in-new-tab, which never fire `click`.
  document.addEventListener("auxclick", onActivate);
  document.addEventListener("toggle", onDisclosure, true);
}
