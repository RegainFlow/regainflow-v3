# What `docs/blogs_seo/` asks of a post

Distilled from `docs/blogs_seo/blog_seo.md` and `blog_ui_ux.md`. Evidence tiers: **[G]** Google/Bing-confirmed or WCAG, **[R]** research-backed, **[P]** practitioner consensus, **[V]** vendor data. The template (`components/BlogPostView.tsx`) already handles the page-level items; this list covers what the writer controls.

## Content

- **[G] Non-commodity element.** Original data, a first-hand test, a real failure, a named engineer's judgment. "If a model could write it from existing web content, rework it."
- **[G] Intent match.** The format and depth fit what the searcher wants; the answer comes early; follow-up sub-questions are answered on the same page, not spun into thin separate posts (that is the "fan-out page farm" Google calls scaled content abuse).
- **[G] No preferred length.** Cover the topic and its likely follow-ups, then stop. Padding hurts.
- **[G] Cite primary sources.** Footnotes to the original study or documentation, not to a blog quoting it.
- **[G] Honest dates.** "Updated" moves only after a substantive change (`--substantive`). Date-bumping is "noise & useless" (Mueller).

## Structure

- **[R] Answer first.** 57% of viewing time is on the first screen; the first paragraph states the answer or the stakes.
- **[R] Descriptive H2s every 200–400 words**, each readable as a standalone summary (the "layer-cake" scan). Subheads raised engaged time about 20% at NZZ [V].
- **[G/S] Real heading order.** `##` then `###`; never `#` (the page owns the H1); never skip a level.
- **[P] Short paragraphs, bullets for parallel items, tables for comparisons.** Avoid walls of text *and* confetti formatting.
- **[P/V] Takeaways: 3–5 claims**, not repeated verbatim in the body.
- **[R] TOC** appears automatically at 3+ H2 sections.

## Links

- **[G/P] Link the topic's pillar and 2–5 related posts or pages** with descriptive anchor text ("our evaluation harness post", never "click here").
- **[P] Link *to* the new post** from 2–3 established pages after publishing.
- **[R] An early contextual link** within the first few paragraphs gets the clicks the end module misses.

## Images and media

- **[G] Original images with descriptive alt text.** Alt describes purpose for someone who cannot see it; not keywords, not "image of". Charts get the takeaway in text too.
- **[R/V] Images that carry information** (screenshots, diagrams, charts) over stock photos, and never a stock photo that repeats the headline.
- **[G] Video** where it is the best format; YouTube is a large AI Overview citation source. Use the `video` figure (click-to-load).

## Search snippet

- **[G] Title:** unique, specific, leads with the topic. About 60 characters shows in full.
- **[G] Meta description:** unique and accurate, about 120–160 characters. A click aid, not a ranking factor.
- **[G] Slug:** short, readable, no dates; never changed without a redirect.

## Myths to ignore (Google, May 2026)

llms.txt for Google, "chunking" for AI, AI-specific rewrites for every long-tail variant, special schema, FAQ markup for rich results (retired May 7, 2026). Clear sections still help readers; that is the only reason to write them.
