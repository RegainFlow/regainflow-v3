-- Case studies move out of the repository and into a table.
--
-- They were authored in `lib/content/case-studies.ts`, which meant publishing
-- one was a commit, a review, and a deploy. This table is the editing surface
-- instead — and the reason it exists now rather than at three studies is that
-- a generator should be able to produce one by running SQL. That is the
-- requirement the schema is shaped around: everything a page needs is a
-- column, so `insert … ; refresh` is the whole publishing flow.
--
-- **The pages read this on every request**, the same trade `public.reports`
-- made and for the same reason. The cost here is larger and worth stating: the
-- home page renders `ProofStrip`, `/industries` and its four group pages
-- render studies, and `/llm-info` lists them — so this makes essentially the
-- whole marketing site dynamic rather than three routes. `getCaseStudies()`
-- degrades to `[]` on failure so a blip costs a proof section rather than the
-- home page; `app/sitemap.ts` and `app/llms.txt/route.ts` opt out of that,
-- because a confidently empty sitemap is a de-index and a 500 is a retry.
--
-- Same RLS stance as `reports`: enabled, **no policies**, `select` granted to
-- `service_role` only. Reads happen server-side through the secret key, which
-- carries BYPASSRLS. There is no browser Supabase client on this site.
--
-- `select` only. The site never writes a study.
--
-- Seed rows are **not** in this migration. They live in
-- `supabase/seed/case-studies.sql`, run by hand — a migration that carries
-- content re-inserts it on every environment that replays it, which is how a
-- copy edit made in Studio gets silently reverted.

create table if not exists public.case_studies (
  -- The URL. Primary key rather than a surrogate id, because the slug is the
  -- identity: two rows with the same slug is not a data problem, it is two
  -- pages at one address.
  slug text primary key,

  -- The headline. Reads as a claim, not a label — it is the page's `h1` and the
  -- card's heading, so it has to work at both sizes.
  title text not null,
  -- Industry or environment. Leads the card and the OG card's eyebrow, and is
  -- `about` in the structured data. Keep it short: it renders in a card's
  -- utility register.
  industry text not null,
  -- Overrides the page eyebrow where a study wants more than its industry —
  -- "Professional Services · AI Engineering Enablement". Falls back to
  -- `industry`, which is what the card and the OG card always use, because a
  -- compound string does not fit either.
  eyebrow text,
  -- One executive-legible line. The only body copy on a card, and the page's
  -- introduction.
  summary text not null,
  -- Visible chips on the card, and `keywords` in the structured data.
  capability_tags text[] not null default '{}',

  -- Search metadata, both optional and both falling back to `title` /
  -- `summary`. They exist because the two audiences differ: an `h1` earns
  -- attention from someone already reading, a `<title>` has to win a result
  -- page. "From two client briefs to customer-ready Codex workshops" is the
  -- former; "Codex Engineering Enablement Workshops" is the latter.
  meta_title text,
  meta_description text,

  ---------------------------------------------------------------------------
  -- The narrative spine. Every study answers these six, in this order, and
  -- that is the point: a reader comparing two studies is comparing the same
  -- six answers. Adding a seventh here is a decision about every study.
  ---------------------------------------------------------------------------
  context text not null,
  constraints text not null,
  -- RegainFlow's role. Says plainly what we did and did not own.
  role text not null,
  -- What we engineered, as flat lines. **Leave empty when `stages` is set** —
  -- the page renders the staged version instead, and filling both puts the
  -- same content on the page twice under one heading.
  engineered text[] not null default '{}',
  outcome text not null,
  -- The closing beat. `next_label` overrides the default "What changed next"
  -- where a study earns a better heading — the enablement study uses
  -- "Designed to compound". Optional; the body is not.
  next_label text,
  next_body text not null,

  ---------------------------------------------------------------------------
  -- Optional. Any study may use these; none has to. Rendered only when
  -- present, so a study that fills none of them looks exactly like the three
  -- that shipped before this table existed.
  ---------------------------------------------------------------------------

  -- Public storage URL, like `reports.cover_url`. Absolute rather than a
  -- /public path, because a row created in a browser cannot reference a file
  -- in the repository — that is what `images.remotePatterns` in
  -- `next.config.ts` already exists for. No intrinsic dimensions travel with
  -- it; `.rf-case-cover` declares the ratio in CSS so there is nothing for an
  -- editor to measure.
  image_url text,
  -- Required in practice whenever `image_url` is set. These are content
  -- images, not decoration, so an empty alt is wrong rather than economical.
  image_alt text,

  -- Engagement scope, never impact. [{value, label}] — "2", "workshop tracks".
  -- Governed by the same rule as everything else here: a figure appears only
  -- if we can say how it was measured. Counting what was delivered is safe;
  -- claiming what it returned is not.
  at_a_glance jsonb,

  -- What the client actually received. Concrete and checkable.
  deliverables text[],

  -- A named process, in order. [{name, detail}]. Renders numbered, because
  -- order is information — see `docs/DESIGN.md#iconography`. When present it
  -- **replaces** `engineered` rather than joining it.
  stages jsonb,

  -- An engagement that ran in two or more parallel tracks.
  -- [{label, thesis, context[], demos[]}]. Deliberately general: this is not
  -- "two workshops", it is the shape of work split across contexts.
  tracks jsonb,

  -- Overrides the closing CTA's copy. {heading, body, secondaryLabel}.
  --
  -- One column rather than three, because these are only ever set together —
  -- a heading without its body is a worse CTA than the default. The
  -- destinations are deliberately NOT here: they are the free assessment and
  -- the contact form, they are the same on every page of this site, and a
  -- column holding a URL is a column that will eventually hold a broken one.
  cta jsonb,

  -- Sanitized diagrams. [{kind, title, caption, nodes[]}].
  --
  -- `kind` is a **closed union** resolved to a React component, the same
  -- pattern `components/Icon.tsx` uses for its glyph map. An arbitrary diagram
  -- cannot be data; which diagram, and its labels, can be. A `kind` the site
  -- does not know renders nothing rather than breaking the page — but it also
  -- means a generator cannot invent one.
  artifacts jsonb,

  ---------------------------------------------------------------------------

  -- **Advisory.** Filling this does NOT put a study on an industry page.
  --
  -- `IndustryGroup.proof` in `lib/content/industries.ts` is authoritative: the
  -- industry page picks which studies lead it and in what order. This column
  -- is the reverse index, so the relationship stays declared on both sides and
  -- a study added without a home is visible.
  --
  -- That used to be self-enforcing, because both sides were in the repository
  -- and a mismatch was a typecheck away. It is not any more. A row inserted
  -- with `industries = '{defense-aerospace}'` and no matching `proof` entry
  -- appears on no industry page, silently. **Putting a study on an industry
  -- page is a repository change.**
  industries text[] not null default '{}',

  -- Display order, ascending. Explicit rather than alphabetical or by date:
  -- which study leads the listing is an editorial decision.
  --
  -- `sort_order`, not `position`. `POSITION(x IN y)` is a SQL-standard
  -- function and the bare word is reserved in enough contexts that
  -- `order=sort_order.asc` through PostgREST is the safe spelling.
  sort_order int not null default 0,

  -- Draft by default, and load-bearing rather than descriptive. "Add a row and
  -- it is live" would otherwise publish a half-typed row the instant you
  -- tabbed out of the first field — the site reads this table on every
  -- request, so no build step stands between a typo and a visitor.
  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.case_studies enable row level security;

-- Every query the site makes is "published rows, in display order".
create index if not exists case_studies_status_sort_idx
  on public.case_studies (status, sort_order);

-- `public.set_updated_at()` already exists from the reports migration, with an
-- empty search_path for the reason documented there. Reused rather than
-- redefined: two copies of a trigger function drift.
drop trigger if exists case_studies_set_updated_at on public.case_studies;
create trigger case_studies_set_updated_at
  before update on public.case_studies
  for each row execute function public.set_updated_at();

grant select on table public.case_studies to service_role;
revoke all on table public.case_studies from anon, authenticated;
