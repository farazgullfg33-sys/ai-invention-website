import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { getSettingsMap } from "@/lib/content";

const siteTitle = "AI Invention | We Deploy AI Agents For Your Business";
const siteDescription =
  "Done-for-you custom AI agent deployment for bookings, real estate, ecommerce, service teams, and internal business assistants. VPS setup from $200 + $100/month.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiinvention.tech"),
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  verification: {
    google: "Qbo7jUD1wY-XrW0ptddKpd7oxiDSV6uwqeo48gs8VC8",
  },
  title: {
    default: siteTitle,
    template: "%s | AI Invention",
  },
  description: siteDescription,
  keywords: [
    "AI agent deployment",
    "custom AI agents for business",
    "AI automation service",
    "website chatbot",
    "Telegram AI bot",
    "VPS AI agent",
    "real estate AI assistant",
    "hotel booking AI agent",
    "ecommerce support AI agent",
    "AI Invention",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "AI Invention",
    type: "website",
    locale: "en_MY",
    url: "https://aiinvention.tech",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "AI Invention - AI Agent Workflow Deployment Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/og-image.webp"],
  },
  alternates: { canonical: "https://aiinvention.tech" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettingsMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link crossOrigin="anonymous" rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <JsonLd />
        <Header />
        {children}
        <WhatsAppWidget />
        <Footer settings={settings} />
      </body>
    </html>
  );
}
