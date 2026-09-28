/**
 * Host routing for gov.regainflow.com, as a pure function so it can be tested
 * without a request. `proxy.ts` is the only caller.
 *
 * The subdomain is one page, `app/gov`, served at its root:
 *
 * - **A `gov.` host** (production, or `gov.localhost` in development) rewrites
 *   `/` to `/gov`. A typed `/gov/…` redirects to the clean form, the two retired
 *   document paths redirect to `/`, and anything else is a marketing route, so
 *   it redirects to the main site rather than rendering a 404 with the wrong
 *   chrome.
 * - **The production main site** sends `/gov/…` and the retired paths to the
 *   subdomain root, so the page has exactly one public URL.
 * - **Any other host** — `localhost`, a Vercel preview — serves `/gov` in place
 *   and sends the retired paths there.
 */

/**
 * The subdomain had one page per document before it became a single page.
 * Links to these went out, and the main nav pointed at one, so they redirect
 * rather than 404.
 */
export const RETIRED_GOV_PATHS = ["/capability-statement", "/past-performance"];

const PRODUCTION_HOSTS = new Set(["regainflow.com", "www.regainflow.com"]);

export type GovRoute =
  | { kind: "next" }
  | { kind: "rewrite"; pathname: string }
  | { kind: "redirect"; url: string };

/** `host` as the request carries it, port included. */
export function routeGov(host: string, pathname: string, protocol = "https:"): GovRoute {
  const hostname = host.split(":")[0].toLowerCase();
  const port = host.includes(":") ? `:${host.split(":")[1]}` : "";

  const underGov = pathname === "/gov" || pathname.startsWith("/gov/");
  const retired = RETIRED_GOV_PATHS.includes(pathname);

  if (hostname.startsWith("gov.")) {
    if (pathname === "/") return { kind: "rewrite", pathname: "/gov" };
    if (underGov || retired) return { kind: "redirect", url: `${protocol}//${host}/` };
    const mainHost =
      hostname === "gov.regainflow.com" ? "www.regainflow.com" : `${hostname.slice(4)}${port}`;
    return { kind: "redirect", url: `${protocol}//${mainHost}${pathname}` };
  }

  if (PRODUCTION_HOSTS.has(hostname)) {
    if (underGov || retired) return { kind: "redirect", url: "https://gov.regainflow.com/" };
    return { kind: "next" };
  }

  if (retired) return { kind: "redirect", url: `${protocol}//${host}/gov` };
  return { kind: "next" };
}
