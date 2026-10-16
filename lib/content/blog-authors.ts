import { authorBySlug, type TeamMember } from "@/lib/content/company";
import { SITE_NAME } from "@/lib/site";

/**
 * A post's byline, resolved.
 *
 * `blog_posts.author` holds a founder slug. A founder gets a name, portrait,
 * role and an author page; anything else — including the migration's
 * `regainflow` default — is bylined to the organization with no page, rather
 * than inventing a person the site cannot back.
 */
export interface BlogAuthor {
  /** Present only for a real person with an author page. */
  member?: TeamMember;
  name: string;
  role?: string;
  image?: string;
  href?: string;
}

/** The RF app icon, for posts bylined to the organization. */
export const ORG_AVATAR = "/brand/regainflow-icon-180.png";

export function authorPath(slug: string): string {
  return `/insights/blog/authors/${slug}`;
}

export function resolveAuthor(slug: string): BlogAuthor {
  const member = authorBySlug(slug);

  // The organization's avatar is the app icon, so a list row never shows an
  // empty circle. Still no author page: there is no person to back it.
  if (!member) return { name: SITE_NAME, image: ORG_AVATAR };

  return {
    member,
    name: member.name,
    role: member.role,
    image: member.image,
    href: authorPath(member.slug),
  };
}
