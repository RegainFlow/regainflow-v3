# How content pages are cached

Case studies, reports and blog posts live in Supabase, not in the repository.
Every page that shows them is **cached and rebuilt in the background at most once
a minute** (`export const revalidate = 60`).

## What that means in practice

- **A change in Supabase is live within a minute.** Flip a row to `published`
  in the table editor, or run a publishing pipeline, and the page shows it after
  the next rebuild. The first visitor after the minute is up still gets the old
  page; their visit triggers the rebuild, and the next visitor gets the new one.
- **A new slug works immediately.** Detail pages (`/insights/[slug]`,
  `/insights/reports/[slug]`, `/insights/blog/[slug]`) are not built at deploy
  time. Each is rendered on its first visit and cached from then on.
- **An outage shows the last good page.** If Supabase is unreachable when a
  rebuild runs, the cached page keeps being served.
- **Visitors and crawlers never wait on the database.** That was the reason for
  the change: these pages used to be `force-dynamic`, which put a database round
  trip in front of every request, including the home page.

## The rule

A page that reads a content table sets:

```ts
export const revalidate = 60;
```

The number has to be written out in each file. Next reads this export without
running the code, so it cannot be an imported constant.

A dynamic route also needs `generateStaticParams`, or it falls back to rendering
on every request:

- slugs that come from the database return `[]` (render on first visit);
- slugs that come from the repository (industries, blog topics, authors) return
  the full list (prerender at build).

## What is deliberately not cached

| Route | Why |
|---|---|
| `/sitemap.xml`, `/llms.txt` | They throw when Supabase is down so a crawler gets an error to retry, not a file that says the content is gone. A cached build-time copy would need the database at build. |
| `/insights/blog/preview/[slug]` | Token-gated drafts. |
| `/insights/blog/feed.xml`, `card.png` | Already cached by their own `Cache-Control` headers. |
| The two `opengraph-image` routes | Generated on demand for link previews. |
| `/newsletter/confirm`, `/newsletter/confirmed` | They read the query string. |

## If a minute is too slow

Lower the number, or add on-demand revalidation: a token-protected route that
calls `revalidatePath("/", "layout")`, called by the publishing pipelines after
they write. That was left out on purpose. It adds a secret and a failure mode,
and it would not cover rows edited by hand in Supabase, which the one-minute
rebuild does.
