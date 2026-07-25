"use client";

import { useState } from "react";
import { GALLERY } from "@/lib/data";
import { cn } from "@/lib/utils";

export function BeforeAfterGallery() {
  const [active, setActive] = useState<Record<string, "before" | "after">>({});

  const toggle = (idx: number) => {
    setActive((prev) => ({
      ...prev,
      [idx]: prev[idx] === "after" ? "before" : "after",
    }));
  };

  return (
    <section className="section bg-ink-50/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Before & After</span>
          <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
            See the PureMaids difference
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Drag the slider or tap to reveal the transformation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, idx) => {
            const state = active[idx] ?? "after";
            return (
              <div key={idx} className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                <div
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                  onClick={() => toggle(idx)}
                >
                  <img
                    src={g.before}
                    alt={`${g.label} before`}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                      state === "before" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <img
                    src={g.after}
                    alt={`${g.label} after`}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                      state === "after" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors",
                      state === "before"
                        ? "bg-ink-800 text-white"
                        : "bg-brand-500 text-white"
                    )}
                  >
                    {state}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-700 backdrop-blur">
                    Tap to {state === "after" ? "see before" : "see after"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-ink-800">{g.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
