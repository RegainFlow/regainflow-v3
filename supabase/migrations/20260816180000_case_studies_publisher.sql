-- What a generator needs that the editing surface did not.
--
-- `20260816120000_case_studies.sql` shaped the table around "a generator should
-- be able to produce a study by running SQL". This migration is what happened
-- when one actually did. Three things were missing:
--
-- 1. **A way to say which studies lead the home page.** `ProofStrip` rendered
--    every published study, so publishing a fourth silently changed the home
--    page. `featured` makes that an editorial decision instead of a side effect.
--
-- 2. **Constraints the generator can fail against.** The rules were in prose in
--    `lib/content/case-studies.ts` and enforced by whoever was typing. A slug
--    with a capital letter, an image with no alt text, or a `stages` block that
--    is an object rather than an array all rendered wrong rather than being
--    refused. Prose does not stop a program.
--
-- 3. **A write path.** The original migration granted `select` only and said
--    "the site never writes a study" — which is still true, and is why the
--    grant does not change here. The publisher is not the site. It gets one
--    named, auditable entry point instead of the table.

---------------------------------------------------------------------------
-- 1. Featured
---------------------------------------------------------------------------

-- Which studies lead the home page, distinct from `status`.
--
-- `status` answers "is this fit to be seen"; `featured` answers "is this one of
-- the three we lead with". Conflating them would mean unpublishing a study to
-- get it off the home page, which also removes it from `/insights`, the
-- sitemap, and its own URL.
alter table public.case_studies
  add column if not exists featured boolean not null default false;

-- Partial, because the only query that reads this is the home page's, and it is
-- always "featured and published, in display order".
create index if not exists case_studies_featured_sort_idx
  on public.case_studies (featured, sort_order)
  where status = 'published';

---------------------------------------------------------------------------
-- 1b. Section headings
---------------------------------------------------------------------------

-- Per-study overrides for the optional sections' headings.
--
-- Three strings in `app/insights/[slug]/page.tsx` were written for the study
-- that happened to be in front of us: "Two client contexts" is two, and "What
-- the partner received" is a partner rather than a client. A fourth study with
-- three tracks and a direct client had to accept both.
--
-- One column rather than six, because a study's headings are decided together
-- by whoever is writing it, and the alternative is a schema change every time a
-- section earns its own language.
--
--   {"tracks":       {"eyebrow", "title", "lead"},
--    "artifacts":    {"eyebrow", "title"},
--    "deliverables": {"title"}}
--
-- Null is the normal case: the defaults live in `lib/content/case-studies.ts`
-- and a null here renders exactly what shipped before this column existed.
-- Members are omitted rather than set null — the page spread-merges over the
-- defaults, and an explicit null would overwrite one with nothing.
alter table public.case_studies
  add column if not exists section_headings jsonb;

-- The three studies that predate this column were the whole home page band.
-- Without this, `ProofStrip` starts filtering on `featured`, nothing has it,
-- and the proof section disappears from the highest-traffic route on the site.
-- Belongs here rather than in the seed file: the seed is re-runnable content,
-- this is a one-time consequence of adding the column.
update public.case_studies
  set featured = true
  where slug in (
    'ai-engineering-enablement',
    'government-energy-rag-platform',
    'aerospace-rag-evaluation'
  );

---------------------------------------------------------------------------
-- 2. Constraints
---------------------------------------------------------------------------

-- `drop` then `add` rather than `add ... if not exists`, which Postgres does
-- not offer for check constraints. Keeps the migration re-runnable.

-- The slug is the URL and the primary key. `Aerospace_RAG` is a 404 with a
-- valid-looking row behind it.
alter table public.case_studies
  drop constraint if exists case_studies_slug_kebab;
alter table public.case_studies
  add constraint case_studies_slug_kebab
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- These are content images, not decoration, so an empty alt is wrong rather
-- than economical — already the documented rule, now enforced. Stated as an
-- equality so it catches both directions: alt text describing an image that is
-- not there is its own kind of broken.
alter table public.case_studies
  drop constraint if exists case_studies_image_alt_paired;
alter table public.case_studies
  add constraint case_studies_image_alt_paired
  check ((image_url is null) = (image_alt is null));

-- The optional blocks are read as arrays by every consumer — `row.stages?.length`,
-- then `.map()`. An object here does not crash the page; it renders nothing,
-- which is worse, because it looks like the study simply has no stages.
alter table public.case_studies
  drop constraint if exists case_studies_optional_blocks_shape;
alter table public.case_studies
  add constraint case_studies_optional_blocks_shape
  check (
    (at_a_glance is null or jsonb_typeof(at_a_glance) = 'array')
    and (stages is null or jsonb_typeof(stages) = 'array')
    and (tracks is null or jsonb_typeof(tracks) = 'array')
    and (artifacts is null or jsonb_typeof(artifacts) = 'array')
    -- The two objects: `cta` is {heading, body, secondaryLabel} set together,
    -- and `section_headings` is keyed by section name. Different shape, so
    -- they are checked as objects rather than folded into the array test.
    and (cta is null or jsonb_typeof(cta) = 'object')
    and (section_headings is null or jsonb_typeof(section_headings) = 'object')
  );

---------------------------------------------------------------------------
-- `industries` is authoritative from here.
--
-- `20260816120000_case_studies.sql` says filling it "does NOT put a study on an
-- industry page", and that "putting a study on an industry page is a repository
-- change". **That is no longer true, and this note supersedes it** — an applied
-- migration is not edited, so the two are read in order.
--
-- `studiesForIndustry()` now unions the two sources: `IndustryGroup.proof`
-- leads, in `proof` order, then every published study whose `industries`
-- contains the group slug, in `sort_order`. `proof` is not removed — it is
-- demoted from the only mechanism to a curated ordering override, because
-- "which study leads this page" is still an editorial decision that a global
-- `sort_order` cannot express.
--
-- The union is a no-op against the rows that exist: both non-empty `proof`
-- arrays name exactly the study whose `industries` already claims that group.
---------------------------------------------------------------------------

---------------------------------------------------------------------------
-- 3. The write path
---------------------------------------------------------------------------

-- jsonb array to text[], or null when the key is absent.
--
-- Exists because four columns need this and inlining the CASE four times is
-- four places to get the `jsonb_typeof(...) = 'null'` branch wrong. A JSON
-- `null` and an absent key both have to become SQL NULL; a scalar has to not
-- raise, because `jsonb_array_elements_text` on one does.
--
-- `with ordinality` because array order is content here: `engineered` and
-- `deliverables` are read in the order they were written.
create or replace function public.rf_text_array(input jsonb)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case
    when input is null or jsonb_typeof(input) <> 'array' then null
    else (
      select coalesce(array_agg(elem order by ord), '{}'::text[])
      from jsonb_array_elements_text(input) with ordinality as t(elem, ord)
    )
  end;
$$;

revoke all on function public.rf_text_array(jsonb) from public, anon, authenticated, service_role;

-- The one way a row enters this table from outside Studio.
--
-- **`service_role` still has `select` only on the table.** That property is
-- worth more than the convenience of an upsert: the site and the publisher hold
-- the same secret key, so a table-level `insert` grant would hand write access
-- to every request the site serves. A SECURITY DEFINER function is the standard
-- shape for "this role may perform this operation, not this operation on
-- anything" — the write is named, and it is the only one.
--
-- Content validation deliberately does NOT live here. It lives in
-- `scripts/case-study-pipeline.ts`, where a failure can say which field and
-- which term, and where it can be tested. This function's job is the write.
--
-- `search_path = ''` for the reason `public.set_updated_at()` documents: a
-- SECURITY DEFINER function resolving unqualified names through a
-- caller-controlled search_path is the classic privilege-escalation shape.
-- Everything below is schema-qualified; `pg_catalog` is searched regardless,
-- which is what lets the built-in functions resolve.
create or replace function public.publish_case_study(payload jsonb)
returns public.case_studies
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.case_studies;
begin
  insert into public.case_studies (
    slug, title, industry, eyebrow, summary, capability_tags,
    meta_title, meta_description,
    context, constraints, role, engineered, outcome, next_label, next_body,
    image_url, image_alt,
    at_a_glance, deliverables, stages, tracks, cta, artifacts,
    section_headings, industries, sort_order, status, featured
  )
  values (
    payload ->> 'slug',
    payload ->> 'title',
    payload ->> 'industry',
    payload ->> 'eyebrow',
    payload ->> 'summary',
    coalesce(public.rf_text_array(payload -> 'capability_tags'), '{}'),
    payload ->> 'meta_title',
    payload ->> 'meta_description',
    payload ->> 'context',
    payload ->> 'constraints',
    payload ->> 'role',
    coalesce(public.rf_text_array(payload -> 'engineered'), '{}'),
    payload ->> 'outcome',
    payload ->> 'next_label',
    payload ->> 'next_body',
    payload ->> 'image_url',
    payload ->> 'image_alt',
    -- `nullif` against a JSON `null`: absent and explicitly-null both have to
    -- clear the column, or a study can never drop a block it once had.
    nullif(payload -> 'at_a_glance', 'null'::jsonb),
    public.rf_text_array(payload -> 'deliverables'),
    nullif(payload -> 'stages', 'null'::jsonb),
    nullif(payload -> 'tracks', 'null'::jsonb),
    nullif(payload -> 'cta', 'null'::jsonb),
    nullif(payload -> 'artifacts', 'null'::jsonb),
    nullif(payload -> 'section_headings', 'null'::jsonb),
    coalesce(public.rf_text_array(payload -> 'industries'), '{}'),
    coalesce((payload ->> 'sort_order')::int, 0),
    -- Draft unless the caller says otherwise, matching the column default. The
    -- check constraint rejects anything that is neither.
    coalesce(payload ->> 'status', 'draft'),
    coalesce((payload ->> 'featured')::boolean, false)
  )
  on conflict (slug) do update set
    title = excluded.title,
    industry = excluded.industry,
    eyebrow = excluded.eyebrow,
    summary = excluded.summary,
    capability_tags = excluded.capability_tags,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    context = excluded.context,
    constraints = excluded.constraints,
    role = excluded.role,
    engineered = excluded.engineered,
    outcome = excluded.outcome,
    next_label = excluded.next_label,
    next_body = excluded.next_body,
    image_url = excluded.image_url,
    image_alt = excluded.image_alt,
    at_a_glance = excluded.at_a_glance,
    deliverables = excluded.deliverables,
    stages = excluded.stages,
    tracks = excluded.tracks,
    cta = excluded.cta,
    artifacts = excluded.artifacts,
    section_headings = excluded.section_headings,
    industries = excluded.industries,
    sort_order = excluded.sort_order,
    status = excluded.status,
    featured = excluded.featured
    -- `updated_at` is left alone: `case_studies_set_updated_at` fires before
    -- update and setting it here too would be two answers to one question.
  returning * into saved;

  return saved;
end;
$$;

-- Nobody but the publisher, and the publisher only through `service_role`.
revoke all on function public.publish_case_study(jsonb) from public, anon, authenticated;
grant execute on function public.publish_case_study(jsonb) to service_role;
