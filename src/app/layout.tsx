import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://monachiltech.com";
const SITE_TITLE =
  "Monachil Technologies | Data Infrastructure for Alternative Assets";
const SITE_DESCRIPTION =
  "The proprietary data platform — ingestion, verification, enrichment, and analytics — behind Monachil Capital Partners. Nine asset classes, four countries, one unified system.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Monachil Technologies",
  authors: [{ name: "Monachil Technologies" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Monachil Technologies",
    description: "The proprietary data platform behind Monachil Capital Partners — ingestion, verification, enrichment, and analytics for private credit.",
    url: SITE_URL,
    siteName: "Monachil Technologies",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monachil Technologies",
    description: "The proprietary data platform behind Monachil Capital Partners — ingestion, verification, enrichment, and analytics for private credit.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06060A" },
    { media: "(prefers-color-scheme: light)", color: "#FAFBFC" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="geolocation=(), microphone=(), camera=()"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://formsubmit.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://formsubmit.co; object-src 'none'; upgrade-insecure-requests"
        />
        <link rel="dns-prefetch" href="https://formsubmit.co" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
