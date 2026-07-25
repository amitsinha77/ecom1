"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Loader as Loader2, ShieldCheck, Calendar, Chrome as Home, Sparkles, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const BEDROOMS = ["1", "2", "3", "4", "5+"];
const BATHROOMS = ["1", "2", "3", "4+"];
const FREQUENCIES = [
  { value: "weekly", label: "Weekly (15% off)" },
  { value: "fortnightly", label: "Fortnightly (10% off)" },
  { value: "one-off", label: "One-off / Deep" },
];

function BookingContent() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);

  const [service, setService] = useState(
    params.get("service") ?? "domestic-cleaning"
  );
  const [bedrooms, setBedrooms] = useState(params.get("bedrooms") ?? "2");
  const [bathrooms, setBathrooms] = useState(params.get("bathrooms") ?? "1");
  const [frequency, setFrequency] = useState(params.get("frequency") ?? "weekly");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const estimate = useMemo(() => {
    const svc = SERVICES.find((s) => s.slug === service) ?? SERVICES[0];
    const freq = FREQUENCIES.find((f) => f.value === frequency) ?? FREQUENCIES[0];
    const beds = bedrooms === "5+" ? 5 : parseInt(bedrooms, 10);
    const baths = bathrooms === "4+" ? 4 : parseInt(bathrooms, 10);
    const baseHours = svc.slug === "office-cleaning" ? 3 : 2;
    const hours = baseHours + beds * 0.5 + baths * 0.5;
    const hourly = svc.priceFrom * (frequency === "one-off" ? 1.6 : 1);
    const subtotal = hours * hourly;
    const discountPct = frequency === "weekly" ? 0.15 : frequency === "fortnightly" ? 0.1 : 0;
    const total = Math.round(subtotal * (1 - discountPct));
    return { total, hours: Math.max(2, Math.round(hours)), svc, freq };
  }, [service, bedrooms, bathrooms, frequency]);

  const steps = [
    { num: 1, label: "Your clean", icon: Sparkles },
    { num: 2, label: "Schedule", icon: Calendar },
    { num: 3, label: "Your details", icon: Home },
    { num: 4, label: "Confirm", icon: Check },
  ];

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return date && time;
    if (step === 3) return name && email && phone && address && postcode && consent;
    return true;
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          bedrooms,
          bathrooms,
          frequency,
          estimate: estimate.total,
          date,
          time,
          address,
          postcode,
          name,
          email,
          phone,
          notes,
          consent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Booking failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Booking failed");
    }
  };

  if (status === "success") {
    return (
      <div className="container max-w-2xl py-20">
        <div className="rounded-3xl border border-accent/20 bg-emerald-50 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-ink-800">
            Booking received!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you, {name.split(" ")[0]}. We've sent a confirmation to{" "}
            <span className="font-semibold text-ink-800">{email}</span>. Our team
            will be in touch shortly to confirm your cleaner and finalise payment.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-semibold text-ink-800">{estimate.svc.title}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-ink-800">{date} at {time}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Estimate</span>
              <span className="font-bold text-brand-600">
                {formatCurrency(estimate.total)}
              </span>
            </div>
          </div>
          <Link href="/" className="btn-outline mt-6">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12 md:py-20">
      <div className="text-center">
        <span className="eyebrow">Book Online</span>
        <h1 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
          Book your clean in 4 easy steps
        </h1>
      </div>

      {/* Stepper */}
      <div className="mt-10 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
                  step >= s.num
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-ink-200 bg-white text-ink-400"
                )}
              >
                {step > s.num ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  step >= s.num ? "text-ink-800" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full transition-colors",
                  step > s.num ? "bg-brand-500" : "bg-ink-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-ink-100 bg-white p-6 shadow-sm md:p-8">
        {/* Step 1: Service */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-ink-800">
              Your cleaning details
            </h2>
            <div className="space-y-1.5">
              <Label>Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Bedrooms</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BEDROOMS.map((b) => (
                      <SelectItem key={b} value={b}>{b === "5+" ? "5+ Bedrooms" : `${b} Bedroom${b !== "1" ? "s" : ""}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Bathrooms</Label>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BATHROOMS.map((b) => (
                      <SelectItem key={b} value={b}>{b === "4+" ? "4+ Bathrooms" : `${b} Bathroom${b !== "1" ? "s" : ""}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-600">Your estimate</span>
                <span className="text-xs text-brand-700">~{estimate.hours}h</span>
              </div>
              <p className="mt-1 font-display text-3xl font-bold text-brand-600">
                {formatCurrency(estimate.total)}
                <span className="text-sm font-normal text-ink-500">
                  {" "}/{frequency === "one-off" ? "clean" : "visit"}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-ink-800">
              Pick a date & time
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="date">Preferred date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Preferred time *</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Property address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Example Street"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="M1 2AB"
              />
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-ink-800">
              Your contact details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number *</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07123 456789" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Cleaning notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests, access details, or areas to focus on..." />
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400"
              />
              <span className="text-xs leading-relaxed text-ink-600">
                I consent to PureMaids processing my data to arrange this booking, as described in the{" "}
                <a href="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</a> (GDPR compliant).
              </span>
            </label>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-ink-800">
              Review & confirm
            </h2>
            <div className="space-y-3 rounded-2xl bg-ink-50 p-5">
              {[
                { label: "Service", value: estimate.svc.title },
                { label: "Frequency", value: estimate.freq.label },
                { label: "Bedrooms", value: bedrooms },
                { label: "Bathrooms", value: bathrooms },
                { label: "Date", value: date },
                { label: "Time", value: time },
                { label: "Address", value: `${address}, ${postcode}` },
                { label: "Name", value: name },
                { label: "Email", value: email },
                { label: "Phone", value: phone },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-right font-semibold text-ink-800">{row.value}</span>
                </div>
              ))}
              <div className="border-t border-ink-200 pt-3 flex justify-between">
                <span className="font-semibold text-ink-800">Estimated total</span>
                <span className="font-display text-xl font-bold text-brand-600">
                  {formatCurrency(estimate.total)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
              <Lock className="h-4 w-4 shrink-0" />
              Payment is securely collected after your cleaner is confirmed. No charge until your booking is locked in.
            </div>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={status === "loading"}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm booking
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-accent" />
        Secure booking · GDPR compliant · No payment until confirmed
      </div>
    </div>
  );
}

export default function BookOnlinePage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
