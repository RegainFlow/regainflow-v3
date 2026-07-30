import type { Metadata } from "next";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { STAGES } from "@/lib/content/stages";
import { BOOKING_HREF, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

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
 * Per-route metadata.
 *
 * A page that declares `openGraph` replaces the layout's object outright rather
 * than merging into it, and the same goes for `twitter` — so a page setting
 * only a title silently loses the card image, site name, and locale, and keeps
 * the home page's Twitter description. Building all three here keeps every
 * route complete and consistent.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

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
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    description:
      "AI transformation partner for aerospace, industrial, and federal organizations — AI portfolio direction, production engineering, and managed AI operations.",
    areaServed: "US",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Orlando",
      addressRegion: "FL",
      addressCountry: "US",
    },
    // `address` already carries the location as a typed Place; a second
    // free-text `location` would not validate.
    sameAs: [BOOKING_HREF],
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
 * `parent` is only passed by the case study pages, which sit a level below
 * `/insights`. Every other call stays a two-crumb trail.
 */
export function breadcrumbJsonLd(
  name: string,
  path: string,
  parent?: { name: string; path: string },
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
