import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { FAQ_ITEMS } from "@/lib/data";

export const metadata = {
  title: "FAQ | House Cleaning Bolton, Manchester & Across the UK",
  description:
    "Answers to common questions about PureMaids house cleaning, domestic cleaners, end of tenancy cleaning, deep cleaning services and office cleaning in Bolton, Manchester, Bury, Wigan & Preston.",
  keywords: [
    "house cleaning Bolton",
    "domestic cleaners near me",
    "end of tenancy cleaning",
    "deep cleaning services",
    "office cleaning Bolton",
  ],
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Help Centre"
        title="Frequently asked questions"
        subtitle="Everything you need to know about booking, pricing, and our cleaning service across Bolton, Manchester, Bury, Wigan & Preston. Can't find your answer? Get in touch — we're happy to help."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <FAQSection items={FAQ_ITEMS} />
      <CTASection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
