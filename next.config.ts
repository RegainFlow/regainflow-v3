import type { NextConfig } from "next";

/**
 * PostHog ingest, reverse-proxied through this origin.
 *
 * Content blockers filter requests to posthog.com by hostname, and the traffic
 * this site most wants to measure — people arriving from an AI assistant to
 * evaluate a technical vendor — is exactly the traffic most likely to be running
 * one. Serving ingest from our own origin is PostHog's documented way around
 * that.
 *
 * Region follows `NEXT_PUBLIC_POSTHOG_HOST`, so an EU project needs no code
 * change. Read at build time, which is when rewrites are resolved.
 */
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.includes("eu")
  ? "https://eu-assets.i.posthog.com"
  : "https://us-assets.i.posthog.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Static assets come from a different host than the ingest API, so this
      // has to be matched first — the catch-all below would otherwise swallow
      // it and the SDK bundle would 404.
      {
        source: "/ingest/static/:path*",
        destination: `${POSTHOG_ASSETS}/static/:path*`,
      },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  // PostHog's API is sensitive to a trailing slash being appended on redirect;
  // without this some ingest calls are answered with a 308 rather than landing.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
