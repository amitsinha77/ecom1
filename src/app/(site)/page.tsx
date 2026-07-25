import Link from "next/link";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Check,
  MapPin,
} from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { TrustBadges } from "@/components/sections/trust-badges";
import { Testimonials } from "@/components/sections/testimonials";
import { GoogleReviews } from "@/components/sections/google-reviews";
import { BeforeAfterGallery } from "@/components/sections/before-after-gallery";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import {
  SERVICES,
  HOW_IT_WORKS,
  STATS,
  AREAS,
  PLANS,
  FAQ_ITEMS,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const FAQ_ITEMS_PREVIEW = FAQ_ITEMS.slice(0, 6);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm">
              <span className="flex -space-x-1">
                {["SM", "JO", "PP", "DT"].map((i) => (
                  <span
                    key={i}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-[10px] font-bold text-brand-700"
                  >
                    {i}
                  </span>
                ))}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">· 2,148 reviews</span>
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink-800 md:text-5xl lg:text-6xl text-balance">
              Professional House Cleaning Across the UK
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
              Insured, vetted cleaners you can trust. Eco-friendly products, the
              same friendly face every visit, and a satisfaction guarantee on
              every clean.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book-online" className="btn-primary">
                Get instant quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/areas-we-cover" className="btn-outline">
                <MapPin className="h-4 w-4" />
                Check your area
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-600">
              {[
                "Fully insured (£2m)",
                "DBS-checked cleaners",
                "Eco-friendly products",
                "Cancel anytime",
              ].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-ink-100 bg-white py-10">
        <div className="container">
          <TrustBadges />
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Cleaning services for every need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From regular weekly cleans to one-off deep cleans, we've got your
              home or office covered.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 to-transparent" />
                  <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-brand-600 backdrop-blur">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-ink-800">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                    {s.tagline}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                    <span className="text-sm text-ink-500">
                      From{" "}
                      <span className="font-bold text-brand-600">
                        {formatCurrency(s.priceFrom)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink-700 transition-colors group-hover:text-brand-600">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Booking a cleaner takes 60 seconds
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No phone calls. No waiting. Just a spotless home.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-4xl font-bold text-ink-100">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink-800">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 rounded-3xl bg-ink-800 p-8 text-center md:grid-cols-4 md:p-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-white md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-ink-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No hidden fees. No surprises. Just great value cleaning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                  className={`mt-7 ${
                    p.popular ? "btn-primary" : "btn-outline"
                  } w-full`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need something custom?{" "}
            <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
              Get in touch
            </Link>
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Google reviews */}
      <GoogleReviews />

      {/* Before & After */}
      <BeforeAfterGallery />

      {/* Areas covered */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Areas We Cover</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Cleaning across the UK
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're expanding fast. Find your city below.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <Link
                key={a.name}
                href="/areas-we-cover"
                className="group relative overflow-hidden rounded-2xl border border-ink-100 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl font-bold text-white">
                      {a.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-200">
                      {a.postcodes.join(", ")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/areas-we-cover" className="btn-outline">
              View all areas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={FAQ_ITEMS_PREVIEW} />

      {/* CTA */}
      <CTASection />
    </>
  );
}
