/**
 * Host routing for gov.regainflow.com, as a pure function so it can be tested
 * without a request. `proxy.ts` is the only caller.
 *
 * The gov pages live in `app/gov`, and the subdomain serves them from its root:
 * `gov.regainflow.com/past-performance` is `app/gov/past-performance`. Links on
 * those pages are therefore written without the `/gov` prefix, and this module
 * is what makes that true on every host:
 *
 * - **A `gov.` host** (production, or `gov.localhost` in development) rewrites
 *   its three paths into `/gov`. A `/gov/…` URL typed on the subdomain redirects
 *   to the clean form, and anything else is a marketing route, so it redirects
 *   to the main site rather than rendering a 404 with the wrong chrome.
 * - **The production main site** sends `/gov/…` and the two document paths to
 *   the subdomain, so each document has exactly one public URL.
 * - **Any other host** — `localhost`, a Vercel preview — rewrites the two
 *   document paths in place, so the pages and their links work without DNS.
 */

/** The subdomain's pages, without the `/gov` prefix. */
export const GOV_PATHS = ["/", "/capability-statement", "/past-performance"];

const PRODUCTION_HOSTS = new Set(["regainflow.com", "www.regainflow.com"]);

export type GovRoute =
  | { kind: "next" }
  | { kind: "rewrite"; pathname: string }
  | { kind: "redirect"; url: string };

/** `host` as the request carries it, port included. */
export function routeGov(host: string, pathname: string, protocol = "https:"): GovRoute {
  const hostname = host.split(":")[0].toLowerCase();
  const port = host.includes(":") ? `:${host.split(":")[1]}` : "";

  const unprefixed =
    pathname === "/gov" ? "/" : pathname.startsWith("/gov/") ? pathname.slice(4) : null;

  if (hostname.startsWith("gov.")) {
    if (unprefixed !== null) {
      return { kind: "redirect", url: `${protocol}//${host}${unprefixed}` };
    }
    if (GOV_PATHS.includes(pathname)) {
      return { kind: "rewrite", pathname: pathname === "/" ? "/gov" : `/gov${pathname}` };
    }
    const mainHost =
      hostname === "gov.regainflow.com" ? "www.regainflow.com" : `${hostname.slice(4)}${port}`;
    return { kind: "redirect", url: `${protocol}//${mainHost}${pathname}` };
  }

  const isDocument = pathname !== "/" && GOV_PATHS.includes(pathname);

  if (PRODUCTION_HOSTS.has(hostname)) {
    if (unprefixed !== null) {
      return { kind: "redirect", url: `https://gov.regainflow.com${unprefixed}` };
    }
    if (isDocument) {
      return { kind: "redirect", url: `https://gov.regainflow.com${pathname}` };
    }
    return { kind: "next" };
  }

  if (isDocument) return { kind: "rewrite", pathname: `/gov${pathname}` };
  return { kind: "next" };
}
