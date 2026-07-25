import { ServicePage } from "@/components/sections/service-page";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "End of Tenancy Cleaning Bolton & Manchester | Deposit-Back Guarantee",
  description:
    "Guaranteed landlord-approved end of tenancy cleaning in Bolton, Manchester, Bury, Wigan & Preston. We cover every inch so you can hand back the keys with confidence and secure your full deposit. Book online today.",
  keywords: [
    "end of tenancy cleaning",
    "end of tenancy cleaning Bolton",
    "move out cleaning Manchester",
    "deposit back guarantee",
    "tenancy clean",
  ],
};

const FAQS = [
  {
    q: "Is your end of tenancy clean guaranteed?",
    a: "Yes. We offer a deposit-back guarantee. If your landlord or letting agent identifies any cleaning-related issue within 72 hours, we'll return to put it right free of charge.",
  },
  {
    q: "Does the clean include carpets and the oven?",
    a: "Our standard end of tenancy clean covers the full property. Professional carpet cleaning and oven deep-cleaning can be added as optional extras during booking.",
  },
  {
    q: "Do you provide an inventory or checklist?",
    a: "Yes. We work to a comprehensive end-of-tenancy checklist covering every room, surface, and appliance, so nothing is missed and you have proof of a thorough clean.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 3 to 5 days before your move-out date to secure your preferred slot, but we'll always do our best to accommodate last-minute bookings.",
  },
];

export default function EndOfTenancyCleaningPage() {
  const service = SERVICES.find((s) => s.slug === "end-of-tenancy-cleaning")!;
  return <ServicePage service={service} faqs={FAQS} />;
}
