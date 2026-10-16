-- Sample blog posts, written to `docs/blogs_seo/blog_seo.md` and
-- `docs/blogs_seo/blog_ui_ux.md`, for building and reviewing the blog.
--
-- Run after `20260928130000_blog_posts_v2.sql`. `npx supabase db reset` does
-- both locally. They are inserted as `published`, so **running this against
-- production publishes them.** Every first-hand claim is drawn from the three
-- case studies in `case-studies.sql` and must be checked by the named author
-- before a post goes public; every figure is from a cited source. Images are
-- placeholders — see `public/blog/placeholders/README.md`.
--
-- Bodies and list items are dollar-quoted, so apostrophes need no escaping.
-- Re-running is safe: an existing slug is updated in place.

-- The first round of samples, replaced by these.
delete from public.blog_posts where slug in (
  'the-pilot-that-never-left-the-lab',
  'clean-the-data-you-will-actually-use',
  'five-questions-for-an-ai-vendor',
  'what-ai-readiness-means-for-a-county'
);

insert into public.blog_posts (
  slug, title, summary, published, updated_on, author, topic, tags,
  takeaways, related, cta, cover_url, cover_alt, cover_credit,
  featured, pillar, meta_title, meta_description, body, status
)
values

-- 1 ---------------------------------------------------------------------------
(
  'the-production-gap-ai-pilots',
  'The production gap: why AI pilots stall, and the checklist we run before week one',
  'Most AI pilots work. They stall afterwards, when the system meets live data, real permissions and a team that has to run it. Here is the checklist we now run before any model code gets written.',
  '2026-06-10',
  '2026-09-08',
  'will-baltus',
  'production-ai',
  array['Implementation', 'Operations', 'AI governance'],
  array[
    $t$A pilot answers "can this work at all?" Production needs different answers: whose data, whose permissions, who gets paged.$t$,
    $t$Most stalls happen at the handoff between the team that built the pilot and the team that has to run it.$t$,
    $t$We settle five things before writing model code: the operating owner, the data route, what "wrong" means, where it runs, and how it is handed over.$t$,
    $t$A slower first two weeks buys a much shorter path to go-live, because the handoff questions are answered before there is anything to hand off.$t$
  ],
  array['rag-evaluation-harness-technical-documents', 'seeded-failure-engineering-workshops', 'ai-vendor-questions-procurement-misses'],
  $j${"eyebrow": "Free assessment", "heading": "Have a pilot that stalled, or one about to start?", "body": "We will run this checklist against your project and tell you plainly what stands between it and production.", "label": "Book a free assessment", "href": "https://cal.com/regainflow/free-assessment"}$j$::jsonb,
  '/blog/placeholders/operations-room.jpg',
  'An operator at a mission control workstation with two wide monitors of telemetry, in a dim room lit red.',
  'Placeholder image. NASA/JPL-Caltech, public domain.',
  true, true,
  'Why AI pilots stall: the production checklist we run first',
  'Most AI pilots work in the lab and stall on the way to production. The five things we settle before writing model code, from engagements in government and aerospace.',
  $md$
Most of the AI projects we get called into did not fail. The pilot worked, the demo went well, and then nothing shipped for months.

We see the same stall in government, aerospace and enterprise work. A system that runs on a laptop meets everything a laptop gets to ignore, and nobody planned for that meeting. This post covers what the pilot skipped, where the handoff breaks, and the five questions we now settle before anyone writes model code.

## What a pilot is allowed to skip

A pilot exists to answer one question: can this work at all? That is the right first question, and the answer is usually yes. A yes tells you very little about the next question, which is whether an operations team can run it on a Monday with live data.

These are the things a pilot can leave out and production cannot:

- **Real data access.** The pilot ran on an export somebody pulled by hand. Production needs a connection that survives a password rotation, a schema change and an audit.
- **Identity and permissions.** In the demo, everyone saw everything. In production, a caseworker in one division must not retrieve records from another, and the retrieval layer has to enforce that, not the prompt.
- **Failure handling.** When the model is wrong, somebody has to notice, and there has to be a defined next step.
- **Cost at real volume.** A pilot's bill is a rounding error. At full volume, tokens, storage and retrieval become a line item somebody has to defend.
- **An owner.** The pilot had a champion. Production needs a team that has the system in its job description.

None of these are research problems, and none of them demo well. That is why they get deferred, and why they decide whether the project ships.

```callout
{"kind": "definition", "title": "The production gap", "body": "The distance between a system that works when its builders run it and a system an operations team can run, support and defend without them. It is mostly made of access, permissions, failure handling, cost and ownership."}
```

## Where the handoff breaks

The second stall happens between teams. The pilot was built by an innovation group or an outside vendor. The system has to be run by IT operations, and operations was not in the room when the architecture was chosen.

The handoff then becomes a review, the review becomes a list of findings, and working through the findings takes a quarter. Nobody did anything wrong. The people who will live with the system saw it for the first time at the end.

We see this most clearly with retrieval systems. On a government energy engagement, the assistant had to run on the Azure and .NET stack the organization already operated, so ingestion and retrieval were designed around that stack from the start.[^1] Picking the stack the operators already run is an architecture decision, and it is often the one that decides whether the system survives the handoff.

## The checklist we run before week one

Before any model code, we settle five things in writing. The order matters, because each one constrains the next.

```steps
{"caption": "The five pre-build questions, in the order we settle them. Each answer constrains the ones after it.", "steps": [{"title": "Operating owner", "detail": "A named person, not a department, who is paged when it breaks and can switch it off."}, {"title": "Data route", "detail": "How live data reaches the system, approved by whoever owns that data, even if week one uses a sample."}, {"title": "Definition of wrong", "detail": "What a bad output looks like, how it gets caught, and what a person does next."}, {"title": "Where it runs", "detail": "The environment, identity provider and logging the operators already use."}, {"title": "Handoff terms", "detail": "What documentation, runbooks and sessions the owning team receives, and when."}]}
```

### 1. Name the operating owner

A person, with a name. They take part in design reviews from the first week, and they can veto an architecture choice that their team cannot support. If nobody will accept this role, you have learned something important about the project before spending on it.

### 2. Get the data route approved

Even when the first build uses a sample, the route to live data is agreed up front: which system, which service account, which fields, who approves it. Data access is the most common reason a finished pilot waits months for production, and the wait is usually procedural. Starting the approval in week one runs it in parallel with the build.

### 3. Define "wrong" before you define "right"

Teams spend weeks tuning for good answers and almost no time on what happens with bad ones. We write down:

- what a harmful or unacceptable output looks like for this use,
- how it will be detected (automated checks, sampling, user flags),
- who reviews flagged outputs, and within what time.

This is also the start of the evaluation set. The cases that define "wrong" become test cases, which is how we approached the aerospace work described in [our post on evaluation harnesses](/insights/blog/rag-evaluation-harness-technical-documents).

### 4. Build where it will run

The cheapest environment to build in is rarely the one production uses. We build in the target environment, or a faithful copy of it, from the first sprint. That means using the organization's identity provider, its logging and its network rules rather than a developer's personal account.

### 5. Write the handoff terms first

What the owning team receives is decided at the start: architecture notes, runbooks, an evaluation harness they can rerun, and working sessions. When those are deliverables from day one, the handoff becomes a scheduled event. Otherwise it turns into a rescue.

## What this costs, and what it buys

Running this checklist makes the first two weeks slower. There are more meetings and fewer demos, and sometimes it produces an uncomfortable finding, such as nobody being willing to own the system.

It buys a much shorter path from "it works" to "it's live", because the questions that usually surface at the handoff have been answered before there is anything to hand off. It also makes the project easier to defend, since every one of the five answers is something a reviewer, auditor or budget owner will eventually ask for.

The NIST AI Risk Management Framework makes the same point in governance terms. It treats deciding who is accountable, and mapping the context a system will run in, as work that comes before measurement and management.[^2]

## A test you can run this week

If you have a pilot in flight, ask the team one question: who gets the call when this is wrong in production?

If the answer is a name, you are in good shape. If the answer is a pause, spend the next month closing that gap before building anything else.

[^1]: RegainFlow case study, [Government Energy RAG Platform](/insights/government-energy-rag-platform).
[^2]: National Institute of Standards and Technology, [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework), including the Govern and Map functions.
$md$,
  'published'
),

-- 2 ---------------------------------------------------------------------------
(
  'rag-evaluation-harness-technical-documents',
  'Measure before you choose: building a RAG evaluation harness for technical documents',
  'On technical documents, answer quality is decided at ingestion. How we built an evaluation harness to compare document-processing approaches on real material, and why the harness outlives the decision.',
  '2026-07-14',
  null,
  'will-baltus',
  'retrieval-and-data',
  array['RAG', 'Evaluation', 'Document processing', 'Aerospace'],
  array[
    $t$On complex technical documents, most bad answers trace back to ingestion: tables, figures and structure that did not survive parsing.$t$,
    $t$Evaluate the stages separately. Check parsing, then retrieval, then the answer, or you cannot tell which layer failed.$t$,
    $t$Build the test set from questions your engineers actually ask, with the page that holds the answer.$t$,
    $t$Hand the harness over with the system. It is how the owning team makes the next architecture decision without you.$t$
  ],
  array['government-rag-from-qa-to-agentic-workflows', 'the-production-gap-ai-pilots', 'ai-overviews-public-agency-websites-evidence'],
  $j${"eyebrow": "Case study", "heading": "See the engagement behind this post", "body": "How we led evaluation and document-processing decisions for an aerospace manufacturer, and what stayed with their team afterwards.", "label": "Read the case study", "href": "/insights/aerospace-rag-evaluation"}$j$::jsonb,
  '/blog/placeholders/aerospace-technicians.jpg',
  'Technicians working inside an opened section of a large aircraft fuselage in a hangar.',
  'Placeholder image. NASA Armstrong Flight Research Center, public domain.',
  true, true,
  'RAG evaluation for technical documents: build the harness first',
  'How to evaluate document processing, retrieval and answers separately on complex technical material, from an aerospace manufacturing engagement.',
  $md$
When a retrieval-augmented generation (RAG) system gives a wrong answer about a technical document, the model is rarely the cause. Usually the part of the document that held the answer never made it into the index in a usable form. A torque table became a run of loose numbers, a figure caption lost its figure, or a note got split away from the step it qualified.

We learned to measure this before arguing about it. On an aerospace manufacturing engagement, answer quality depended on how complex technical documents survived processing, and nobody had evidence for which approach worked best.[^1] This post describes the harness we built to get that evidence and how we would build one again.

## Why ingestion decides the answer

A RAG system answers from the chunks it retrieves.[^2] If a chunk is wrong, a better model or a longer prompt will not bring back information that is missing from it.

Technical documents are hard on ingestion in predictable ways:

- **Tables** carry the facts people ask about most, such as limits, tolerances and part numbers. Naive text extraction flattens them.
- **Multi-column layouts** interleave unrelated text when they are read in the wrong order.
- **Figures and captions** get separated, so the caption is retrieved without the thing it describes.
- **Hierarchy** matters. "Step 4" means nothing without the procedure it belongs to, and warnings apply to the steps below them.

Different document-processing tools handle these differently. The only reliable way to choose between them is to run them on your own documents and score the results.

## Evaluate each stage on its own

The most useful design decision was to score the pipeline in stages rather than only at the end. When an answer is wrong, you want to know which layer to fix.

```steps
{"caption": "The three checkpoints in the harness. Scoring each stage separately is what turns a wrong answer into a specific fix.", "steps": [{"title": "Parsing", "detail": "Did the content that holds the answer survive conversion, with structure intact? Checked against the source page."}, {"title": "Retrieval", "detail": "For each test question, did the chunk that holds the answer come back in the top results?"}, {"title": "Answer", "detail": "Is the generated answer correct, grounded in what was retrieved, and cited to the right source?"}]}
```

Answer-level scoring alone hides too much. A correct answer can come from luck in retrieval, and a wrong one can come from a parser that dropped half a table. The staged approach follows the same split the RAGAS work uses between retrieval quality and answer faithfulness,[^3] applied one layer earlier to the parsing step.

## Build the test set from real questions

The harness is only as good as its questions. We built ours from questions the engineers who would use the system actually ask, and for each question we recorded where the answer lives: the document, the page, and the table or section.

A good test set for technical documents includes:

- lookups that land on a single table cell,
- questions whose answer spans a step and the warning above it,
- questions that need a figure or its caption,
- questions with no answer in the corpus, where the right response is to say so.

That last group gets skipped most often, and it matters most in regulated work. A system that confidently answers a question it has no source for is more dangerous than one that says it doesn't know.

```callout
{"kind": "warning", "title": "Do not let the test set drift toward what works", "body": "When a question keeps failing, the temptation is to reword it until it passes. Keep the original wording. The failures are the most valuable rows in the set."}
```

## Comparing processing approaches

With the harness in place, comparing document-processing approaches becomes a controlled experiment. The documents, questions, retrieval settings and model stay fixed while only the processing changes. On this engagement we introduced Docling, an open-source document conversion toolkit that preserves layout and table structure,[^4] and evaluated it alongside the alternatives on the client's own material.

We score each approach on criteria that map to the failure modes above:

| Criterion | What we check | Why it matters here |
|---|---|---|
| Table fidelity | Rows, columns and headers survive as structure | Limits and part data live in tables |
| Reading order | Multi-column pages read in the right sequence | Wrong order fuses unrelated instructions |
| Figure handling | Captions stay attached to figures | Diagrams carry procedure context |
| Hierarchy | Headings and step numbers are preserved | Warnings apply to the steps below them |
| Throughput and cost | Time and compute per document at full corpus size | Re-ingestion has to be affordable |

We have not published scores here, because they are specific to one client's documents and would mislead anyone with a different corpus. The method transfers. The numbers do not.

## Retrieval: hybrid, then measured

Once parsing is sound, retrieval is the next lever. Technical queries mix natural language ("what's the limit for…") with exact tokens such as part numbers, specification codes and acronyms. Pure vector search is weak on exact tokens, and pure keyword search is weak on paraphrase. We advised on a hybrid approach that combines the two. Whether a hybrid setup helps on a given corpus is itself something to measure: the retrieval stage of the harness answers it directly.

## Hand the harness over

The most durable deliverable from this engagement was the harness itself, more than any particular parser choice. It stays with the team after the engagement.[^1] New document types will arrive, better tools will be released, and the corpus will grow. Each of those is an architecture decision, and with the harness the owning team can make it on evidence without calling us.

If you take one thing from this post, start the harness before you pick the tools. It is cheaper to build first, and it turns every later debate into a test run.

[^1]: RegainFlow case study, [Aerospace Manufacturing RAG Evaluation and Delivery](/insights/aerospace-rag-evaluation).
[^2]: Lewis et al., [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), 2020.
[^3]: Es et al., [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217), 2023.
[^4]: Auer et al., [Docling Technical Report](https://arxiv.org/abs/2408.09869), 2024; project at [github.com/docling-project/docling](https://github.com/docling-project/docling).
$md$,
  'published'
),

-- 3 ---------------------------------------------------------------------------
(
  'government-rag-from-qa-to-agentic-workflows',
  'From Q&A to agentic workflows: what changes in a government RAG system',
  'A knowledge assistant that answers questions is a read-only system. Once it starts taking steps, the engineering problem changes: permissions, audit trails and failure handling all move to the front.',
  '2026-08-05',
  null,
  'will-baltus',
  'retrieval-and-data',
  array['RAG', 'Agents', 'Government', 'Architecture'],
  array[
    $t$Single-turn Q&A is read-only and forgiving. A multi-step workflow acts, so every step needs its own permission check and its own record.$t$,
    $t$Build on the stack the organization already operates. It decides whether the system can be supported after launch.$t$,
    $t$Add autonomy one bounded workflow at a time, with a person approving anything consequential.$t$,
    $t$The audit trail is part of the product. In government work, "why did it do that?" needs an answer on the record.$t$
  ],
  array['rag-evaluation-harness-technical-documents', 'the-production-gap-ai-pilots', 'ai-vendor-questions-procurement-misses'],
  $j${"eyebrow": "Case study", "heading": "The engagement behind this post", "body": "How we led ingestion and retrieval architecture for a government energy organization's internal knowledge assistant, on the stack it already ran.", "label": "Read the case study", "href": "/insights/government-energy-rag-platform"}$j$::jsonb,
  '/blog/placeholders/compute-cluster.jpg',
  'Rows of black server cabinets with green status lights in a machine room lit blue.',
  'Placeholder image. NASA Goddard Space Flight Center, public domain.',
  false, false,
  null,
  'What changes when a government knowledge assistant moves from answering questions to multi-step agentic workflows: permissions, audit, failure handling.',
  $md$
The first version of most government knowledge assistants does one thing: a staff member asks a question, and the system retrieves the relevant internal documents and drafts an answer with citations. That is useful, and it is also forgiving. If the answer is wrong, a person reads it, notices, and moves on. Nothing in the world changed.

The next request is always to have it do something: draft the memo, fill in the form, open the ticket, check the three systems and summarize what they disagree on. That is where the engineering changes. On a government energy engagement, the system we helped build is moving from single-turn Q&A toward exactly these multi-step agentic workflows,[^1] and this post covers what that move requires.

## Start on the stack they already run

The assistant was built for the organization's own documents, on the Azure and .NET stack it already operated, with Elastic for retrieval.[^1] That was a deliberate constraint, and it made everything later possible.

Every component the operators already know, including identity, logging, networking and deployment, is one less thing to justify to security review and one less thing that breaks when the builders leave. For an agentic system this matters more, because each new capability adds a new place where the system touches production. It helps if those places are already governed.

## What changes when it starts acting

A question-answering system reads. A workflow system reads, decides and writes. Each part of that loop adds a requirement:

| Concern | Single-turn Q&A | Multi-step workflow |
|---|---|---|
| Permissions | Can this user see these documents? | Can this user, through this system, take this action on this record? |
| Errors | A wrong answer is read and discarded | A wrong step can change a record or trigger the next step |
| Audit | Log the question, sources and answer | Log every step, tool call, input, output and approval |
| Testing | Answer quality on a question set | Workflow outcomes, including partial failures and retries |
| Cost | Roughly one retrieval and one generation per question | Many calls per task, and loops if nothing bounds them |

None of this is exotic. It is the discipline any system that writes to a system of record already follows, applied to a component that behaves less predictably.

## Add autonomy one workflow at a time

The most practical guidance we have found on agent design says to prefer the simplest pattern that works, and to use fixed, predefined workflows before handing a model open-ended control.[^2] That matches what works in government settings.

```steps
{"caption": "How we sequence autonomy. Each stage ships and runs in production before the next begins.", "steps": [{"title": "Answer with sources", "detail": "Read-only Q&A with citations. The baseline everything else is measured against."}, {"title": "Draft for review", "detail": "The system prepares an artifact such as a memo, form or summary. A person edits and sends it."}, {"title": "Act with approval", "detail": "The system proposes a specific action. A person approves each one before it runs."}, {"title": "Act within bounds", "detail": "Low-risk, reversible actions run unattended within explicit limits, with sampling review."}]}
```

Most workflows should stop at stage two or three for a long time. The draft-for-review stage delivers most of the time savings, and it keeps a person accountable for anything that leaves the building.

## Permissions per step, enforced outside the model

A prompt instruction is no access control. Every tool the system can call should check the calling user's permissions itself, as if the request came from that user directly. The retrieval layer should filter documents by the user's entitlements before anything reaches the model.

This keeps the security model the organization already has. The assistant can never see or do more than the person using it, and a mistake in the model's reasoning cannot widen what it is allowed to touch.

```callout
{"kind": "warning", "title": "Watch the service account", "body": "Agentic prototypes often call tools with one powerful service account for convenience. That silently gives every user the account's permissions. Replace it before the first real user, not after."}
```

## The audit trail is part of the product

In a public agency, "why did the system do that?" is a question somebody will eventually ask on the record. The system needs to answer it without anyone reconstructing events from scattered logs.

For every task we record the request, each retrieval and its sources, each tool call with its inputs and outputs, every approval and who gave it, and the final result. Stored together and keyed to the task, this gives investigators a timeline, gives engineers their debugging data, and gives the evaluation team real cases to add to the test set.

## Measure workflows, not just answers

The evaluation harness grows with the system. For Q&A we score retrieval and answers, as described in [our post on evaluation harnesses](/insights/blog/rag-evaluation-harness-technical-documents). For workflows we also score outcomes: did the task complete, did it stop safely when it should have, and did it ask for approval at the right points. Partial failures need their own test cases, such as a tool timing out halfway or two sources disagreeing.

The move from answering to acting is where these systems start earning their budget. It goes well when each step is permissioned, recorded and reversible, and when autonomy expands only as fast as the evidence supports.

[^1]: RegainFlow case study, [Government Energy RAG Platform](/insights/government-energy-rag-platform).
[^2]: Anthropic, [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), December 2024.
$md$,
  'published'
),

-- 4 ---------------------------------------------------------------------------
(
  'seeded-failure-engineering-workshops',
  'Workshops with seeded failures: AI enablement that engineers actually use',
  'Engineering teams past the basics do not need another tour of an AI coding tool. They need to see it fail in their kind of codebase and practice recovering. How we designed two workshop tracks around that idea.',
  '2026-08-26',
  null,
  'leo-ramirez',
  'production-ai',
  array['Enablement', 'AI coding tools', 'Training'],
  array[
    $t$Experienced engineers learn more from watching a tool fail and recovering than from a clean demo.$t$,
    $t$Seed the failures on purpose, so every group hits the same instructive problems at the same point.$t$,
    $t$Write for the client's engineering context, not a generic sample app, or the lessons will not transfer back to their work.$t$,
    $t$Ship facilitator guides and implementation kits, so the workshop can be run again without you.$t$
  ],
  array['the-production-gap-ai-pilots', 'rag-evaluation-harness-technical-documents', 'ai-vendor-questions-procurement-misses'],
  $j${"eyebrow": "Case study", "heading": "The workshops behind this post", "body": "Two customer-ready workshop packages, designed from two client briefs and delivered through a partner consultancy.", "label": "Read the case study", "href": "/insights/ai-engineering-enablement"}$j$::jsonb,
  null, null, null,
  false, false,
  'AI coding tool workshops with seeded failures: how we design them',
  'Why AI enablement for experienced engineering teams should be built around deliberate, seeded failures, and what a reusable workshop package contains.',
  $md$
An AI consultancy came to us with two client engineering organizations that were already past the basics. Their engineers had installed the tools and tried them. What they lacked was judgment: when to trust the output, how to steer it, and what to do when it goes wrong on real code.[^1]

We designed two 120-minute workshops on OpenAI's Codex[^2] for those teams and delivered them to the partner's field engineers, who kept the client relationships.[^1] The design choice that did the most work was deciding to make things fail on purpose.

## Why a clean demo teaches experienced engineers little

A polished demo shows the happy path, and an experienced engineer has already found the happy path in their first afternoon with the tool. What they have not had is a safe place to see the tool confidently produce something wrong, notice it, and recover.

That is the skill that decides whether a team gets value from an AI coding tool or quietly stops using it. So we built the sessions around failure.

## Seeding the failures

A seeded failure is a problem we plant in the workshop material in advance, so the tool reliably goes wrong in an instructive way at a known point. Every group hits the same problem, which means the facilitator can prepare the recovery discussion instead of improvising around whatever breaks.

```callout
{"kind": "definition", "title": "Seeded failure", "body": "A deliberate flaw placed in workshop material, such as a misleading comment, an ambiguous requirement or a subtly broken test, chosen so the tool fails in a way that teaches a specific recovery skill."}
```

The failures we find most useful map to real mistakes:

- **A plausible but wrong fix.** A test fails for a reason the obvious change does not address. The tool makes the obvious change and the test passes for the wrong reason. The lesson is to read the diff and not trust the green check.
- **Context the tool cannot see.** A constraint lives in a document or a convention outside the files the tool reads. The lesson is to supply context deliberately.
- **An over-broad change.** A request is loose enough that the tool rewrites more than it should. The lesson is to scope requests and review for collateral changes.
- **A confident wrong explanation.** The tool explains code that does something different from what it says. The lesson is to verify explanations against behaviour.

## Structure of a 120-minute session

Two hours is enough for real practice if the time is protected. We use a consistent shape so facilitators can run it the same way every time.

```steps
{"caption": "The shape of each 120-minute session. Most of the time goes to hands-on work, with each failure followed immediately by a recovery debrief.", "steps": [{"title": "Frame", "detail": "The client's own engineering context and what good use looks like there. Short."}, {"title": "Guided build", "detail": "A realistic task in a representative codebase, with the first seeded failure built in."}, {"title": "Debrief", "detail": "What went wrong, how people noticed, and the recovery move. Written down as a team rule."}, {"title": "Independent work", "detail": "A second task with fewer rails and further seeded failures."}, {"title": "Adopt", "detail": "Which rules the team takes back, and the implementation kit to apply them."}]}
```

The debrief after each failure is where most of the learning happens. Engineers compare how they noticed the problem, and the fastest detection habits spread through the room without anyone lecturing.

## Write for their context, not a sample app

Each of the two tracks was built from a different client brief, and the difference showed. A workshop set in a generic to-do app produces lessons that stay in the to-do app. A workshop set in code that resembles the team's own, with its languages, test habits and review norms, produces rules they can apply the next morning.

This takes more preparation, and it is the part a partner consultancy usually cannot do alone, because it needs engineers to build the material and seed the failures convincingly.

## Package it so it runs without us

A workshop that only its designer can deliver is a one-off event. We delivered each track as a customer-ready package:[^1]

| Component | What it contains | Who uses it |
|---|---|---|
| Narrative | The story of the session and why each part is there | Facilitators preparing to deliver |
| Live demos | Scripted tasks with seeded failures at known points | Facilitators, during the session |
| Facilitator guide | Timings, expected failures, debrief prompts, recovery answers | Anyone running it again |
| Implementation kit | The team rules, configuration and checklists to adopt afterwards | The client's engineers |

Two tracks and four hours of delivery is a small engagement. The package is what makes it reusable: the partner's field engineers can run it again for the next client without us in the room.

## What we would tell a team planning enablement

Skip the product tour. Pick three or four mistakes your engineers are likely to make with the tool, build exercises where they make them safely, and spend the saved time on the debrief. The goal is a team that uses the tool well on a Tuesday afternoon when nobody is watching, which a feature list will not produce.

[^1]: RegainFlow case study, [From two client briefs to customer-ready Codex workshops](/insights/ai-engineering-enablement).
[^2]: OpenAI, [Codex documentation](https://developers.openai.com/codex).
$md$,
  'published'
),

-- 5 ---------------------------------------------------------------------------
(
  'ai-vendor-questions-procurement-misses',
  'Before you sign: the AI vendor questions procurement checklists miss',
  'Public procurement is good at checking that a vendor is real. It is weaker at checking whether an AI product will still work for you in two years. Six questions that close the gap, and the contract terms behind them.',
  '2026-07-22',
  null,
  'leo-ramirez',
  'public-sector-ai',
  array['Procurement', 'Government', 'AI governance', 'Contracts'],
  array[
    $t$Standard vendor checks confirm a company is legitimate. They rarely test data handling, model changes or exit terms.$t$,
    $t$Ask for an evaluation on your own records, scored by your own staff, before full rollout.$t$,
    $t$Price at your realistic annual volume and at double it. Per-use pricing makes pilot costs misleading.$t$,
    $t$Negotiate the exit at signature: data export, configuration handover and transition support, in the contract.$t$
  ],
  array['the-production-gap-ai-pilots', 'government-rag-from-qa-to-agentic-workflows', 'ai-overviews-public-agency-websites-evidence'],
  $j${"eyebrow": "For government buyers", "heading": "Evaluating an AI vendor or contract?", "body": "Our capability statement, identifiers and past performance are on one page for contracting officers.", "label": "View capability statement", "href": "https://gov.regainflow.com"}$j$::jsonb,
  '/blog/placeholders/county-government.jpg',
  'A county government campus at dusk, with bare trees and lit street lamps along an empty road.',
  'Placeholder image. Packer1028 via Wikimedia Commons, CC0.',
  true, true,
  'AI vendor questions for government procurement: six to ask before signing',
  'Six questions public agencies should ask AI vendors before signing, covering data handling, model changes, evaluation, cost at volume and exit terms.',
  $md$
Public procurement is good at checking whether a vendor is real. It confirms that the company is registered, insured, financially stable and not debarred. It is much weaker at checking whether an AI product will still be working for you, at a price you can defend, two years after signature.

I was an Army officer before I was an engineer, and I still read vendor terms with one question in mind: what happens when this goes wrong and the vendor is not in the room? These six questions are the ones I would want asked on any agency's behalf. None of them are trick questions. A vendor who has shipped to public agencies before will have ready answers, and one who has not will show you a lot by how they answer.

## 1. Where does our data go, and who can see it?

Ask for the data path in plain language: from your system, to where, processed by whom, stored for how long. Then ask specifically:

- Is our data used to train or improve a model that other customers use?
- Which subprocessors touch it, and in which jurisdictions?
- What is logged, including prompts and outputs, and who at the vendor can read those logs?
- What happens to all of it when the contract ends?

"We take security seriously" is no answer. A diagram and a data processing addendum are. For federal work, FedRAMP authorization covers much of the infrastructure question, but it does not answer the training and logging questions above.[^1]

## 2. What happens when the underlying model changes?

Most AI products are built on a model the vendor does not control. Providers update, retire and reprice models on their own schedules. Your contract should say what the vendor owes you when that happens:

- notice before a model change that affects outputs,
- re-validation against your evaluation set after a change,
- the right to stay on a prior version for a defined period, or to exit if performance drops.

## 3. Can we see it perform on our own records?

Benchmarks on public datasets say little about your caseload. Ask for an evaluation on a sample of your own records, scored by your own staff, before full rollout. Agree the scoring criteria in advance, including what counts as an unacceptable output.

A vendor confident in the product will usually agree. Resistance to this is itself informative.

```callout
{"kind": "note", "title": "Keep the evaluation set", "body": "The records and scoring sheet from this evaluation become your acceptance test. Rerun them after every model change, major update and renewal."}
```

## 4. What does it cost at the volume we will actually run?

AI pricing is often per use: per document, per query, per thousand words processed. A pilot's invoice therefore says almost nothing about production cost. Ask for a written price at your realistic annual volume and at double it, and ask what happens to your price when the vendor's own model costs change.

## 5. What happens when it is wrong?

Every model is wrong some of the time. The questions are whether the product was designed for that, and who carries the consequence. Look for:

- a way for staff to flag a bad output, and a stated response time,
- a record of what the system produced and which sources it used,
- a point where a person must approve before anything consequential happens,
- contract language on responsibility for errors, rather than silence.

Federal guidance points the same way. OMB's AI memoranda for agencies emphasize risk management, human oversight for higher-impact uses, and acquisition terms that protect the government's data and rights.[^2] Agencies outside the federal system can borrow the same questions.

## 6. How do we leave?

This question gets skipped because it feels pessimistic, and it is the one that protects you most. Negotiate the exit at signature, while you still have leverage:

| Term | A good answer | A warning sign |
|---|---|---|
| Data export | Standard formats, on request, at no charge | "We can discuss that at renewal" |
| Configuration and prompts | Documented and handed over as a deliverable | Proprietary and non-transferable |
| Evaluation results | Yours, including the test set and scores | Held by the vendor |
| Transition support | Defined hours and duration in the contract | Not mentioned |
| Termination for performance | Tied to agreed evaluation thresholds | Only for material breach |

A system you cannot leave is a system whose price will rise.

## Putting the questions to work

You do not need all six in the solicitation, though the data, evaluation and exit questions belong there. The others work well in oral presentations and reference calls. What matters is that someone on the buying side asks them before signature, not after the first invoice or the first model update.

The NIST AI Risk Management Framework is a useful companion when writing evaluation criteria, because it gives both sides a shared vocabulary for mapping, measuring and managing AI risk.[^3]

[^1]: FedRAMP, [fedramp.gov](https://www.fedramp.gov/).
[^2]: Office of Management and Budget, [Memoranda for agencies](https://www.whitehouse.gov/omb/information-for-agencies/memoranda/), including the 2025 memoranda on federal use and acquisition of AI.
[^3]: National Institute of Standards and Technology, [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework).
$md$,
  'published'
),

-- 6 ---------------------------------------------------------------------------
(
  'ai-overviews-public-agency-websites-evidence',
  'AI Overviews and public-agency websites: what the 2026 evidence says',
  'Randomized experiments now show AI summaries in search cut clicks to websites by roughly 40 percent when they appear. What that means for agencies whose websites exist to inform the public, and what to change.',
  '2026-09-16',
  null,
  'will-baltus',
  'public-sector-ai',
  array['Search', 'Public information', 'Digital services'],
  array[
    $t$The best causal estimate: when an AI Overview appears, outbound clicks to websites drop by about 40 percent.$t$,
    $t$Informational and how-to questions, the core of agency websites, are the most affected kinds of search.$t$,
    $t$Google says there is no special optimization for AI features. Clear, accurate, crawlable pages remain the work.$t$,
    $t$Measure whether people find the right answer, not only visits. A drop in sessions can be a normal outcome now.$t$
  ],
  array['ai-vendor-questions-procurement-misses', 'the-production-gap-ai-pilots', 'rag-evaluation-harness-technical-documents'],
  $j${"eyebrow": "Talk to us", "heading": "Rethinking how residents find your information?", "body": "We help agencies put AI to work on their own content and services, with evidence rather than hype.", "label": "Contact us", "href": "/contact"}$j$::jsonb,
  null, null, null,
  false, false,
  'AI Overviews and government websites: the 2026 click-loss evidence',
  'What randomized experiments and large studies show about AI Overviews cutting clicks, and what public agencies should change on their websites.',
  $md$
Most agency websites exist to answer questions: how to renew a permit, when bulk pickup runs, what a new ordinance means. Those are exactly the questions search engines now answer on the results page with an AI-generated summary.

We reviewed the published evidence on what that does to website traffic as background for our own work. This post summarizes what holds up, what it means for public agencies, and what we would change.

## What the evidence says about clicks

Two randomized field experiments published in 2026 are the strongest evidence so far, because they measure cause rather than correlation. Agarwal and Sen found that when an AI Overview was shown, outbound organic clicks fell 39.8 percent, with no gain in user satisfaction to offset it.[^1] A separate preregistered experiment found that removing AI features raised click-through to publishers by 8.8 percentage points.[^2]

Behavioural and large-sample studies point the same way, with larger numbers because they measure different things:

```bars
{"caption": "Estimated drop in clicks to websites when an AI summary appears, by study. The studies differ in design: only the first is a randomized experiment, and the others cover narrower query sets or longer periods.", "unit": "%", "source": "Agarwal & Sen, SSRN 2026; Pew Research Center, July 2025; Ahrefs, 2026 update; Seer Interactive, September 2025.", "bars": [{"label": "Agarwal & Sen (randomized experiment)", "value": 39.8, "note": "Outbound organic clicks when an AI Overview is shown"}, {"label": "Pew Research Center (browsing panel)", "value": 47, "note": "Clicks on traditional results: 8% of visits with a summary vs 15% without"}, {"label": "Ahrefs (300K keywords)", "value": 58, "note": "Position-one click-through rate, December 2025 vs forecast"}, {"label": "Seer Interactive (informational queries)", "value": 61, "note": "Organic click-through, 1.76% to 0.61%"}]}
```

The most defensible single figure is the experimental one, about 40 percent. The larger numbers are real but narrower: Ahrefs measures only the top position, and Seer measures only informational queries, where losses concentrate.[^3][^4]

## Why agencies are more exposed than most

The research is consistent about which searches lose the most clicks: informational, question-style and how-to queries, especially long natural-language ones.[^3] Pew found that longer, sentence-style queries were more likely to trigger a summary.[^5]

That describes most of what an agency website is for. Branded and transactional searches are much less affected. A resident searching for the county's permit portal by name will still click. A resident asking what permit they need for a backyard shed may get their answer, or an approximation of it, without visiting.

```callout
{"kind": "warning", "title": "The accuracy problem is yours too", "body": "When a summary paraphrases your page, residents may act on the paraphrase. If your page is ambiguous or out of date, the summary inherits the problem and your office takes the phone call."}
```

## What Google says to do

Google's guidance, published in May 2026, is unusually direct. Optimizing for AI features is ordinary SEO. The same ranking systems retrieve the pages, and there is no special markup, file or rewriting technique to add. It specifically lists llms.txt files, "chunking" content for AI, and AI-specific rewrites as unnecessary for Google Search.[^6]

What it does ask for is familiar: pages that are indexable and eligible for snippets, clearly organized with descriptive headings, and useful to the person reading them. Its long-standing guidance on helpful content adds that pages should make clear who wrote them and should not change dates to look fresh without substantive changes.[^7]

For agencies, that means the fixes are editorial and technical basics. Nobody needs to buy an AI-specific product.

## What we would change on an agency website

1. **Answer the question in the first paragraph.** State the rule, the fee, the deadline or the next step plainly, then explain. Summaries draw on clear statements, and so do people skimming on a phone.
2. **Keep one authoritative page per question.** Old PDFs, duplicate pages and outdated news posts compete with the current answer. Retire or redirect them.
3. **Date and own every page.** Show when it was last reviewed and which office owns it, and review high-traffic pages on a schedule.
4. **Keep pages crawlable and snippet-eligible.** Main content should be in the HTML rather than locked in images or scanned PDFs, and nothing should block snippets unless there is a legal reason.
5. **Put the transaction one click away.** If the page leads to a form, payment or booking, make that link obvious, since the visitors who do arrive are further along.

## Measure outcomes, not only visits

A year-on-year drop in website sessions is now expected, and on its own it says little about whether residents are being served. Better measures for a public information site are whether people complete the task (applications submitted, bookings made), whether calls about the topic go up or down, and whether search tools show your pages being cited. Google Search Console now reports impressions in its AI features, though not clicks, and Bing's webmaster tools report citations.[^6][^8]

The public still needs accurate information from the agency that is responsible for it. Whether residents read it on your page or in a summary drawn from your page, what you can control is that the source is clear, current and correct.

[^1]: Agarwal and Sen, [The Impact of Google AI Overviews on Publisher Traffic and User Experience: Evidence from a Field Experiment](https://ssrn.com/abstract=6513059), SSRN, 2026.
[^2]: Wang, Gleason, Bart, Wilson and Metaxa, preregistered field experiment on AI features in search, arXiv, August 2026.
[^3]: Ahrefs, [AI Overviews reduce clicks: 2026 update](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update).
[^4]: Seer Interactive, [AIO impact on Google CTR: September 2025 update](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update).
[^5]: Pew Research Center, [Google users are less likely to click on links when an AI summary appears in the results](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/), July 2025.
[^6]: Google Search Central, [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
[^7]: Google Search Central, [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
[^8]: Microsoft Bing Webmaster Tools, AI Performance report (public preview, February 2026).
$md$,
  'published'
)

on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  published = excluded.published,
  updated_on = excluded.updated_on,
  author = excluded.author,
  topic = excluded.topic,
  tags = excluded.tags,
  takeaways = excluded.takeaways,
  related = excluded.related,
  cta = excluded.cta,
  cover_url = excluded.cover_url,
  cover_alt = excluded.cover_alt,
  cover_credit = excluded.cover_credit,
  featured = excluded.featured,
  pillar = excluded.pillar,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  body = excluded.body,
  status = excluded.status;
