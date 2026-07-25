"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Loader as Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SERVICES } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const BEDROOMS = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5+ Bedrooms" },
];

const BATHROOMS = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4", label: "4+ Bathrooms" },
];

const FREQUENCIES = [
  { value: "weekly", label: "Weekly", multiplier: 1, discount: 0.15 },
  { value: "fortnightly", label: "Fortnightly", multiplier: 1, discount: 0.1 },
  { value: "one-off", label: "One-off / Deep", multiplier: 1.6, discount: 0 },
];

type Props = {
  variant?: "hero" | "compact";
  className?: string;
};

export function QuoteForm({ variant = "hero", className }: Props) {
  const [service, setService] = useState<string>("domestic-cleaning");
  const [bedrooms, setBedrooms] = useState<string>("2");
  const [bathrooms, setBathrooms] = useState<string>("1");
  const [frequency, setFrequency] = useState<string>("weekly");
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const estimate = useMemo(() => {
    const svc = SERVICES.find((s) => s.slug === service) ?? SERVICES[0];
    const freq = FREQUENCIES.find((f) => f.value === frequency) ?? FREQUENCIES[0];
    const beds = parseInt(bedrooms, 10);
    const baths = parseInt(bathrooms, 10);
    const baseHours = svc.slug === "office-cleaning" ? 3 : 2;
    const hours = baseHours + beds * 0.5 + baths * 0.5;
    const hourly = svc.priceFrom * freq.multiplier;
    const subtotal = hours * hourly;
    const discount = subtotal * freq.discount;
    const total = Math.round(subtotal - discount);
    return { total, hours: Math.max(2, Math.round(hours)), svc, freq };
  }, [service, bedrooms, bathrooms, frequency]);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCalculated(true);
    }, 600);
  };

  const bookingParams = new URLSearchParams({
    service,
    bedrooms,
    bathrooms,
    frequency,
    estimate: String(estimate.total),
  }).toString();

  return (
    <div
      className={cn(
        "rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl shadow-ink-900/5 md:p-8",
        className
      )}
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-ink-800">
            Get Your Instant Quote
          </h3>
          <p className="text-xs text-muted-foreground">
            No sign-up. No phone call. Just a price.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="qf-service">Service</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="qf-service">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="qf-beds">Bedrooms</Label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger id="qf-beds">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BEDROOMS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qf-baths">Bathrooms</Label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger id="qf-baths">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATHROOMS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="qf-freq">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="qf-freq">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {calculated && (
          <div className="animate-fade-up rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink-600">
                Your estimate
              </span>
              <span className="text-xs text-brand-700">
                {estimate.freq.label} · ~{estimate.hours}h
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold text-brand-600">
                {formatCurrency(estimate.total)}
              </span>
              <span className="text-sm text-ink-500">
                /{frequency === "one-off" ? "clean" : "visit"}
              </span>
            </div>
            {estimate.freq.discount > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                <Check className="h-3.5 w-3.5" />
                {Math.round(estimate.freq.discount * 100)}% loyalty discount
                applied
              </p>
            )}
            <Link
              href={`/book-online?${bookingParams}`}
              className="btn-primary mt-4 w-full"
            >
              Book this clean
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!calculated && (
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                Get my instant quote
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Free, no-obligation quote · Secure online booking
        </p>
      </div>
    </div>
  );
}
