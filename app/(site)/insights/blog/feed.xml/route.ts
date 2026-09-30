import { getPosts } from "@/lib/blog.server";
import { resolveAuthor } from "@/lib/content/blog-authors";
import { topicBySlug } from "@/lib/content/blog-topics";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * The blog as RSS 2.0: the twenty newest posts, title and deck.
 *
 * For feed readers, aggregators and the assistants that poll feeds. It also
 * gives a future newsletter something to build issues from. The deck only,
 * not the body: the feed announces a post, and the page is where it is read.
 *
 * Per request, like every blog surface, so a post appears here the moment its
 * row is published. Cached at the edge for an hour, which is well inside how
 * often feed readers poll.
 */
export const dynamic = "force-dynamic";

const FEED_SIZE = 20;

function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export async function GET() {
  const posts = (await getPosts({ throwOnError: true })).slice(0, FEED_SIZE);
  const self = `${SITE_URL}/insights/blog/feed.xml`;
  // The newest substantive change, not the newest publish date: a refreshed
  // older post changes the feed too. ISO dates sort as strings.
  const latest = posts.map((post) => post.updatedOn ?? post.published).sort().at(-1);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/insights/blog/${post.slug}`;
      const topic = topicBySlug(post.topic);

      return [
        "    <item>",
        `      <title>${xml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${xml(post.summary)}</description>`,
        `      <pubDate>${rfc822(post.published)}</pubDate>`,
        `      <dc:creator>${xml(resolveAuthor(post.author).name)}</dc:creator>`,
        topic ? `      <category>${xml(topic.name)}</category>` : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(`${SITE_NAME} Blog`)}</title>
    <link>${SITE_URL}/insights/blog</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>Field notes from RegainFlow's engineers on putting AI into production.</description>
    <language>en-us</language>
    <managingEditor>${CONTACT_EMAIL} (${xml(SITE_NAME)})</managingEditor>
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
