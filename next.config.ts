import type { NextConfig } from "next";

/**
 * PostHog ingestion is proxied through this origin so it is first-party.
 *
 * The audience is aerospace, industrial, and federal — ad blockers and
 * corporate network filters are the norm, and a direct `posthog.com` request is
 * blocked often enough to bias everything measured through it. The path is
 * `/relay` rather than the `/ingest` used in most tutorials for exactly that
 * reason: `/ingest` is itself on blocklists now.
 *
 * Order matters. Next evaluates rewrites top-down, so the two asset rules have
 * to precede the catch-all or they never match.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/relay/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/relay/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/relay/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  /**
   * Required by the proxy above, and a deliberate global change rather than a
   * side effect: PostHog's API paths end in a slash (`/e/`, `/flags/`), and
   * without this Next redirects them before the rewrite applies, which breaks
   * capture entirely.
   *
   * The trade is that Next no longer auto-redirects `/services/` to
   * `/services`. Nothing on the site links that way — `lib/site.ts`,
   * `app/sitemap.ts`, and every `<Link>` use the canonical no-slash form — so
   * this only affects a hand-typed or badly-copied inbound URL.
   */
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
