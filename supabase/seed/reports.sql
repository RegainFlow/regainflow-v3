-- Report rows for the LOCAL stack only, so `/insights/reports` and the report
-- pages have something real to render in development.
--
-- **Never run this against production.** Production reports are published by
-- `pnpm report:publish`, which uploads the PDF, cover and audio to storage and
-- writes absolute URLs. These rows point at the covers committed under
-- `public/reports/` (relative paths, which `next/image` serves without a
-- `remotePatterns` entry) and at PDF paths that do not exist locally, so the
-- download link on a local report page is dead by design. Audio is left out
-- for the same reason.
--
-- Summaries and findings are drawn from the reports themselves (the PDFs in the
-- founders' Drive, August 2026). Figures appear only where the report cites a
-- source for them. Page counts are the PDFs' own.
--
-- `npx supabase db reset` runs this with the other seeds. To apply it alone:
--   docker exec -i supabase_db_regainflow-v3 psql -U postgres < supabase/seed/reports.sql
-- Safe to re-run: every row is `on conflict (slug) do update`.

insert into public.reports (
  slug, title, summary, published, findings, cover_url, pdf_url, pages, status
) values
(
  'the-no-brainer-ai-investment',
  'The No-Brainer AI Investment',
  'Where enterprise AI should start: internal knowledge search, because it pays directly and forces the data maturity everything after it depends on.',
  '2026-08-17',
  array[
    'Every organization past a certain size has scattered institutional knowledge, and nobody needs persuading that faster, sourced answers are worth having, so adoption risk is low.',
    'For grounded answers over your own documents, every leading model clears the bar. Model choice becomes procurement: cost, hosting and data residency.',
    'Credible knowledge search needs governed, permissioned, current data. Building it leaves a digital thread that analytics, automation and agents all reuse.',
    'Agents and redesigned workflows need exactly what a good knowledge search deployment leaves behind. Most stalled pilots trace back to skipping that stage.',
    'Five questions separate a deployment from a demo: name the owner, bound the corpus, decide permissions early, define trustworthy before rollout, and plan where the returned time goes.'
  ],
  '/reports/the-no-brainer-ai-investment-cover.png',
  '/reports/the-no-brainer-ai-investment.pdf',
  10,
  'published'
),
(
  'the-ai-roi-problem',
  'The AI ROI Problem',
  'Why returns on AI are hard to measure, why costs run away, why adoption stalls, and a before, during and after framework for all three.',
  '2026-08-16',
  array[
    'Without success criteria written before deployment (metric, baseline, target, date, owner), any ROI figure produced afterwards cannot be checked.',
    'AI spend is metered, so the cost side moves with usage, model choice, context size, retries and agent chains. The FinOps Foundation found 73% of enterprises exceeded their AI cost projections.',
    'The provider invoice is one line. Integration, data preparation, evaluation, governance and training routinely take the total to two to three times the subscription.',
    'Automating one step moves the constraint to review and handoffs. Two to three times on a whole workflow is a strong, realistic result.',
    'Adoption is the cheapest failure to prevent: build the first use case with the people who will use it, around friction they already work around.'
  ],
  '/reports/the-ai-roi-problem-cover.png',
  '/reports/the-ai-roi-problem.pdf',
  14,
  'published'
),
(
  'surviving-the-ai-hype-cycle',
  'Surviving the AI Hype Cycle',
  'The seven stages organizations go through with AI, from confusion to possibility, and the six pieces of work that shorten the trough or recover from it.',
  '2026-08-16',
  array[
    'Adoption is nearly universal and value is rare: McKinsey found 88% of organizations using AI, and about 6% capturing measurable P&L impact.',
    'Four forces produce the curve: expectations that outrun the work, demos that flatter, budgets that invert the 10-20-70 ratio of algorithms, infrastructure and people, and shadow AI that keeps running.',
    'Each emotional stage maps to a piece of work (Understand, Focus, Prepare, Prove, Embed, Scale), so the trough becomes a work order instead of a verdict.',
    'After a failed pilot, diagnose the workflow before blaming the model, salvage the data and process work already done, and rebuild credibility with one small, measured win.'
  ],
  '/reports/surviving-the-ai-hype-cycle-cover.png',
  '/reports/surviving-the-ai-hype-cycle.pdf',
  11,
  'published'
),
(
  'closing-the-ambition-circuit',
  'Closing the Ambition Circuit',
  'An operating model for turning AI ambition into systems a business can run: direction travels down five layers, and evidence travels back up.',
  '2026-08-09',
  array[
    'Individual speed does not add up to a better business: in the Work AI Index 2026, 75% of digital workers said AI improves their productivity, and 13% said it had significantly improved their organization''s performance.',
    'AI lowers the threshold for automation, so small or temporary problems are now worth solving, provided each one has an owner, tests, a review path and recovery.',
    'Human oversight is a capacity with limits. Tier review by consequence and put judgment where errors cost most and are hardest to reverse.',
    'Programs usually fail between layers: ambition with no operating outcome, local value with no owner, fast generation in front of slow coordination, authority with no boundary, and feedback that never travels up.',
    'Measure value after human and operational cost, including review time, rework and exceptions, instead of counting seats and sessions.'
  ],
  '/reports/closing-the-ambition-circuit-cover.png',
  '/reports/closing-the-ambition-circuit.pdf',
  22,
  'published'
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  published = excluded.published,
  findings = excluded.findings,
  cover_url = excluded.cover_url,
  pdf_url = excluded.pdf_url,
  pages = excluded.pages,
  status = excluded.status;
