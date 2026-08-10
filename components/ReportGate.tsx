"use client";

import { useActionState, useEffect, useSyncExternalStore } from "react";

import { captureReader } from "@/app/insights/reports/actions";
import { RF_EVENTS } from "@/lib/analytics/events";
import { identify, track } from "@/lib/analytics/track";
import type { Report } from "@/lib/content/reports";
import { HONEYPOT, IDLE, LIMITS } from "@/lib/forms";

/**
 * The email ask in front of a report's PDF.
 *
 * **It is a courtesy ask, not access control, and the code says so.** The
 * reports sit in a public Supabase bucket, so the URL below is public whether or
 * not anyone fills this in. That is a deliberate choice, and the honest
 * consequence of it is the `<noscript>` block at the bottom: this site's floor
 * is that content is present when JavaScript is not (`docs/DESIGN.md` §6), and
 * leaving a reader with scripting off staring at a dead page — to protect a link
 * that is already public — would be the first thing here to break that rule.
 *
 * The unlock is remembered per device. One submission opens every report from
 * then on, which is what makes the second report we publish convert an existing
 * reader instantly.
 */

const STORE = "rf_reader";

/**
 * `localStorage` as an external store, read through `useSyncExternalStore`.
 *
 * The obvious version of this — `useState(null)` plus an effect that reads
 * storage on mount — is what React's own lint rule rejects, and it is right to:
 * it renders the locked state, then immediately re-renders the unlocked one, so
 * a returning reader watches the form flash past. `useSyncExternalStore` is
 * built for exactly this shape, and its server snapshot is what keeps hydration
 * honest: the server has no storage, so it must render locked.
 *
 * The listener set exists because the `storage` event only fires in *other*
 * tabs. This tab writes through `setReader`, which notifies directly.
 */
let cached: string | null | undefined;
const listeners = new Set<() => void>();

function readStore(): string | null {
  try {
    return window.localStorage.getItem(STORE);
  } catch {
    // Safari in private mode throws on access rather than returning null.
    // Unreadable and absent are the same outcome here: stay locked.
    return null;
  }
}

/** Must be referentially stable between calls, or React re-renders forever. */
function getSnapshot(): string | null {
  if (cached === undefined) cached = readStore();
  return cached;
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function setReader(email: string | null) {
  try {
    if (email) window.localStorage.setItem(STORE, email);
    else window.localStorage.removeItem(STORE);
  } catch {
    // The unlock still applies to this page view; it just will not survive a
    // reload.
  }

  cached = email;
  for (const listener of listeners) listener();
}

export default function ReportGate({ report }: { report: Report }) {
  const [state, action, pending] = useActionState(captureReader, IDLE);
  const reader = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Syncing React state *out* to an external system, which is what an effect is
  // for. Nothing here calls setState — the store notifies, and the subscription
  // above re-reads.
  useEffect(() => {
    if (state.status !== "ok") return;

    setReader(state.email);

    // `person_profiles: "identified_only"` means this is the call that creates
    // the person record, and it stitches everything the visitor read before
    // submitting onto it retroactively. See `instrumentation-client.ts`.
    identify(state.email);
    track(RF_EVENTS.reportUnlocked, { report: report.slug });
  }, [state, report.slug]);

  const errors = state.status === "error" ? state.errors : {};
  const formError = state.status === "error" ? state.formError : undefined;

  if (reader) {
    return (
      <div className="rf-gate">
        <p className="rf-eyebrow">The full report</p>
        <h2 className="rf-h3 mt-4 max-w-[28ch]">{report.title}</h2>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={report.pdf}
            className="rf-cta-primary"
            target="_blank"
            rel="noopener noreferrer"
            data-rf-event={RF_EVENTS.reportDownloaded}
            data-rf-report={report.slug}
            data-rf-location="report_gate"
          >
            Download the PDF
          </a>
          {report.pages ? <p className="rf-utility">{report.pages} pages</p> : null}
        </div>

        <p className="rf-form-note mt-6 max-w-[46ch]">
          Unlocked with {reader} on this device.{" "}
          <button
            type="button"
            className="rf-text-link"
            onClick={() => setReader(null)}
          >
            Use a different address
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="rf-gate">
      <p className="rf-eyebrow">Read the full report</p>
      <h2 className="rf-h3 mt-4 max-w-[30ch]">
        Tell us where to send it, and it opens.
      </h2>
      <p className="rf-body mt-4 max-w-[46ch]">
        One address, once. Every report we publish opens for you after this. We
        do not run a newsletter and we do not pass this on.
      </p>

      <form action={action} className="mt-7 flex flex-col gap-5">
        <input type="hidden" name="report" value={report.slug} />

        <div className="rf-honeypot" aria-hidden="true">
          <label htmlFor="rf-gate-company-website">Company website</label>
          <input
            id="rf-gate-company-website"
            type="text"
            name={HONEYPOT}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="rf-field">
          <label htmlFor="gate-email" className="rf-label">
            Email
          </label>
          <input
            id="gate-email"
            name="email"
            type="email"
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            className="rf-input"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "gate-email-error" : undefined}
          />
          {errors.email ? (
            <p id="gate-email-error" className="rf-field-error">
              <span className="rf-route-tick" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          ) : null}
        </div>

        <div className="rf-field">
          <label htmlFor="gate-name" className="rf-label" data-optional>
            Name
          </label>
          <input
            id="gate-name"
            name="name"
            type="text"
            maxLength={LIMITS.name}
            autoComplete="name"
            className="rf-input"
          />
        </div>

        <div role="alert" aria-live="polite">
          {formError ? (
            <p className="rf-field-error">
              <span className="rf-route-tick" aria-hidden="true" />
              <span>{formError}</span>
            </p>
          ) : null}
        </div>

        <div>
          <button type="submit" className="rf-cta-primary" disabled={pending}>
            {pending ? "Opening…" : "Open the report"}
          </button>
        </div>
      </form>

      {/* The honest half of a soft gate. Nothing here is protected — the file is
          public — so a reader without JavaScript gets the document rather than a
          form that cannot submit and a link that never appears. */}
      <noscript>
        <p className="rf-form-note mt-6 max-w-[46ch]">
          The form above needs JavaScript. The report itself does not —{" "}
          <a href={report.pdf} className="rf-text-link">
            download the PDF directly
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
