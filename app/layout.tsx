import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

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

const TITLE = "RegainFlow | AI Systems Engineering Partner";
const DESCRIPTION =
  "RegainFlow turns AI ambition into dependable production systems through focused discovery, hands-on engineering, and operational scale.";

/**
 * No production domain is configured for this project, so no canonical URL and
 * no social image are declared rather than inventing either.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "RegainFlow",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "RegainFlow",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <a href="#main" className="rf-skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
