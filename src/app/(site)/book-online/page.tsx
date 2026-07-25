"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  ShieldCheck,
  Calendar,
  Home,
  Sparkles,
  Lock,
  MapPin,
  Plus,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";
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
import { useAuth } from "@/lib/auth-context";
import { SERVICES } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const BEDROOMS = ["1", "2", "3", "4", "5+"];
const BATHROOMS = ["1", "2", "3", "4+"];
const FREQUENCIES = [
  { value: "weekly", label: "Weekly (15% off)", discount: 0.15, mult: 1 },
  { value: "fortnightly", label: "Fortnightly (10% off)", discount: 0.1, mult: 1 },
  { value: "one-off", label: "One-off / Deep", discount: 0, mult: 1.6 },
];

const EXTRAS = [
  { id: "oven", label: "Oven Clean", price: 25 },
  { id: "carpet", label: "Carpet Clean", price: 45 },
  { id: "fridge", label: "Fridge Clean", price: 20 },
  { id: "windows", label: "Windows (internal)", price: 30 },
];

const DEPOSIT_PERCENT = 0.3;

function BookingContent() {
  const params = useSearchParams();
  const { user, profile, signIn, signUp } = useAuth();
  const [step, setStep] = useState(1);

  const [service, setService] = useState(params.get("service") ?? "domestic-cleaning");
  const [postcode, setPostcode] = useState("");
  const [bedrooms, setBedrooms] = useState(params.get("bedrooms") ?? "2");
  const [bathrooms, setBathrooms] = useState(params.get("bathrooms") ?? "1");
  const [frequency, setFrequency] = useState(params.get("frequency") ?? "weekly");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [extras, setExtras] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [authMode, setAuthMode] = useState<"guest" | "signin" | "signup">("guest");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const pricing = useMemo(() => {
    const svc = SERVICES.find((s) => s.slug === service) ?? SERVICES[0];
    const freq = FREQUENCIES.find((f) => f.value === frequency) ?? FREQUENCIES[0];
    const beds = bedrooms === "5+" ? 5 : parseInt(bedrooms, 10);
    const baths = bathrooms === "4+" ? 4 : parseInt(bathrooms, 10);
    const baseHours = svc.slug === "office-cleaning" ? 3 : 2;
    const hours = baseHours + beds * 0.5 + baths * 0.5;
    const hourly = svc.priceFrom * freq.mult;
    const subtotal = hours * hourly;
    const basePrice = Math.round(subtotal * (1 - freq.discount));
    const extrasPrice = EXTRAS.filter((e) => extras.includes(e.id)).reduce(
      (sum, e) => sum + e.price,
      0
    );
    const total = basePrice + extrasPrice;
    const deposit = Math.round(total * DEPOSIT_PERCENT);
    return {
      basePrice,
      extrasPrice,
      total,
      deposit,
      hours: Math.max(2, Math.round(hours)),
      svc,
      freq,
    };
  }, [service, bedrooms, bathrooms, frequency, extras]);

  const steps = [
    { num: 1, label: "Service", icon: Sparkles },
    { num: 2, label: "Schedule", icon: Calendar },
    { num: 3, label: "Extras", icon: Plus },
    { num: 4, label: "Account", icon: User },
    { num: 5, label: "Pay", icon: CreditCard },
  ];

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const canProceed = () => {
    if (step === 1) return service && postcode.trim().length > 0;
    if (step === 2) return date && time && address.trim().length > 0;
    if (step === 3) return true;
    if (step === 4) {
      if (user) return true;
      if (authMode === "guest") return name && email && phone && consent;
      if (authMode === "signin") return authEmail && authPassword;
      if (authMode === "signup") return authEmail && authPassword && authName && consent;
    }
    if (step === 5) return true;
    return true;
  };

  const handleAuth = async (): Promise<boolean> => {
    setAuthError("");
    if (authMode === "signin") {
      const { error } = await signIn(authEmail, authPassword);
      if (error) {
        setAuthError(error);
        return false;
      }
      return true;
    }
    if (authMode === "signup") {
      const { error } = await signUp(authEmail, authPassword, authName);
      if (error) {
        setAuthError(error);
        return false;
      }
      return true;
    }
    return true;
  };

  const handleCreateBooking = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          bedrooms: bedrooms === "5+" ? 5 : parseInt(bedrooms, 10),
          bathrooms: bathrooms === "4+" ? 4 : parseInt(bathrooms, 10),
          frequency,
          postcode,
          address,
          bookingDate: date,
          bookingTime: time,
          extras,
          basePrice: pricing.basePrice * 100,
          extrasPrice: pricing.extrasPrice * 100,
          totalPrice: pricing.total * 100,
          depositAmount: pricing.deposit * 100,
          customerName: user ? profile?.full_name || name : name,
          customerEmail: user ? profile?.email || email : email,
          customerPhone: user ? profile?.phone || phone : phone,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create booking");
      setBookingId(data.bookingId);
      setClientSecret(data.clientSecret);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Booking failed");
    }
  };

  if (status === "success" && bookingId) {
    return (
      <div className="container max-w-2xl py-20">
        <div className="rounded-3xl border border-accent/20 bg-emerald-50 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-ink-800">
            Booking confirmed!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you, {(user?.email ?? email).split("@")[0]}. We&apos;ve sent a
            confirmation email with all the details. Your deposit of{" "}
            <span className="font-bold text-ink-800">
              {formatCurrency(pricing.deposit)}
            </span>{" "}
            has been secured.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking ref</span>
              <span className="font-mono font-semibold text-ink-800">
                #{bookingId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-semibold text-ink-800">{pricing.svc.title}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-ink-800">{date} at {time}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Address</span>
              <span className="font-semibold text-ink-800">{address}, {postcode}</span>
            </div>
            {extras.length > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Extras</span>
                <span className="font-semibold text-ink-800">
                  {extras.map((e) => EXTRAS.find((x) => x.id === e)?.label).join(", ")}
                </span>
              </div>
            )}
            <div className="mt-3 border-t border-ink-200 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-ink-800">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit paid</span>
                <span className="font-bold text-brand-600">{formatCurrency(pricing.deposit)}</span>
              </div>
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
    <div className="container max-w-4xl py-12 md:py-20">
      <div className="text-center">
        <span className="eyebrow">Book Online</span>
        <h1 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
          Book your clean in 5 easy steps
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
                {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={cn("hidden text-xs font-medium sm:block", step >= s.num ? "text-ink-800" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded-full transition-colors", step > s.num ? "bg-brand-500" : "bg-ink-200")} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-ink-100 bg-white p-6 shadow-sm md:p-8">
          {/* Step 1: Service + Postcode + Property */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-800">Your cleaning details</h2>
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
              <div className="space-y-1.5">
                <Label htmlFor="postcode">Postcode *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="M1 2AB"
                    className="pl-10"
                  />
                </div>
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
            </div>
          )}

          {/* Step 2: Schedule + Address */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-800">Pick a date & time</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Preferred date *</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
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
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Example Street" />
              </div>
            </div>
          )}

          {/* Step 3: Extras */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-800">Add extras (optional)</h2>
              <p className="text-sm text-muted-foreground">Boost your clean with these add-ons.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {EXTRAS.map((e) => {
                  const selected = extras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggleExtra(e.id)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all",
                        selected ? "border-brand-400 bg-brand-50" : "border-ink-100 bg-white hover:border-ink-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink-800">{e.label}</p>
                        <p className="text-xs text-muted-foreground">+{formatCurrency(e.price)}</p>
                      </div>
                      <div className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors", selected ? "border-brand-500 bg-brand-500 text-white" : "border-ink-200")}>
                        {selected && <Check className="h-4 w-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Cleaning notes (optional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests, access details, or areas to focus on..." />
              </div>
            </div>
          )}

          {/* Step 4: Account / Guest */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-800">
                {user ? "Confirm your details" : "Create an account or continue as guest"}
              </h2>
              {user ? (
                <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
                  Signed in as <span className="font-semibold">{user.email}</span>
                </div>
              ) : (
                <div className="flex gap-2 rounded-2xl bg-ink-50 p-1">
                  {(["guest", "signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setAuthMode(m); setAuthError(""); }}
                      className={cn("flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors", authMode === m ? "bg-white text-ink-800 shadow-sm" : "text-muted-foreground")}
                    >
                      {m === "guest" ? "Guest" : m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>
              )}

              {authMode === "guest" || user ? (
                <div className="space-y-4">
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
                  {!user && (
                    <label className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
                      <span className="text-xs leading-relaxed text-ink-600">
                        I consent to PureMaids processing my data to arrange this booking, as described in the{" "}
                        <a href="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</a> (GDPR compliant).
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {authMode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="authname">Full name</Label>
                      <Input id="authname" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Jane Smith" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="authemail">Email</Label>
                    <Input id="authemail" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="jane@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="authpass">Password</Label>
                    <Input id="authpass" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Min 6 characters" />
                  </div>
                  {authError && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{authError}</p>}
                  {authMode === "signup" && (
                    <label className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
                      <span className="text-xs leading-relaxed text-ink-600">
                        I consent to PureMaids processing my data, as described in the{" "}
                        <a href="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</a>.
                      </span>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Pay deposit */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-800">Review & pay deposit</h2>
              <div className="space-y-3 rounded-2xl bg-ink-50 p-5">
                {[
                  { label: "Service", value: pricing.svc.title },
                  { label: "Frequency", value: pricing.freq.label },
                  { label: "Property", value: `${bedrooms} bed, ${bathrooms} bath` },
                  { label: "Date", value: `${date} at ${time}` },
                  { label: "Address", value: `${address}, ${postcode}` },
                  ...(extras.length > 0 ? [{ label: "Extras", value: extras.map((e) => EXTRAS.find((x) => x.id === e)?.label).join(", ") }] : []),
                  { label: "Name", value: user ? profile?.full_name || name : name },
                  { label: "Email", value: user ? profile?.email || email : email },
                  { label: "Phone", value: user ? profile?.phone || phone : phone },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-right font-semibold text-ink-800">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
                <Lock className="h-4 w-4 shrink-0" />
                A {Math.round(DEPOSIT_PERCENT * 100)}% deposit secures your booking. The balance is paid after your clean.
              </div>
              {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={status === "loading"}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : <span />}
            {step < 5 ? (
              <Button
                onClick={async () => {
                  if (step === 4 && authMode !== "guest" && !user) {
                    const ok = await handleAuth();
                    if (!ok) return;
                  }
                  setStep((s) => s + 1);
                }}
                disabled={!canProceed() || (status === "loading")}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreateBooking} disabled={status === "loading"}>
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Pay {formatCurrency(pricing.deposit)} deposit</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Live price sidebar */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink-800">Live price</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base clean</span>
                <span className="font-semibold text-ink-800">{formatCurrency(pricing.basePrice)}</span>
              </div>
              {pricing.extrasPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extras</span>
                  <span className="font-semibold text-ink-800">{formatCurrency(pricing.extrasPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Duration</span>
                <span>~{pricing.hours}h</span>
              </div>
              <div className="border-t border-ink-200 pt-2 flex justify-between">
                <span className="font-semibold text-ink-800">Total</span>
                <span className="font-display text-xl font-bold text-brand-600">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Deposit (30%)</span>
                <span className="text-sm font-bold text-accent">{formatCurrency(pricing.deposit)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-ink-50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Secure payment via Stripe
            </div>
          </div>
        </div>
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
