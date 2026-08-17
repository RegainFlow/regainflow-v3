# RegainFlow brand foundations

Use these rules for every RegainFlow artifact. This file is the portable, approved distillation of RegainFlow’s `DESIGN.md` and is the operative authority inside this skill; do not search for or depend on an external repository copy during an artifact task.

## Positioning

| Field    | Canonical value                                                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name     | RegainFlow                                                                                                                                                                                                                                                                                 |
| Category | AI engineering & transformation partner                                                                                                                                                                                                                                                    |
| Tagline  | AI transformation, from ambition to operation.                                                                                                                                                                                                                                             |
| Mission  | RegainFlow helps organizations move at the speed of their ambition.                                                                                                                                                                                                                        |
| Audience | Public agencies and complex organizations across public safety; infrastructure and utilities; federal, state, and local government; and defense and aerospace. Keep the framing engineering-led and credible in regulated environments without excluding complex commercial organizations. |

## Voice and evidence

- Write as a senior operator, not a vendor.
- State the claim, then provide the evidence or reasoning that earns it.
- Prefer plain verbs and concrete nouns. Name the unglamorous operational layer: retrieval, data quality, evaluation, observability, cost control, ownership, and handoff.
- Say clearly what RegainFlow will not do when that boundary matters.
- Use sentence case for prose. Reserve uppercase for monospace utility labels.
- Keep claims specific to the actual artifact. Remove generic consultancy language.

### Defensible-number policy

Use a number only when the artifact can state how it was measured and defend the source in procurement. Distinguish:

- **Scope facts:** counts of delivered workshops, systems, controls, phases, or hours may be used when verified.
- **Return claims:** savings, speed, risk reduction, revenue, accuracy, or productivity require a defensible source and method.
- **Synthetic values:** label them `illustrative`, `example`, or `fictional` at the point of use and keep them out of claims about RegainFlow performance.

Prefer a sourced qualitative outcome over an unsupported figure. Where return cannot be measured, say so rather than imply it.

## Official dark palette

Use these eight tokens unchanged in `operational-dark` and on dark covers.

| Token     | Hex       | Use                                       |
| --------- | --------- | ----------------------------------------- |
| Void      | `#050912` | Page ground and dark cover                |
| Navy      | `#0A1222` | Raised surfaces                           |
| Warm      | `#F2F5FA` | Headings, primary text, mark face         |
| Slate     | `#8B96AA` | Body copy, captions, utility text         |
| Flow      | `#2F6BFF` | Strokes, nodes, ticks, active edges       |
| Flow Soft | `#6E9BFF` | Readable accent text on dark, focus state |
| Hairline  | `#253149` | Borders and rules only                    |
| Line      | `#4A5872` | Secondary structural strokes              |

Flow is not small text. Use Flow Soft for readable accent text on Void or Navy. Hairline and Line never carry body content.

## Typography

Use only the bundled files under `../assets/fonts/`:

| Role                                    | Family        | Weights                                   |
| --------------------------------------- | ------------- | ----------------------------------------- |
| Headings and prose                      | Space Grotesk | 400 body, 500 headings, 600 wordmark only |
| Utility labels and technical annotation | IBM Plex Mono | 400, 500                                  |

Do not use serif typography. Do not use Space Grotesk 600 for ordinary headings. Keep body prose near 48–58 characters per line. Tighten heading tracking slightly as size increases. Use IBM Plex Mono only for machine-adjacent labels, indices, table metadata, footers, diagram annotations, or compact mechanisms; uppercase these labels with deliberate tracking.

## Mark and wordmark

- Use `../assets/regainflow-mark-1024.png` as the source mark and `../assets/regainflow-app-icon-180.png` only where a small icon is required.
- Preserve aspect ratio and native colors. The face remains Warm; the depth remains Flow.
- Place the mark only on Void or another sufficiently dark field. Never add a glow, blur, soft drop shadow, recolor, stretch, rotate, or reconstruct it.
- Construct a text wordmark only when a raster mark is not the correct form: set `RegainFlow` in Space Grotesk 600, Warm, with a solid Flow extrusion built from five stacked offsets at 0.5, 1, 1.5, 2, and 2.5 px down and right. Do not use a blurred shadow.

## Spatial and surface language

- Use right angles, hairline rules, precise grids, square terminals, and visible structure.
- Surfaces are square. Only button-like controls may use a 2 px corner radius.
- Establish depth with drawn geometry, containment, or the mark extrusion—never blurred elevation shadows.
- Use Flow for 1–2.5 px route strokes, nodes, ticks, and active edges. Give every diagram route a node at each end.
- Number content only when order carries meaning. Use an icon only when it honestly represents a parallel item; otherwise use no marker.
- Use founder portraits at a consistent 4:5 crop with restrained sizing; never let a portrait overpower the biography.

## Accessibility

- On dark, use Warm for primary text and Slate for body text. Use Flow Soft—not Flow—for small accent text.
- On white, use Ink for body and `#1A4FD6` for small accent text.
- Do not encode state by color alone; pair it with a label, shape, or pattern.
- Maintain readable type sizes, explicit line length, visible focus treatment in interactive artifacts, and meaningful alt text for portraits and charts.
- Check actual contrast after export because rasterization and transparency can reduce it.
