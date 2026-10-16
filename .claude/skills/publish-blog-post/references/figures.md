# Body syntax

GitHub-flavoured markdown, rendered by `components/Markdown.tsx`. Raw HTML is **not** rendered (it prints as text), so everything beyond markdown is one of the fenced figures below, declared as JSON. A malformed figure fails `pnpm blog prepare`.

## Headings

`##` for sections, `###` below. Never `#`. Three or more `##` sections add a table of contents automatically. The first `##` is where the inline CTA appears, just before the second section.

## Images

```markdown
![What the image shows and why it is here](images/eval-dashboard.png "Optional caption that adds something")
```

A local path in `.blog/<slug>/images/`, listed under `images:` in the intake with `cleared: true`. Rendered at its own aspect ratio, never cropped. Alt text is required.

## Footnotes (the Sources list)

```markdown
Clicks fell about 40% when an AI Overview appeared.[^agarwal]

[^agarwal]: Agarwal & Sen, "The Impact of Google AI Overviews on Publisher Traffic", SSRN, 2026. https://ssrn.com/abstract=6513059
```

Every citation needs a definition and every definition a citation. They render as a visible "Sources" section, which also appears in the TOC.

## Callout

A definition, warning or rule of thumb that **adds** something the surrounding text does not. Never a pull quote of the body.

````markdown
```callout
{"kind": "definition", "title": "The production gap", "body": "The distance between a system that works when its builders run it and one an operations team can run without them."}
```
````

`kind`: `note`, `warning` (shown as "Watch for") or `definition`.

## Steps

A numbered process, where order is the information. Two or more steps.

````markdown
```steps
{"caption": "The five pre-build questions, in the order we settle them.", "steps": [{"title": "Operating owner", "detail": "A named person who is paged when it breaks."}, {"title": "Data route", "detail": "How live data reaches the system, approved by its owner."}]}
```
````

## Bars

A horizontal bar comparison. Values are shown as text beside each bar. `source` is required.

````markdown
```bars
{"caption": "Answer accuracy by chunking strategy, on our 120-question evaluation set.", "unit": "%", "source": "RegainFlow evaluation, aerospace engagement, 2026", "bars": [{"label": "Fixed 512 tokens", "value": 61}, {"label": "Section-aware", "value": 78, "note": "Kept tables whole"}]}
```
````

## Video

A YouTube video behind a click-to-load facade (no player script until pressed). `youtube` is the 11-character id, not a URL.

````markdown
```video
{"youtube": "dQw4w9WgXcQ", "title": "Walkthrough of the evaluation harness", "caption": "Optional caption."}
```
````

## Tables

Standard GFM tables. Wide tables scroll horizontally on phones.

## Links

- Internal: `[descriptive anchor](/insights/blog/other-post)`. Opens in the same tab. A link to an unpublished post fails `prepare`.
- External: `[source name](https://…)`. Opens in a new tab.
