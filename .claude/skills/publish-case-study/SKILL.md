---
name: publish-case-study
description: Use when publishing, drafting, or replacing a RegainFlow case study on regainflow.com — writing the narrative, filling the intake file, generating the hero image, and writing the row to Supabase. Runs only from the regainflow-v3 repository, which holds the pipeline. Apply regainflow-brand-guidelines to voice and art direction, and the repository's own no-ai-slop skill to the prose.
---

# Publish a RegainFlow case study

## Purpose

Turn an engagement into a published case study. You do the editorial work; `scripts/case-study-pipeline.mts` does everything that must not be improvised — validation, image generation, upload, the database write, cleanup, and verification.

A published study is live the moment the row commits. The site reads the table on every request and there is no build step between a typo and a visitor.

## Precondition

**The current directory must be the regainflow-v3 repository.** Before anything else, confirm `scripts/case-study-pipeline.mts` exists. If it does not, stop and say:

> This skill runs from the regainflow-v3 repository, which holds the publishing pipeline. `scripts/case-study-pipeline.mts` is not in the current directory. `cd` there and start again.

Do not search for the project, accept a path argument, or read an environment variable to find it.

## The two rules

Both come from `lib/content/case-studies.ts` and both are the reason this skill exists.

1. **Nothing is named without written client approval.** No company, customer, platform, program, or project name — only the industry or environment the work ran in. Never add a note saying the study is anonymized; naming the omission is what makes it conspicuous.
2. **No metric until it can be defended.** A number appears only once you can explain how it was measured and hold that up in a procurement conversation. `at_a_glance` is the one exception, and only because it counts what was *delivered* — engagement scope, never impact.

The pipeline scans for violations of both. It cannot detect compliance, which is why a person reads the draft before it ships.

## Workflow

1. **Interview.** Collect the six spine answers — context, constraints, RegainFlow's role, what was engineered, outcome, what changed next — plus scope facts, deliverables, and capability tags. Ask explicitly for the **deny list**: every client, program, platform, and project name that must never appear. Ask how every number was measured.
2. **Apply the brand.** Use **regainflow-brand-guidelines** for voice and for art direction. Use the repository's **no-ai-slop** skill on the prose.
3. **Write the intake** to `.case-study/<slug>/intake.yaml` (gitignored). Start from `assets/case-study-intake.yaml`; field rules are in `references/case-study-schema.md`.
4. **Prepare.**
   ```
   pnpm case-study prepare .case-study/<slug>/intake.yaml
   ```
   This writes a preview folder and touches nothing anyone can see. Add `--skip-image` to validate without generating art, `--replace` to overwrite an existing slug.

   **`--replace` overwrites the whole row, it does not patch it.** Every column is set from the intake, so a field you leave out is a field that gets cleared on a live page — an omitted `at_a_glance`, `tracks`, `cta`, or `featured` silently disappears. Start from the published study's current content, not from a blank template.
5. **Stop at the approval gate.** See below.
6. **Publish**, only after the person says yes.
   ```
   pnpm case-study publish .case-study/<slug>/preview
   ```
7. **Report** the live URLs the command prints. If the study should *lead* an industry page rather than merely appear on it, that is still a repository edit to `INDUSTRY_GROUPS[].proof` in `lib/content/industries.ts` — say so.

## The approval gate

**Never run `publish` in the same turn as `prepare`.** Present the result and wait for the person to answer.

Show them, in one message: the copy from `report.md`, the generated `hero.webp` (actually view it), the resolved payload, every warning the run produced, and every figure exempted with `--allow-metric`.

If they want changes, edit the intake and re-run `prepare`. Never hand-edit the preview folder — `publish` re-hashes the image against the manifest and will reject it.

| Rationalization | Reality |
|---|---|
| "They already said publish this case study" | They approved the task, not this draft. They have not seen the copy or the image yet. |
| "They're in a hurry" | Publishing is instant and public. A retraction is not. |
| "The scans passed, so it's clean" | The scans catch violations, never compliance. Only a person can confirm a name was approved. |
| "It's a replacement, they've seen it before" | A replacement overwrites a live page. It needs the gate more, not less. |
| "I'll publish and fix anything after" | The page is live and crawlable the moment the row commits. |

**Red flags — stop:** running `publish` without having shown the image; describing the copy instead of quoting it; treating an earlier "yes" as covering this draft; calling the gate a formality.

## Which database you are writing to

Two commands, and the difference is the whole point:

| Command | Env file | Target |
|---|---|---|
| `pnpm case-study …` | `.env.local` | whatever that file points at — normally the local stack |
| `pnpm case-study:prod …` | `.env` | **production. This is the live site.** |

Publishing to production takes the `:prod` suffix deliberately. Never reach for
it because a command failed against local — check which database you meant
first. Confirm the target with the operator before the first `:prod publish` of
a session.

Both files must hold `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and
`OPENAI_API_KEY`. The pnpm script loads one with `node --env-file`, which
**throws an opaque Node error if the file is missing** rather than reaching the
pipeline's own message. Copy `.env.example` first.

The storage bucket is created once per project, per environment:

```
pnpm case-study bootstrap          # local
pnpm case-study:prod bootstrap     # production
```

## When the pipeline refuses

It fails loudly and names the field. Exit codes: `1` invalid intake, `2` missing configuration, `3` a remote refused, `4` retries exhausted, `5` the write failed and the uploaded image was removed (safe to re-run), `6` the write failed and the image was **not** removed — it prints the path to delete by hand.

A confidential term or an undefended number is a hard stop. Fix the copy or add the figure to `measurement_sources` with how it was measured. Do not work around a scan.
