import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf, Award, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { CTASection } from "@/components/sections/cta-section";
import { STATS, SITE } from "@/lib/data";

export const metadata = {
  title: "About Us | The PureMaids Story",
  description:
    "PureMaids is a UK cleaning company built on trust, quality, and care. Learn about our mission, our vetted cleaners, and our commitment to a spotless home for every customer.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    desc: "Every cleaner is DBS-checked, reference-verified, and insured. Your home and family are in safe hands.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    desc: "We use planet-friendly, family-safe products that are tough on dirt but gentle on your home.",
  },
  {
    icon: HeartHandshake,
    title: "People First",
    desc: "We pay our cleaners fairly and treat them like family. Happy cleaners make happy homes.",
  },
  {
    icon: Award,
    title: "Quality Always",
    desc: "We don't cut corners. Every clean meets our high standards, backed by a satisfaction guarantee.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About PureMaids"
        title="Cleaning homes with care since 2018"
        subtitle="What started as a small family-run business is now one of the UK's most trusted cleaning companies — and we've never lost our personal touch."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src="https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="PureMaids cleaner at work"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              A family business with a national reach
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                PureMaids was founded in 2018 by a family who believed that
                hiring a cleaner should be simple, safe, and stress-free. We were
                tired of unreliable agencies and impersonal service — so we built
                something better.
              </p>
              <p>
                Today we clean over 50,000 homes a year across the UK, but our
                values haven't changed. We still hand-pick and personally vet
                every cleaner. We still answer the phone. And we still treat
                every home as if it were our own.
              </p>
              <p>
                Our mission is simple: to give you back your time, with a clean
                you can trust and a service you'll love.
              </p>
            </div>
            <Link href="/book-online" className="btn-primary mt-7 w-fit">
              Book your first clean
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-800 py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-white md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-ink-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-ink-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Values</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              What we stand for
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-800">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Cleaners</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
              The people who make it happen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We employ over 180 vetted cleaners across the UK. They're the
              heart of PureMaids.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Emma R.",
                role: "Senior Cleaner, Manchester",
                years: "5 years with PureMaids",
                img: "https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                name: "James T.",
                role: "Team Lead, London",
                years: "4 years with PureMaids",
                img: "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                name: "Aisha M.",
                role: "Deep Clean Specialist, Birmingham",
                years: "3 years with PureMaids",
                img: "https://images.pexels.com/photos/4239026/pexels-photo-4239026.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
            ].map((m) => (
              <div
                key={m.name}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-bold text-ink-800">{m.name}</p>
                  <p className="text-sm text-brand-600">{m.role}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {m.years}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <CTASection
        title="Join 50,000+ happy homes"
        subtitle="Experience the PureMaids difference for yourself. Get your instant quote today."
      />
    </>
  );
}
