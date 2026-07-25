import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { PLANS, SERVICES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Pricing | Transparent Cleaning Prices",
  description:
    "Simple, transparent PureMaids pricing. No hidden fees. View our cleaning plans and per-service rates. Get an instant quote and book online today.",
};

const PRICING_FAQS = [
  {
    q: "Are there any hidden fees?",
    a: "Never. The price you see in your instant quote is the price you pay. There are no booking fees, no surprise charges, and no minimum contract length.",
  },
  {
    q: "How is my quote calculated?",
    a: "Your quote is based on your selected service, the number of bedrooms and bathrooms, and your cleaning frequency. Regular weekly and fortnightly plans receive an automatic loyalty discount.",
  },
  {
    q: "Do you offer discounts for regular cleaning?",
    a: "Yes. Weekly plans receive a 15% loyalty discount and fortnightly plans receive a 10% discount, applied automatically to every visit.",
  },
  {
    q: "How do I pay?",
    a: "We accept all major debit and credit cards via Stripe, our secure payment processor. Regular customers can set up hassle-free recurring payments.",
  },
  {
    q: "Can I change my plan later?",
    a: "Absolutely. You can upgrade, downgrade, pause, or cancel your plan anytime from your online account with 7 days' notice. No penalties, no fuss.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent pricing, no surprises"
        subtitle="Choose a plan that fits your home and budget. Every plan includes insured, vetted cleaners and our satisfaction guarantee."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border p-7 transition-all ${
                  p.popular
                    ? "border-brand-300 bg-white shadow-xl shadow-brand-500/10 lg:-translate-y-2"
                    : "border-ink-100 bg-white shadow-sm"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-ink-800">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-ink-800">
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {p.frequency}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-ink-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book-online"
                  className={`mt-7 ${p.popular ? "btn-primary" : "btn-outline"} w-full`}
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Per-service rates */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Service Rates</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Starting prices by service
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Use the quote calculator for a precise price for your home.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className={`flex items-center gap-4 p-5 transition-colors hover:bg-brand-50/40 ${
                  i !== SERVICES.length - 1 ? "border-b border-ink-100" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink-800">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-display text-xl font-bold text-brand-600">
                    {formatCurrency(s.priceFrom)}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-ink-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote + Guarantees */}
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Instant Quote</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Get your exact price in seconds
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No phone calls. No waiting. Just enter your details and see your
              price instantly.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "No hidden fees, ever",
                  desc: "The price you see is the price you pay.",
                },
                {
                  icon: Sparkles,
                  title: "Loyalty discounts",
                  desc: "Save up to 15% on regular weekly cleaning.",
                },
                {
                  icon: Check,
                  title: "Satisfaction guaranteed",
                  desc: "Not happy? We'll return free within 48 hours.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <QuoteForm />
          </div>
        </div>
      </section>

      <FAQSection items={PRICING_FAQS} />
      <CTASection />
    </>
  );
}
