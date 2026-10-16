# Intake fields

`.blog/<slug>/intake.yaml`, validated by `IntakeSchema` in `scripts/blog/intake.mts`. Unknown keys are rejected. The body is `.blog/<slug>/post.md` unless `body:` says otherwise.

| Field | Required | Rule | Why |
|---|---|---|---|
| `slug` | yes | kebab-case; short; no year; not `topics`, `authors`, `page`, `preview` | It is the URL. Changing it later needs a redirect, and a dated slug reads stale after a refresh. |
| `title` | yes | specific, leads with the topic, unique. For a post built on one of our reports, lead with the report's named idea and add the post's own angle after a colon; never the report's exact title | The H1 and the card. Google rewrites generic or misleading titles, and a post sharing a report's title competes with the report page. |
| `summary` | yes | one or two sentences | The deck under the H1, the card copy, and the meta description fallback. |
| `author` | yes | `will-baltus` or `leo-ramirez`; `regainflow` for a company post written by both (a warning, not an error) | A real byline linked to an author page is a core trust signal. The organization byline has no author page or Person markup. |
| `topic` | yes | `production-ai`, `retrieval-and-data`, `public-sector-ai` | Places the post in its cluster hub and breadcrumb. |
| `tags` | no | up to 6 | Shown as chips and in `article:tag`. No tag pages exist, deliberately. |
| `takeaways` | yes | 3–5 findings, none repeated verbatim in the body | The numbered TL;DR under the title (`01`, `02`…). Write them as findings. Repetition costs attention (NZZ). |
| `related` | no | up to 5 published slugs, in order | "Keep reading". Relevance beats volume. |
| `cta` | no | `{eyebrow, heading, body, label, href}`; href `/…` or `https://…` | Shown after the first section and at the end. Null means the free assessment. |
| `featured` | no | boolean | The index features the newest two (`FEATURED_SLOTS` in `lib/content/blog.ts`). A third featured post drops the oldest from that row. |
| `pillar` | no | boolean; one per topic | The post the topic hub leads with. |
| `published` | no | `YYYY-MM-DD` | First-publish date; default today. Ignored on `--replace`. |
| `meta_title` | no | about 60 characters or fewer | When the H1 is too long or too clever for a results page, and always when the H1 leads with a report's name: put the question a reader would type here. |
| `meta_description` | no | 120–160 characters | A click aid, not a ranking factor. Falls back to `summary`. |
| `cover` | no | `{file, alt, credit, cleared: true}` or `{generate, alt}` | Real image first. `generate` is the house illustration, paid, and last resort. |
| `images` | when the body has local images | `[{file, cleared: true, credit?}]` | Every local image in `post.md` must be listed and cleared. Alt text and captions live in the markdown. |
| `deny_terms` | yes (may be `[]`) | client, agency, program, platform, project names | Scanned across every field and the cover prompt. A hit stops the run. |

## Image files

- PNG, JPEG or WebP, detected by content. Under 5 MB (warned above 1.5 MB). About 2000px wide is plenty.
- Export photos **upright**: dimensions are read from the header, and EXIF rotation is not applied.
- Stored at `blog/post/<slug>/<content-hash>.<ext>` in Supabase storage. The URL carries `#<width>x<height>` so the page reserves the right space and never crops.

## What the pipeline sets

| Column | Value |
|---|---|
| `published` | intake `published`, or today; the live value on a replace |
| `updated_on` | null for a new post; today with `--replace --substantive`; unchanged with `--replace` alone |
| `status` | `draft` under `preview--<slug>` when staged; `published` under `<slug>` when published |
| `cover_url`, image URLs | the storage URL for the target database, resolved at stage/publish |
| `cover_credit` | "Illustration generated for this post." for a generated cover |
