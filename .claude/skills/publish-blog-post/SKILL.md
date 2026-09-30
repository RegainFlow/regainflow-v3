---
name: publish-blog-post
description: Use when writing, publishing, refreshing, or taking down a RegainFlow blog post on regainflow.com/insights/blog. Covers the interview, collecting photos and screenshots, follow-up questions, the outline, the draft, the SEO and accessibility checks, the draft preview, and the Supabase write through `pnpm blog`. Trigger on "new blog post", "write a post about…", "publish this post", "update/refresh the post on…", "add this to the blog", or "unpublish the post". Runs only from the regainflow-v3 repository. Apply regainflow-brand-guidelines for voice and the repository's no-ai-slop skill to the prose.
---

# Publish a RegainFlow blog post

## Purpose

Turn something RegainFlow actually saw, measured or decided into a post worth citing. You do the editorial work: interview, outline, draft, edit. `scripts/blog-pipeline.mts` does everything that must not be improvised: validation against `docs/blogs_seo/`, image measurement and upload, the draft preview, the database write, and the IndexNow ping.

A published post is live the moment its row commits. The site reads the table on every request.

## Precondition

**The current directory must be the regainflow-v3 repository.** Confirm `scripts/blog-pipeline.mts` exists. If it does not, stop:

> This skill runs from the regainflow-v3 repository, which holds the blog pipeline. `scripts/blog-pipeline.mts` is not here. `cd` there and start again.

## The rule that decides whether a post exists

**Every post carries something only RegainFlow can supply:** a first-hand result, original data, a real failure, a screenshot of real work, a named engineer's judgment, or a defensible opinion. Google's May 2026 guidance names this "non-commodity content" as its single most emphasized lever, and it is the only kind of post an assistant has a reason to cite.

If the interview turns up nothing like that, say so plainly and suggest either a sharper angle or not writing the post. A generic "7 tips" post is not published under the founders' names.

Two rules inherited from the case studies also apply:
1. **No client is named without written approval.** Ask for the deny list every time.
2. **No figure without a source.** Our own measurements say so ("on our evaluation set"); anyone else's get a footnote.

## Workflow

### 1. Interview

Use `references/interview.md`. Ask in small batches with AskUserQuestion where the answers are choices (author, topic, CTA), and in plain conversation where they are stories. Cover:

- the reader, the question they would type, and what format the current results show (guide, comparison, checklist, opinion);
- **the first-hand element** (the thing only we know);
- author (`will-baltus` or `leo-ramirez`), topic cluster, and pillar or cluster post;
- sources for every number;
- the deny list;
- the next step the post should offer (the CTA);
- 2–5 existing posts or pages it should link to, and which should link back.

List what is published before asking, so the options you offer are real (topics come from `lib/content/blog-topics.ts`):

```
pnpm blog:prod list     # production: slugs, titles, pillars, featured, by topic
```

Reading the list only; it writes nothing, so `:prod` is safe here.

### 2. Ask for photos

Real images beat decoration (`docs/blogs_seo/blog_ui_ux.md`, Part 3.4). Ask specifically for:

- screenshots of the actual work (redacted), annotated if possible;
- diagrams the team already drew;
- photos from an engagement **we are cleared to show**;
- a cover: the strongest of the above.

For each image, collect: the file (PNG, JPEG or WebP, under 5 MB, about 2000px wide, photos exported upright), **alt text** describing what it shows and why it is there (not keywords, not "image of"), an optional caption that adds something, a credit, and a yes to "are we cleared to publish this?".

Tell the person to drop the files in `.blog/<slug>/images/` (gitignored), or give you paths to copy there.

**Only if there are no usable images:** confirm before generating a cover. Write a `cover.generate` subject that describes the idea abstractly (the house style forbids text, people, logos and UI). Generation calls OpenAI and costs money; never scan a client name into the prompt (the pipeline checks it against the deny list).

### 3. Follow-up questions

Before outlining, go back on what the interview left soft:
- a claim with no example ("teams struggle with X": which team, what happened?);
- a number with no source or method;
- no failure, trade-off or "what we would do differently";
- an answer that would take more than the first two sentences to state.

### 4. Outline, and get it approved

Propose: the title (specific, leads with the topic), the one-sentence answer the post opens with, the H2s (each one readable as a standalone summary), where each image and figure goes, the takeaways, and the links. Wait for a yes before drafting.

### 5. Draft

Write `.blog/<slug>/post.md` from `assets/post-template.md`:
- answer or stakes in the first paragraph, short;
- a descriptive `##` every 200–400 words, `###` below it, never `#`;
- short paragraphs, bullets for parallel items, tables where they compare;
- figures from `references/figures.md` (callout, steps, bars, video) where they carry information;
- images as `![alt](images/file.png "caption")`;
- sources as GFM footnotes `[^1]`, which render as the visible Sources list;
- internal links with descriptive anchor text.

Takeaways (3–5) are claims, and **none is repeated word for word in the body**. The pipeline rejects a repeat.

### 6. Edit

Run the **no-ai-slop** skill on the draft, then check voice against **regainflow-brand-guidelines**. Keep the author's voice; cut hedging and throat-clearing.

### 7. Intake, prepare, stage

Copy `assets/blog-intake.yaml` to `.blog/<slug>/intake.yaml` and fill it (field rules: `references/blog-post-schema.md`). Then:

```
pnpm blog prepare .blog/<slug>/intake.yaml
pnpm blog stage   .blog/<slug>/preview
```

`prepare` fails loudly with every problem at once; fix the draft or intake and re-run. Never hand-edit `preview/`; `publish` re-hashes it and will refuse.

`stage` writes a **draft** under `preview--<slug>` and prints a preview URL. For a local preview, `pnpm dev` must be running with `BLOG_PREVIEW_TOKEN` set in `.env.local`.

### 8. The approval gate

**Never run `publish` in the same turn as `stage`.** Show the person, in one message:

- the preview URL (open it yourself and look at it, including on a phone width);
- the cover and every body image (actually view them);
- the search title and description from `preview/report.md`;
- every warning the run printed, with your recommendation on each;
- the deny list you checked against.

| Rationalization | Reality |
|---|---|
| "They asked me to publish it" | They approved the task, not this draft. They have not seen the page. |
| "The checks passed" | The checks catch broken pages and missing sources. Whether the post is true, cleared and worth reading is theirs to say. |
| "It's only a refresh" | A refresh rewrites a live, indexed page. It needs the gate more. |
| "I'll fix it after" | The page is crawlable the moment the row commits. |

### 9. Publish

Only after a clear yes:

```
pnpm blog publish .blog/<slug>/preview          # local
pnpm blog:prod publish .blog/<slug>/preview     # PRODUCTION
```

Report the live URL and the IndexNow result. Then suggest 2–3 established posts or pages that should now link **to** the new post, with the anchor text and the sentence it would go in. Those edits are separate refreshes; offer to do them.

## Modes

| Situation | Command | Dates |
|---|---|---|
| New post | `prepare` → `stage` → `publish` | `published` = today (or `published:` in the intake) |
| Substantive refresh: new facts, sections, data | `prepare --replace --substantive` | keeps `published`, sets "Updated" to today |
| Fix: typo, metadata, a link | `prepare --replace` | both dates unchanged |
| Take down | `pnpm blog unpublish <slug>` | row kept as a draft; the URL 404s |

For a replace, **start the intake and `post.md` from the live post**, not from a blank template: `--replace` rewrites the whole row, so anything left out is cleared. Google is explicit that moving "Updated" without a real change is noise, which is why only `--substantive` moves it.

## Which database

| Command | Env file | Target |
|---|---|---|
| `pnpm blog …` | `.env.local` | normally the local stack |
| `pnpm blog:prod …` | `.env` | **production, the live site** |

Confirm the target with the person before the first `:prod` command of a session. Never switch to `:prod` because a local command failed. The first time on a new environment, run `pnpm blog bootstrap` (or `blog:prod bootstrap`) to create the `blog` storage bucket.

Env: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` always; `OPENAI_API_KEY` for a generated cover; `BLOG_PREVIEW_TOKEN` for the preview link (must match the deployed site's value for a production preview); `INDEXNOW_KEY` for the ping.

## When the pipeline refuses

Exit codes: `1` invalid intake or post, `2` missing configuration, `3` a remote refused, `4` retries exhausted, `5` the write failed and uploaded files were removed (safe to re-run), `6` the write failed and files were **not** removed (it prints the paths).

Errors are hard stops: a reserved or taken slug, an unknown author or topic, an H1 or skipped heading level, a repeated takeaway, a broken figure or footnote, an image without alt text or clearance, a link to an unpublished post, a deny-listed term. Fix the draft; do not work around a check.

Warnings go to the person at the gate: snippet lengths, word count, too few internal links, a missing pillar link, an unsourced number, a large image. Give each one a recommendation.

## References

- `references/interview.md`: the question bank, and follow-up prompts.
- `references/blog-post-schema.md`: every intake field and the rule behind it.
- `references/seo-checklist.md`: what `docs/blogs_seo/` asks of a post, with evidence tiers.
- `references/figures.md`: callout, steps, bars, video, image and footnote syntax.
- `assets/blog-intake.yaml`, `assets/post-template.md`: the starting files.
