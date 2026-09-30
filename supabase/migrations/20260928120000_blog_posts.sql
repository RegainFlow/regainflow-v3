-- Blog posts, in a table beside `reports` and `case_studies`.
--
-- Same model as reports: add a row in the Supabase UI, refresh, it is live.
-- `/insights/blog`, `/insights/blog/[slug]`, and the blog band on `/insights`
-- read this on every request.
--
-- Same RLS stance as every other content table: enabled, **no policies**,
-- `select` granted to `service_role` only. Reads happen server-side through
-- the secret key; no key reaches a visitor.

create table if not exists public.blog_posts (
  -- The URL. Primary key for the same reason as `reports.slug`: two rows with
  -- one slug are two pages at one address.
  slug text primary key,

  title text not null,
  -- One line. The card's only body copy, and the meta description fallback.
  summary text not null,
  -- Drives display order, `datePublished`, and the sitemap's `lastModified`.
  published date not null,

  -- A byline, as written. Not a foreign key: the site has no people table.
  author text not null default 'RegainFlow',
  tags text[] not null default '{}',

  -- Markdown (GitHub-flavoured). Rendered with raw HTML disabled, so an
  -- embedded `<script>` or `<iframe>` prints as text rather than running.
  body text not null,

  -- Optional hero image. A public storage URL, like `reports.cover_url`.
  cover_url text,

  -- Optional overrides for the search snippet. Null falls back to
  -- `title` and `summary`.
  meta_title text,
  meta_description text,

  -- Draft by default, for the reason given in the reports migration: this
  -- table is read on every request, so nothing stands between a half-typed
  -- row and a visitor except this column.
  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published desc);

-- `public.set_updated_at()` is defined in the reports migration.
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

grant select on table public.blog_posts to service_role;
revoke all on table public.blog_posts from anon, authenticated;
