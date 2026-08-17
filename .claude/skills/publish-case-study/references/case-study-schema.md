# Case study intake schema

The exact contract between `assets/case-study-intake.yaml` and the
`public.case_studies` row. Enforced by `scripts/case-study/intake.mts` in
regainflow-v3; the database enforces a subset again as check constraints.

Unknown keys are **rejected**, not ignored.

## Required

| Field | Rules |
|---|---|
| `slug` | `^[a-z0-9]+(-[a-z0-9]+)*$`. The URL and the primary key. |
| `title` | The h1 and the card heading. |
| `industry` | Industry or environment. Never a client name. |
| `summary` | One line. The card's only body copy. |
| `capability_tags` | At least one. |
| `context` `constraints` `role` `outcome` `next_body` | The narrative spine. |
| `engineered` **or** `stages` | Exactly one. See below. |
| `image_alt` + `image_prompt` | Required unless `--skip-image`. |

## Optional

`eyebrow`, `meta_title` (≤70), `meta_description` (≤165), `next_label`,
`at_a_glance`, `deliverables`, `tracks`, `cta`, `artifacts`,
`section_headings`, `industries`, `featured`, `sort_order`.

## Rules the database also enforces

- **`engineered` XOR `stages`.** The page renders the staged version when
  present, so both means the same content twice under one heading.
- **`image_alt` and the image are paired.** `case_studies_image_alt_paired`
  rejects one without the other. With `--skip-image`, alt text is cleared.
- **`artifacts[].kind` is a closed union** — `spine`, `branch-stack`, `kit`.
  It resolves to a React component; an unknown kind renders *nothing*, so the
  study would publish with a silently missing diagram.
- **Optional blocks are arrays**, except `cta` and `section_headings`, which
  are objects.
- **`tracks` needs two or more.** One track is the study itself.

## Field shapes

```yaml
at_a_glance:   [{ value, label }]          # scope delivered, never impact
stages:        [{ name, detail }]          # renders numbered; order matters
tracks:        [{ key, label, thesis, context: [], demos: [] }]
artifacts:     [{ kind, title, caption, nodes: [] }]
cta:           { heading, body, secondaryLabel }   # all three or none
section_headings:
  tracks:       { eyebrow, title, lead }
  artifacts:    { eyebrow, title }
  deliverables: { title }
```

`section_headings` members are spread over `DEFAULT_SECTION_HEADINGS`. **Omit a
member to keep its default** — an empty string overwrites the default with
nothing, so the pipeline strips empties before writing.

## Placement

`industries` accepts only these group slugs:

```
public-safety   infrastructure-utilities   federal-state-local   defense-aerospace
```

Listing a group puts the study **on** that page automatically. Making it
**lead** the page is still a repository edit to `INDUSTRY_GROUPS[].proof` in
`lib/content/industries.ts`, which controls which studies come first and in
what order.

`featured` puts it on the home page, which shows at most three.

## Governance fields

Neither reaches the database.

**`deny_terms`** — every name that must never appear. Matched
case-insensitively, on word boundaries, across hyphens, underscores, and
spaces, so `Acme Corp` catches `acme-corp` in a slug and `ACME_CORP` in a
prompt. Scanned across every string in the payload *and* the image prompt,
which leaves the building even though it never renders. A hit is a hard stop
that names the field. Nothing is ever silently redacted.

**`measurement_sources`** — a map from the exact figure to how it was measured.
The scanner rejects figures shaped like claims:

| Caught | Not caught |
|---|---|
| `40%`, `$1.2M`, `3x`, `2 million` | `4 hrs`, `12 document types`, `90-minute` |
| a benefit verb near a digit — "reduced … to 2 days" | plain counts |

An entry forgives only the figure it overlaps, never its neighbours: declaring
`40%` does not exempt a `$2M` in the same sentence. `--allow-metric "<string>"`
does the same thing from the command line, and every exemption is listed in the
approval report.

`at_a_glance[].value` is the documented exception — it counts what was
delivered — but percentages, currency, and multipliers are still rejected
there, because those are impact claims wearing a scope field.

## The image

Generated at 1536×1024 and cropped by CSS to 16:9 on the card and 21:9 on the
study page, **both cutting from the top and bottom**. `image_prompt` supplies
the subject only; the pipeline prepends a fixed preamble carrying composition
(subject inside the middle 60% band), the palette, and the bans on text, logos,
faces, and UI screenshots. Write the subject, not the framing.

## Replacing a study

`--replace` is a **full overwrite**, not a patch. `publish_case_study` sets
every column from the payload, so anything absent from the intake is cleared on
a page that is already live: drop `at_a_glance` and the scope facts vanish,
omit `featured` and the study leaves the home page. Rebuild the intake from the
study's current content before replacing it.

## Set by the pipeline, not the intake

`status` (`published`, or `draft` with `--draft`), `image_url` (the
content-hashed storage URL), `created_at`, `updated_at`. `sort_order` defaults
to one past the current maximum.
