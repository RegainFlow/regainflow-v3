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
  /** No `X-Powered-By: Next.js`. It tells a scanner which exploits to try. */
  poweredByHeader: false,

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
      // The still behind a blog post's video facade (`components/BlogVideo.tsx`).
      // Only the thumbnail path: the player itself is an iframe, not an image.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
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

  /**
   * The baseline security headers, on every response.
   *
   * HSTS is not here because Vercel already sends it. There is no
   * Content-Security-Policy either: a real one needs a nonce on every inline
   * script (the JSON-LD blocks, the theme scripts), and a loose one is theatre.
   * These four are the ones a procurement security questionnaire checks for
   * and that cannot break a page:
   *
   * - `nosniff`: a file is what its Content-Type says it is.
   * - `SAMEORIGIN`: the site cannot be framed by another origin. The gov page's
   *   inline PDF viewer frames `/files/*`, which is this origin, so it works.
   * - `Referrer-Policy`: other sites learn the origin a visitor came from, not
   *   the full URL.
   * - `Permissions-Policy`: nothing here uses the camera, microphone or
   *   location, so no embedded script can ask for them either.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
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
      // The gov documents' PDFs, same-origin so `download` works and the inline
      // viewer is not a cross-origin frame. An `afterFiles` rewrite, so a PDF
      // committed under `public/files` wins and anything else falls through to
      // the `site` bucket — see `GOV_CAPABILITY_PDF` in `lib/site.ts`.
      {
        source: "/files/:file",
        destination:
          "https://qsnaxtjoyqycpbmmghff.supabase.co/storage/v1/object/public/site/:file",
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
   * `/services`. `proxy.ts` does it instead, for page paths only, so each page
   * still has one address and `/relay/` is left alone.
   */
  skipTrailingSlashRedirect: true,

  /**
   * `gov.localhost` is how the subdomain is exercised in development — browsers
   * resolve any `*.localhost` to loopback, and `proxy.ts` treats a `gov.` host
   * the same everywhere. Without this Next blocks the dev assets it serves to
   * a second origin.
   */
  allowedDevOrigins: ["gov.localhost"],
};

export default nextConfig;
