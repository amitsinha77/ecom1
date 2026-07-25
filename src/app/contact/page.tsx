import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/contact-form";
import { SITE } from "@/lib/data";

export const metadata = {
  title: "Contact Us | Get in Touch with PureMaids",
  description:
    "Get in touch with PureMaids. Call us, email us, or send a message and we'll respond within one business day. We're here to help with all your cleaning needs.",
};

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Call us",
    value: SITE.phone,
    href: SITE.phoneHref,
    sub: "Mon–Sun, 7am–9pm",
  },
  {
    icon: Mail,
    label: "Email us",
    value: SITE.email,
    href: SITE.emailHref,
    sub: "We reply within 1 business day",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: SITE.address,
    href: "#",
    sub: "By appointment only",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        subtitle="Questions about booking, pricing, or your existing clean? Our friendly team is here to help, seven days a week."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {CONTACT_CARDS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-0.5 font-semibold text-ink-800">{c.value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-ink-800 p-6 text-white">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-300" />
                <h3 className="font-display text-lg font-bold">Opening hours</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-200">
                <li className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-white">7am – 9pm</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-white">8am – 6pm</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-white">9am – 4pm</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-display text-2xl font-bold text-ink-800">
                Send us a message
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fill in the form below and we'll get back to you within one
                business day. Your data is handled in line with the GDPR.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
