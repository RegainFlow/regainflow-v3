-- A write path and constraints for `pnpm blog`, the publishing pipeline.
--
-- The same shape as `20260816180000_case_studies_publisher.sql`, for the same
-- reasons, which that file sets out at length: `service_role` keeps `select`
-- only on the table, because the site and the publisher hold the same secret
-- key, and the publisher gets named SECURITY DEFINER functions instead of a
-- table grant. Content validation lives in `scripts/blog/`, where a failure
-- can name the field. These functions only write.

---------------------------------------------------------------------------
-- 1. Constraints
---------------------------------------------------------------------------

-- The slug is the URL. A staged draft is written under `preview--<slug>` so a
-- refresh of a live post can be reviewed without touching the live row; the
-- double hyphen cannot occur in a real slug, so the two can never collide.
alter table public.blog_posts
  drop constraint if exists blog_posts_slug_kebab;
alter table public.blog_posts
  add constraint blog_posts_slug_kebab
  check (slug ~ '^(preview--)?[a-z0-9]+(-[a-z0-9]+)*$');

-- A cover is content, so it has alt text; alt text with no image is its own
-- kind of broken. Same rule as `case_studies_image_alt_paired`.
alter table public.blog_posts
  drop constraint if exists blog_posts_cover_alt_paired;
alter table public.blog_posts
  add constraint blog_posts_cover_alt_paired
  check ((cover_url is null) = (cover_alt is null));

alter table public.blog_posts
  drop constraint if exists blog_posts_cta_shape;
alter table public.blog_posts
  add constraint blog_posts_cta_shape
  check (cta is null or jsonb_typeof(cta) = 'object');

---------------------------------------------------------------------------
-- 2. The write path
---------------------------------------------------------------------------

-- Insert or replace one post from a payload. Every column is set from the
-- payload, so a replace is a whole-row write: the pipeline builds the payload
-- from the intake plus the live row's dates, never from a partial patch.
--
-- `rf_text_array` is defined in the case-studies publisher migration.
create or replace function public.publish_blog_post(payload jsonb)
returns public.blog_posts
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.blog_posts;
begin
  insert into public.blog_posts (
    slug, title, summary, published, updated_on, author, topic, tags,
    takeaways, related, cta, cover_url, cover_alt, cover_credit,
    featured, pillar, meta_title, meta_description, body, status
  )
  values (
    payload ->> 'slug',
    payload ->> 'title',
    payload ->> 'summary',
    (payload ->> 'published')::date,
    (payload ->> 'updated_on')::date,
    payload ->> 'author',
    payload ->> 'topic',
    coalesce(public.rf_text_array(payload -> 'tags'), '{}'),
    coalesce(public.rf_text_array(payload -> 'takeaways'), '{}'),
    coalesce(public.rf_text_array(payload -> 'related'), '{}'),
    nullif(payload -> 'cta', 'null'::jsonb),
    payload ->> 'cover_url',
    payload ->> 'cover_alt',
    payload ->> 'cover_credit',
    coalesce((payload ->> 'featured')::boolean, false),
    coalesce((payload ->> 'pillar')::boolean, false),
    payload ->> 'meta_title',
    payload ->> 'meta_description',
    payload ->> 'body',
    coalesce(payload ->> 'status', 'draft')
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    published = excluded.published,
    updated_on = excluded.updated_on,
    author = excluded.author,
    topic = excluded.topic,
    tags = excluded.tags,
    takeaways = excluded.takeaways,
    related = excluded.related,
    cta = excluded.cta,
    cover_url = excluded.cover_url,
    cover_alt = excluded.cover_alt,
    cover_credit = excluded.cover_credit,
    featured = excluded.featured,
    pillar = excluded.pillar,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    body = excluded.body,
    status = excluded.status
  returning * into saved;

  return saved;
end;
$$;

-- Publish or take down a post without rewriting it. `pnpm blog unpublish`.
create or replace function public.set_blog_post_status(p_slug text, p_status text)
returns public.blog_posts
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.blog_posts;
begin
  update public.blog_posts
    set status = p_status
    where slug = p_slug
  returning * into saved;

  return saved;
end;
$$;

-- Removes a staged draft once its post is published or abandoned. Can only
-- ever touch a `preview--` row: the prefix is added here, not by the caller,
-- so no argument can delete a live post.
create or replace function public.discard_blog_preview(p_slug text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.blog_posts where slug = 'preview--' || p_slug;
$$;

revoke all on function public.publish_blog_post(jsonb) from public, anon, authenticated;
revoke all on function public.set_blog_post_status(text, text) from public, anon, authenticated;
revoke all on function public.discard_blog_preview(text) from public, anon, authenticated;
grant execute on function public.publish_blog_post(jsonb) to service_role;
grant execute on function public.set_blog_post_status(text, text) to service_role;
grant execute on function public.discard_blog_preview(text) to service_role;
