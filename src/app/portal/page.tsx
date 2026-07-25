"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Calendar, MapPin, CreditCard, Star, Gift, Loader as Loader2, Clock, CircleCheck as CheckCircle2, Circle as XCircle, Download, ChevronRight, Plus, Trash2, CircleAlert as AlertCircle, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";

type Tab = "bookings" | "addresses" | "payment" | "reviews" | "referrals";

type Booking = {
  id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  address: string;
  postcode: string;
  total_price: number;
  deposit_amount: number;
  status: string;
  extras: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  frequency: string | null;
};

type Address = {
  id: string;
  label: string;
  address_line1: string;
  postcode: string;
  is_default: boolean;
};

type PaymentMethod = {
  id: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
};

type Review = {
  id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type Referral = {
  id: string;
  referee_email: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
};

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
};

const SERVICE_LABELS: Record<string, string> = {
  "domestic-cleaning": "Domestic",
  "deep-cleaning": "Deep Clean",
  "end-of-tenancy-cleaning": "End of Tenancy",
  "office-cleaning": "Office",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-brand-100 text-brand-700",
  assigned: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function CustomerPortalPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/login");
    }
  }, [user, loading, router]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const [bookingsRes, addrRes, pmRes, reviewsRes, referralsRes, invoicesRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("customer_id", user.id).order("booking_date", { ascending: true }),
      supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("payment_methods").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("referrals").select("*").eq("referrer_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
    ]);

    setBookings((bookingsRes.data as Booking[]) ?? []);
    setAddresses((addrRes.data as Address[]) ?? []);
    setPaymentMethods((pmRes.data as PaymentMethod[]) ?? []);
    setReviews((reviewsRes.data as Review[]) ?? []);
    setReferrals((referralsRes.data as Referral[]) ?? []);

    // Invoices are admin-only via RLS; customer sees invoices for their bookings
    // We filter by matching booking IDs
    const bookingIds = (bookingsRes.data as Booking[])?.map((b) => b.id) ?? [];
    if (bookingIds.length > 0) {
      const { data: invData } = await supabase
        .from("invoices")
        .select("*")
        .in("booking_id", bookingIds)
        .order("created_at", { ascending: false });
      setInvoices((invData as Invoice[]) ?? []);
    } else {
      setInvoices([]);
    }

    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "completed"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "referrals", label: "Refer a Friend", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold text-ink-800">
              Pure<span className="text-brand-500">Maids</span>
            </span>
            <span className="hidden rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600 sm:inline">
              My Account
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{profile?.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut().then(() => router.push("/"))}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Welcome */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
          <h1 className="font-display text-2xl font-bold">
            Welcome back, {profile?.full_name?.split(" ")[0] || "there"}!
          </h1>
          <p className="mt-1 text-sm text-brand-100">
            You have {upcomingBookings.length} upcoming booking{upcomingBookings.length !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                tab === t.id ? "bg-brand-500 text-white shadow-sm" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <>
            {tab === "bookings" && (
              <BookingsTab
                upcoming={upcomingBookings}
                past={pastBookings}
                invoices={invoices}
                onRefresh={fetchAll}
              />
            )}
            {tab === "addresses" && (
              <AddressesTab addresses={addresses} userId={user.id} onRefresh={fetchAll} />
            )}
            {tab === "payment" && (
              <PaymentTab paymentMethods={paymentMethods} userId={user.id} onRefresh={fetchAll} />
            )}
            {tab === "reviews" && (
              <ReviewsTab reviews={reviews} bookings={bookings} userId={user.id} onRefresh={fetchAll} />
            )}
            {tab === "referrals" && (
              <ReferralsTab referrals={referrals} userId={user.id} onRefresh={fetchAll} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============ BOOKINGS TAB ============

function BookingsTab({
  upcoming,
  past,
  invoices,
  onRefresh,
}: {
  upcoming: Booking[];
  past: Booking[];
  invoices: Invoice[];
  onRefresh: () => Promise<void>;
}) {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [loading, setLoading] = useState(false);

  const handleReschedule = async (bookingId: string) => {
    setLoading(true);
    await supabase
      .from("bookings")
      .update({ booking_date: newDate, booking_time: newTime })
      .eq("id", bookingId);
    setRescheduleId(null);
    setNewDate("");
    await onRefresh();
    setLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
    await onRefresh();
    setLoading(false);
  };

  const downloadInvoice = (invoice: Invoice) => {
    const csv = [
      ["Invoice Number", "Amount (pence)", "Status", "Due Date"],
      [invoice.invoice_number, invoice.amount, invoice.status, invoice.due_date ?? ""],
    ]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoice_number}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink-800">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3">No upcoming bookings.</p>
            <Link href="/book-online" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">
              Book a clean →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</h3>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[b.status])}>
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {b.booking_date} at {b.booking_time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {b.address}, {b.postcode}
                      </p>
                      <p className="flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5" />
                        {formatCurrency(b.total_price / 100)} (deposit: {formatCurrency(b.deposit_amount / 100)})
                      </p>
                      {b.extras.length > 0 && (
                        <p className="text-xs">Extras: {b.extras.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rescheduleId === b.id ? (
                      <div className="flex flex-col gap-2 rounded-xl bg-ink-50 p-3">
                        <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                        <Select value={newTime} onValueChange={setNewTime}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"].map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button size="sm" disabled={!newDate || loading} onClick={() => handleReschedule(b.id)}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setRescheduleId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => { setRescheduleId(b.id); setNewDate(b.booking_date); setNewTime(b.booking_time); }}>
                          <Clock className="h-3.5 w-3.5" /> Reschedule
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(b.id)} disabled={loading}>
                          <XCircle className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past bookings + invoices */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink-800">Past Bookings & Invoices</h2>
        {past.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3">No past bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {past.map((b) => {
              const invoice = invoices.find((i) => i.invoice_number.includes(b.id.slice(0, 8)));
              return (
                <div key={b.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</h3>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[b.status])}>
                          {b.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {b.booking_date} at {b.booking_time} — {b.address}, {b.postcode}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink-800">{formatCurrency(b.total_price / 100)}</p>
                    </div>
                    {invoice && (
                      <Button size="sm" variant="outline" onClick={() => downloadInvoice(invoice)}>
                        <Download className="h-3.5 w-3.5" /> Invoice
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ADDRESSES TAB ============

function AddressesTab({
  addresses,
  userId,
  onRefresh,
}: {
  addresses: Address[];
  userId: string;
  onRefresh: () => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("Home");
  const [line1, setLine1] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isDefault) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    }
    await supabase.from("addresses").insert({
      user_id: userId,
      label,
      address_line1: line1,
      postcode: postcode.toUpperCase(),
      is_default: isDefault,
    });
    setLabel("Home"); setLine1(""); setPostcode(""); setIsDefault(false);
    setShowAdd(false);
    await onRefresh();
    setLoading(false);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    await onRefresh();
  };

  const setDefault = async (id: string) => {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="font-display text-lg font-bold text-ink-800">Saved Addresses ({addresses.length})</h2>
        <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4" /> Add address</>}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={addAddress} className="mb-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="alabel">Label</Label>
              <Select value={label} onValueChange={setLabel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Home", "Office", "Other"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apc">Postcode *</Label>
              <Input id="apc" value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} placeholder="M1 2AB" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="aaddr">Address *</Label>
              <Input id="aaddr" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="123 Example Street" required />
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
            <span className="text-sm text-ink-600">Set as default address</span>
          </label>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save address"}
          </Button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-800">{a.label}</p>
                  {a.is_default && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Default</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.address_line1}</p>
                <p className="text-sm text-muted-foreground">{a.postcode}</p>
              </div>
              <button onClick={() => deleteAddress(a.id)} className="text-ink-300 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {!a.is_default && (
              <Button variant="ghost" size="sm" className="mt-3" onClick={() => setDefault(a.id)}>
                Set as default
              </Button>
            )}
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No saved addresses yet.</p>
        )}
      </div>
    </div>
  );
}

// ============ PAYMENT METHODS TAB ============

function PaymentTab({
  paymentMethods,
  userId,
  onRefresh,
}: {
  paymentMethods: PaymentMethod[];
  userId: string;
  onRefresh: () => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const addMockCard = async () => {
    setLoading(true);
    // In production, this would use Stripe Elements to capture a real card.
    // For now we add a mock payment method entry.
    await supabase.from("payment_methods").insert({
      user_id: userId,
      stripe_pm_id: `pm_mock_${Date.now()}`,
      brand: "visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2028,
      is_default: paymentMethods.length === 0,
    });
    setShowAdd(false);
    await onRefresh();
    setLoading(false);
  };

  const deletePM = async (id: string) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    await onRefresh();
  };

  const setDefault = async (id: string) => {
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("payment_methods").update({ is_default: true }).eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="font-display text-lg font-bold text-ink-800">Payment Methods ({paymentMethods.length})</h2>
        <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4" /> Add card</>}
        </Button>
      </div>

      {showAdd && (
        <div className="mb-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            In production, a Stripe Elements form would appear here to securely capture your card details.
            For this demo, a test card (Visa ending 4242) will be added.
          </p>
          <Button className="mt-4" onClick={addMockCard} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add test card"}
          </Button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {paymentMethods.map((pm) => (
          <div key={pm.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-ink-800 text-xs font-bold uppercase text-white">
                  {pm.brand ?? "card"}
                </div>
                <div>
                  <p className="font-semibold text-ink-800">•••• {pm.last4}</p>
                  <p className="text-xs text-muted-foreground">Exp {pm.exp_month}/{pm.exp_year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pm.is_default && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Default</span>}
                <button onClick={() => deletePM(pm.id)} className="text-ink-300 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {!pm.is_default && (
              <Button variant="ghost" size="sm" className="mt-3" onClick={() => setDefault(pm.id)}>
                Set as default
              </Button>
            )}
          </div>
        ))}
        {paymentMethods.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No payment methods saved yet.</p>
        )}
      </div>
    </div>
  );
}

// ============ REVIEWS TAB ============

function ReviewsTab({
  reviews,
  bookings,
  userId,
  onRefresh,
}: {
  reviews: Review[];
  bookings: Booking[];
  userId: string;
  onRefresh: () => Promise<void>;
}) {
  const [showReviewFor, setShowReviewFor] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const completedBookings = bookings.filter((b) => b.status === "completed");
  const reviewedBookingIds = new Set(reviews.map((r) => r.booking_id));
  const unreviewed = completedBookings.filter((b) => !reviewedBookingIds.has(b.id));

  const submitReview = async (bookingId: string) => {
    setLoading(true);
    await supabase.from("reviews").insert({
      booking_id: bookingId,
      user_id: userId,
      rating,
      comment: comment || null,
    });
    setShowReviewFor(null);
    setRating(5);
    setComment("");
    await onRefresh();
    setLoading(false);
  };

  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-bold text-ink-800">My Reviews</h2>

      {/* Pending reviews */}
      {unreviewed.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-ink-700">Bookings awaiting review</h3>
          <div className="space-y-2">
            {unreviewed.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div>
                  <p className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</p>
                  <p className="text-xs text-muted-foreground">{b.booking_date}</p>
                </div>
                {showReviewFor === b.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star className={cn("h-6 w-6", s <= rating ? "fill-amber-400 text-amber-400" : "text-ink-200")} />
                        </button>
                      ))}
                    </div>
                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="w-64" />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={loading} onClick={() => submitReview(b.id)}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowReviewFor(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setShowReviewFor(b.id); setRating(5); setComment(""); }}>
                    <Star className="h-3.5 w-3.5" /> Leave review
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted reviews */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
          <Star className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-3">No reviews yet. Complete a booking to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn("h-4 w-4", s <= r.rating ? "fill-amber-400 text-amber-400" : "text-ink-200")} />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-ink-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ REFERRALS TAB ============

function ReferralsTab({
  referrals,
  userId,
  onRefresh,
}: {
  referrals: Referral[];
  userId: string;
  onRefresh: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (referrals.some((r) => r.referee_email.toLowerCase() === email.toLowerCase())) {
      setError("You've already referred this person.");
      return;
    }
    setLoading(true);
    await supabase.from("referrals").insert({
      referrer_user_id: userId,
      referee_email: email,
    });
    setEmail("");
    await onRefresh();
    setLoading(false);
  };

  const referralLink = `https://puremaids.co.uk/?ref=${userId.slice(0, 8)}`;
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-accent to-emerald-600 p-6 text-white">
        <Gift className="h-8 w-8" />
        <h2 className="mt-2 font-display text-xl font-bold">Refer a friend, earn £25</h2>
        <p className="mt-1 text-sm text-emerald-100">
          Share your referral link. When your friend books their first clean, you both get £25 off your next booking!
        </p>
        <div className="mt-4 flex gap-2">
          <Input
            readOnly
            value={referralLink}
            className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/60"
          />
          <Button variant="secondary" size="sm" onClick={copyLink}>
            Copy link
          </Button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-ink-800">Invite by email</h3>
        <form onSubmit={sendReferral} className="mt-3 flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send invite"}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <h3 className="mb-3 font-display text-lg font-bold text-ink-800">Your Referrals ({referrals.length})</h3>
      {referrals.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
          <Gift className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-3">No referrals yet. Start inviting friends to earn rewards!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {referrals.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-ink-800">{r.referee_email}</p>
                <p className="text-xs text-muted-foreground">
                  Invited {new Date(r.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  r.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                  r.status === "signed_up" ? "bg-brand-100 text-brand-700" :
                  "bg-ink-100 text-ink-600"
                )}>
                  {r.status === "sent" ? "Invited" : r.status === "signed_up" ? "Signed up" : "Completed"}
                </span>
                {r.reward_earned && (
                  <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">
                    £25 earned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
