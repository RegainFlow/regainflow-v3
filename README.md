# RegainFlow — website

Marketing site for RegainFlow, an AI transformation partner.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · npm.
No motion, canvas, WebGL, or 3D dependencies — every diagram is SVG and CSS.

## Requirements

Node.js **>= 20.9.0** (Next.js 16 refuses to start below this). Node 22 LTS recommended.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck
```

## Routes

| Route                                                          | Purpose                                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                                                            | Positioning, the production gap, condensed services, proof, partnership model                   |
| `/services`                                                    | Full Discover / Implement / Scale, the four capability layers, engagement path, free assessment |
| `/insights`                                                    | Selected enterprise AI and platform experience — six featured, all twelve in a disclosure       |
| `/insights/[slug]`                                             | One case study in full: challenge, solution, capabilities, impact                               |
| `/company`                                                     | Who we are, manifesto, contact                                                                  |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/opengraph-image` | Generated                                                                                       |

## Structure

| Path                       | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `app/layout.tsx`           | Fonts, metadata, header, `main#main`, footer, organization JSON-LD               |
| `app/globals.css`          | Palette tokens, type scale, the wave, navigation, cards, model styles, keyframes |
| `lib/ascii/`               | The ASCII engine — `dither`, `field`, `monogram`                                 |
| `lib/site.ts`              | Domain, contact destinations, positioning copy, navigation tree                  |
| `lib/content/`             | Stages, layers, case studies, company — the single source for every page         |
| `lib/seo.ts`               | JSON-LD builders and the `<` escape used before injection                        |
| `components/brand/`        | `AsciiField` (animated), `AsciiMonogram` (still)                                 |
| `components/SiteNav.tsx`   | Desktop dropdowns and the mobile menu (the only navigation client component)     |
| `components/stage-models/` | The isometric primitives and the four stage models                               |

### The ASCII engine

A dot halftone. `lib/ascii/dither.ts` maps a tone to one of ` · : •` through an
8×8 Bayer matrix, so *density* traces the gradient and two neighbouring cells at
the same tone can disagree. That disagreement is the texture. A per-cell
threshold would band; random noise would fizz.

The matrix is 8×8 rather than 4×4 because the ramp has only three intervals, so
*all* the tonal resolution lives in the threshold — 64 steps between one dot and
the next instead of 16. It is tone-neutral: swapping it changes measured ink
density by nothing at all. What it buys is the monogram's extruded sides, which
fade continuously with depth and terraced visibly at the coarser granularity.

**Dots only — never block glyphs.** `▪ ▓ █` were tried and they fail
structurally, not aesthetically. Square cells force `line-height` down to the
monospace advance width (0.6), which is *less* than a glyph's em box, so block
glyphs overlap their vertical neighbours and any dense region welds into a solid
slab. No opacity or grid size fixes it. Every character in the ramp is ASCII or
Latin-1: a glyph the font lacks falls back to another family with a different
advance width and shears the whole grid.

- **`field.ts`** — three wave trains bent by a slow vertical warp: two broad
  sweeps crossing, and a shorter one at roughly twice the frequency for the
  detail between them. A purely horizontal base read as scan lines; the bend is
  what makes it water. A **black point** (0.46) matters more than it looks:
  without it the dither marks about a quarter of the dark cells and the whole
  field turns to grain instead of resolving into bands.

  **Crests are shaped, not sinusoidal.** A sine is symmetric, and that symmetry
  was the main reason the field read as a pattern rather than as water — real
  swell has broad flat troughs and narrow crests. A gamma on the output buys the
  asymmetry. It also costs density, because it drops the midtones where most
  cells live, so it is paired with a `ceiling` of 1: the crests reach the largest
  dot outright and the two together land within a few percent of the ink the flat
  version carried. Measure that pairing rather than eyeballing it — the direction
  is not obvious, and the gamma alone made the field a third *darker*.
- **`monogram.ts`** — RF traced from `app/icon.png`. The R's bowl is a true
  annulus, and almost everything else falls out of that: the outer disc reaches
  back past the stem's right edge unaided, so there is no bottom bar, and the
  sliver of Void that opens between stem and bowl needs no rule of its own. Two
  details are easy to lose and both are load-bearing — the R's stem sits on a
  *raised* baseline while its leg descends past it, and the F has no stem above
  its mid arm, so its top arm hangs off the R's bowl.

  **The extruded sides fade with depth.** Three flat tones read as an outline;
  a continuous falloff reads as a solid. The front face, by contrast, is solid at
  1.0 — the older "front never reaches 1.0" rule was guarding against block
  glyphs welding into a slab, which is a property of the *ramp*, not of the tone.
  A dot cannot weld at any density, and letting the face dither put roughly a
  fifth of its cells on the smaller glyph, which read as noise.

**The wordmark is the logo.** The navigation and footer render `RegainFlow` as
text with a stacked `text-shadow` extrusion in Flow Blue, down and to the right
along the isometric `+a` axis. No glyph component to keep in step, and it works
at any string length.

**Two extrusion axes, on purpose.** The wordmark and the stage diagrams share the
isometric `+a` axis (0.866, −0.5, about 30°). The monogram does not: the icon's
extrusion is steeper — a 4:5 slope, about 53° — and the mark follows the icon.
Within the mark that slope does double duty, because the R's leg runs exactly
parallel to the extrusion; both derive from one constant so they cannot drift
apart, and that alignment is much of why it reads as one solid rather than as a
letter with a shadow behind it.

**`app/icon.png` is the source of truth for the mark, and the direction matters.**
The letterform is drawn, not generated: the geometry in `monogram.ts` was traced
off the PNG by sampling it and fitting primitives, so the favicon and the hero
monogram are the same letterform because the code follows the file. (An earlier
version of this ran the other way, generating the PNG from the geometry with a
throwaway zlib encoder. That generator no longer exists.)

Re-tracing, if the mark ever changes again: sample the PNG classifying each pixel
to the *nearest* of Void / Flow Blue / warm white rather than thresholding on
brightness — a strict threshold drops the antialiased boundary and insets every
edge by a pixel or two, which shows up as a consistent one-cell shortfall on
every outer edge at once. Then diff `isSolid()` against that mask on a fine grid.
Check that diff and the rendered mark as two separate questions: at ~74 cells
across, a letter unit is well under a cell, and chasing a sub-cell discrepancy
into the geometry is how the letter-space definition gets corrupted.

**Two tones, not two hues.** The hero monogram renders as two layers — front
faces and extrusion — so they can be coloured separately. Both are blue; the
*value* difference is what reads as three dimensions. A single flat colour
collapsed R and F into one silhouette. The front layer is a window onto a
gradient (`background-clip: text`) so a band of light can travel across it.

**Only the field animates.** The letterform is static, so `AsciiMonogram` is a
plain server component with no loop and no hydration contract. `AsciiField`
runs one `requestAnimationFrame` loop at 7fps, paused off-screen and on hidden
tabs, and its phase advances with scroll offset as well as time — scrolling
moves the water. It writes `textContent` through a ref and never through React
(`suppressHydrationWarning` is there for exactly that), because an ancestor
re-render would otherwise restore React's own child and snap the animation back.

A drift was tried on the mark — its extrusion angle and depth breathing on two
slow cycles — and taken back out. Two reasons, and the second is the real one.
The front face is drift-invariant by construction (its silhouette is `isSolid`,
which knows nothing about the extrusion), so animating cost a wasted 25,000-cell
DOM write per frame for a layer that never changed. And the extrusion is only
about five cells deep at the size this renders, so any amplitude small enough to
read as calm moved its edge by well under a cell — what you saw was the dither
flickering, not the mark turning. The grid is too coarse to carry the motion.

Cells are **square**: `line-height` matches the monospace advance width, and
`font-size` is derived from the container (`container-type: inline-size` plus a
`--rf-cols` custom property). The monogram's geometry assumes square cells, and
deriving the size means a grid fills its container by construction rather than
by a lucky choice of constants.

**The monogram wrapper centres itself; the `pre` inside it must not.** Firefox
clips a `background-clip: text` background to the box of the containing block,
and `container-type` makes the wrapper one — so an offset `pre` whose grid
over-fills the height lost every glyph outside the wrapper's box, leaving a
horizontal band through the middle of RF. Chrome paints the whole run and hides
the difference entirely, so this will not show up in normal development.
`.rf-ascii-mono` therefore goes auto-height and takes the `top: 50%` /
`translate` itself, with the two layers at its origin. The field keeps the
original arrangement on purpose: it paints a plain colour, so it was never
affected, and its fade is a mask on a section-sized box that this would resize.

Past the hero the motif carries through two devices and no more: `DitherReveal`
resolves blocks out of dot-noise as they arrive, and `ProofStrip` holds one still
field. Wavy section rules and wave bullets were tried and removed — repeated
across every boundary the wave read as decoration. Section rules are plain
hairlines; the wave belongs to the mark alone.

### Content lives in `lib/content`, not in components

Home and `/services` render the same three services at different depths. Both read
`lib/content/stages.ts`, so the summary and the full panels cannot drift. The same
applies to layers, case studies, and company copy — and `app/llms.txt/route.ts`
generates from those modules too, so what an assistant quotes is what the site says.

### The isometric models

One coordinate helper (`components/stage-models/iso.tsx`) drives every model. The
build sequences are declared only under `[data-play="true"]`, so the resting state —
server output, JavaScript disabled, `prefers-reduced-motion` — is always the finished
model. Nothing is hidden waiting on a trigger that might never fire.

**The connection rule: a route may only begin and end at a `port` on a `BoxSpec`.**
That is why solids are declared as objects rather than as inline props — a port is
computed from the solid it belongs to, so a line cannot miss the face it is meant to
touch. `Route` derives its own elbows, and every terminal gets a node. Reaching for
`segment()` to draw a connection reintroduces the bug this file was rewritten to
remove; `segment()` is for structure — posts and ground ties — not for flow.

Three properties are worth re-checking after any model change, because a screenshot
will not catch them: every route terminal lands on a solid face, no terminal lands on
a *dimmed* (rejected) solid, and no vertex hangs outside the drawing's own ground.

### Navigation

Group labels are real links to `/services`, `/insights`, and `/company`; the dropdown
is progressive enhancement only. Below `md` the same tree opens in a focus-trapped
panel. Without JavaScript every route is still reachable.

## Content status

### Case studies

The twelve entries in `lib/content/case-studies.ts` are **anonymized examples of
enterprise work completed by the founders** — not all of them are direct RegainFlow
client engagements, and `EXPERIENCE_DISCLAIMER` says so on the listing and on every
study page. Three rules govern the file:

1. Nothing is named — no company, customer, internal platform, program, or project
   name. Only the industry or environment.
2. `metric` is optional and appears on exactly two of twelve, because exactly two
   figures were confirmed. A study with no number carries none rather than a soft
   one.
3. Cards carry the executive summary; `challenge`, `solution`, `capabilities`, and
   `technologies` appear only on the study page.

The three headline figures in the same file are a **separate claim** — RegainFlow's
own totals, restated from previously published work. `/insights` keeps text between
the two so the adjacency cannot be read as one assertion.

Authored during design, pending RegainFlow's commercial and legal review before launch:

- the four "what this layer enables" lines in `lib/content/layers.ts`
- the three principle detail lines and the five manifesto entries in `lib/content/company.ts`
- the engagement path in `lib/content/stages.ts` and the free assessment in `lib/content/assessment.ts`

Deliberately absent:

- **DPHSL** — documented internally as built and implemented but never adopted, so it
  is not used as public supporting evidence.
- Rate and retainer figures, named pilot success measures, and per-project promises.
  The engagement path describes the shape of the commitment and nothing more
  specific, because anything more would be committing before we have seen the work.
- A blog and a podcast. Both were placeholders and are now off the site and out of
  the navigation; they come back when there is something to publish.

The industries in `lib/content/industries.ts` are the set the vertical research
commits to. Banking, insurance, pharma, and healthcare are documented there as
unvalidated and are deliberately not on the homepage.
