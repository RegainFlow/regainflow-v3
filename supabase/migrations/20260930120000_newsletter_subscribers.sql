-- Newsletter sign-ups, double opt-in.
--
-- The blog's signup form writes a `pending` row and mails a confirmation link;
-- the row turns `confirmed` only when that link's page is submitted, and only
-- then is the address added to Resend, which sends the issues and handles
-- unsubscribes. So this table is the record of consent: who asked, when, from
-- which page, and when they confirmed.
--
-- Same stance as `contact_submissions`: RLS on with no policies, reached only
-- through the secret key in Server Actions, explicit grants below.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Lower-cased by the action, so the plain unique index below is the dedupe.
  email text not null,

  status text not null default 'pending'
    check (status in ('pending', 'confirmed')),

  -- sha256 of the token in the confirmation link. The raw token exists only in
  -- the email, so a read of this table cannot confirm anyone. Cleared on
  -- confirmation; replaced when a pending address signs up again.
  confirm_token_hash text,
  -- When the current link was sent. Links older than the action's window are
  -- refused, and a re-signup issues a new one.
  token_sent_at timestamptz,
  confirmed_at timestamptz,

  -- The page the form was on, e.g. `blog_post:<slug>` or `blog_index`.
  source text,
  -- sha256(ip + RF_IP_SALT), for the rate limiter. Never the address.
  ip_hash text
);

alter table public.newsletter_subscribers enable row level security;

create unique index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (email);

create unique index if not exists newsletter_subscribers_token_idx
  on public.newsletter_subscribers (confirm_token_hash)
  where confirm_token_hash is not null;

create index if not exists newsletter_subscribers_ip_hash_created_at_idx
  on public.newsletter_subscribers (ip_hash, created_at desc);

-- `update` as well as `select, insert`, unlike the contact tables: a
-- confirmation changes the row's status, and a re-signup replaces its token.
-- Still no `delete`. Removing someone is done in Resend (unsubscribe) or, for
-- an erasure request, by hand in the Supabase UI.
grant select, insert, update on table public.newsletter_subscribers to service_role;
revoke all on table public.newsletter_subscribers from anon, authenticated;
