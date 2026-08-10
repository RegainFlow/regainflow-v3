-- Reports move out of the repository and into a table.
--
-- They were authored in `lib/content/reports.ts`, which meant publishing one was
-- a commit, a review, and a deploy. This table is the editing surface instead:
-- add a row in the Supabase UI, refresh the site, it is there. No webhook, no
-- deploy hook, no build.
--
-- **The pages read this on every request.** `/insights/reports`,
-- `/insights/reports/[slug]`, and the reports band on `/insights` are dynamic
-- routes now rather than prerendered HTML, which is the price of "refresh and
-- it is live" and was chosen deliberately. Every other route on the site is
-- still static.
--
-- Same RLS stance as `contact_submissions` and `report_leads`: enabled, **no
-- policies**, `select` granted to `service_role` only. Reads happen server-side
-- through the secret key (`sb_secret_…`), which carries BYPASSRLS. There is no
-- browser Supabase client on this site, so no key ever reaches a visitor.
--
-- Editing in the Supabase Table Editor is unaffected by any of this — Studio
-- connects to Postgres directly as a privileged role rather than through
-- PostgREST, so neither RLS nor these grants apply to it.
--
-- `select` only. The site never writes a report; a role that cannot write one
-- cannot be used to publish one.

create table if not exists public.reports (
  -- The URL. Primary key rather than a surrogate id, because the slug is the
  -- identity here: two rows with the same slug is not a data problem, it is two
  -- pages at one address.
  slug text primary key,

  title text not null,
  -- One executive-legible line. The only body copy on a card.
  summary text not null,
  -- Drives display order, `datePublished` in the structured data, and
  -- `lastModified` in the sitemap. A date, not a timestamp: these are dated to
  -- the day, and the page renders only the month.
  published date not null,

  -- Three to five conclusions the report actually reaches — written as claims,
  -- not chapter titles. Public, and the substance of the page: the gate asks for
  -- the document, not for the argument, so this has to be worth reading cold.
  --
  -- A text[] rather than jsonb. Studio edits it as a list, the client gets a
  -- plain string[] with no parsing, and the ordering is the array's own.
  findings text[] not null default '{}',

  -- Public storage URLs, all three. The cover used to be a committed PNG under
  -- /public specifically so `next.config.ts` needed no `images.remotePatterns`
  -- entry; that trade stopped being available the moment a row added in a
  -- browser had to reference it. See the remotePatterns block in next.config.ts.
  cover_url text not null,
  pdf_url text not null,
  audio_url text,

  -- Both optional and both display-only. `pages` comes from `pnpm report:cover`,
  -- which counts them against the file rather than taking it on trust.
  pages int,
  -- As written on the page — "22:20". Never parsed. It also seeds the duration
  -- readout in the player, because iOS frequently does not fire
  -- `loadedmetadata` until the first interaction.
  audio_length text,

  -- Draft by default, and this is the one column that is load-bearing rather
  -- than descriptive. "Add a row and it is live" would otherwise publish a
  -- half-typed row the instant you tabbed out of the first field — the site
  -- reads this table on every request, so there is no build step standing
  -- between a typo and a visitor.
  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Every query the site makes is "published rows, newest first".
create index if not exists reports_status_published_idx
  on public.reports (status, published desc);

-- Keeps `updated_at` honest without the editor having to remember it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
-- Empty search_path: a SECURITY DEFINER-adjacent function that resolves
-- unqualified names through a caller-controlled search_path is the classic
-- Postgres privilege-escalation shape. Nothing here is unqualified anyway.
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

grant select on table public.reports to service_role;
revoke all on table public.reports from anon, authenticated;
