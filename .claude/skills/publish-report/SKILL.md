---
name: publish-report
description: Publish a RegainFlow report to the site. Renders the cover from page 1 of the PDF, uploads the PDF, cover, and audio to Supabase storage, and writes the row in public.reports. Use whenever the user wants to publish, upload, add, or post a report, insight report, guide, brief, or whitepaper; says they have a report PDF or a recording to put on the site; asks how reports get published or where reports live; wants to replace a report's PDF, audio, or cover; wants to fix a report's title, summary, or findings; or wants to unpublish or pull a report from the site.
---

# Publish a report

Reports are rows in `public.reports`, not files in this repo. Publishing one is uploading three objects and writing a row — no commit, no deploy. `pnpm report:publish` does the mechanical half. Your job is the half a script cannot do: collecting the inputs without guessing, drafting copy that does not overclaim, and stopping for approval before anything goes live.

## Intake — ask, never assume

**Do not go looking for the files.** Never glob the filesystem for something PDF-shaped, never infer an audio file from a matching name, never invent a slug and proceed on it. Every input below is either given to you or asked for.

Ask for everything missing in **one message**, not one question at a time. Paths go in prose — a
filesystem path is not a multiple choice, and `AskUserQuestion` is the wrong shape for one. Use it
for the slug and the date, where there is a real default to offer.

| Input | What to do |
| --- | --- |
| **PDF path** | Required. A local path — the script uploads the bytes, so a URL is rejected. It is the source of truth for the cover *and* the page count. |
| **Audio path** | **Always ask, even if they didn't mention audio.** "You didn't mention it" and "this report has no audio" are different answers, and shipping a report without its audio because nobody raised it is a real failure. Accept an explicit *no audio* and move on — `audio_url` is nullable and the page renders no player rather than an empty frame. |
| **Slug** | Propose one from the title, then confirm it. It is the primary key **and** the URL, so a collision is two pages at one address. The script checks the table before uploading anything and tells you if it is taken. |
| **Published date** | Ask, offering today. Only the month is rendered, but it drives sort order, `datePublished` in the structured data, and `lastModified` in the sitemap. |

If the user hands over several reports at once, do them **one at a time, start to finish**. Two half-finished uploads sharing a bad slug is a mess worth not having.

## Drafting the copy

Read the PDF, then write `title`, `summary`, and `findings` into a JSON file.

- **`summary`** — one executive-legible line. It is the only body copy on a card.
- **`findings`** — the conclusions the report actually reaches, written as **claims, not chapter titles**. "Pilot programs stall at integration, not at model quality" is a finding; "Chapter 3: Integration" is not.

**Three to five is the range, not a target.** Write the number the report earns and stop. A five-page
executive brief making three clean arguments gets three findings; padding it to five means inventing
a conclusion or splitting one in half, and both read worse than three strong claims. Five identical
findings across every report is itself a tell that they were generated to fill a quota. If the
document genuinely supports five, use five.

The findings are the substance of the public page. The gate asks for the document, not the argument, so they have to be worth reading cold by someone who never downloads the PDF.

**Two rules govern every word, and nothing in the code enforces either:**

1. **Name nothing the report itself does not name** — no company, customer, platform, program, or project name.
2. **No figure in `summary` or `findings` that the report does not confirm.** A report is the one artifact where an invented number is not just embarrassing but checkable.

## Run the draft through `no-ai-slop` before showing it

**Always, not on request.** Generated summaries and findings arrive full of the patterns that skill
exists to remove, and this copy is the most-read text on the site: the listing card, the detail page,
the OG card, and the `llms.txt` entry all quote it. Invoke `no-ai-slop` on the summary and findings,
apply the edit, then show the user the result.

These are the patterns that actually showed up the first time, so start by not writing them:

- **Telling the reader what the number shows.** "Abandonment more than doubled in a year: 42% against
  17%" — the figures already say it. Delete the preamble and lead with the figure.
- **Paraphrasing a sentence the report already nails.** The guides are well written. When a report
  states its own core principle cleanly, quote it close to verbatim instead of flattening it.
- **Em dashes.** None in copy this short.
- **Colon reveals.** "The claim that matters: a lowercase dramatic reveal." Write a plain sentence.
  A colon introducing a genuine list is fine.
- **Binary contrasts.** "Stalled adoption is a design failure, not resistance." State the conclusion
  and let the evidence carry the contrast.
- **Robotic rhythm.** Five findings all built as "sentence. sentence." reads as machine output. Vary
  the shapes.

`docs/DESIGN.md` "Voice" wins where it disagrees with `no-ai-slop`: claim-then-evidence
("A pilot is not a result.") is a house rule, not a binary contrast to strip.

The meta JSON:

```json
{
  "title": "Closing the Ambition Circuit",
  "summary": "One executive-legible line — the only body copy on a card.",
  "findings": ["A conclusion.", "Another conclusion.", "A third."],
  "published": "2026-08-16"
}
```

`published` is optional and defaults to today. `audioLength` may be set to override the measured duration; leave it out and the script measures the file. Write it somewhere temporary — the scratchpad, not the repo. Reports do not live in this repo and neither does their copy.

## Run it

Always dry-run first. It renders the cover, counts the pages, and measures the audio without touching anything remote:

```bash
pnpm report:publish --pdf <path> --audio <path> --meta <meta.json> --slug <slug> --dry-run
```

Then for real — uploads all three objects, reads back the public URLs, and upserts the row:

```bash
pnpm report:publish --pdf <path> --audio <path> --meta <meta.json> --slug <slug>
```

The row lands as a **draft**. No page renders it: every query in `lib/reports.server.ts` filters `status = 'published'`.

## The approval gate

**Show the drafted copy and the script's output, then stop.** Do not run `--publish` in the same turn as the content run — the script deliberately will not do both, and neither should you. Wait for the user to say go.

```bash
pnpm report:publish --slug <slug> --publish
```

Live on the next request across all five surfaces: `/insights/reports`, the reports band on `/insights`, `/insights/reports/<slug>`, `/sitemap.xml`, and `/llms.txt`.

To pull one back — the row and its files are untouched, it just stops rendering:

```bash
pnpm report:publish --slug <slug> --unpublish
```

## Replacing a PDF or audio

Re-run the content command. Uploads upsert, the row upserts on `slug`, and **`status` is never written by a content run** — a fix to a typo cannot publish or unpublish anything as a side effect. Always re-run it when the PDF changes: the PDF is the source of truth, and a cover that disagrees with page 1 is a bug a reader finds before we do.

**Two things about updating a report that is already live.**

*There is no draft gate.* The content run leaves `status` alone, so on an already-published row the new title, summary, findings, cover, and PDF are live on the next request. Approval has to happen **before** the run, not after. Use `--dry-run` to show the user the copy, get the go-ahead, then run it. If they would rather see it off the site first, `--unpublish`, update, review, `--publish`.

*Storage URLs carry a content hash, and that is what makes a replaced file appear.* Object paths are stable, so without it the URL after a replacement is byte-for-byte the URL before, and storage sends `cache-control: public, max-age=3600` — Cloudflare, the browser, and the Next image optimizer would all keep serving the old cover for an hour. The script appends `?v=<first 8 of sha256>` to each uploaded URL, so identical bytes give an identical URL and new bytes give one nothing has cached. If a replaced cover ever fails to appear, check that the `?v=` on `cover_url` changed; if it did not, the upload did not take.

## Notes and gotchas

- **`.env` is the live project; `.env.local` is a local Supabase stack** that only runs under `supabase start`. Credentials resolve in this order: `SUPABASE_URL` + `SUPABASE_SECRET_KEY` already exported in the environment, then `--env <file>`, then `.env`. It defaults to `.env` rather than `.env.local` because publishing is a production act — and it prints the target host and where the credentials came from on every run. **Read that line before approving anything.**
- **`pnpm install` first if the script cannot find `@supabase/supabase-js`.** `node_modules` in a stale checkout can predate the Supabase work.
- **Reading the PDF's text takes a helper.** The Read tool's PDF path needs poppler (`pdftoppm`), which is not installed here, and `pdfjs-dist` is not hoisted to the top level under pnpm — it belongs to `pdf-to-img`. Write a throwaway script in the scratchpad that globs `node_modules/.pnpm/pdfjs-dist@*/node_modules/pdfjs-dist/legacy/build/pdf.mjs`, imports it by file URL, and prints `getTextContent()` per page grouped into lines by y position. Do not add it to the repo; it is a reading aid, not a deliverable.
- **Title casing is a question, not a default.** Covers are sometimes set in sentence case while the listing runs title case. Show the user both and let them pick, rather than silently normalising a title the cover disagrees with.
- **Reports sharing a `published` date have no defined order** among themselves; the listing sorts by that date alone. If the sequence in the listing matters, give each one its own date.
- **The live site sits behind Cloudflare**, so `curl` and WebFetch against `www.regainflow.com` return 403 with a bot challenge. Post-publish verification means reading the row back from the table and asking the user to load the page in a browser. Do not report a page as visually verified on the strength of the database alone.
- **Slug rules:** lowercase letters, digits, single hyphens. Anything else is rejected rather than turned into a bad URL.
- **pdfjs and `Buffer`:** it rejects a plain `Uint8Array` with "Cannot transfer object of unsupported type". `scripts/lib/cover.mjs` already converts; keep it that way if you touch it.
- **A draft is not previewable.** There is no URL that renders one. Review against the meta JSON and the PDF. Recovery is fast if something slips through — the pages are `force-dynamic`, so `--unpublish` takes effect on the next refresh with no deploy.
- **The cover is never hand-exported.** It is always page 1 of the PDF, rendered by the script. `pnpm report:cover <pdf> <slug>` does that step alone if that is all you need.
