import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AccessibilityToolbar } from "@/components/ui/AccessibilityToolbar";
import { OnboardingWrapper } from "@/features/profile/components/OnboardingWrapper";

export const metadata: Metadata = {
  title: {
    default: "CivicGuide — Your AI Election Assistant",
    template: "%s | CivicGuide",
  },
  description:
    "Understand the election process, timelines, and voting steps with CivicGuide — an AI-powered civic education assistant. Find polling places, explore ballots, and learn how democracy works.",
  keywords: [
    "election assistant",
    "voting guide",
    "how to vote",
    "election process",
    "polling place finder",
    "voter registration",
    "electoral college",
    "civic education",
    "AI election helper",
  ],
  authors: [{ name: "CivicGuide Team" }],
  creator: "CivicGuide",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CivicGuide — Your AI Election Assistant",
    description:
      "Understand the election process, timelines, and voting steps with AI-powered civic education.",
    siteName: "CivicGuide",
  },
  twitter: {
    card: "summary_large_image",
    title: "CivicGuide — Your AI Election Assistant",
    description:
      "AI-powered civic education — understand elections, voting, and democracy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1b3e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div id="google_translate_element" className="hidden" />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
        </Script>

        {/* Main content — Navbar and Footer are rendered inside each page/layout */}
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>

        {/* ARIA Live region for polite announcements (loading states, success) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          id="global-announcer"
          className="sr-only"
          role="status"
        />

        {/* ARIA Live region for urgent alerts (errors, warnings) */}
        <div
          aria-live="assertive"
          aria-atomic="true"
          id="global-alert"
          className="sr-only"
          role="alert"
        />

        <OnboardingWrapper />
        <AccessibilityToolbar />
      </body>
    </html>
  );
}
