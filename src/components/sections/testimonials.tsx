import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="section bg-ink-50/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
            Loved by families across the UK
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real reviews from real PureMaids customers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card-surface flex flex-col p-6 transition-all hover:shadow-md"
            >
              <Quote className="h-8 w-8 text-brand-200" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                "{t.text}"
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-800">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location} · {t.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
