import { ServicePage } from "@/components/sections/service-page";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "Deep Cleaning | Top-to-Bottom Home Deep Clean",
  description:
    "A thorough, detailed deep clean of every surface, corner, and appliance. Perfect for spring cleans, post-renovation, or when you need that brand-new feeling. Book online today.",
};

const FAQS = [
  {
    q: "What's the difference between a regular clean and a deep clean?",
    a: "A regular clean covers the visible, day-to-day surfaces. A deep clean goes further — skirting boards, light fittings, inside appliances, tile grout, and hard-to-reach corners are all included.",
  },
  {
    q: "How long does a deep clean take?",
    a: "Depending on the size and condition of your home, a deep clean typically takes between 4 and 8 hours. We may send a small team to complete it efficiently.",
  },
  {
    q: "Do you bring all the equipment?",
    a: "Yes. Our team arrives with professional-grade equipment and eco-friendly products. If you'd like us to use specific products, just let us know when booking.",
  },
  {
    q: "Can I book a deep clean as a one-off?",
    a: "Of course. Deep cleans are perfect as a one-off service — for spring cleaning, before a special occasion, or after renovation work. No ongoing commitment required.",
  },
];

export default function DeepCleaningPage() {
  const service = SERVICES.find((s) => s.slug === "deep-cleaning")!;
  return <ServicePage service={service} faqs={FAQS} />;
}
