# Writing for RegainFlow

How RegainFlow writes blog posts, founder essays and other long-form copy. The short version:
write like an experienced engineer explaining something they have seen, built or learned to a
thoughtful prospective client. Useful reasoning and earned credibility, not marketing polish.

This guide sits on top of two others. [`DESIGN.md`](DESIGN.md) "Voice" sets the site-wide
register and the number policy, and wins where they disagree. The `no-ai-slop` skill
(`.claude/skills/no-ai-slop/`) holds the general list of AI patterns. This file is the
RegainFlow-specific layer: who we sound like, the house rules the first four posts settled, and
worked examples from those edits.

## Who we sound like

**Engineering with conviction:** craftsmanship, ownership, independence, and respect for the
people doing the work.

- Grounded, technically credible, quietly confident, founder-led, practical, observant, human.
- Conversational but professional. Natural paragraphs, varied sentence lengths, clear words.
- Principled without preaching. Skeptical of hype without sounding bitter.
- Close to real workflows, people, constraints, engineering decisions and outcomes.
- Written for intelligent business and technical readers. Explain a specialist term the first
  time it appears ("forward-deployed engineering") without talking down to either audience.
- "We" for genuine RegainFlow practice. "I" only for a named founder's real view or experience,
  and only in a post bylined to that founder. Never invent an experience.

**Positioning.** RegainFlow is an engineer-led partner working alongside client teams. The
engineers who scope the work build it. The work is usable production systems, clear handovers
and durable value. AI, retrieval, data engineering, integration and automation are tools; do not
reduce the company to "an AI consultancy" or assume every reader needs AI. Data maturity and
interoperability come before the model, and we say so.

**Regulated and secure environments** (law enforcement, aerospace, defense, large enterprise)
are where our backgrounds are. Use them when they are relevant, not as decoration. The view we
hold: these organizations are often told modern software and AI are for someone else, and that
is wrong when the constraints are designed in from the start. Claims about security or
compliance must describe what is actually built and verified. Never imply a certification or a
guarantee.

## Core principles

1. **Lead with the problem.** Understand the operation before choosing the technology. Not
   every problem is a RAG, AI or agent problem.
2. **Show the mechanics.** Who hits the problem, what they do today, why it is hard, and how a
   change would help. "The engineer searches three repositories" beats "knowledge friction
   prevents operational excellence."
3. **Make claims defensible.** Qualify a general recommendation when the context genuinely
   changes the answer ("for document-heavy teams"). Never invent client anecdotes, figures,
   timelines, credentials or implementation experience.
4. **Account for production** where it is relevant: data, integration, permissions, evaluation,
   ownership, reliability, observability, cost, adoption, handover. Do not force all of them
   into every post.
5. **Keep the client's autonomy central.** The client should be able to use, run, evaluate and
   eventually own what we build.
6. **Let the evidence carry the message.** Show judgment through trade-offs and specifics
   instead of claiming to be different.
7. **Worth reading without hiring us.** Every post gives the reader something to use: an
   example, a decision rule, or questions to ask. The call to action is short and optional.

## House rules

These came out of editing the first four posts (October 2026). Each was applied to every one of
them, so treat them as defaults.

**The first sentence states the answer.** Search engines and AI answer tools quote a post's
opening sentence, so it must stand alone and say the point in plain words. The recognizable
situation, the story or the "we've seen this" paragraph comes right after it, not instead of
it.

> Internal knowledge search, an assistant that answers questions from your organization's own
> records with links to the sources, is often one of the first AI investments we recommend.

**Link the companion report in the first paragraph.** A post built on a report links it with
the report's exact title as the anchor text. Drafts written elsewhere tend to drop this link;
check for it every time. Rules for titles and slugs are in the `publish-blog-post` skill.

**Hedge on purpose, not by reflex.** "Often", "may", "might", "can", "relatively",
"necessarily", "considerably" and "substantially" are each fine once, where they are true. A
draft that uses "necessarily" five times reads as nervous. One qualifier per claim, at most;
where we are sure, say it flat. Money and engineering posts can afford to be firm.

**Cut verdict sentences.** A sentence that only announces importance goes. Replace it with the
reason, or delete it if the paragraph already shows the point. Lines cut from the first four
posts:

- "That proximity matters."
- "Both perspectives matter."
- "The distinction matters when evaluating projected savings."
- "The important question is whether the benefit grows with them."
- "A useful budget should account for both changes."
- "What matters is that the system can be used and supported…"
- "These principles aren't complicated, but following them consistently takes effort."
- "That's still what guides us."

**End on the last useful point, not a recap.** A closing section that repeats the post ("We
encourage organizations to understand the full cost… The goal is to make informed decisions…")
gets cut to its one concrete line plus the call to action. A final section should say something
new; "When a pilot still makes sense" replaced "Building something people can keep using"
because it does.

**Sources are primary and checked.** Cite the original study with a footnote (`[^sp]`) where the
figure appears, not a Sources list at the end. Open every link and confirm it contains the exact
figure before publishing. Cite our own report only when the original cannot be reached, and
never list a source the post does not use. Example: a draft cited Gallup for "half of workers
never use AI"; the Gallup page says half use it at least a few times a year.

**No number without a method.** DESIGN.md rule 4. An illustrative example is fine when it is
plainly labelled ("Imagine a process that takes 30 minutes…"). A rule of thumb like "plan for
two to three times the subscription" is a claim and needs a source or goes.

**Use the site's components.** Sequential stages or questions go in a `steps` block; parallel
items in a bulleted list with a bold lead; definitions and warnings in a `callout`. Numbered
bold paragraphs ("**01. Find the value leak**") should become a `steps` block.

**Title and deck live in the intake file.** The body starts at the first paragraph. No `#` H1
and no italic subtitle in `post.md`; they would print twice. The deck becomes `summary`.

**Keep the summary, takeaways and meta description in step with the body.** When a post is
rewritten, the intake file is rewritten with it. A takeaway that promises something the new
body no longer says is a claim we cannot back.

**Length.** A focused post runs 600–900 words. A founder essay or a report companion can run to
about 1,300. Never pad, and never cut a worthwhile argument to hit a count.

## Patterns to cut

The `no-ai-slop` skill has the full list. The ones that keep showing up in our drafts:

- Verdict and announcement sentences (above). Also "This is where things get interesting", "The
  takeaway is clear", "The reality is", "Here's why that matters", "It's important to note".
- Habitual contrasts: "It's not X; it's Y", "Not just X, but Y", "The question isn't X".
  DESIGN.md rule 1 (claim, then evidence) is allowed; a contrast used as a rhythm is not.
- Manufactured one-sentence paragraphs, mic-drop endings, reflexive lists of three, identical
  paragraph shapes.
- Hype: revolutionize, transformative, unlock, game-changing, cutting-edge, seamless, leverage,
  robust, powerful, "in today's rapidly evolving landscape", "at scale" without a number.
- Inflated promises: "immediate ROI", "useful within weeks", "the model is just a config change".
- House words used on everything: not every idea is a "foundation", every problem a "value
  leak", or every paragraph a "key insight".
- Slogan headings. A heading names the topic of its section.
- Writing about the writing: "In this article, we'll explore…".
- Invented first-hand evidence. Use a clearly hypothetical example instead.

## Before and after

| Instead of | Write |
| --- | --- |
| "Those references matter. This is where the real value begins." | "The engineer can review the original reports, verify the information, and decide what applies to the current investigation." |
| "Once retrieval is implemented, changing models is just a configuration change." | "With retrieval and evaluation in place, teams can compare models against their own questions. Switching may still take some adjustment, but the knowledge infrastructure doesn't need to be rebuilt." |
| "Our revolutionary AI solutions unlock unprecedented operational efficiency." | "We start by understanding where work slows down, then decide whether better information access, integrations, automation or another approach would help." |
| "It's not about the model. It's about the foundation." | "Model selection affects cost and answer quality, but document ownership, access controls, retrieval and evaluation take more sustained engineering work." |
| "Saving ten minutes doesn't necessarily save the organization ten minutes, particularly if…" | "Saving an employee ten minutes on a task doesn't save the organization ten minutes of paid labor if the surrounding workflow stays the same." |
| "We're comfortable working within these constraints, and we understand why organizations have them." | "Organizations like these are often told that modern software and AI are for someone else. We disagree. They are often where reliable systems count most." |

## Process

1. **Define the point.** One sentence: who the post is for and what judgment they will gain.
2. **Choose the angle.** A specific operational problem, engineering trade-off, founder
   observation or decision framework, not a general "AI trends" topic.
3. **Outline lightly.** Usually four to six sections, fewer if the argument is short. No
   required Why / How / What shape.
4. **Draft.** Answer first, then a concrete situation, then the reasoning with specifics,
   limits and consequences.
5. **Check the claims.** Separate likely benefits from established results. Open every source.
6. **De-slop pass.** Run `no-ai-slop`, then the house rules above.
7. **Brand pass.** Would a senior engineer say this plainly to a thoughtful prospective client?
   Can the reader use it without hiring us?
8. **Trim**, then update the intake file to match.

## Final checklist

- [ ] The first sentence states the answer and stands alone.
- [ ] The companion report, if there is one, is linked in the first paragraph.
- [ ] Every section adds something; no verdict or announcement sentences.
- [ ] Hedges are deliberate: one per claim at most, none where we are sure.
- [ ] Every figure has a primary source that was opened and checked, or is plainly hypothetical.
- [ ] Examples are real and approved, or unmistakably hypothetical.
- [ ] Trade-offs and alternatives get room.
- [ ] No habitual contrasts, slogan headings or buzzwords.
- [ ] RegainFlow reads as an accountable engineering partner, not a vendor.
- [ ] The ending adds a last useful point, not a recap.
- [ ] No H1 or subtitle in the body; summary, takeaways and meta description match it.
- [ ] The post is useful without the call to action.
