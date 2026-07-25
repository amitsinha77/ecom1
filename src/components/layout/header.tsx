"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE, SERVICES } from "@/lib/data";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/domestic-cleaning", label: "Domestic" },
  { href: "/deep-cleaning", label: "Deep Clean" },
  { href: "/end-of-tenancy-cleaning", label: "End of Tenancy" },
  { href: "/office-cleaning", label: "Office" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/areas-we-cover", label: "Areas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="border-b border-ink-100 bg-ink-800 text-white">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Insured, vetted & trusted by 50,000+ UK homes
            </span>
            <span className="flex items-center gap-1.5 sm:hidden">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Trusted across the UK
            </span>
          </div>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-1.5 font-semibold transition-colors hover:text-brand-300"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE.phone}
          </a>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-ink-800">
            Pure<span className="text-brand-500">Maids</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/book-online" className="btn-primary hidden sm:inline-flex">
            Book Online
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 text-ink-700 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-ink-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/book-online" className="btn-primary mt-2">
              Book Online
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
