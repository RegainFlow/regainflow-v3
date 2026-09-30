"use client";

import { useActionState, useEffect, useRef } from "react";

import { subscribe } from "@/app/(site)/newsletter/actions";
import { NEWSLETTER } from "@/lib/content/newsletter";
import { HONEYPOT, IDLE, LIMITS } from "@/lib/forms";

/**
 * The newsletter signup: one field, a specific promise, inline.
 *
 * Built to `docs/blogs_seo/blog_ui_ux.md` Part 6: an inline or end-of-post
 * form rather than a popup (Google treats a content-covering dialog on arrival
 * from search as intrusive), one field (email), and a promise that says what
 * arrives and how often. The copy lives in `lib/content/newsletter.ts`.
 *
 * Same progressive-enhancement contract as `ContactForm`: a plain form around
 * a Server Action, so it submits and redirects with JavaScript off.
 *
 * `source` is recorded on the row, e.g. `blog_post:<slug>` or `blog_index`,
 * so which surface earns signups is a query rather than a guess.
 */
export default function NewsletterSignup({ source }: { source: string }) {
  const [state, action, pending] = useActionState(subscribe, IDLE);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const error =
    state.status === "error" ? (state.errors.email ?? state.formError) : undefined;
  const id = `newsletter-email-${source.replace(/[^\w-]/g, "-")}`;

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  return (
    <section className="rf-newsletter" aria-labelledby={`${id}-heading`}>
      <p className="rf-utility text-rf-flow-soft">{NEWSLETTER.eyebrow}</p>
      <h2 id={`${id}-heading`} className="rf-h3 mt-3">
        {NEWSLETTER.heading}
      </h2>
      <p className="rf-newsletter-body">{NEWSLETTER.body}</p>

      <form action={action} className="rf-newsletter-form">
        <input type="hidden" name="source" value={source} />

        <div className="rf-honeypot" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Company website</label>
          <input
            id={`${id}-website`}
            type="text"
            name={HONEYPOT}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          required
          maxLength={LIMITS.email}
          autoComplete="email"
          placeholder="you@agency.gov"
          className="rf-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button type="submit" className="rf-cta-primary" disabled={pending}>
          {pending ? "Sending…" : NEWSLETTER.label}
        </button>
      </form>

      <div role="alert" aria-live="polite">
        {error ? (
          <p id={`${id}-error`} ref={errorRef} tabIndex={-1} className="rf-field-error mt-3">
            <span className="rf-route-tick" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
