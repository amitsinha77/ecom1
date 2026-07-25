import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { AuthProvider } from "@/lib/auth-context";
import { SITE } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: "PureMaids | Professional House Cleaning Across the UK",
    template: "%s | PureMaids",
  },
  description:
    "PureMaids provides insured, vetted house cleaning in Bolton, Manchester, Bury, Wigan & Preston. Domestic cleaners, end of tenancy cleaning, deep cleaning services & office cleaning. Get an instant quote and book online today.",
  keywords: [
    "house cleaning Bolton",
    "domestic cleaners near me",
    "end of tenancy cleaning",
    "deep cleaning services",
    "office cleaning Bolton",
    "cleaners Manchester",
    "house cleaning Bury",
    "house cleaning Wigan",
    "house cleaning Preston",
    "PureMaids",
  ],
  authors: [{ name: "PureMaids" }],
  creator: "PureMaids",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `https://${SITE.domain}`,
    siteName: "PureMaids",
    title: "PureMaids | House Cleaning Bolton, Manchester & Across the UK",
    description:
      "Insured, vetted local cleaners for house cleaning, end of tenancy, deep cleaning & office cleaning. Get an instant quote and book online in under 60 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PureMaids | House Cleaning Bolton, Manchester & Across the UK",
    description:
      "Insured, vetted professional cleaners. Get an instant quote and book online in under 60 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    name: "PureMaids",
    url: `https://${SITE.domain}`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "££",
    areaServed: ["GB", "Greater Manchester", "Lancashire"],
    knowsAbout: [
      "house cleaning",
      "domestic cleaning",
      "end of tenancy cleaning",
      "deep cleaning",
      "office cleaning",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "71-75 Shelton Street",
      addressLocality: "London",
      postalCode: "WC2H 9JQ",
      addressCountry: "GB",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating,
      reviewCount: SITE.reviewCount,
    },
  };

  return (
    <html lang="en-GB" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
