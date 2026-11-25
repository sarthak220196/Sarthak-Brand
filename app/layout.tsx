import type { Metadata, Viewport } from "next";
import "./globals.css";
import { person, siteUrl } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${person.name} | One career. Several frequencies.`,
  description:
    "Sarthak Sighat: Mumbai-based commercial operator across product, GTM, enterprise sales and cross-border payments partnerships. Also a DJ.",
  keywords: [
    "Sarthak Sighat",
    "cross-border payments",
    "strategic partnerships",
    "enterprise sales",
    "fintech",
    "GTM",
    "DJ",
    "Mumbai",
  ],
  openGraph: {
    title: `${person.name} | One career. Several frequencies.`,
    description: "I make money move. I make music move. I make things happen.",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F1EDE2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
