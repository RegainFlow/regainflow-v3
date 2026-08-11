"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitContact } from "@/app/contact/actions";
import { HONEYPOT, IDLE, LIMITS } from "@/lib/forms";

/**
 * The contact form.
 *
 * A plain `<form action={…}>` around a Server Action, which Next progressively
 * enhances. **This works with JavaScript disabled, and that is measured rather
 * than assumed** — a native `multipart/form-data` POST carrying the four
 * `$ACTION_*` fields React serializes was replayed against a running server:
 *
 * - a valid submission runs the action through to the write;
 * - `redirect()` answers `303 See Other → /contact/thanks`;
 * - a submission failing server validation re-renders this page with the field
 *   error present in the response HTML.
 *
 * That last one is the part worth knowing, because it is easy to assume
 * otherwise: `useActionState` is not what renders the errors, it is what
 * renders them *without a round trip*. They are in the no-JS response too.
 *
 * Every `maxLength` and `minLength` below mirrors a rule in `lib/forms.ts`, so
 * the browser catches what it can before the POST. `LIMITS` is imported rather
 * than retyped — one number, one place.
 */

interface Props {
  /** Recorded on the row, so the next surface that mounts this is separable. */
  source: string;
}

export default function ContactForm({ source }: Props) {
  const [state, action, pending] = useActionState(submitContact, IDLE);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Drives the character counter, which is the only reason the message field is
  // controlled. It costs nothing on the no-JS path — React server-renders the
  // value as the element's content and the browser takes it from there — and it
  // buys something on the JS path: a submission rejected by server validation
  // re-renders through `useActionState`, and component state survives that, so
  // the reader no longer loses what they typed.
  const [message, setMessage] = useState("");

  const errors = state.status === "error" ? state.errors : {};
  const formError = state.status === "error" ? state.formError : undefined;

  // A returned error replaces no content and moves nothing, so a screen reader
  // on the JS path would otherwise hear nothing happen. The live region
  // announces it; this moves the caret to it as well.
  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  // There is deliberately no success branch here. The action redirects, so a
  // successful submission never returns state to this component — the
  // `contact_form_submitted` event fires from `/contact/thanks` instead, which
  // is the only place that is reached exclusively by having succeeded.

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="source" value={source} />

      {/* See `.rf-honeypot` and `isBot`. Labelled and off-screen rather than
          hidden, because a bot skips what is obviously not there. */}
      <div className="rf-honeypot" aria-hidden="true">
        <label htmlFor="rf-company-website">Company website</label>
        <input
          id="rf-company-website"
          type="text"
          name={HONEYPOT}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        id="name"
        label="Name"
        error={errors.name}
        input={
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={LIMITS.name}
            autoComplete="name"
            className="rf-input"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        }
      />

      <Field
        id="email"
        label="Email"
        error={errors.email}
        input={
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            className="rf-input"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        }
      />

      <Field
        id="organization"
        label="Organization"
        optional
        error={errors.organization}
        input={
          <input
            id="organization"
            name="organization"
            type="text"
            maxLength={LIMITS.organization}
            autoComplete="organization"
            className="rf-input"
            aria-invalid={errors.organization ? true : undefined}
            aria-describedby={errors.organization ? "organization-error" : undefined}
          />
        }
      />

      <Field
        id="message"
        label="What are you trying to move into production?"
        error={errors.message}
        input={
          <textarea
            id="message"
            name="message"
            required
            minLength={LIMITS.messageMin}
            maxLength={LIMITS.message}
            rows={6}
            className="rf-textarea"
            placeholder="The problem, roughly where it stands, and any timeline you are working to."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            // The counter is always described; the error joins it when present.
            // A screen reader hearing the limit before typing is the point —
            // hearing it only after hitting the cap is not a warning.
            aria-describedby={
              errors.message ? "message-count message-error" : "message-count"
            }
          />
        }
        counter={
          // Not a live region. `aria-live` here would announce on every
          // keystroke, which turns a helpful number into an unusable field;
          // `aria-describedby` above is how it gets read instead.
          //
          // `data-near` at 90% is the only state change. Colour is never the
          // only signal — the number itself already says it.
          <p
            id="message-count"
            className="rf-field-count"
            data-near={message.length >= LIMITS.message * 0.9 || undefined}
          >
            {/* Locale pinned to the `lang="en"` the document declares. Bare
                `toLocaleString()` reads the *runtime* locale, so the server
                would render "4,000" and a browser set to de-DE would hydrate
                "4.000" — a mismatch React would have to repair. */}
            {message.length.toLocaleString("en-US")} /{" "}
            {LIMITS.message.toLocaleString("en-US")}
          </p>
        }
      />

      {/* Always in the output, so the announcement has somewhere to land. */}
      <div role="alert" aria-live="polite">
        {formError ? (
          <p ref={errorRef} tabIndex={-1} className="rf-field-error">
            <span className="rf-route-tick" aria-hidden="true" />
            <span>{formError}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="rf-cta-primary" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
        <p className="rf-form-note max-w-[38ch]">
          We reply to everything, usually within one business day.
        </p>
      </div>
    </form>
  );
}

/** One field, one label, one error slot. Kept local — nothing else needs it. */
function Field({
  id,
  label,
  input,
  error,
  optional,
  counter,
}: {
  id: string;
  label: string;
  input: React.ReactNode;
  error?: string;
  optional?: boolean;
  /** Rendered under the input, before the error. Only the message field uses it. */
  counter?: React.ReactNode;
}) {
  return (
    <div className="rf-field">
      <label htmlFor={id} className="rf-label" data-optional={optional || undefined}>
        {label}
      </label>
      {input}
      {counter}
      {error ? (
        <p id={`${id}-error`} className="rf-field-error">
          <span className="rf-route-tick" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
