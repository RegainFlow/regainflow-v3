-- Blog posts, second shape: the fields the post template needs to meet
-- `docs/blogs_seo/blog_seo.md` and `docs/blogs_seo/blog_ui_ux.md`.
--
-- Everything here is additive and defaulted, so rows written against the
-- first shape still read.

-- `author` stops being a free-text byline and becomes a founder slug from
-- `TEAM` in `lib/content/company.ts` (`will-baltus`, `leo-ramirez`). The site
-- resolves it to a name, portrait, role and author page; an unknown value
-- falls back to the organization rather than inventing a person.
alter table public.blog_posts
  alter column author set default 'regainflow';

alter table public.blog_posts
  -- The topic cluster. Slugs live in `lib/content/blog-topics.ts`; each has an
  -- indexed hub page at `/insights/blog/topics/[topic]`. A text column rather
  -- than an enum so a new cluster is a code change, not a migration.
  add column if not exists topic text not null default 'production-ai',

  -- Three to five bullets shown in the key-takeaways box near the top. Written
  -- as claims, and never repeated word for word in the body.
  add column if not exists takeaways text[] not null default '{}',

  -- Curated "keep reading" slugs, in order. The page falls back to the same
  -- topic, then the latest, when this runs short.
  add column if not exists related text[] not null default '{}',

  -- The post-specific next step, shown inline after the first section and
  -- again at the end: {eyebrow, heading, body, label, href}. Null uses the
  -- free assessment.
  add column if not exists cta jsonb,

  -- Alt text is required whenever `cover_url` is set; the credit is shown
  -- under the image and is where a placeholder says it is one.
  add column if not exists cover_alt text,
  add column if not exists cover_credit text,

  -- "Start here" on the blog index.
  add column if not exists featured boolean not null default false,

  -- The one comprehensive post a topic hub leads with.
  add column if not exists pillar boolean not null default false,

  -- The visible "Updated" date and the structured data's `dateModified`.
  -- Set by hand, only after a substantive edit. Deliberately not `updated_at`:
  -- that one moves on every typo fix, and Google is explicit that bumping a
  -- date without changing the content is noise.
  add column if not exists updated_on date;

create index if not exists blog_posts_topic_idx
  on public.blog_posts (status, topic, published desc);

create index if not exists blog_posts_author_idx
  on public.blog_posts (status, author, published desc);
