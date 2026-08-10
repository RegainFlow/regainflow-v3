-- The two tables the site's forms write to: the contact form on /contact, and
-- the email gate in front of each report's PDF.
--
-- Both hold inbound contact details, and both are written only by Server Actions
-- using the **secret key** (`sb_secret_…`, the replacement for the legacy
-- `service_role` key). That is why RLS is enabled with **no policies at all**:
-- the secret key carries BYPASSRLS, and every other key — publishable included —
-- is left with no way to read or write. There is no browser Supabase client on
-- this site, so no public key ever reaches a visitor.
--
-- The consequence to keep in mind: adding a policy here is what would open these
-- tables up. Do not add one to "make a dashboard work" — read them through the
-- Supabase UI, which connects as the service role.
--
-- **The grants at the bottom are not decoration.** Supabase is moving the
-- platform default from auto-granting new `public` tables to `anon`,
-- `authenticated`, and `service_role` to revoking them, so exposure is opt-in —
-- see the `auto_expose_new_tables` note in `supabase/config.toml`. On a project
-- with the new default, a table created without an explicit grant returns
-- "permission denied" through PostgREST even to the secret key. Stating the
-- grants makes this migration correct under either default.
--
-- Written `if not exists` throughout. A migration normally runs exactly once, so
-- this is not for re-runs — it is so `db push` succeeds against a project where
-- these tables were already created by hand before migrations existed.

-- ---------------------------------------------------------------------------
-- /contact
-- ---------------------------------------------------------------------------

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  organization text,
  message text not null,
  -- The path the form was submitted from. Currently always /contact, but the
  -- form is a component and the next surface that mounts it should be
  -- distinguishable without a schema change.
  source text,
  -- sha256(ip + RF_IP_SALT). Enough to rate-limit a burst from one address
  -- without the table ever holding an address.
  ip_hash text
);

alter table public.contact_submissions enable row level security;

-- The rate limiter counts rows by ip_hash over a trailing window, so it reads
-- both columns on every submission.
create index if not exists contact_submissions_ip_hash_created_at_idx
  on public.contact_submissions (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- The report gate
-- ---------------------------------------------------------------------------

create table if not exists public.report_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Stored lower-cased by the action, which is what lets the uniqueness below be
  -- over the plain column. PostgREST's on_conflict names columns and cannot
  -- target a lower(email) functional index, so normalizing on write is what
  -- makes the dedupe reachable from supabase-js at all.
  email text not null,
  -- Which report was asked for. This is the intent signal and the reason rows
  -- are per-report rather than per-person.
  report_slug text not null,
  name text,
  organization text,
  ip_hash text
);

alter table public.report_leads enable row level security;

-- The unlock is remembered in localStorage, so the same reader on a second
-- device submits again. Dedupe on the pair and let the insert do nothing on
-- conflict, so created_at keeps meaning first touch.
--
-- A unique *index* rather than a table constraint, deliberately: `ON CONFLICT`
-- infers from either, but only the index form can be written `if not exists`,
-- which is what keeps this migration safe against a hand-created table.
create unique index if not exists report_leads_email_report_idx
  on public.report_leads (email, report_slug);

create index if not exists report_leads_ip_hash_created_at_idx
  on public.report_leads (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------
--
-- Stated rather than inherited, for the reason at the top of this file.
--
-- `select` as well as `insert`, because the rate limiter counts prior rows by
-- ip_hash before it writes. No `update` or `delete`: nothing in the application
-- edits or removes a submission, and a role that cannot delete cannot be used to
-- erase evidence of one.

grant select, insert on table public.contact_submissions to service_role;
grant select, insert on table public.report_leads to service_role;

-- Belt and braces for a project still on the legacy auto-grant default, where
-- these two roles would otherwise arrive holding table privileges nobody asked
-- for. RLS with no policies already stops them; this removes the reliance on
-- that being the only thing standing in the way.

revoke all on table public.contact_submissions from anon, authenticated;
revoke all on table public.report_leads from anon, authenticated;
