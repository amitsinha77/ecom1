import Link from "next/link";
import { MapPin, ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { AREAS, LOCAL_SEO_TOWNS } from "@/lib/data";

export const metadata = {
  title: "Areas We Cover | House Cleaning Bolton, Manchester, Bury, Wigan & Preston",
  description:
    "PureMaids provides professional house cleaning in Bolton, Manchester, Bury, Wigan, Preston and across Greater Manchester & Lancashire. Domestic cleaners, end of tenancy, deep cleaning & office cleaning. Check your postcode.",
  keywords: [
    "house cleaning Bolton",
    "domestic cleaners near me",
    "house cleaning Manchester",
    "house cleaning Bury",
    "house cleaning Wigan",
    "house cleaning Preston",
    "cleaners Greater Manchester",
  ],
};

const ALL_CITIES = [
  "Bolton", "Manchester", "Bury", "Wigan", "Preston", "Leigh",
  "Salford", "Stockport", "Trafford", "Oldham", "Rochdale", "Bury",
  "Bolton", "Wigan", "Chorley", "Leyland", "Chorley", "London", "Birmingham",
  "Leeds", "Bristol", "Edinburgh", "Glasgow", "Liverpool", "Sheffield",
  "Newcastle", "Nottingham", "Cardiff", "Brighton", "Oxford", "Cambridge",
  "Reading",
];

const uniqueCities = Array.from(new Set(ALL_CITIES));

export default function AreasPage() {
  const primaryAreas = AREAS.filter((a) => a.primary);
  const otherAreas = AREAS.filter((a) => !a.primary);

  return (
    <>
      <PageHero
        eyebrow="Areas We Cover"
        title="House Cleaning in Bolton, Manchester, Bury, Wigan & Preston"
        subtitle="PureMaids provides vetted, insured local cleaners across Greater Manchester and Lancashire. From house cleaning in Bolton to office cleaning in Manchester, find your area below and book online in under 60 seconds."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Areas We Cover" }]}
      />

      {/* Primary local SEO areas with rich content */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Local Cleaning Services</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Trusted cleaners across Greater Manchester &amp; Lancashire
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Searching for domestic cleaners near me? PureMaids covers Bolton,
              Manchester, Bury, Wigan and Preston with reliable, eco-friendly
              house cleaning, end of tenancy cleaning, deep cleaning services and
              office cleaning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {primaryAreas.map((a) => (
              <div
                key={a.name}
                className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image}
                    alt={`House cleaning in ${a.name}`}
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
                  {a.blurb && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">
                      {a.blurb}
                    </p>
                  )}
                  <Link
                    href="/book-online"
                    className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-600"
                  >
                    Book cleaning in {a.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO keyword content blocks */}
      <section className="section bg-ink-50/50">
        <div className="container max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Find Your Local Cleaner</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Domestic cleaners near me — across the North West
            </h2>
          </div>
          <div className="mt-10 space-y-6">
            {LOCAL_SEO_TOWNS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-xl font-bold text-ink-800">
                  House Cleaning in {t.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other areas */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">More Locations</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              Cleaning across the UK
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;re expanding fast. Find your city below.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherAreas.map((a) => (
              <div
                key={a.name}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image}
                    alt={`Cleaning services in ${a.name}`}
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
              Don&apos;t see your area? We&apos;re adding new locations every month.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueCities.map((c) => (
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
