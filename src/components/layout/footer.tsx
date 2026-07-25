import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Clock, Star } from "lucide-react";
import { SITE, SERVICES } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Pure<span className="text-brand-400">Maids</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              Professional, insured house cleaning across the UK. Vetted
              cleaners, eco-friendly products, and a satisfaction guarantee on
              every clean.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, label: "Fully Insured" },
                { icon: Star, label: "4.9/5 Rated" },
                { icon: Clock, label: "Same Cleaner" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1.5 text-xs font-medium text-ink-200"
                >
                  <b.icon className="h-3.5 w-3.5 text-brand-400" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="text-ink-300 transition-colors hover:text-brand-400"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/areas-we-cover", label: "Areas We Cover" },
                { href: "/pricing", label: "Pricing" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
                { href: "/book-online", label: "Book Online" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-300 transition-colors hover:text-brand-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-start gap-2.5 text-ink-300 transition-colors hover:text-brand-400"
                >
                  <Phone className="mt-0.5 h-4 w-4 text-brand-400" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="flex items-start gap-2.5 text-ink-300 transition-colors hover:text-brand-400"
                >
                  <Mail className="mt-0.5 h-4 w-4 text-brand-400" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-ink-300">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-400" />
                {SITE.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-8 text-xs text-ink-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.{" "}
            <span className="text-ink-500">·</span> Registered in England & Wales
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-brand-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-brand-400">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-brand-400">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
