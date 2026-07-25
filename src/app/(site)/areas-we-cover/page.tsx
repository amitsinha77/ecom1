import Link from "next/link";
import { MapPin, ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { AREAS } from "@/lib/data";

export const metadata = {
  title: "Areas We Cover | UK Cleaning Locations",
  description:
    "PureMaids provides professional cleaning across major UK cities including London, Manchester, Birmingham, Leeds, Bristol, Edinburgh and more. Check if we cover your postcode.",
};

const ALL_CITIES = [
  "London", "Manchester", "Birmingham", "Leeds", "Bristol", "Edinburgh",
  "Glasgow", "Liverpool", "Sheffield", "Newcastle", "Nottingham",
  "Cardiff", "Brighton", "Oxford", "Cambridge", "Reading",
];

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Areas We Cover"
        title="Cleaning across the UK"
        subtitle="We're expanding fast. Use the list below to check if we cover your area — and if you don't see your city, get in touch as we may already be on our way."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Areas We Cover" }]}
      />

      {/* Featured areas */}
      <section className="section">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <div
                key={a.name}
                className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-xl font-bold text-white">
                      {a.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
                    <MapPin className="h-3.5 w-3.5" />
                    Postcodes covered
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.postcodes.join(", ")}
                  </p>
                  <Link
                    href="/book-online"
                    className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-600"
                  >
                    Book in {a.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All cities */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Full Coverage</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              All cities we serve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don't see your area? We're adding new locations every month.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_CITIES.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{c}</p>
                    <p className="text-xs text-muted-foreground">Now available</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Don't see your area?"
        subtitle="We're growing quickly. Get in touch and we'll let you know as soon as PureMaids arrives in your city."
      />
    </>
  );
}
