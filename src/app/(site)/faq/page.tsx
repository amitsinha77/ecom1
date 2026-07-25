import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { FAQ_ITEMS } from "@/lib/data";

export const metadata = {
  title: "FAQ | Frequently Asked Questions",
  description:
    "Answers to common questions about PureMaids cleaning services, booking, pricing, insurance, vetting, cancellations, and our satisfaction guarantee.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help Centre"
        title="Frequently asked questions"
        subtitle="Everything you need to know about booking, pricing, and our cleaning service. Can't find your answer? Get in touch — we're happy to help."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <FAQSection items={FAQ_ITEMS} />
      <CTASection />
    </>
  );
}
