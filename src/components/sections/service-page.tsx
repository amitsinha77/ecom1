import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Star, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TrustBadges } from "@/components/sections/trust-badges";
import type { Service } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function ServicePage({
  service,
  faqs,
}: {
  service: Service;
  faqs: { q: string; a: string }[];
}) {
  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.title}
        subtitle={service.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: service.title },
        ]}
      />

      {/* Detail + Quote */}
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={service.image}
                alt={service.title}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-ink-800">
                What's included
              </h2>
              <ul className="mt-5 space-y-3">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-ink-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-ink-50 p-5">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  From
                </p>
                <p className="font-display text-2xl font-bold text-brand-600">
                  {formatCurrency(service.priceFrom)}
                </p>
              </div>
              <div className="h-10 w-px bg-ink-200" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Duration
                </p>
                <p className="font-display text-2xl font-bold text-ink-800">
                  {service.duration}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-ink-100 bg-white py-10">
        <div className="container">
          <TrustBadges />
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why PureMaids</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              The trusted choice for {service.shortTitle.toLowerCase()} cleaning
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Fully Insured & Vetted",
                desc: "Every cleaner is DBS-checked, reference-verified, and covered by £2m public liability insurance.",
              },
              {
                icon: Star,
                title: "Satisfaction Guaranteed",
                desc: "Not 100% happy? We'll return within 48 hours to put it right, completely free of charge.",
              },
              {
                icon: Clock,
                title: "Reliable & Flexible",
                desc: "Same cleaner every visit, eco-friendly products, and the flexibility to pause or cancel anytime.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-800">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQSection items={faqs} />
      <CTASection
        title={`Ready to book your ${service.shortTitle.toLowerCase()} clean?`}
        subtitle="Get your instant quote and book online in under 60 seconds. No phone calls, no obligation."
      />
    </>
  );
}
