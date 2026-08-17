# RegainFlow — design system

The brand and its implementation, in one place.

This document describes **what the rules are and why they cannot be broken**. The
[README](../README.md) describes **how the machinery works** — the Bayer matrix behind the
halftone, the isometric projection math, the port/route rule, the analytics listener. Where
the two touch, this file points there rather than restating it.

Everything below is extracted from shipping code. Nothing here is aspirational. Patterns the
site has not needed yet — form inputs, tables, toasts, error and empty states, light mode —
are **not defined**, and are listed as gaps at the end rather than invented here.

- **Part 1 — [Brand foundations](#part-1--brand-foundations):** positioning, voice, the mark,
  color, type.
- **Part 2 — [Implementation contract](#part-2--implementation-contract):** what to reach for
  when adding something, and the rules that must survive it.

---

# Part 1 — Brand foundations

## Positioning

| | |
|---|---|
| **Name** | RegainFlow |
| **Category** | AI engineering & transformation partner |
| **Tagline** | AI transformation, from ambition to operation. |
| **Audience** | Public agencies and complex organizations, across four industries: public safety; infrastructure and utilities; federal, state, and local government; and defense and aerospace. Engineering-led, focused on government and regulated environments, without excluding the complex commercial organizations the same engineering applies to. |
| **Mission** | RegainFlow helps organizations move at the speed of their ambition. |

Source of truth: `lib/site.ts` and `lib/content/company.ts`. These are constants, not prose —
import them, never retype them. `app/llms.txt/route.ts` generates from the same modules, so
what an assistant quotes is what the site says.

## Voice

The register is **senior operator, not vendor**. It is defined by the copy that ships, not by
adjectives. Five rules, each visible in the existing content:

**1. Claim, then evidence.** The manifesto is the purest form — a flat assertion, then the
reasoning that earns it. Never the assertion alone.

> **A pilot is not a result.**
> Demos are cheap and plentiful. The work that matters is everything between a thing that
> impresses a room and a thing your business runs on Monday.

**2. Plain verbs, concrete nouns.** "Find the leverage." "Build the whole system." "Operate
it, then hand you the keys." Stage promises run 3–4 words; nav hints run one line. If a
sentence could appear on any consultancy's site, it is not written yet.

**3. Name the unglamorous thing.** "Retrieval, data quality, evaluation, observability, cost
control." Specificity is the proof of experience; abstraction reads as distance from the work.

**4. No number we cannot explain how we measured and defend in procurement.** This is policy,
not style, and it is stricter than the rule it replaced.

The case studies carry **no figures at all**, and neither does the home page. The previous rule
admitted any number published on the earlier RegainFlow site; that admitted per-study metrics
(`2×`, `80%`, `$8M`) and a set of career totals (`$5M+` value created, `5,000+` hours reduced,
`18+` transformations delivered) presented as RegainFlow's own. All of it is gone with the
twelve prior-career studies it described.

A number ships only once we can state how it was measured and hold that up in a procurement
conversation. Until then the engineering challenge, our exact role, what we built, and the
production outcome carry the proof — they are harder to write and much harder to dispute. A
plausible invented figure is worse than an absent one; a real figure we cannot source is not
much better.

`PROFILES` in `lib/site.ts` shipped empty for months and now carries exactly the two URLs that
were confirmed, for the same reason: a guessed profile URL asserts an identity we cannot back.
The same test governs prose: Leo's bio carries his service record because he stated it, and
carries no degree or certification because the only source for those was a login-walled page.
Where we cannot measure the return, we say so rather than imply one.

The distinction the rule turns on is *claim about return* versus *fact about the work*. A case
study's `context`, `constraints`, `role`, and `engineered` describe what the engagement **was** —
environment, scope, stack, method — so none of them is a claim the number rule governs. `outcome`
and `next` are, and they are written as what changed rather than by how much.

**`atAGlance` is the one field that carries numbers, and it is allowed to because it counts what
was *delivered*.** "2 workshop tracks" and "4 hrs of live delivery" are facts about the
engagement's scope; "40% faster reviews" would be a claim about its return and does not go there
or anywhere else. If a figure would need a footnote to defend, it is the wrong kind of figure.
(The old `metrics` field, which held exactly the wrong kind, is gone.)

**5. Say what we will not do.** "Dependency is a failure mode, not a business model." The
manifesto commits against things. That is what makes the commitments legible.

**Case.** Sentence case everywhere, with one exception: the monospace utility register
(eyebrows, labels, indices, diagram annotations) is uppercase. See [Type](#type).

## The mark

`app/icon.png` is the source of truth. It is **drawn, not generated** — `lib/ascii/monogram.ts`
traces it, so the geometry follows the icon and never the other way round.

**Construction.** Interlocked R and F sharing a diagonal, extruded down-and-right. The front
face is Warm White; the extruded sides are Flow Blue. The color lives in the *depth*, which is
what lets the letterform stay quiet at 24px.

Three facts govern any reproduction:

- **The bowl is a true annulus** — outer and inner circles concentric. Two things fall out of
  that rather than needing rules of their own: the outer disc reaches past the stem's right
  edge unaided, so there is no bottom bar to draw; and the sliver of Void that opens between
  stem and bowl appears exactly where the icon has it.
- **One slope, two uses.** The R's leg runs exactly parallel to the extrusion axis
  (`SLOPE = 0.8`). Deriving both from one constant is most of why the mark reads as a solid
  rather than a letter with a shadow behind it.
- **The mark's extrusion is *not* the isometric `+a` axis** used by the diagrams and the
  wordmark. It is steeper. Do not "correct" it — it follows the icon.

**In the interface, the wordmark is the logo.** There is no separate glyph in the header. The
whole word carries the same extrusion via `.rf-wordmark-3d`, built from **five stacked
text-shadows** rather than one, so the offset reads as a solid side instead of a drop shadow.

| Use | How |
|---|---|
| Header, footer | `.rf-wordmark .rf-wordmark-3d` — the word, extruded |
| Vector mark | `.rf-mark` with `.rf-mark-face` / `.rf-mark-depth`; 1.375rem tall, 1.5rem from `lg` |
| Hero | ASCII monogram at ~232 columns, dot-rendered in two stacked layers |
| OG cards | The same two dot layers, 380px of a 1200px card |
| Footer watermark | `REGAINFLOW` as SVG `text` with `textLength` |

The watermark is SVG rather than styled text because CSS `font-size` cannot guarantee the fit —
width depends on font metrics. `textLength="1000"` pins it to the container at any viewport and
`lengthAdjust="spacing"` absorbs the difference in tracking instead of distorting the glyphs.

**Never:** recolor the face or the depth; add a drop shadow or glow beyond the defined
extrusion; place the mark on a light ground (none is defined); stretch it — the ASCII cell must
stay square or the letterform distorts.

## Iconography

Icons come from **Lucide**, behind `components/Icon.tsx` — the only module permitted to import
`lucide-react`. Content modules hold an `IconName` string, never a component, because
`lib/content/*` is read by `app/llms.txt/route.ts` and the JSON-LD builders, neither of which
has any use for a React element.

Lucide was chosen against Phosphor on evidence rather than reputation. Phosphor is **filled
paths at every weight**, including `thin` — the thinness is baked into a 256×256 path, so
stroke width and terminals cannot be adjusted at all. Lucide draws `fill="none"
stroke="currentColor"` on a 24×24 grid, which is exactly the convention the hand-drawn SVGs in
`SiteNav.tsx` already use, and is therefore tunable to it.

**Two corrections make the set read as house rather than as a library someone installed:**

| Property | Lucide ships | We set | Where | Matches |
|---|---|---|---|---|
| `stroke-width` | `2` | `1.4` | `Icon.tsx` prop | The `SiteNav` chevron |
| `stroke-linecap` | `round` | `butt` | `.rf-icon` | Nothing here is round |
| `stroke-linejoin` | `round` | `miter` | `.rf-icon` | Same |

Presentation attributes lose to any CSS rule, which is why the two `stroke-*` overrides live in
`.rf-icon` and work despite Lucide writing `round` onto every `<svg>`. **Deleting those two
lines is the single easiest way to make the whole set look wrong** — nothing else on this site
has a rounded terminal, not a border, not a card, not an isometric model.

Icons carry `--color-rf-flow-soft`, the same as `.rf-index`, so a list that swaps numbers for
icons does not change color as well as shape. They are always `aria-hidden`: every call site
pairs the icon with the text it belongs to, so announcing it would read the item twice.

### Icons or numbers — the rule

**Structural devices encode something true about the content.** One question decides it:

> Does order carry information the reader needs?

- **Yes → number it.** `STAGES` (Discover before Implement), `ENGAGEMENT_PATH`, the assessment
  phases. An icon cannot express sequence. `L1`–`L4` also keep their marks, but those are
  identifiers rather than ordinals.
- **No → icon it.** `PRINCIPLES`, industry `stalls`. These are parallel items where which one a
  reader lands on has nothing to do with position. Use `ul`, not `ol` — the list type makes the
  same claim the marker does.
- **Neither, sometimes.** The manifesto takes no marker at all. Its eight entries are arguments,
  not categories — *"A pilot is not a result"*, *"Nobody gets used"* — so a number implies a
  sequence that does not exist and an icon is decoration standing in front of a claim. The
  register there is a flat assertion followed by the reasoning that earns it; anything to the
  left of the claim competes with it.

**Pick the icon for the sentence, not for the section.** A generic warning triangle on all
sixteen industry stalls would be worse than the numbers it replaced. If no honest icon exists
for an item, that list wants no marker.

`ICONS` in `Icon.tsx` is a **closed map**, like `AI_GLYPHS`. `IconName` derives from its keys, so
a name that does not exist fails the typecheck rather than rendering an empty box.

`/llm-info` deliberately keeps route ticks where the industry pages take icons: it is written to
be quoted, and a glyph carries nothing into a retrieved chunk.

## Case study artifacts

A case study may carry **artifacts** — sanitized diagrams reconstructed from an engagement.
They follow the same closed-union pattern as the icons: `kind` picks a layout component,
the row supplies the labels. `spine` and `branch-stack` render a directed run whose last node
takes the Flow Blue edge; `kit` renders an unordered grid, because contents are not a sequence.

Two rules, and the second is not negotiable:

- **Built from HTML and CSS, never an image of words.** Labels stay selectable, translatable,
  and readable by a screen reader.
- **Never a screenshot of a source document.** The material behind these is confidential, and
  a screenshot is the one format that cannot be sanitized by review. Reconstruct the concept.

The `figcaption` doubles as the accessible description, so it has to carry the meaning without
the layout — the arrangement is presentational.

Adding a fourth `kind` means adding a branch to `components/case-study/Artifact.tsx` and a
member to `ArtifactKind`. An unknown kind degrades to a list rather than throwing, so a row a
generator wrote against a newer vocabulary still renders something readable.

## Case study images

`.rf-case-cover` is 16:9, against the report cover's 17:22 — a study's image is a scene rather
than a document, and a portrait block at the top of a card pushes the title below the fold in a
three-across grid. `object-fit` is `cover` rather than the report's `contain`: there is no title
to crop off, and letterboxing an arbitrary image reads as a mistake. `.rf-case-hero` widens it
to 21:9 on the study page.

The ratio is declared in CSS so nothing intrinsic travels with a URL pasted into the table, and
so a row of cards stays level whether or not each study has art. **Both surfaces render nothing
when the image is absent** — most studies will have none for a long time, and a placeholder
frame is worse than no frame.

## Color

Eight tokens, declared once in `@theme` in `app/globals.css`. There are no others, and every
one is available both as a Tailwind utility (`bg-rf-void`, `text-rf-slate`) and as a custom
property (`var(--color-rf-void)`).

| Token | Hex | Role |
|---|---|---|
| `rf-void` | `#050912` | The page ground. Also `themeColor` and the iOS status bar. |
| `rf-navy` | `#0a1222` | Raised surfaces: cards, iso frames, menu panel, active rows. |
| `rf-warm` | `#f2f5fa` | Headings, primary text, the mark's front face, primary CTA fill. |
| `rf-slate` | `#8b96aa` | Body copy, eyebrows, captions, secondary CTA border. |
| `rf-flow` | `#2f6bff` | **The accent.** Strokes, nodes, ticks, active edges — see below. |
| `rf-flow-soft` | `#6e9bff` | The accent when it has to carry text. Focus rings. |
| `rf-hairline` | `#253149` | Borders and rules. Structure only, never content. |
| `rf-line` | `#4a5872` | Structure strokes inside the isometric models. |

### The Flow Blue rule

**Flow Blue is below AA for small text on both grounds.** This is the single most important
rule in the palette, and it is the one most likely to be broken by someone reaching for the
brand color to make something feel on-brand.

| Foreground | on Void `#050912` | on Navy `#0a1222` |
|---|---|---|
| `rf-warm` | 18.2:1 | 17.1:1 |
| `rf-slate` | 6.7:1 | 6.3:1 |
| `rf-flow-soft` | 7.4:1 | 6.9:1 |
| `rf-flow` | **4.45:1** | **4.16:1** |
| `rf-line` | 2.8:1 | 2.6:1 |
| `rf-hairline` | 1.53:1 | 1.44:1 |

Every ratio names its background, deliberately. "Flow Blue is 4.45:1" applied on Navy is wrong
by enough to matter — cards and iso frames are Navy.

So:

- **Flow Blue is for 1–2.5px strokes, nodes, ticks, and inset active edges.** Route lines, the
  CTA's leading rule, the nav underline, the layer spine, the `box-shadow: inset 3px 0 0`
  marking an active panel.
- **When the accent must be read as text, use `rf-flow-soft`.** Indices (`.rf-index`), menu
  numerals, plane labels, the iso caption state. All of them.
- **`rf-hairline` never carries content.** At 1.44:1 it is a structural line and nothing else.
  The footer watermark is the deliberate edge case — mixed 94% hairline with warm to reach
  ~1.8:1, legible as a shape and clearly behind the content.
- **`rf-line` exists because hairline was too dim for the models.** At 1.44:1 on Navy the
  isometric drawings read as ghosts; `rf-line` is 2.6:1 — legible, still well under Flow Blue,
  so the accent leads.

### Dark only

There is no light mode. `color-scheme: dark` is set on `:root`, `themeColor` matches Void, and
`colorScheme: "dark"` is declared in the viewport export. Building a light theme means defining
a second full palette with its own measured ratios — it is not a matter of inverting these.

### Surface hierarchy

Three levels, and only three: **Void** (page) → **Navy** (raised) → **hairline border**
(bounded). There are no elevation shadows anywhere on the site. Depth is drawn — in the mark's
extrusion and the isometric models — not simulated with blur.

## Type

Two families, loaded through `next/font/google` in `app/layout.tsx`.

| | Family | Weights | Variable |
|---|---|---|---|
| Display | **Space Grotesk** | 400, 500, 600 | `--font-space-grotesk` → `--font-display` |
| Utility | **IBM Plex Mono** | 400, 500 | `--font-ibm-plex-mono` → `--font-mono` |

Body copy is Space Grotesk 400. Headings are **500, not 600** — 600 is reserved for the
wordmark and the watermark, which is part of how the wordmark reads as a mark rather than as
text.

### The scale

| Class | Size | Role |
|---|---|---|
| `.rf-h1` | `clamp(2.05rem, 3.9vw, 3.25rem)` | Page headline. One per page. |
| `.rf-h2` | `clamp(1.6rem, 3vw, 2.35rem)` | Section headline. |
| `.rf-h3` | `clamp(1.05rem, 1.4vw, 1.2rem)` | Card and block headings. |
| `.rf-lead` | `clamp(1rem, 1.1vw, 1.075rem)` | The paragraph under a headline. Slate. |
| `.rf-body` | `0.9375rem` | Everything else. Slate. |
| `.rf-stat` | `clamp(1.75rem, 3.4vw, 2.6rem)` | Figures. |

Headings tighten as they grow (`-0.012em` → `-0.03em`) and use `text-wrap: balance`.

**`.rf-h1` is capped at 3.25rem and the cap is load-bearing** — above it the hero headline runs
to three lines and pushes the CTAs off the fold.

### The mono register

Monospace is not decoration here. It marks a specific class of text: **machine-adjacent
labelling** — things that index, name, or annotate rather than speak.

| Class | Tracking | Used for |
|---|---|---|
| `.rf-eyebrow` | `0.2em` | The label above a headline |
| `.rf-utility` | `0.16em` | Footer labels, stat labels, legal line |
| `.rf-index` | `0.14em` | Sequence numerals — Flow Soft |
| `.rf-mech` | `0.13em` | Mechanism chips, pipe-separated |
| `.rf-annotation` | `0.14em` | SVG annotations inside diagrams |

All uppercase, all Slate except `.rf-index`. Prose is never monospace; a label is never
sentence case.

### Measure

Line length is capped explicitly, per block, in `ch` — currently ranging `18ch` to `62ch`.
Representative: `.rf-lead` in the hero `46ch` · `PageHeader` lead `52ch` · `.rf-layer-enables`
`44ch` · footer tagline `34ch` · a short `.rf-h2` `18ch`. Body prose sits in the 48–58ch band.

Set a measure on every new text block. The 12-column grid alone will not do it.

## The brand beyond the site

The OG card (`lib/og.tsx`, rendered at `app/opengraph-image.tsx` and
`app/insights/[slug]/opengraph-image.tsx`) is currently the only extension of the identity
beyond the site itself, and it is the pattern for any future collateral: Void ground, the
dot-rendered RF at ~32% of the width, a Warm White title, a Slate lead, one Flow Blue rule.

Two constraints carry over to anything else built this way:

- **Satori reads neither Tailwind nor CSS custom properties**, so `lib/og.tsx` repeats the
  palette as six hex literals. See [Changing a token](#9-changing-a-token) — this is the most
  likely thing to silently drift.
- **The fonts are vendored as `.ttf` under `app/fonts/`** because `next/font/google` only emits
  hash-named `.woff2` into `.next`, which Satori cannot read. Those binaries never reach the
  browser.

---

# Part 2 — Implementation contract

Organized by the decision you are making. The class names are the answer; the reasoning is the
point. All classes are defined in `app/globals.css` under `@layer components`.

## 1. Adding a section

```tsx
<section className="rf-section">
  <div className="rf-shell rf-grid gap-y-10 rf-band">
    <div className="col-span-full lg:col-span-5">
      <p className="rf-eyebrow">Label</p>
      <h2 className="rf-h2 mt-5">Headline</h2>
    </div>
    <div className="col-span-full lg:col-span-6 lg:col-start-7">…</div>
  </div>
</section>
```

- **`.rf-section`** — a bottom hairline, and nothing else. A wavy section rule was tried and
  removed; see [the wave](#8-the-wave--a-closed-list).
- **`.rf-shell`** — `max-width: 80rem`, centered, gutters `clamp(1.25rem, 4vw, 3.5rem)`. Every
  full-bleed element that must align to the content edge repeats that exact clamp — the
  marquee and the watermark both do.
- **`.rf-grid`** — 12 columns, `column-gap: clamp(1rem, 2.2vw, 2rem)`. Row gap is set per
  section (`gap-y-*`), because it varies with content.

**Vertical rhythm — a section must choose a weight.** Three bands, declared once in
`app/globals.css`. They replaced a single standard padding that seven of ten sections used
byte-identically, which meant the argument, the offer, the proof, and a two-line teaser all
occupied the same vertical space. A reader scrolling fast got no signal about what mattered.

| Class | Padding (base → `md` → `lg`) | For |
|---|---|---|
| `.rf-band-lead` | `4.5rem` → `6rem` → `7.5rem` | The two or three sections a page stands on |
| `.rf-band` | `3.5rem` → `4.5rem` → `5.5rem` | Default. The previous standard value, unchanged |
| `.rf-band-tight` | `3rem` → `3.5rem` → `4rem` | A section whose job is finished when the reader clicks through |

**`lead` stops meaning anything the moment a third section on the same page takes it.** Take it
from something else rather than adding it. Every route currently spends it exactly twice or
once:

| Route | `lead` sections |
|---|---|
| `/` | `ProductionGap` (the argument), `FreeAssessment` (the conversion) |
| `/services` | `RegainFlowSystem` (the framework), `FreeAssessment` |
| `/industries` | The four industry cards — the hub's whole reason to exist |
| `/industries/[slug]` | `AssessmentCallout` — the conversion, and the only one on the page |
| `/insights` | The case studies |

**Ground alternates with weight.** Void and Navy carry the beat — the home page ran four Void
sections back to back, and the change to Navy at `StageSummary` is what tells a scrolling reader
the diagnosis has ended and the offer has started. Never leave more than two same-ground
sections adjacent unless one carries the wave, which distinguishes it on its own.

`PageHeader` keeps `py-12 md:py-16 lg:py-20` — it is the opening block, not a band. `Hero` sets
its own, because it carries a full-bleed element that supplies the space.

The reference and form routes (`/llm-info`, the report pages, `/contact`, `/company`) still use
raw `py-*` values. Move each to a band when you next touch it.

**Layout convention.** Headline column left at `lg:col-span-5`, content right at
`lg:col-span-6 lg:col-start-7`, everything `col-span-full` below `lg`. Card grids are
`grid gap-4 sm:grid-cols-2` (or `sm:grid-cols-3` for stats, `gap-8`).

## 2. Setting text

Use the [scale](#the-scale). Two rules beyond it:

- **Set a measure.** Every text block gets an explicit `max-w-[NNch]`.
- **Spacing after a heading is conventional:** eyebrow → `mt-5`/`mt-6` → headline → `mt-5`/`mt-6`
  → lead → `mt-8`/`mt-9` → controls.

## 3. Adding a control

| Class | Use |
|---|---|
| `.rf-cta-primary` | The conversion. Warm fill, Void text. One per content section, plus the persistent header CTA. |
| `.rf-cta-secondary` | The alternative. Slate border, transparent fill. |
| `.rf-cta-compact` | Modifier for the header CTA only. |
| `.rf-nav-link` | Navigation and "read more" links. Underline grows from the left. |
| `.rf-text-link` | A link inside prose. Hairline underline that warms to Flow on hover. |
| `.rf-ai-link` | Icon-only assistant links in the footer. |
| `.rf-skip-link` | Skip to content. Already in `app/layout.tsx`; do not add a second. |

Both CTAs are `min-height: 3rem`, `border-radius: 2px`. Form inputs are controls too and
inherit both — see [Adding a form](#10-adding-a-form).

**Controls are 2px; surfaces are square.** Only `.rf-cta-primary`, `.rf-cta-secondary`, and
`.rf-skip-link` carry a radius, and it is 2px. Cards, iso frames, menu panels, and stage panels
have none. This is a system of hairlines and right angles — a rounded card reads as borrowed
from another system.

**The route stub.** `.rf-cta-primary::before` is a 14px Flow Blue rule that extends to 24px on
interaction. It is the same 14px mark the disclosure marker opens with and the same tick the
marquee rows carry — one vocabulary, three places.

### The hover gate — do not break this

**Every hover-only declaration must sit inside `@media (hover: hover)`.** iOS Safari applies
`:hover` on tap and holds it until the user taps something else, so an ungated hover rule reads
as stuck state on a phone. Ungated, a single tap on the marquee left it paused for the rest of
the visit.

The `:focus-visible` half of each pair stays **outside** the query — keyboard users need it at
every width. The shape is always:

```css
.thing:focus-visible { /* state */ }

@media (hover: hover) {
  .thing:hover { /* the same state */ }
}
```

Touch-only adjustments go in `@media (hover: none)`.

## 4. Adding a surface

| Class | Use |
|---|---|
| `.rf-card` | Navy fill, hairline border, `1.35rem` padding, full height. Border warms to Slate on hover. |
| `.rf-iso` / `.rf-iso-frame` | The framed container for an isometric model. |
| `.rf-stage-panel` | Process panels — the only strongly bordered modules on the page. |
| `.rf-portrait` | Team photographs. `4/5` ratio, `object-position: center 25%`, capped at `16rem`. |
| `.rf-disclosure` | Native `<details>`. Folds content; never hides it from the server output. Takes `.rf-disclosure-summary` on the `<summary>` and a `.rf-disclosure-marker` span inside it. |
| `.rf-report-cover` | The frame around a report cover. Declares `aspect-ratio: 17/22` and `object-fit: contain`, so covers exported at different page sizes still leave a grid row level. `.rf-report-cover-lead` caps the hero copy at `24rem`. |
| `.rf-gate` | The email ask on a report page. Bordered, Navy, with the Flow Blue inset edge — it is the one module on the page asking the reader for something. |
| `.rf-audio` | The frame around the audio overview. The transport inside it is ours: `.rf-audio-mark` (the RF monogram tile), `.rf-audio-range` (the scrubber), `.rf-audio-rate`, `.rf-audio-play`, `.rf-audio-skip`. The one platform widget the system replaces rather than styles — at the size it occupies, a native player reads as an embed. `.rf-audio-native` is the `<noscript>` fallback, where the transport does go back to the platform. |

**Active state is an inset shadow, never a wider border.** `box-shadow: inset 3px 0 0
var(--color-rf-flow)` on `.rf-stage-panel` and `.rf-assess-step`; a `border-left` that is
already 2px and transparent on `.rf-menu-item`. Nothing reflows when state changes.

**The portrait cap is deliberate.** `width: 100%` with `height: auto` let a portrait grow to the
full grid column and pushed the name and bio of the person it belongs to below the fold — you
had to scroll past a face to find out whose it was.

Interactive rows (`.rf-layer-toggle`, `.rf-assess-toggle`) make the **whole row** the target,
full width, with the surface lifting to Navy. Shifting one numeral's color does not read as
interactive.

## 5. Adding a diagram

One projection for every model, so they read as a set: `+a` right-and-down, `+b` left-and-down,
`+c` straight up. The primitives are in `components/stage-models/iso.tsx`; the projection math
and **the port/route rule** are documented in the [README](../README.md#the-isometric-models)
and are not repeated here.

The stroke vocabulary is the design half, and each class means something:

| Class | Meaning |
|---|---|
| `.rf-iso-line` | Structure. `rf-line`, 1px. Navy fill so overlapping solids occlude. |
| `.rf-iso-accent` | The subject. Flow Blue, 1.5px. |
| `.rf-iso-route` | Flow between solids. Flow Blue, 1.5px. |
| `.rf-iso-dim` | Considered and not chosen. Hairline. Still there, no longer the subject. |
| `.rf-iso-ghost` | Absent or implied. Slate, dashed. |
| `.rf-iso-grid` / `.rf-iso-ground` | The plane the model sits on. Recedes. |
| `.rf-iso-node` / `.rf-iso-node-muted` | Route terminals — filled, or outlined. |
| `.rf-iso-pulse` | Traffic. Flow Soft, `stroke-dasharray: 3 22`. |
| `.rf-iso-spine` | The through-line of a stack. Drawn *before* the plates so each occludes it. |
| `.rf-iso-scan` / `.rf-iso-select` | The sweep that searches, and the cell that survives it. |
| `.rf-iso-thin` | Slate 1px — light structure that is not part of a solid. |
| `.rf-iso-dot` / `.rf-iso-dot-muted` | Points that are not route terminals. |

The framed container adds `.rf-iso-caption` above the drawing, with `.rf-iso-state` (Flow Soft)
for its right-hand status. Below `lg`, `.rf-model-pin` sticks the model under the header while
its rows are tapped — otherwise a tap changes a drawing that has already scrolled away.

`ClosingCTA` uses a flatter set for its converging-routes glyph: `.rf-route`, `.rf-head`,
`.rf-cta-pulse`, with `.rf-annotation` for labels. `.rf-route-tick` is the standalone version —
an 18px Flow Blue rule with a square terminal, used to introduce a response line.

**Every route gets a node at each end.** That is what makes a line read as attached rather than
as lying across the drawing. A terminal must never land on a dimmed solid.

Diagram labels use `.rf-plane-label` (Flow Soft) and `.rf-plane-name` (Slate, uppercase); both
go Warm when their plane is active. Unlabelled slabs tell the reader nothing — a diagram that
names nothing is doing no work.

## 6. Adding motion

**The resting state is always the finished state.** Play-once sequences are declared only under
`[data-play="true"]`, so server output, JavaScript-disabled, and `prefers-reduced-motion` all
show the completed model. Nothing is hidden waiting on a trigger that might never fire. Apply
the same test to anything new: if JS never runs, is the content there?

| Kind | What runs |
|---|---|
| Interface state | `0.18–0.25s`, `ease` |
| Arrival | `0.45–0.72s`, `cubic-bezier(0.2, 0.7, 0.3, 1)` |
| Model build | `0.32–0.55s`, staggered via `--rf-delay` |
| Continuous | pulses `2.2–2.6s` linear; monogram sheen `9s`; marquee `38s` linear |

Arrival easing is one curve — `cubic-bezier(0.2, 0.7, 0.3, 1)` — used by `.rf-plane`,
`rf-anim-rise`, `rf-anim-drop`, `rf-menu-in`, and `rf-reveal-in`. Do not introduce a second.

**`DitherReveal`** is the standard entrance: content resolves out of dot-noise as it arrives.
It fires **once** — content that re-animates on every viewport crossing makes a page feel
restless. Stagger siblings with `delay={i * 90}`.

**Reduced motion is not optional.** Continuous animation is declared inside
`@media (prefers-reduced-motion: no-preference)` so it never starts, and
`@media (prefers-reduced-motion: reduce)` strips transitions and reflows the marquee into a
static wrapped row. Any new continuous motion must be added to both.

## 7. Accessibility floors

These are floors, not guidelines. The site currently meets all of them.

- **44px minimum touch target.** `.rf-burger` is exactly `2.75rem` square — it is the one
  control a thumb has to hit before anything else works. Grow the *element*, not an overlay:
  `.rf-nav-link` adds `padding-block` under `@media (hover: none)` so stacked footer rows stay
  separated instead of overlapping, and `.rf-ai-link` uses negative-margin padding to gain the
  target without breaking its row alignment.
- **Focus is never removed.** Global `:focus-visible` is `2px solid var(--color-rf-flow-soft)`
  at `3px` offset. Flow *Soft*, not Flow — see [the Flow Blue rule](#the-flow-blue-rule).
- **`-webkit-tap-highlight-color` is cleared, and that is only safe because every control
  carries an explicit `:active` state.** If you add a control, give it one.
- **Contrast:** body text is Slate at 6.3:1 or better on both grounds. Never put small text in
  `rf-flow`, `rf-line`, or `rf-hairline`.
- **`scroll-margin-top: 5.5rem` on `[id]`** clears the sticky header on anchor jumps. It is
  scoped to any element with an id, not to `section`, because dropdown links target articles
  and list items too.
- **Progressive enhancement.** Nav group labels are real links; the dropdown is enhancement
  only. Disclosures are native `<details>`. Every route is reachable without JavaScript.
- **Pointer-aware copy.** "Hover a layer" is wrong on a phone. Both words ship and CSS picks
  via `.rf-on-pointer` / `.rf-on-touch`, so it stays correct with JS off.

## 8. The wave — a closed list

The wave motif appears in **three places and no more**:

1. The RF monogram — nav and vector mark
2. The hero ASCII field
3. `.rf-ascii-echo`, one still, near-imperceptible reprise in `ProofStrip`

That is the whole list. Wavy section rules and wave bullets were built and removed: repeated at
every boundary, the wave read as decoration rather than as identity. **Section rules are plain
hairlines.** Past the hero, the halftone carries through two devices only — `DitherReveal` and
the `ProofStrip` field.

Adding a fourth appearance is the most likely way to dilute the identity, and it will look
locally reasonable every time.

## 9. Changing a token

`@theme` in `app/globals.css` is the source of truth — **but `lib/og.tsx` hand-mirrors all six
palette hexes as literals**, because Satori reads neither Tailwind nor CSS custom properties.

**A palette change must be applied in both places.** Nothing will fail; the OG cards will
quietly keep rendering the old color. This is the single most likely thing in the system to
break silently.

Adding a token means adding it to `@theme` only — it becomes both a Tailwind utility and a
custom property from that one declaration. Do not add raw hex values in components; the only
literals in the CSS are `#ffffff` (CTA hover, selection) and the `rgb(… / …)` overlays derived
from Warm and Void.

**The palette has stayed at eight, and the forms are the reason that is worth stating.** A form
is the obvious place to want a ninth — every system has a red. This one does not, and the error
state is built from primitives that already existed instead: see below.

## 10. Adding a form

```tsx
<div className="rf-field">
  <label htmlFor="email" className="rf-label">Email</label>
  <input id="email" name="email" type="email" required maxLength={LIMITS.email}
         className="rf-input" aria-invalid={error ? true : undefined} />
  {error ? (
    <p id="email-error" className="rf-field-error">
      <span className="rf-route-tick" aria-hidden="true" />
      <span>{error}</span>
    </p>
  ) : null}
</div>
```

| Class | Use |
|---|---|
| `.rf-field` | One field: label, control, error slot. `flex-col`, `0.5rem` gap. |
| `.rf-label` | The label. Mono utility register — `data-optional` appends "(optional)". |
| `.rf-input` / `.rf-textarea` | Navy fill, hairline border, 2px radius. Input is `min-height: 3rem`; textarea is `9rem` and vertical-resize only. |
| `.rf-field-error` | The message. Warm text behind a `.rf-route-tick`. |
| `.rf-form-note` | Slate, `0.8125rem`. The line beside a submit button. |
| `.rf-honeypot` | Off-screen wrapper for the bot trap. Never `display: none` — see below. |

**An input is a control, so it takes the control rules.** `border-radius: 2px` and
`min-height: 3rem`, both matching the two CTAs, which is what lets a submit button sit under a
field and read as the same row of the system. Surfaces stay square.

**Labels are the mono register**, and that is not decoration: a field label indexes and names
rather than speaks, which is exactly what [the mono register](#the-mono-register) marks.

**`:focus`, not `:focus-visible`, on the field itself.** `:focus-visible` does not fire on click
for a text input, so the global ring alone leaves a field that has the caret looking identical to
one that does not. Both are declared; the hover half still sits inside `@media (hover: hover)`.

**There is no error colour, and there must not be one.** The invalid state is
`box-shadow: inset 3px 0 0 var(--color-rf-flow)` — the same inset-edge device
[Adding a surface](#4-adding-a-surface) uses for active, so nothing reflows, and Flow Blue is
legal there because it is a stroke rather than text. The message itself is **Warm**, introduced
by the `.rf-route-tick` that [Adding a diagram](#5-adding-a-diagram) defines as the mark that
opens a response line. An error is a response line. Meaning lives in the words, never in the
colour, which is also what [the accessibility floors](#7-accessibility-floors) require.

**Every limit is imported, never retyped.** `LIMITS` in `lib/forms.ts` is read by the client to
render `maxLength` / `minLength` *and* by the Server Action to validate. Browsers run constraint
validation with scripting off, so the attributes catch what they can before the POST; the server
rules are what actually enforce.

**The honeypot is positioned off-screen, not hidden.** `display: none` and `hidden` are the
first things a bot skips. `tabIndex={-1}` and `autoComplete="off"` are what keep it away from
keyboard users and password managers, and those are the half that actually matters.

**Forms submit to Server Actions, and the no-JS path is not optional.** `<form action={fn}>`
progressively enhances — with scripting off the browser performs a native POST. Measured on
`/contact` by replaying that POST as `multipart/form-data`: the action runs, `redirect()` answers
`303 See Other`, and a validation failure re-renders the page with the error in the response
HTML. `useActionState` is not what renders errors — it is what renders them without a round trip.

Apply the same test [Adding motion](#6-adding-motion) applies: if JS never runs, does this still
work? Where the honest answer is no, say so in the markup rather than papering over it —
`components/ReportGate.tsx` ships a `<noscript>` block with the direct download link, because its
reveal genuinely does need scripting and the file behind it is public anyway.

---

## Not yet defined

The site has never needed these, so no convention exists. Anyone adding one is designing, not
applying — extend the vocabulary above deliberately rather than importing a component library.

(Lucide is not the exception it looks like. It supplies *geometry*, not components: every icon
is retuned to the house stroke in `.rf-icon` and gated behind one module. A library that shipped
its own layout, spacing, or color would still be the thing this rule forbids.)

Tables · toasts and notifications · modals and dialogs · skeleton states · pagination · tabs ·
tooltips · light mode · route-level error states (404/500 render Next.js defaults).

Form validation and pending states are defined — see [Adding a form](#10-adding-a-form). Empty
states have one worked example and no rule: `/insights/reports` renders a headline, a sentence,
and a route out when nothing is published, rather than an empty grid.

## Files

| Path | Holds |
|---|---|
| `app/globals.css` | `@theme` tokens, the type scale, every `.rf-*` class, keyframes |
| `app/layout.tsx` | Font loading, `themeColor`, `colorScheme`, metadata |
| `app/icon.png` | The mark — source of truth |
| `lib/site.ts` | Positioning, tagline, audience, contact, profiles, nav tree |
| `lib/content/` | All copy: stages, layers, case studies, company, reports |
| `lib/forms.ts` | Field limits and validators. **No imports** — read by client and server both |
| `lib/supabase.ts` | The secret-key client. Server only |
| `supabase/migrations/` | The two tables the forms write to, their grants, and their RLS posture |
| `lib/og.tsx` | The OG card **and a hand-mirrored copy of the palette** |
| `lib/ascii/monogram.ts` | The mark's geometry, traced from the icon |
| `components/Icon.tsx` | The icon set. **The only module that may import `lucide-react`** |
| `components/stage-models/iso.tsx` | Isometric primitives |
