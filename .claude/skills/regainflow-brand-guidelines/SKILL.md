---
name: regainflow-brand-guidelines
description: Use when creating or reviewing RegainFlow-branded reports, documents, SOPs, assessments, capability statements, resumes, PDFs, Word files, or other collateral that must follow RegainFlow visual identity, voice, structure, typography, color, logo, or author-credit rules.
---

# RegainFlow Brand Guidelines

## Purpose

Apply one RegainFlow brand and editorial system across collateral while leaving file construction to the appropriate artifact skill. Treat the approved contracts in this skill as requirements, not inspiration.

## Workflow

1. **Classify the artifact.** Decide whether it is a report, SOP, assessment, capability statement, resume, one-pager, presentation, or other collateral. Treat a formal assessment with findings and recommendations as a report; do not classify an SOP as a report.
2. **Load the rules.** Read [brand-foundations.md](references/brand-foundations.md) and [artifact-application.md](references/artifact-application.md). Also read [canonical-copy.md](references/canonical-copy.md) whenever the artifact contains company positioning, founder copy, or a report author page.
3. **Resolve public controls.** Honor explicit `design_family` and `cover_preset` values. Otherwise select them from the artifact mapping in `artifact-application.md`; ask only when a genuine ambiguity would materially change the result.
4. **Build the content contract.** Apply the report-only sections when the artifact is a report. Preserve global typography, color, voice, accessibility, logo, and evidence rules for every artifact.
5. **Use the format skill.** Use the available PDF skill for PDF creation or inspection, the Documents skill for DOCX/Word work, and the Presentations skill for slide formats. This skill supplies the brand layer; it does not replace those renderers.
6. **Render and verify.** Inspect every page or slide at readable size. Correct clipping, overflow, wrong font substitution, low contrast, broken image paths, inconsistent footers, and inaccurate page numbers before delivery.

## Quick reference

| Input                                             | Default                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| Insight report, guidance report, long-form report | `editorial-hybrid` + `mark-led`                                    |
| Technical/readiness audit or report               | `operational-dark` + `split-mark`                                  |
| SOP or practical guide                            | `editorial-hybrid` + `typographic`                                 |
| Capability statement or one-page collateral       | `editorial-hybrid` + `grid-one-pager`                              |
| Resume or dense operational collateral            | `operational-dark`; choose a suitable preset from the allowed list |

Example: `Create a PDF readiness audit with design_family=operational-dark and cover_preset=split-mark.` Both explicit values govern even if an automatic mapping would differ.

## Non-negotiable checks

- Use only Space Grotesk and IBM Plex Mono from `assets/fonts/`; never introduce a serif or substitute brand family.
- Use the supplied mark files; never redraw, recolor, stretch, glow, or place the mark on a light ground.
- Include both founders on the final author page of every report. Do not add an author biography page to a non-report unless the user explicitly requests one.
- Publish no quantitative claim that lacks a stated measurement method and defensible source. Label synthetic or illustrative values plainly.
- Use only reusable public assets. Do not import client content, personal email addresses, resume-only facts, unsupported career metrics, or source PDFs.

## Common mistakes

| Mistake                                                | Correction                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| Inventing teal, green, coral, or gradient brand colors | Use only the selected family palette in `artifact-application.md`. |
| Treating every document like a report                  | Apply the report contract only after classification.               |
| Reusing one cover for every format                     | Select or honor one of the four cover presets.                     |
| Using blue for small body text                         | Use Flow Soft on dark or Accessible Accent Text on white.          |
| Ending a report with a generic contact page            | End with the required two-founder “About the authors” page.        |
