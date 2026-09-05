import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abdul Rehman — OXVID Systems",
  description:
    "Personal portfolio of Abdul Rehman, founder of OXVID Systems — 7 years of professional experience building premium web, automation and brand work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          STEP 17: the Google Fonts <link> and its two preconnects are gone —
          the faces are self-hosted and declared in globals.css. What is left
          is a preload for the two that paint first: the display weight the
          headline uses and the body weight everything else uses. Without
          these the browser cannot discover a font until it has parsed the
          stylesheet, which costs a round trip on exactly the text the
          visitor sees first.
        */}
        <link
          rel="preload"
          href="/fonts/archivo-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
