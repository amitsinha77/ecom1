import { ServicePage } from "@/components/sections/service-page";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "Domestic Cleaning Bolton & Manchester | Weekly & Fortnightly Cleaners",
  description:
    "Reliable weekly and fortnightly domestic cleaning in Bolton, Manchester, Bury, Wigan & Preston. Same trusted, DBS-checked cleaner every visit. Eco-friendly products. Fully insured. Get an instant quote.",
  keywords: [
    "domestic cleaners near me",
    "house cleaning Bolton",
    "weekly cleaning",
    "fortnightly cleaning",
    "regular cleaners Manchester",
  ],
};

const FAQS = [
  {
    q: "How long is each domestic cleaning visit?",
    a: "A typical regular clean takes between 2 and 4 hours depending on the size of your home and your cleaning checklist. You can adjust the duration anytime in your online account.",
  },
  {
    q: "Can I trust the cleaner in my home?",
    a: "Absolutely. Every cleaner is DBS-checked, reference-verified, and trained before they're matched to a home. You'll meet the same cleaner every visit so you build a trusted relationship.",
  },
  {
    q: "What if my regular cleaner is on holiday?",
    a: "We'll arrange a vetted cover cleaner so your home stays spotless. Your regular cleaner returns as soon as they're back, and we'll always let you know in advance.",
  },
  {
    q: "Do I need to be home during the clean?",
    a: "Not at all. Many customers provide a key or arrange access. All our cleaners are fully vetted and insured, so you can come home to a clean house with confidence.",
  },
];

export default function DomesticCleaningPage() {
  const service = SERVICES.find((s) => s.slug === "domestic-cleaning")!;
  return <ServicePage service={service} faqs={FAQS} />;
}
