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

A dot halftone. `lib/ascii/dither.ts` maps a tone to one of ` · : •` through a
4×4 Bayer matrix, so *density* traces the gradient and two neighbouring cells at
the same tone can disagree. That disagreement is the texture. A per-cell
threshold would band; random noise would fizz.

**Dots only — never block glyphs.** `▪ ▓ █` were tried and they fail
structurally, not aesthetically. Square cells force `line-height` down to the
monospace advance width (0.6), which is *less* than a glyph's em box, so block
glyphs overlap their vertical neighbours and any dense region welds into a solid
slab. No opacity or grid size fixes it. Every character in the ramp is ASCII or
Latin-1: a glyph the font lacks falls back to another family with a different
advance width and shears the whole grid.

- **`field.ts`** — broad diagonal sweeps bent by a slow vertical warp. A
  purely horizontal base read as scan lines; the bend is what makes it water.
  A **black point** (0.46) matters more than it looks: without it the dither
  marks about a quarter of the dark cells and the whole field turns to grain
  instead of resolving into bands.
- **`monogram.ts`** — RF as continuous rectangles plus one slanted leg,
  extruded along the same `+a` screen axis the isometric diagrams use. Front,
  top, and side faces carry different tones, which is what makes it read as a
  solid. Front never reaches 1.0: the mark has to stay a dot texture, not a
  fill. Deliberately a placeholder — swapping in a real mark means replacing
  the geometry and nothing else.

**The wordmark is the logo.** The navigation and footer render `RegainFlow` as
text with the same extrusion the letterform has — stacked `text-shadow` offsets
in Flow Blue, down and to the right along the isometric `+a` axis. No glyph
component to keep in step, and it works at any string length.

`app/icon.png` is generated from the same `RECTS` and `LEG` geometry by a
throwaway PNG encoder (Node `zlib`, no dependencies), so the favicon and the hero
monogram are literally the same letterform.

**Two tones, not two hues.** The hero monogram renders as two layers — front
faces and extrusion — so they can be coloured separately. Both are blue; the
*value* difference is what reads as three dimensions. A single flat colour
collapsed R and F into one silhouette. The front layer is a window onto a
gradient (`background-clip: text`) so a band of light can travel across it.

**Only the field animates.** The letterform is static, so `AsciiMonogram` is a
plain server component with no loop and no hydration contract. `AsciiField`
runs one `requestAnimationFrame` loop at 9fps, paused off-screen and on hidden
tabs, and its phase advances with scroll offset as well as time — scrolling
moves the water. It writes `textContent` through a ref and never through React
(`suppressHydrationWarning` is there for exactly that), because an ancestor
re-render would otherwise restore React's own child and snap the animation back.

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

### Analytics

PostHog, and it adds **no client component and no change to `app/layout.tsx`**.

`instrumentation-client.ts` at the root is the entire client surface: Next runs it
once before hydration, so it initialises PostHog and registers **one delegated
click listener** on the document. An element carrying `data-rf-event` fires that
event when clicked, and its other `data-rf-*` attributes become properties —
`data-rf-location` arrives as `location`. Instrumenting a CTA is therefore
*adding an attribute*, which is why every anchor on the site is still inside the
server component that renders it. `lib/analytics/events.ts` holds the names and
the property vocabularies, and deliberately **imports nothing**: server
components read `RF_EVENTS`, so a `posthog-js` import there would be evaluated
on the server once per importer.

Three details are load-bearing and will not show up as an obvious failure:

- **`toggle` does not bubble.** The `/insights` disclosure listener is registered
  on the capture phase or it never fires. It also uses `data-rf-toggle` rather
  than `data-rf-event`, so the click listener does not match the `<details>` too
  and double-count every open.
- **Outbound CTAs capture with `sendBeacon` *and* `send_instantly`.** `transport`
  alone only picks the network API; without `send_instantly` the event is still
  in the batching queue when the document unloads. The `preventDefault` +
  `setTimeout` alternative breaks modified clicks and keyboard activation.
- **Do not add the `usePathname` + `useSearchParams` pageview component** that
  most PostHog/Next tutorials still show. `defaults` already puts pageviews in
  `'history_change'` mode, and `useSearchParams` would opt the route into
  dynamic rendering. Every route here is static and `next build` should keep
  saying so.

`CaseStudyCard` takes a required `surface` — `home_proof`, `featured`,
`all_work`, or `related`. It renders in four places and the property exists to
separate browsing from digging; a default would let a fifth call site report as
one of the four and flatten it.

Ingestion is proxied through `/relay` (`next.config.ts`) so it is first-party —
this audience runs ad blockers and sits behind corporate filters. That is what
`skipTrailingSlashRedirect` is for: PostHog's API paths end in a slash and Next
would otherwise redirect them before the rewrite applies. Its side effect is
that `/services/` now serves 200 rather than redirecting to `/services`; both
forms emit the same canonical link, so the two consolidate.

Session replay is off via an explicit `disable_session_recording` — the bundled
defaults snapshot moved recording behaviour and there is no consent banner.
`NEXT_PUBLIC_POSTHOG_KEY` (see `.env.example`) is the only variable; unset makes
analytics a no-op rather than an error.

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
