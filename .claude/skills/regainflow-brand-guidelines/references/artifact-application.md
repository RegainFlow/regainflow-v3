# Applying the brand to artifacts

## Selection contract

Support these public prompt controls:

- `design_family=operational-dark|editorial-hybrid`
- `cover_preset=split-mark|mark-led|typographic|grid-one-pager`

Honor an explicit valid value. Without one, select from the table. Ask only when the artifact genuinely fits multiple rows and the difference is material.

| Artifact                                    | Design family      | Cover preset                      |
| ------------------------------------------- | ------------------ | --------------------------------- |
| Audit, readiness report, technical report   | `operational-dark` | `split-mark`                      |
| Resume or dense operational collateral      | `operational-dark` | choose the closest allowed preset |
| Insight or guidance report                  | `editorial-hybrid` | `mark-led`                        |
| Practical guide or SOP                      | `editorial-hybrid` | `typographic`                     |
| Capability statement or one-page collateral | `editorial-hybrid` | `grid-one-pager`                  |

## Design families

### Operational Dark

Use the official eight tokens from `brand-foundations.md` unchanged across every page. Use Void as the page ground, Navy for panels, Warm for primary text, Slate for body text, Flow for geometry, Flow Soft for readable accent text, and Hairline/Line for structure. Favor dense but ordered information, audit grids, clear score definitions, technical annotations, and explicit evidence.

### Editorial Hybrid

Use a dark cover with the official dark tokens. Use this print-only palette for light interiors:

| Token                  | Hex       | Use                                      |
| ---------------------- | --------- | ---------------------------------------- |
| Paper                  | `#FFFFFF` | Page ground                              |
| Ink                    | `#050912` | Primary text                             |
| Muted                  | `#4A5872` | Secondary text                           |
| Panel                  | `#F2F5FA` | Tinted panels and table bands            |
| Rule                   | `#D7DEEA` | Dividers and grid lines                  |
| Accent                 | `#2F6BFF` | Large accents, rules, nodes, chart marks |
| Accessible Accent Text | `#1A4FD6` | Small blue text on white                 |

Do not add light gradients, soft shadows, beige paper, or a serif editorial face. Keep the same right-angle, grid-led system as Operational Dark.

## Cover presets

| Preset           | Composition                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split-mark`     | Full dark field; title and engagement metadata in a disciplined left block; enlarged RF mark or cropped mark geometry occupying the opposing field; one Flow rule connects the halves. Best for client audits and technical reports. |
| `mark-led`       | Full dark field; official mark as the primary visual anchor; concise eyebrow, title, subtitle, date, and publisher aligned to a strong grid. Best for narrative insight reports.                                                     |
| `typographic`    | Full dark field; title hierarchy and structural rules do the work; mark or wordmark remains compact. Best for practical guides and SOP-style documents.                                                                              |
| `grid-one-pager` | Paper ground; supplied mark contained inside a compact Void tile; hairline modular grid; dense, scannable one-page hierarchy with no decorative cover page. Never set the mark or Warm wordmark directly on Paper. Best for capability statements and single-page collateral. |

Vary scale, crop, column split, and title placement within the preset. Do not make every cover identical. Keep the preset’s defining composition and the mark rules intact.

## Report contract

Classify as a report when the artifact presents analysis, research, findings, assessment results, recommendations, or an evidence-backed point of view. Every report contains these parts in this order:

1. **Selected cover.** Apply the chosen family and cover preset.
2. **Table of contents or report map.** Place it immediately after the cover. Keep labels and final page numbers synchronized with the finished pagination.
3. **Body.** Use a clear narrative sequence with claim-then-evidence writing, meaningful section labels, and accessible tables/figures.
4. **Sources and limitations.** Include whenever research, quantitative claims, synthetic data, evidence constraints, or input limitations are present. Put local citations near claims and use a consolidated section when useful.
5. **About the authors.** Make this the final page. Include both Leonardo J. Ramirez and William J. Baltus using the portraits, titles, credentials, and biographies in `canonical-copy.md`.

Use a consistent body-page footer containing `RegainFlow`, a shortened document title, and the accurate page number. The cover may omit the footer. Do not replace the final author page with a generic contact or sales page.

## Non-report contract

Apply the full brand system, but add only sections appropriate to the artifact. An SOP normally includes document control, purpose, scope, roles, prerequisites, procedure, controls, verification, escalation, and revision history. It does not automatically receive a report map, research sources, or author biographies. A one-page capability statement does not receive a separate cover or contents page.

## Format adaptation

- **PDF:** embed the bundled fonts, preserve vector rules where practical, render every page to images, and visually inspect page order and pagination.
- **DOCX/Word:** embed or explicitly apply the bundled font families, use real heading styles, update the table of contents and fields, render to PDF or page images, and inspect for font substitution and reflow.
- **Presentation:** preserve the same family, palette, mark, type roles, and evidence rules; translate page footers into slide numbers and a compact source line.
- **Web or interactive output:** retain semantic headings, alt text, keyboard focus, 44 px touch targets, and color-independent state cues.

## Final QA checklist

- Artifact classification is explicit; report-only sections appear only when required.
- Explicit family/preset controls are honored; automatic selection matches the mapping.
- Cover follows one preset without distorting or recoloring the mark.
- Only Space Grotesk and IBM Plex Mono appear, with correct weights and no serif substitution.
- Palette matches the selected family exactly; small accent text uses an accessible token.
- Claims follow claim-then-evidence; every number is sourced, measured, or labeled illustrative.
- Contents/report map follows the cover and matches final page numbers.
- Tables and figures use readable hierarchy, labels, sources, and color-independent meaning.
- Footers are consistent and page numbers are accurate.
- Report author page is final and contains both canonical founders; non-reports do not inherit it automatically.
- No clipping, overflow, orphaned headings, broken paths, low-resolution logos, or unintended blank pages remain.
