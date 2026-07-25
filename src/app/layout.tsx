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
    "PureMaids provides insured, vetted professional house cleaning across the UK. Domestic, deep, end of tenancy, and office cleaning. Get an instant quote and book online today.",
  keywords: [
    "house cleaning",
    "cleaning services UK",
    "domestic cleaning",
    "deep cleaning",
    "end of tenancy cleaning",
    "office cleaning",
    "professional cleaners",
    "PureMaids",
  ],
  authors: [{ name: "PureMaids" }],
  creator: "PureMaids",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `https://${SITE.domain}`,
    siteName: "PureMaids",
    title: "PureMaids | Professional House Cleaning Across the UK",
    description:
      "Insured, vetted professional cleaners. Get an instant quote and book online in under 60 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PureMaids | Professional House Cleaning Across the UK",
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
    areaServed: "GB",
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
