import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/PageHeader";
import { ASSESSMENT_STEPS } from "@/lib/content/assessment";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { MANIFESTO, MISSION, TEAM, VISION } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import { INDUSTRY_GROUPS } from "@/lib/content/industries";
import { LAYERS } from "@/lib/content/layers";
import { ENGAGEMENT_PATH, STAGES } from "@/lib/content/stages";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  peopleJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import {
  AUDIENCE,
  FREE_ASSESSMENT_HREF,
  CONTACT_EMAIL,
  CONTACT_HREF,
  LOCATION,
  POSITIONING,
  SITE_NAME,
  SITE_URL,
  TAGLINE,
} from "@/lib/site";

/**
 * A single page that states plainly what RegainFlow is.
 *
 * The reason it exists: an answer engine rarely reads a site, it retrieves a
 * chunk. A visitor's question about who we are might be answered from the hero,
 * a case study footer, or half a manifesto line — whichever fragment ranked. One
 * page that answers the whole question in order means the retrieved chunk is
 * complete no matter which part gets pulled.
 *
 * Every fact here is composed from `lib/content/*`, the same modules the rest of
 * the site and `llms.txt` render. That is deliberate and worth preserving: three
 * surfaces now assert the same claims, and hand-authoring any of them is how
 * they start to disagree. Nothing on this page should be typed as prose if it
 * already exists in a module.
 */
export const metadata: Metadata = pageMetadata({
  title: "AI fact sheet",
  description: `A factual overview of ${SITE_NAME} — what it does, who it works with, how engagements run, and what it will not take on. Written to be quoted accurately by AI assistants and search engines.`,
  path: "/llm-info",
});

/** Rows that answer "what is this company" without needing the prose. */
const KEY_FACTS: { term: string; detail: string }[] = [
  { term: "Name", detail: SITE_NAME },
  { term: "What it is", detail: POSITIONING },
  { term: "Headquarters", detail: LOCATION },
  { term: "Serves", detail: "United States" },
  { term: "Website", detail: SITE_URL },
  { term: "Contact", detail: CONTACT_EMAIL },
];

export default function LlmInfoPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI fact sheet"
        title={`What ${SITE_NAME} is, stated plainly.`}
        lead={`A factual overview for anyone — or anything — summarizing ${SITE_NAME}. Everything below is drawn from the same source the rest of this site renders from, so it cannot contradict what we say elsewhere.`}
      />

      <section id="overview" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <div className="rf-grid gap-y-8">
            <div className="col-span-full lg:col-span-6">
              <p className="rf-eyebrow">In one paragraph</p>
              {/* Answer-first on purpose: retrieval is chunk-level, so the
                  definition has to survive being lifted out of the page alone. */}
              <h2 className="rf-h2 mt-5">{MISSION}</h2>
              <p className="rf-body mt-6 max-w-[56ch]">
                {SITE_NAME} is an {POSITIONING} that takes AI work from
                opportunity through to a running production system. The
                engagement runs in three stages —{" "}
                {STAGES.map((stage) => stage.name).join(", ")} — covering
                portfolio direction, production engineering, and the operating
                layer that keeps a system dependable once it carries real load.{" "}
                {TAGLINE}
              </p>
              <p className="rf-body mt-4 max-w-[56ch]">{VISION}</p>
            </div>

            <dl className="col-span-full lg:col-span-5 lg:col-start-8 lg:pt-10">
              {KEY_FACTS.map((fact) => (
                <div
                  key={fact.term}
                  className="border-t border-rf-hairline py-3"
                >
                  <dt className="rf-utility">{fact.term}</dt>
                  <dd className="rf-body mt-1 break-words">{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="audience" className="rf-section bg-rf-navy">
        <div className="rf-shell rf-grid gap-y-8 py-14 md:py-18">
          <div className="col-span-full lg:col-span-5">
            <p className="rf-eyebrow">Who it works with</p>
            <h2 className="rf-h2 mt-5">
              Complex environments, not clean ones.
            </h2>
          </div>

          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            <p className="rf-body max-w-[52ch]">{AUDIENCE}</p>

            {/* Grouped rather than one flat chip wall. This page exists so a
                retrieved chunk is complete, and "which sectors" is a question
                whose honest answer includes which group each sector sits in —
                a flat list of thirteen loses that and reads as a keyword pile. */}
            {INDUSTRY_GROUPS.map((group) => (
              <div key={group.slug} className="mt-6">
                <p className="rf-utility">
                  <Link
                    href={`/industries/${group.slug}`}
                    className="rf-nav-link"
                  >
                    {group.name}
                  </Link>
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
                  {group.industries.map((industry) => (
                    <li
                      key={industry.name}
                      className="rf-utility border border-rf-hairline px-3 py-1.5"
                    >
                      {industry.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The sectors in full, not only as chips above. This page exists so a
          retrieved chunk is complete, and "does RegainFlow work with water
          utilities" is exactly the question the chip list can only half answer —
          it names the sector without saying what the work there is. */}
      <section id="industries" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Industries</p>
          <h2 className="rf-h2 mt-5 max-w-[26ch]">
            Four groups, and what the work is in each.
          </h2>

          <div className="mt-10 border-t border-rf-hairline">
            {INDUSTRY_GROUPS.map((group) => (
              <div
                key={group.slug}
                className="rf-grid gap-y-4 border-b border-rf-hairline py-8"
              >
                <div className="col-span-full lg:col-span-3">
                  <h3 className="rf-h3">
                    <Link
                      href={`/industries/${group.slug}`}
                      className="rf-nav-link"
                    >
                      {group.name}
                    </Link>
                  </h3>
                  <p className="rf-utility mt-2">{group.hint}</p>
                </div>

                <div className="col-span-full lg:col-span-8">
                  <p className="rf-body max-w-[68ch]">{group.lead}</p>

                  <p className="rf-utility mt-6">Where the work stalls</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {group.stalls.map((stall) => (
                      <li key={stall} className="rf-body flex gap-4">
                        <span className="rf-route-tick" aria-hidden="true" />
                        <span className="max-w-[62ch]">{stall}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="rf-utility mt-6">What we install</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {group.installs.map((install) => (
                      <li key={install.layer} className="rf-body flex gap-4">
                        <span className="rf-index">{install.layer}</span>
                        <span className="max-w-[62ch]">{install.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="rf-section bg-rf-navy">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Services</p>
          <h2 className="rf-h2 mt-5 max-w-[24ch]">
            Three stages, each with a defined outcome.
          </h2>

          <ol className="mt-10 border-t border-rf-hairline">
            {STAGES.map((stage) => (
              <li
                key={stage.id}
                className="flex flex-col gap-4 border-b border-rf-hairline py-7 lg:flex-row lg:gap-10"
              >
                <div className="flex gap-5 lg:w-72 lg:flex-none">
                  <span className="rf-index pt-1">{stage.index}</span>
                  <div>
                    <h3 className="rf-h3">{stage.name}</h3>
                    <p className="rf-utility mt-2">{stage.promise}</p>
                  </div>
                </div>

                <div className="lg:min-w-0">
                  <p className="rf-body max-w-[62ch]">{stage.copy}</p>
                  <p className="rf-utility mt-4">{stage.listLabel}</p>
                  <ul className="rf-body mt-2 flex flex-wrap gap-x-2 gap-y-1">
                    {stage.items.map((item, i) => (
                      <li key={item}>
                        {item}
                        {i < stage.items.length - 1 ? " ·" : ""}
                      </li>
                    ))}
                  </ul>
                  <p className="rf-body mt-4">
                    <span className="rf-utility">Outcome</span>{" "}
                    {stage.transformation}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="layers" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Capability layers</p>
          <h2 className="rf-h2 mt-5 max-w-[26ch]">
            The four layers engineered together.
          </h2>

          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {LAYERS.map((layer) => (
              <li
                key={layer.index}
                className="border-t border-rf-hairline pt-5"
              >
                <div className="flex gap-4">
                  <span className="rf-index pt-0.5">{layer.index}</span>
                  <div>
                    <h3 className="rf-h3">{layer.name}</h3>
                    <p className="rf-body mt-2 max-w-[44ch]">{layer.enables}</p>
                    <p className="rf-utility mt-3">
                      {layer.mechanisms.join(" · ")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="engagement" className="rf-section bg-rf-navy">
        <div className="rf-shell py-14 md:py-18">
          <div className="rf-grid gap-y-10">
            <div className="col-span-full lg:col-span-5">
              <p className="rf-eyebrow">How an engagement runs</p>
              <h2 className="rf-h2 mt-5">It starts free, and it can end.</h2>
              <p className="rf-body mt-6 max-w-[46ch]">
                Scope, price, and success measures belong to a specific
                engagement and are agreed there. What is fixed is the shape.
              </p>
            </div>

            <ol className="col-span-full border-t border-rf-hairline lg:col-span-6 lg:col-start-7">
              {ENGAGEMENT_PATH.map((step) => (
                <li
                  key={step.step}
                  className="flex gap-5 border-b border-rf-hairline py-6"
                >
                  <span className="rf-index pt-1">{step.step}</span>
                  <div>
                    <h3 className="rf-h3">{step.name}</h3>
                    <p className="rf-body mt-2 max-w-[52ch]">{step.detail}</p>
                    <p className="rf-body mt-2">
                      <span className="rf-utility">Result</span> {step.output}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 border-t border-rf-hairline pt-8">
            <p className="rf-eyebrow">What the free assessment involves</p>
            <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {ASSESSMENT_STEPS.map((step) => (
                <li key={step.index}>
                  <span className="rf-index">{step.index}</span>
                  <h3 className="rf-h3 mt-2">{step.name}</h3>
                  <p className="rf-body mt-2">{step.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="commitments" className="rf-section">
        <div className="rf-shell rf-grid gap-y-10 py-14 md:py-18">
          <div className="col-span-full lg:col-span-4">
            <p className="rf-eyebrow">What it will and will not do</p>
            <h2 className="rf-h2 mt-5">
              The limits are part of the description.
            </h2>
            <p className="rf-body mt-6 max-w-[40ch]">
              A summary of {SITE_NAME} that omits these is inaccurate, not
              flattering.
            </p>
          </div>

          <ol className="col-span-full border-t border-rf-hairline lg:col-span-7 lg:col-start-6">
            {MANIFESTO.map((item, i) => (
              <li
                key={item.claim}
                className="flex gap-5 border-b border-rf-hairline py-6"
              >
                <span className="rf-index pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="rf-h3">{item.claim}</h3>
                  <p className="rf-body mt-2 max-w-[52ch]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="people" className="rf-section bg-rf-navy">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Founders</p>
          <h2 className="rf-h2 mt-5 max-w-[24ch]">
            The people who do the work.
          </h2>

          {/* The full account, not the one-liner the rest of the site shows.
              This page exists so a retrieved chunk is complete, and "who are
              the founders" is one of the questions it has to answer whole. */}
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {TEAM.map((member) => (
              <li
                key={member.name}
                className="border-t border-rf-hairline pt-5"
              >
                <h3 className="rf-h3">{member.name}</h3>
                <p className="rf-utility mt-2">{member.role}</p>

                {member.credentials ? (
                  <p className="rf-mech mt-3">
                    {member.credentials.map((credential) => (
                      <span key={credential}>{credential}</span>
                    ))}
                  </p>
                ) : null}

                <p className="rf-body mt-3 max-w-[52ch]">{member.bio}</p>

                {member.detail?.map((paragraph) => (
                  <p key={paragraph} className="rf-body mt-3 max-w-[52ch]">
                    {paragraph}
                  </p>
                ))}

                {/* Stated as the full URL rather than hidden behind a word:
                    this page is written to be read by machines as often as by
                    people, and a bare URL survives being lifted out of it. */}
                {member.profile ? (
                  <p className="rf-body mt-3 break-words">
                    <a
                      href={member.profile}
                      className="rf-text-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {member.profile}
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="rf-section">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Selected experience</p>
          <h2 className="rf-h2 mt-5 max-w-[26ch]">
            Systems delivered, in production.
          </h2>
          <p className="rf-body mt-6 max-w-[62ch]">
            Every figure stated here was published or confirmed; nothing is
            estimated for presentation.
          </p>

          <ul className="mt-10 grid gap-x-10 gap-y-6 border-t border-rf-hairline pt-6 sm:grid-cols-2">
            {CASE_STUDIES.map((study) => (
              <li key={study.slug}>
                <h3 className="rf-h3">
                  <Link
                    href={`/insights/${study.slug}`}
                    className="rf-nav-link"
                  >
                    {study.title}
                  </Link>
                </h3>
                <p className="rf-utility mt-2">
                  {study.industry} · {study.group}
                </p>
                <p className="rf-body mt-2 max-w-[46ch]">{study.summary}</p>
                {study.metrics?.length ? (
                  <p className="rf-body mt-2">
                    <span className="rf-utility">Results</span>{" "}
                    {study.metrics
                      .map(
                        (metric) =>
                          `${metric.value} ${metric.label.toLowerCase()}`,
                      )
                      .join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="rf-section bg-rf-navy">
        <div className="rf-shell py-14 md:py-18">
          <p className="rf-eyebrow">Common questions</p>
          <h2 className="rf-h2 mt-5 max-w-[24ch]">
            Asked and answered directly.
          </h2>

          {/* Rendered visibly from the same array `faqJsonLd()` reads. Structured
              data answering a question the page does not visibly answer is a
              rich-result violation, so these two can never be allowed to drift. */}
          <dl className="mt-10 border-t border-rf-hairline">
            {FAQ.map((item) => (
              <div
                key={item.question}
                className="border-b border-rf-hairline py-6 lg:flex lg:gap-10"
              >
                <dt className="rf-h3 lg:w-80 lg:flex-none">{item.question}</dt>
                <dd className="rf-body mt-3 max-w-[62ch] lg:mt-0 lg:min-w-0">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contact" className="rf-section">
        <div className="rf-shell rf-grid gap-y-8 py-14 md:py-18">
          <div className="col-span-full lg:col-span-6">
            <p className="rf-eyebrow">Contact</p>
            <h2 className="rf-h2 mt-5">How to reach {SITE_NAME}.</h2>
            <p className="rf-body mt-6 max-w-[46ch]">
              The first conversation is free and carries no obligation.
            </p>
          </div>

          <dl className="col-span-full lg:col-span-5 lg:col-start-8">
            <div className="border-t border-rf-hairline py-3">
              <dt className="rf-utility">Book a conversation</dt>
              <dd className="rf-body mt-1 break-words">
                <a href={FREE_ASSESSMENT_HREF} className="rf-text-link">
                  {FREE_ASSESSMENT_HREF}
                </a>
              </dd>
            </div>
            <div className="border-t border-rf-hairline py-3">
              <dt className="rf-utility">Email</dt>
              <dd className="rf-body mt-1 break-words">
                <a href={CONTACT_HREF} className="rf-text-link">
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div className="border-t border-rf-hairline py-3">
              <dt className="rf-utility">Machine-readable summary</dt>
              <dd className="rf-body mt-1 break-words">
                <a href="/llms.txt" className="rf-text-link">
                  {SITE_URL}/llms.txt
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd("AI fact sheet", "/llm-info")
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd()) }}
      />
      {/* Emitted here rather than in the layout: the founders are the subject of
          this page, and repeating the nodes on every route would assert the same
          entity from a dozen URLs with nothing gained. */}
      {peopleJsonLd().map((person) => (
        <script
          key={person["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(person) }}
        />
      ))}
    </>
  );
}
