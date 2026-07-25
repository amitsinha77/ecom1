import { ServicePage } from "@/components/sections/service-page";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "Office Cleaning | Commercial Cleaning Services UK",
  description:
    "Reliable, discreet commercial cleaning for offices, clinics, and retail. Daily, weekly, or one-off contracts tailored to your business hours. DBS-checked teams. Get a quote.",
};

const FAQS = [
  {
    q: "Can you clean outside of our business hours?",
    a: "Yes. The majority of our commercial clients prefer early-morning, evening, or overnight cleaning so staff aren't disturbed. We'll schedule around your operating hours.",
  },
  {
    q: "Are your cleaners DBS-checked?",
    a: "Every cleaner working on commercial contracts is DBS-checked, reference-verified, and fully trained. We can provide documentation for your compliance records.",
  },
  {
    q: "Do you offer ongoing contracts?",
    a: "Yes. We offer flexible daily, weekly, or fortnightly contracts with a dedicated account manager. You can adjust the schedule or scope as your needs change.",
  },
  {
    q: "Can you provide sanitisation and disinfection?",
    a: "Absolutely. Our commercial service includes high-touch surface sanitisation, washroom hygiene, and disinfection using industry-standard products and protocols.",
  },
];

export default function OfficeCleaningPage() {
  const service = SERVICES.find((s) => s.slug === "office-cleaning")!;
  return <ServicePage service={service} faqs={FAQS} />;
}
