import type { NextConfig } from "next";

/**
 * PostHog ingestion is proxied through this origin so it is first-party.
 *
 * The audience is law enforcement, aerospace, and federal — ad blockers and
 * corporate network filters are the norm, and a direct `posthog.com` request is
 * blocked often enough to bias everything measured through it. The path is
 * `/relay` rather than the `/ingest` used in most tutorials for exactly that
 * reason: `/ingest` is itself on blocklists now.
 *
 * Order matters. Next evaluates rewrites top-down, so the two asset rules have
 * to precede the catch-all or they never match.
 */
const nextConfig: NextConfig = {
  /**
   * Report covers live in Supabase storage, not in `/public`.
   *
   * The cover used to be a committed PNG specifically so this block was not
   * needed. That trade stopped being available when reports moved into a table:
   * a row created in a browser cannot reference a file in the repository, so the
   * URL has to be absolute and `next/image` has to be told the host is allowed.
   *
   * Hardcoded rather than read from `SUPABASE_URL`, matching how
   * `CAPABILITY_STATEMENT_HREF` is already written in `lib/site.ts`. This is a
   * public asset host, not a secret, and `next.config.ts` is evaluated before
   * env loading in enough contexts that deriving it invites a confusing build
   * failure. Scoped to the public object path — a signed or private URL should
   * never be rendered through `<Image>` anyway.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qsnaxtjoyqycpbmmghff.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  /**
   * The twelve case studies this site launched with described work the founders
   * did before RegainFlow existed. They were removed rather than relabelled —
   * see the header in `lib/content/case-studies.ts` — which retires twelve live,
   * indexed URLs.
   *
   * A 308 to the listing rather than a 410. Whatever authority those URLs hold
   * is worth passing to the page that now carries the case studies; a 410 would
   * discard it to make a point about honesty that the listing copy already
   * makes. Nothing here 404s in the meantime, which matters most for anyone
   * holding a link we sent them.
   */
  async redirects() {
    const retiredStudies = [
      "workforce-data-validation-platform",
      "agentic-knowledge-assistant",
      "enterprise-search-modernization",
      "secure-internal-paas",
      "operational-anomaly-detection",
      "digital-engineering-simulation",
      "market-competitive-intelligence",
      "secure-government-document-intelligence",
      "manufacturing-knowledge-intelligence",
      "records-normalization",
      "vendor-risk-scorecard",
      "security-testing-automation",
    ];

    // Two industry groups were renamed with the repositioning, and the slugs
    // moved with the names rather than being left to describe the old ones.
    // These two go to their own new page, not to the hub — the reader was
    // asking for a specific sector and that sector still exists.
    const renamedIndustries: Record<string, string> = {
      "government-administration": "federal-state-local",
      "defense-manufacturing": "defense-aerospace",
    };

    return [
      ...retiredStudies.map((slug) => ({
        source: `/insights/${slug}`,
        destination: "/insights",
        permanent: true,
      })),
      ...Object.entries(renamedIndustries).map(([from, to]) => ({
        source: `/industries/${from}`,
        destination: `/industries/${to}`,
        permanent: true,
      })),
    ];
  },

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
