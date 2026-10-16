import type { Metadata } from "next";

// Type-only, and it has to stay that way. `lib/content/case-studies.ts` no
// longer holds data — the studies come from Supabase through
// `lib/case-studies.server.ts` — and a value import here would drag a
// server-only module into one that does nothing but build strings.
import type { CaseStudy } from "@/lib/content/case-studies";
import { TEAM, type TeamMember } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import type { IndustryGroup } from "@/lib/content/industries";
import type { Report } from "@/lib/content/reports";
import type { BlogPost } from "@/lib/content/blog";
import { STAGES } from "@/lib/content/stages";
import {
  CONTACT_EMAIL,
  FOUNDED,
  GOV_SITE_URL,
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
  segmentCard = false,
  article,
  feed = false,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * A card at a stable URL — the blog's `card.png` route, or a cover image.
   * Defaults to the site card.
   */
  image?: { url: string; alt: string };
  /**
   * The segment has its own `opengraph-image.tsx`. Its URL cannot be written
   * here: in a production build Next serves a dynamic segment's card at
   * `opengraph-image-<hash>`, so the literal `/opengraph-image` this helper
   * used to be given 404'd for every report and case study. Leaving `images`
   * unset lets the file convention emit the real URL — the convention only
   * stands back when a page declares images itself.
   */
  segmentCard?: boolean;
  /**
   * A dated article. Switches `og:type` to `article` and adds the published,
   * modified, author and section tags — what LinkedIn and Slack read to show a
   * byline and date on the unfurl.
   */
  article?: {
    publishedTime: string;
    modifiedTime: string;
    authors: string[];
    section?: string;
    tags?: string[];
  };
  /** Advertise the blog's RSS feed (`<link rel="alternate">`) from this page. */
  feed?: boolean;
  /**
   * Keep the page out of search while it has nothing on it: a topic or author
   * with no posts yet. Links are still followed. Remove nothing else, so the
   * page is ready the moment a post lands.
   */
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const card = {
    url: image?.url ?? "/opengraph-image",
    alt: image?.alt ?? `${SITE_NAME}, AI engineering & transformation partner`,
    ...OG_CARD,
  };
  const images = segmentCard ? {} : { images: [card] };

  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(feed
        ? { types: { "application/rss+xml": `${SITE_URL}/insights/blog/feed.xml` } }
        : {}),
    },
    // Only when asked. Every other page inherits the root layout's `robots`,
    // which carries the `max-snippet` and `max-image-preview` settings.
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${path}`,
      locale: "en_US",
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            ...(article.section ? { section: article.section } : {}),
            ...(article.tags?.length ? { tags: article.tags } : {}),
          }
        : { type: "website" as const }),
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...images,
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
export function personId(name: string): string {
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
      "AI engineering and transformation partner for public agencies and complex organizations: AI portfolio direction, production engineering, and managed AI operations, through adoption and handoff.",
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
    //
    // Profiles only. The booking link used to be listed here; it is a place to
    // book a call, not a profile of the organization, and `sameAs` asserts
    // identity.
    sameAs: PROFILES.map((profile) => profile.href),
    foundingDate: FOUNDED,
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
      name: "AI engineering and transformation services",
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

type Crumb = { name: string; path: string };

/**
 * `parent` is passed by pages that sit below a top-level route. One crumb for
 * the case studies and the reports index; an array, outermost first, for the
 * blog posts, which sit two levels down (Insights › Blog). Every other call
 * stays a two-crumb trail.
 */
export function breadcrumbJsonLd(
  name: string,
  path: string,
  parent?: Crumb | Crumb[]
) {
  const parents = parent ? (Array.isArray(parent) ? parent : [parent]) : [];
  const trail = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ...parents.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
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
 * environment and `abstract` the executive line, both already authored in
 * `lib/content/case-studies.ts`.
 *
 * No `mentions`. That property restated each study's headline figures, and
 * there are no figures on these studies — asserting one in structured data that
 * the page does not display would be a rich-result violation even if we had it.
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
    // The environment the work ran in — the closest thing to a subject these
    // deliberately unnamed studies have.
    about: study.industry,
    keywords: [study.industry, ...study.capabilityTags],
    url: `${SITE_URL}/insights/${study.slug}`,
    mainEntityOfPage: `${SITE_URL}/insights/${study.slug}`,
    ...(study.image ? { image: absoluteUrl(study.image) } : {}),
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
    name: `AI engineering for ${group.name}`,
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
    mainEntityOfPage: url,
    inLanguage: "en-US",
    // Absolute in production (Supabase storage); a relative local cover is
    // resolved against the site so the node stays valid either way.
    image: absoluteUrl(report.cover),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    encoding: {
      "@type": "MediaObject",
      contentUrl: absoluteUrl(report.pdf),
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
            name: `${report.title} (audio overview)`,
          },
        }
      : {}),
  };
}

/**
 * A blog post. `BlogPosting`, with every field matching something visible on
 * the page — Google's rule for structured data, and the reason `dateModified`
 * is the hand-set "Updated" date rather than the row's `updated_at`.
 *
 * The author is a founder's `Person` node by the same `@id` `peopleJsonLd`
 * uses, so the byline, the author page and `/llm-info` all resolve to one
 * entity. Carries name and url as well as the `@id`, because the full node is
 * not on this page. Any other byline is the organization.
 */
export function blogPostingJsonLd(
  post: BlogPost,
  {
    image,
    author,
    topic,
  }: {
    image: string;
    author?: TeamMember;
    topic?: { slug: string; name: string };
  },
) {
  const url = `${SITE_URL}/insights/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}/#post`,
    headline: post.title,
    description: post.summary,
    datePublished: post.published,
    dateModified: post.updatedOn ?? post.published,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
    wordCount: post.wordCount,
    ...(topic
      ? {
          articleSection: topic.name,
          isPartOf: [
            { "@id": `${SITE_URL}/#website` },
            {
              "@type": "CollectionPage",
              "@id": `${SITE_URL}/insights/blog/topics/${topic.slug}`,
              name: topic.name,
            },
          ],
        }
      : { isPartOf: { "@id": `${SITE_URL}/#website` } }),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    author: author
      ? {
          "@type": "Person",
          "@id": personId(author.name),
          name: author.name,
          jobTitle: author.role,
          url: `${SITE_URL}/insights/blog/authors/${author.slug}`,
        }
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * An author page: `ProfilePage` whose main entity is the founder's `Person`
 * node, stated in full here because this is the page about them.
 */
export function authorProfileJsonLd(member: TeamMember, postCount: number) {
  const url = `${SITE_URL}/insights/blog/authors/${member.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": url,
    url,
    name: `${member.name} — ${SITE_NAME}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": personId(member.name),
      name: member.name,
      jobTitle: member.role,
      description: member.bio,
      image: `${SITE_URL}${member.image}`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      ...(member.profile ? { sameAs: [member.profile] } : {}),
      agentInteractionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/WriteAction",
        userInteractionCount: postCount,
      },
    },
  };
}

/** A topic hub: a curated `CollectionPage` listing its posts in order. */
export function topicCollectionJsonLd(
  topic: { slug: string; name: string; intro: string },
  posts: { slug: string; title: string }[],
) {
  const url = `${SITE_URL}/insights/blog/topics/${topic.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: topic.name,
    description: topic.intro,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/insights/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

/**
 * The gov subdomain's one page. Tied to the same organization node as the main
 * site, so a crawler reading `gov.regainflow.com` on its own still resolves the
 * publisher to RegainFlow rather than to an unnamed second entity.
 */
export function govPageJsonLd({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const url = `${GOV_SITE_URL}/`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
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

/** A site path made absolute; an absolute URL passes through. */
function absoluteUrl(src: string): string {
  return src.startsWith("/") ? `${SITE_URL}${src}` : src;
}

/**
 * A listing page (`/insights`, `/insights/reports`) as a `CollectionPage`
 * whose main entity is the ordered list it shows. Items carry their own type,
 * so a crawler reading the hub can tell a report from a blog post without
 * opening either. Only what the page lists, in the page's order.
 */
export function collectionJsonLd({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description: string;
  items: { type: "Report" | "BlogPosting" | "CreativeWork"; path: string; name: string }[];
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": item.type, name: item.name, url: `${SITE_URL}${item.path}` },
      })),
    },
  };
}
