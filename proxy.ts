import { NextResponse, type NextRequest } from "next/server";

import { routeGov } from "@/lib/gov-routing";

/**
 * Serves gov.regainflow.com from `app/gov`. The rules live in
 * `lib/gov-routing.ts`, where they are tested; this only applies them.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const route = routeGov(host, request.nextUrl.pathname, request.nextUrl.protocol);

  if (route.kind === "rewrite") {
    const url = request.nextUrl.clone();
    url.pathname = route.pathname;
    return NextResponse.rewrite(url);
  }

  if (route.kind === "redirect") {
    const url = new URL(route.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Pages only. Anything with a dot is a file (`/files/*.pdf`, `robots.txt`,
  // the icons) and is served the same on every host; `_next` and the PostHog
  // `relay` must never be rewritten. `opengraph-image` is excluded so the
  // subdomain's pages can reuse the site's card.
  matcher: ["/((?!_next/|relay/|opengraph-image|.*\\..*).*)"],
};
