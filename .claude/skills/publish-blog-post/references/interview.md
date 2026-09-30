# Interview question bank

Ask in batches of two to four. Use AskUserQuestion for choices (author, topic, CTA, format), and plain conversation for stories. Stop asking once you can write the outline; not every question applies to every post.

## Round 1: the post's reason to exist

1. **What happened?** The engagement, test, incident or decision behind this post. What did you see that someone outside the work would not know?
2. **Who is it for?** A role (agency CIO, program manager, engineering lead), and what they are trying to decide or do.
3. **What would they type?** The question or search this answers, in their words. Then look at what currently ranks for it: is it a guide, a comparison, a checklist, an opinion? Match the format and beat it on substance.
4. **What is the answer, in two sentences?** If it takes longer, the post does not know its point yet.

## Round 2: the non-commodity element

At least one of these must be real, or the post is not written:

- **A result we measured.** How it was measured, on what, compared to what. ("Answer accuracy on our evaluation set rose from X to Y after we changed chunking.")
- **A failure.** What went wrong, how it was noticed, what it cost, what changed.
- **Original data or a worked artifact.** A checklist we actually use, a template, a cost breakdown, an evaluation rubric.
- **A judgment call.** A position we would defend in front of a skeptical buyer, and the strongest argument against it.
- **Evidence from the work.** Screenshots, diagrams, before/after output.

Follow-ups: *Which team? Which week? What did the log/metric/reviewer actually say? What would you do differently?*

## Round 2b: how it was measured (research and data posts)

- What data, from where, and how much of it (documents, queries, systems, weeks)?
- Over what time window?
- How was it measured or scored, and by whom?
- What does it not show? The limits go in the post.
- Can the method be described without naming the client? If not, stop.

## Round 3: placement

5. **Author.** `will-baltus` (William J. Baltus) or `leo-ramirez` (Leonardo J. Ramirez). The byline is the person who reviewed it and will stand behind it.
6. **Topic cluster.** Run `pnpm blog:prod list`, then offer `production-ai`, `retrieval-and-data` or `public-sector-ai`. A post that fits none is a signal: either a new cluster (a code change to `lib/content/blog-topics.ts`, and only once there are posts to fill it) or the wrong post.
7. **Pillar or cluster?** A pillar is the one comprehensive post a topic hub leads with. Most posts are cluster posts that link to the pillar.
8. **Featured?** The index shows two featured posts side by side. Featuring a new post pushes the older one off the row (it stays in the list).
9. **Links out.** Which 2–5 existing posts, case studies, reports or service pages does this build on? Offer candidates from `pnpm blog:prod list`, `/insights` and `/services`.
10. **Links in.** Which existing pages should link *to* this post once it is live?

## Round 4: trust and safety

11. **Deny list.** Every client, agency, program, platform and project name that must not appear, including nicknames and acronyms. Ask even when the person says "there are none": that answer is recorded as an empty list.
12. **Sources.** For each number: ours (how measured) or theirs (URL to the primary source, not a blog quoting it).
13. **Anything under NDA, embargo or pending approval?** If so, stop and wait.

## Round 5: images (see SKILL.md step 2)

14. Screenshots, diagrams or photos that show the work. For each: file, what it shows (alt text), caption, credit, cleared to publish?
15. A cover. The strongest real image, or, only if there is none, confirm generating one and agree the abstract subject.

## Round 6: the next step

16. **CTA.** What should a reader who finished this do next? Offer:
    - the free assessment (default: leave `cta` null);
    - a related report or case study;
    - booking a call about a specific service.
    Collect eyebrow, heading, one-sentence body, button label, link.

## Follow-up prompts for soft answers

| Soft answer | Push back with |
|---|---|
| "Teams often struggle with…" | Which team? What did you watch happen? |
| "Significantly faster / better" | Than what, measured how, over how many cases? |
| "Best practice is…" | Whose? Did we do it? What happened when we did not? |
| "It depends" | On what? Give the two cases and what you would do in each. |
| A list of tips | Which one did we learn the hard way? Lead with that. |
| No downside mentioned | What does this cost, and when is it the wrong call? |
