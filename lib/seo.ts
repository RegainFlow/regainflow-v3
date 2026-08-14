import type { Metadata } from "next";

import { CASE_STUDIES, type CaseStudy } from "@/lib/content/case-studies";
import { TEAM } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import type { IndustryGroup } from "@/lib/content/industries";
import type { Report } from "@/lib/content/reports";
import { STAGES } from "@/lib/content/stages";
import {
  CONTACT_EMAIL,
  FREE_ASSESSMENT_HREF,
  PROFILES,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * Every structured-data payload here is authored in this repository — no user
 * input reaches it. The `<` escape is belt-and-braces: it guarantees a string
 * containing `</script>` can never close the tag early, whatever the copy
 * becomes later.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Every card this site generates is a 1200×630 PNG. Stated rather than inferred
 * because the file convention's own tags are not emitted for a page that
 * declares `openGraph` — see `pageMetadata`.
 *
 * One tag the convention adds that cannot be reproduced here is its content
 * hash. Without it a redeploy that changes the card leaves scrapers serving the
 * cached one until their TTL expires or the URL is resubmitted; the card's copy
 * is stable enough that this is the better trade against having no dimensions.
 */
const OG_CARD = { width: 1200, height: 630, type: "image/png" };

/**
 * Per-route metadata.
 *
 * A page that declares `openGraph` replaces the layout's object outright rather
 * than merging into it, and the same goes for `twitter` — so a page setting
 * only a title silently loses the card image, site name, and locale, and keeps
 * the home page's Twitter description. Building all three here keeps every
 * route complete and consistent.
 *
 * That replacement is also why `images` has to be stated rather than left to
 * Next's `opengraph-image.tsx` convention. The convention only fills in an
 * `openGraph` object the page has not declared: with `images` omitted, the home
 * page (whose card sits in its own segment) kept the full tag set while every
 * page using this helper emitted no `og:image` at all. Verified in the built
 * HTML both ways — it fails silently, which is the dangerous kind.
 *
 * Stated as an object, not the bare `"/opengraph-image"` string this used to
 * pass: a string emits `og:image` alone and drops `og:image:width`, `:height`,
 * and `:alt`, which is what several scrapers use to decide whether to render a
 * large card at all.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * For routes that generate their own card. Defaults to the site card — pass
   * this only where an `opengraph-image` file exists for that segment, or the
   * tags will point at an image that is never generated.
   */
  image?: { url: string; alt: string };
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const card = {
    url: image?.url ?? "/opengraph-image",
    alt: image?.alt ?? `${SITE_NAME} — AI transformation partner`,
    ...OG_CARD,
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${path}`,
      type: "website",
      locale: "en_US",
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [card],
    },
  };
}

/**
 * A stable `@id` for a person, derived from their name.
 *
 * Nodes are linked by `@id` rather than nested so each person is stated once and
 * referenced everywhere else — the organization's `founder`, the page graph, and
 * any future author byline all resolve to the same entity instead of describing
 * three lookalikes.
 */
function personId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${SITE_URL}/#person-${slug}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    // `logo` is what Google reads for the knowledge panel; `image` is the
    // general-purpose fallback. Google wants a logo it can crop square, which
    // is what the 512×512 RF mark is.
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "AI transformation partner for law enforcement, aerospace manufacturing, and federal organizations — AI portfolio direction, production engineering, and managed AI operations.",
    areaServed: "US",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Orlando",
      addressRegion: "FL",
      addressCountry: "US",
    },
    // `address` already carries the location as a typed Place; a second
    // free-text `location` would not validate.
    //
    // `sameAs` is the entity anchor — the set of URLs that let a crawler confirm
    // this node and the profiles it already knows about are one organization.
    // Derived from `PROFILES` rather than restated, so the footer and this node
    // cannot come to disagree about where the company is.
    sameAs: [FREE_ASSESSMENT_HREF, ...PROFILES.map((profile) => profile.href)],
    // Name as well as `@id`, not a bare reference. This node ships on every
    // route but the full `Person` nodes only exist on `/llm-info`, so a
    // reference alone would dangle on four pages out of five. Carrying the name
    // makes each one valid standalone, and the shared `@id` still merges it with
    // the complete node wherever both are seen.
    founder: TEAM.map((member) => ({
      "@type": "Person",
      "@id": personId(member.name),
      name: member.name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI transformation services",
      itemListElement: STAGES.map((stage) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: stage.name,
          description: stage.copy,
          url: `${SITE_URL}/services#${stage.id}`,
        },
      })),
    },
  };
}

/**
 * The site itself, as distinct from the organization that publishes it. Gives
 * answer engines and crawlers one node to hang the name and publisher on, and
 * is what a `sameAs`/`publisher` reference resolves against.
 *
 * No `SearchAction` — the site has no search endpoint, and declaring one that
 * 404s is worse than declaring nothing.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * `parent` is only passed by the case study pages, which sit a level below
 * `/insights`. Every other call stays a two-crumb trail.
 */
export function breadcrumbJsonLd(
  name: string,
  path: string,
  parent?: { name: string; path: string }
) {
  const trail = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ...(parent
      ? [
          {
            "@type": "ListItem",
            position: 2,
            name: parent.name,
            item: `${SITE_URL}${parent.path}`,
          },
        ]
      : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...trail,
      {
        "@type": "ListItem",
        position: trail.length + 1,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
}

/**
 * A single study, for the detail page — which until now shipped a breadcrumb
 * and nothing else, so the page's actual subject was invisible to anything
 * reading structured data.
 *
 * `CreativeWork` rather than `Article`: these are accounts of delivered work,
 * not dated editorial, and `Article` without a real `datePublished` invites a
 * rich-result warning for a field we cannot honestly fill. `about` carries the
 * group and `abstract` the executive line, both already authored in
 * `lib/content/case-studies.ts`.
 */
export function caseStudyJsonLd(study: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/insights/${study.slug}/#work`,
    name: study.title,
    headline: study.title,
    abstract: study.summary,
    description: study.summary,
    about: study.group,
    // The environment the work ran in — the closest thing to a subject these
    // deliberately unnamed studies have.
    keywords: [study.group, study.industry],
    // Every figure here was published or confirmed (see the header comment in
    // `lib/content/case-studies.ts`), which is what makes it safe to restate as
    // structured data. `mentions` rather than a `QuantitativeValue`: these are
    // stated results in prose form, not measured properties of the work.
    ...(study.metrics?.length
      ? {
          mentions: study.metrics.map((metric) => ({
            "@type": "Thing",
            name: `${metric.value} ${metric.label.toLowerCase()}`,
          })),
        }
      : {}),
    url: `${SITE_URL}/insights/${study.slug}`,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * An industry group page.
 *
 * `Service` rather than `WebPage`: the page describes something we sell into a
 * named sector, and `serviceType` plus `areaServed` is what lets an answer
 * engine connect "who does AI work for county utilities" to this organization.
 * `areaServed` is the United States rather than a list of counties — naming
 * jurisdictions we have not worked in would be the same class of unbacked claim
 * as an invented figure.
 */
export function industryJsonLd(group: IndustryGroup) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/industries/${group.slug}/#service`,
    name: `AI transformation for ${group.name}`,
    description: group.lead,
    serviceType: group.industries.map((industry) => industry.name),
    url: `${SITE_URL}/industries/${group.slug}`,
    areaServed: { "@type": "Country", name: "United States" },
    provider: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/**
 * A published report.
 *
 * `Report` rather than the `CreativeWork` the case studies use, and rather than
 * `Article`: these genuinely are reports, they carry a real `datePublished`, and
 * the type exists precisely for this. `abstract` and `about` come from the same
 * fields the page renders visibly — structured data must never assert something
 * the page does not say.
 *
 * The PDF is declared as an `encoding`, which is what tells a crawler the page
 * and the document are the same work in two formats rather than two works.
 */
export function reportJsonLd(report: Report) {
  const url = `${SITE_URL}/insights/reports/${report.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Report",
    "@id": `${url}/#report`,
    name: report.title,
    headline: report.title,
    abstract: report.summary,
    description: report.summary,
    datePublished: report.published,
    url,
    inLanguage: "en-US",
    // Already absolute — it points at Supabase storage, not at `/public`.
    image: report.cover,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    encoding: {
      "@type": "MediaObject",
      contentUrl: report.pdf,
      encodingFormat: "application/pdf",
      ...(report.pages ? { numberOfPages: report.pages } : {}),
    },
    // Declared only where one exists, for the same reason `sameAs` is: a node
    // pointing at a file that was never uploaded is worse than a silent one.
    ...(report.audio
      ? {
          audio: {
            "@type": "AudioObject",
            contentUrl: report.audio,
            encodingFormat: "audio/mp4",
            name: `${report.title} — audio overview`,
          },
        }
      : {}),
  };
}

/**
 * The founders, as first-class entities.
 *
 * An organization whose people resolve to real, cross-referenceable identities
 * is treated as more trustworthy than one asserting expertise in prose alone,
 * and these two are the substance of what the company sells. `sameAs` is emitted
 * only where a profile URL actually exists — see `TeamMember.profile`.
 */
export function peopleJsonLd() {
  return TEAM.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(member.name),
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: `${SITE_URL}${member.image}`,
    url: `${SITE_URL}/company#about`,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(member.profile ? { sameAs: [member.profile] } : {}),
  }));
}

/**
 * `FAQPage`, built from the same array the page renders visibly.
 *
 * Both must come from `FAQ` — structured data that answers a question the page
 * does not visibly answer is a rich-result violation, not a shortcut, and the
 * one-source rule is what makes that impossible to get wrong later.
 */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/llm-info/#faq`,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function caseStudiesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected enterprise AI and platform experience",
    itemListElement: CASE_STUDIES.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: study.title,
        abstract: study.summary,
        about: study.group,
        url: `${SITE_URL}/insights/${study.slug}`,
      },
    })),
  };
}
