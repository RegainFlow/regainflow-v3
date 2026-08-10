import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { organizationJsonLd, serializeJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

const TITLE = "RegainFlow | AI Transformation Partner";
const DESCRIPTION =
  "RegainFlow is an AI transformation partner for law enforcement, aerospace manufacturing, and federal organizations. We find the AI work worth doing, engineer the production system around it, and leave your team able to run it.";

/**
 * `viewportFit` is deliberately left at its default rather than set to
 * `"cover"`. Cover is all-or-nothing: `env(safe-area-inset-*)` reads 0 without
 * it, and turning it on makes every edge-touching surface — the shell, the
 * marquee, the watermark, the sticky header — responsible for its own inset, or
 * hero copy runs under the notch in landscape. Nothing here needs to reach the
 * physical edge, and with `themeColor` matching Void the default letterbox is
 * invisible.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050912",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  // Without these Google will not use a large image or a full-length snippet,
  // which is most of what a mobile result is.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // `black`, not `black-translucent`: translucent puts content behind the
  // status bar, which is the standalone-mode equivalent of the `viewport-fit`
  // decision above, and would slide the sticky header under the clock.
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    url: SITE_URL,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      // Declares the `scroll-behavior: smooth` that `globals.css` sets, so Next
      // can suppress it during route transitions. Without this a navigation
      // animates the scroll back to the top instead of arriving there, which
      // reads as lag on every link — the smooth scroll is wanted for in-page
      // anchors only.
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#main" className="rf-skip-link">
          Skip to content
        </a>

        <SiteHeader />

        {/* One `main` for the whole site, so the skip link resolves on every
            route. Pages compose sections only. */}
        <main id="main">{children}</main>

        <SiteFooter />

        {/* Static, RegainFlow-authored structured data. `serializeJsonLd`
            escapes `<` so no copy change can close the tag early. The site node
            is separate from the organization node so per-page graphs can
            reference either by `@id`. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(websiteJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
