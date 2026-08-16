-- Case study rows. Run this by hand against Supabase; it is deliberately not a
-- migration.
--
-- A migration that carries content re-inserts it on every environment that
-- replays it, which is how a copy edit made in Studio gets silently reverted.
-- This file is the authored source of the rows as they were last written here;
-- Studio is the editing surface after that.
--
-- **Safe to re-run.** Every statement is `on conflict (slug) do update`, so
-- running it again restores these rows to what this file says without
-- duplicating anything or disturbing rows it does not name.
--
-- ## Rules, restated because nothing enforces them here
--
-- 1. **Nothing is named without written client approval.** No company,
--    customer, internal platform, program, or project name — only the industry
--    or environment. No page says the studies are anonymized; naming the
--    omission is what makes it conspicuous.
-- 2. **No metric until we can defend it.** `at_a_glance` counts what was
--    *delivered* — engagement scope, never impact. "2 workshop tracks" is a
--    fact about the work. "40% faster reviews" would be a claim we cannot
--    source, and it does not go here or anywhere else.
--
-- `sort_order` is the listing order and an editorial decision, not a date.

------------------------------------------------------------------------------
-- AI engineering enablement
------------------------------------------------------------------------------
insert into public.case_studies (
  slug, title, industry, eyebrow, summary, capability_tags,
  meta_title, meta_description,
  context, constraints, role, engineered, outcome, next_label, next_body,
  at_a_glance, stages, tracks, artifacts, deliverables,
  industries, sort_order, status
) values (
  'ai-engineering-enablement',
  'From two client briefs to customer-ready Codex workshops',
  'Professional Services',
  'Professional Services · AI Engineering Enablement',
  'RegainFlow served as the technical enablement arm for an AI consultancy, designing and delivering two 120-minute workshops that translated each end client''s engineering constraints into live demonstrations, facilitator guidance, and reusable implementation kits.',
  array[
    'Codex enablement',
    'Workshop design',
    'AI-assisted development',
    'Live demonstration',
    'Facilitator enablement'
  ],
  'Codex Engineering Enablement Workshops',
  'How RegainFlow designed and delivered two customer-ready Codex engineering workshops, with live demonstrations, facilitator guidance, and reusable implementation kits.',

  'One consulting partner brought us two very different client briefs. Both engineering organizations were already experimenting with AI-assisted development, so a generic introduction to AI coding tools would not be credible. Each workshop needed to reflect the client''s repositories, review process, governance requirements, technical bottlenecks, and existing development culture.',

  'Both audiences were already past fundamentals, which ruled out anything that read as an introduction. The material had to be specific enough to survive engineers who knew their own stack better than we did — and it had to be deliverable by someone other than the person who wrote it, since the sessions were run for the partner''s field engineers rather than by us in front of the end client.',

  'The consultancy retained the end-client relationship. RegainFlow owned the technical workshop design and delivered the sessions to its field engineering team, preparing them to bring credible, client-specific enablement into each engagement.',

  -- Empty on purpose: `stages` below carries this study's version of "what we
  -- engineered", and filling both would print it twice under one heading.
  '{}',

  'The consulting partner''s field engineering team received two customer-ready workshop packages it could run with technical depth: client-specific narratives, live demonstration flows, facilitator guidance, and reusable implementation kits.',

  'Designed to compound',
  'The engagement produced a repeatable method for turning a client brief into practical engineering enablement—while preserving the technical specificity that makes each workshop credible.',

  -- Scope facts. Every one of these counts something delivered.
  '[
    {"value": "2", "label": "Tailored workshop tracks"},
    {"value": "4 hrs", "label": "Of live delivery"},
    {"value": "2", "label": "Client-specific demonstration narratives"},
    {"value": "1", "label": "Reusable enablement framework"}
  ]'::jsonb,

  '[
    {"name": "Discover", "detail": "Convert scoping conversations into engineering constraints and a focused workshop thesis."},
    {"name": "Design", "detail": "Build client-specific agendas, technical narratives, exercises, and facilitator talk tracks."},
    {"name": "Prove", "detail": "Create live demonstration flows with seeded failures, validation steps, recovery paths, and human review gates."},
    {"name": "Equip", "detail": "Provide reusable templates, implementation kits, difficult-question preparation, and recommended rollout paths."}
  ]'::jsonb,

  '[
    {
      "key": "A",
      "label": "Increasing review throughput without lowering the bar",
      "thesis": "Accelerate human review without weakening the merge standard.",
      "context": [
        "Monorepo and stacked-branch workflow",
        "Review bottlenecks",
        "Weak or implementation-coupled tests",
        "Missing end-to-end verification",
        "Architecture and governance controls",
        "Cloud and MCP-assisted workflows"
      ],
      "demos": [
        "A seeded production-style defect",
        "Behavior-focused tests",
        "Architecture guardrails",
        "Browser verification",
        "Risk-tiered review",
        "Session mining"
      ]
    },
    {
      "key": "B",
      "label": "Creating consistency without removing autonomy",
      "thesis": "Build a shared engineering harness while preserving individual autonomy.",
      "context": [
        "Multiple repositories",
        "Ticket-driven delivery",
        "Engineers using different AI development tools",
        "Human approval for design and customer-facing work",
        "Shared guidance without prescribing every engineer''s workflow"
      ],
      "demos": [
        "Repository-level agent guidance",
        "Shared engineering skills",
        "Boundary and architecture rules",
        "Behavior-based tests",
        "Browser proof with a human handoff",
        "Lifecycle hooks",
        "A continuous learning loop"
      ]
    }
  ]'::jsonb,

  '[
    {
      "kind": "spine",
      "title": "Workshop spine",
      "caption": "How each client''s constraints became a focused thesis and a session sequence.",
      "nodes": ["Client constraints", "Workshop thesis", "Module sequence", "Live demonstration", "Leave-behind kit"]
    },
    {
      "kind": "branch-stack",
      "title": "Branch-stack journey",
      "caption": "The demonstration path: a seeded failure carried through behavior tests, architecture rules, and browser verification to a human review gate.",
      "nodes": ["demo-0 · seeded failure", "demo-1 · behavior tests", "demo-2 · architecture rules", "main · browser proof, human review"]
    },
    {
      "kind": "kit",
      "title": "Leave-behind kit",
      "caption": "The reusable package each track shipped with.",
      "nodes": ["Repository guidance", "Merge gates", "Architecture rules", "Risk tiers", "Facilitator material", "Rollout recommendations"]
    }
  ]'::jsonb,

  array[
    'Two customer-ready Codex workshops',
    'Client-specific technical narratives',
    'Live demonstration sequences',
    'Field-ready decks and facilitator scripts',
    'Reusable implementation and rollout kits',
    'Difficult-question and fallback guidance',
    'Recommendations for follow-up pilots'
  ],

  '{}', 0, 'published'
)
on conflict (slug) do update set
  title = excluded.title, industry = excluded.industry, eyebrow = excluded.eyebrow,
  summary = excluded.summary, capability_tags = excluded.capability_tags,
  meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  context = excluded.context, constraints = excluded.constraints, role = excluded.role,
  engineered = excluded.engineered, outcome = excluded.outcome,
  next_label = excluded.next_label, next_body = excluded.next_body,
  at_a_glance = excluded.at_a_glance, stages = excluded.stages,
  tracks = excluded.tracks, artifacts = excluded.artifacts,
  deliverables = excluded.deliverables, industries = excluded.industries,
  sort_order = excluded.sort_order, status = excluded.status;

------------------------------------------------------------------------------
-- Government energy RAG platform
------------------------------------------------------------------------------
insert into public.case_studies (
  slug, title, industry, summary, capability_tags,
  context, constraints, role, engineered, outcome, next_body,
  industries, sort_order, status
) values (
  'government-energy-rag-platform',
  'Government Energy RAG Platform',
  'Government & Energy',
  'Technical leadership on an internal knowledge assistant for a government energy organization — document ingestion, retrieval architecture, and the path from answering questions to running multi-step work.',
  array[
    'Retrieval-augmented generation',
    'Document ingestion',
    'Elastic retrieval',
    'Azure and .NET',
    'Agentic workflows'
  ],
  'A government energy organization building an internal knowledge assistant over its own document estate, so that staff could get answers out of material that previously had to be found and read.',
  'A government environment, on an Azure and .NET stack the organization already ran and had to keep running. The architecture had to fit the platform and the operating practices in place rather than arrive as something adjacent to them, and the retrieval had to hold up against real documents rather than a curated sample.',
  'RegainFlow provided technical leadership on the platform. We led the architecture for document ingestion and Elastic-based retrieval and stayed close to the engineering as it was built, working inside the organization''s stack and delivery process.',
  array[
    'A document ingestion path that takes the organization''s own material into a form retrieval can actually use.',
    'An Elastic-based retrieval architecture sized to the corpus and to the questions being asked of it.',
    'An assistant built on the Azure and .NET platform already in place, so it is operated by the team that operates everything else.'
  ],
  'An internal knowledge assistant in the organization''s own environment, answering questions from its document estate on infrastructure its team already knows how to run.',
  'The system is evolving from single-turn question answering toward multi-step agentic workflows — moving from answering a question to carrying out the work the answer implies.',
  array['federal-state-local'], 1, 'published'
)
on conflict (slug) do update set
  title = excluded.title, industry = excluded.industry, summary = excluded.summary,
  capability_tags = excluded.capability_tags, context = excluded.context,
  constraints = excluded.constraints, role = excluded.role,
  engineered = excluded.engineered, outcome = excluded.outcome,
  next_body = excluded.next_body, industries = excluded.industries,
  sort_order = excluded.sort_order, status = excluded.status;

------------------------------------------------------------------------------
-- Aerospace manufacturing RAG evaluation
------------------------------------------------------------------------------
insert into public.case_studies (
  slug, title, industry, summary, capability_tags,
  context, constraints, role, engineered, outcome, next_body,
  industries, sort_order, status
) values (
  'aerospace-rag-evaluation',
  'Aerospace Manufacturing RAG Evaluation and Delivery',
  'Aerospace Manufacturing',
  'Led the evaluation harness and document-processing comparison behind a retrieval system, introduced Docling, and helped the delivery team reach a critical milestone.',
  array[
    'Evaluation harness',
    'Document processing',
    'Docling',
    'Data-quality pipeline',
    'Hybrid retrieval'
  ],
  'An aerospace manufacturing retrieval program where the quality of the answers depended on how well complex technical documents survived processing — and where nobody could yet say, with evidence, which processing approach was doing that best.',
  'A live delivery effort working to a critical milestone, so the evaluation had to inform decisions on the schedule the team was already on rather than run beside it. The documents were the hard part: technical manufacturing material whose structure carries meaning that a naive extraction discards.',
  'RegainFlow led the evaluation harness and the document-processing comparison, and advised on the data-quality pipeline and the hybrid retrieval architecture. We worked alongside the client''s delivery team rather than in place of it, and helped them hit the milestone.',
  array[
    'An evaluation harness that made document-processing and retrieval quality a measured result rather than an opinion.',
    'A structured comparison of document-processing approaches, run against the program''s own material.',
    'The introduction of Docling into the processing pipeline, on the evidence the comparison produced.',
    'Architectural guidance on the data-quality pipeline and on hybrid retrieval.'
  ],
  'The team could show which processing approach performed better and why, and made its architecture decisions on measured evidence. The critical milestone was met.',
  'The harness outlasts the engagement: it is the mechanism that tells the team whether the next change to processing or retrieval helped or hurt.',
  array['defense-aerospace'], 2, 'published'
)
on conflict (slug) do update set
  title = excluded.title, industry = excluded.industry, summary = excluded.summary,
  capability_tags = excluded.capability_tags, context = excluded.context,
  constraints = excluded.constraints, role = excluded.role,
  engineered = excluded.engineered, outcome = excluded.outcome,
  next_body = excluded.next_body, industries = excluded.industries,
  sort_order = excluded.sort_order, status = excluded.status;
