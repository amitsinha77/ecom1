"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  LogOut,
  Calendar,
  List,
  Users,
  FileText,
  DollarSign,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCog,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";

type Booking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service: string;
  bedrooms: number | null;
  bathrooms: number | null;
  frequency: string | null;
  postcode: string;
  address: string;
  booking_date: string;
  booking_time: string;
  extras: string[];
  base_price: number;
  extras_price: number;
  total_price: number;
  deposit_amount: number;
  status: string;
  cleaner_id: string | null;
  notes: string | null;
  created_at: string;
};

type Cleaner = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  areas: string[];
  status: string;
};

type Invoice = {
  id: string;
  booking_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
};

type Tab = "bookings" | "calendar" | "cleaners" | "customers" | "invoices" | "revenue";

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

const STATUS_OPTIONS = ["pending", "confirmed", "assigned", "completed", "cancelled"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, profile, loading, router]);

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true });
    setBookings((data as Booking[]) ?? []);
  }, []);

  const fetchCleaners = useCallback(async () => {
    const { data } = await supabase
      .from("cleaners")
      .select("*")
      .order("name", { ascending: true });
    setCleaners((data as Cleaner[]) ?? []);
  }, []);

  const fetchInvoices = useCallback(async () => {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    setInvoices((data as Invoice[]) ?? []);
  }, []);

  useEffect(() => {
    if (user && profile?.role === "admin") {
      Promise.all([fetchBookings(), fetchCleaners(), fetchInvoices()]).finally(() =>
        setDataLoading(false)
      );
    }
  }, [user, profile]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_email.toLowerCase().includes(q) ||
          b.postcode.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, search, statusFilter]);

  // Revenue calculations
  const revenue = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
    const depositsCollected = bookings.reduce((sum, b) => sum + b.deposit_amount, 0);
    const completed = bookings.filter((b) => b.status === "completed");
    const completedRevenue = completed.reduce((sum, b) => sum + b.total_price, 0);
    const pending = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
    const pendingRevenue = pending.reduce((sum, b) => sum + b.total_price, 0);
    const thisMonth = bookings.filter((b) => {
      const d = new Date(b.booking_date);
      return d.getMonth() === calendarMonth.getMonth() && d.getFullYear() === calendarMonth.getFullYear();
    });
    const monthRevenue = thisMonth.reduce((sum, b) => sum + b.total_price, 0);
    return {
      totalRevenue,
      depositsCollected,
      completedRevenue,
      pendingRevenue,
      monthRevenue,
      totalBookings: bookings.length,
      completedCount: completed.length,
      pendingCount: pending.length,
    };
  }, [bookings, calendarMonth]);

  // Unique customers
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; bookings: number; total: number }>();
    bookings.forEach((b) => {
      const existing = map.get(b.customer_email);
      if (existing) {
        existing.bookings += 1;
        existing.total += b.total_price;
      } else {
        map.set(b.customer_email, {
          name: b.customer_name,
          email: b.customer_email,
          phone: b.customer_phone,
          bookings: 1,
          total: b.total_price,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings);
  }, [bookings]);

  // Calendar
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }, [calendarMonth]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      const key = b.booking_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return map;
  }, [bookings]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setActionLoading(true);
    await supabase.from("bookings").update({ status }).eq("id", bookingId);
    await fetchBookings();
    setActionLoading(false);
  };

  const assignCleaner = async (bookingId: string, cleanerId: string) => {
    setActionLoading(true);
    const status = cleanerId === "none" ? "confirmed" : "assigned";
    const update = cleanerId === "none" ? { cleaner_id: null, status } : { cleaner_id: cleanerId, status };
    await supabase.from("bookings").update(update).eq("id", bookingId);
    await fetchBookings();
    setSelectedBooking((prev) => prev ? { ...prev, cleaner_id: cleanerId === "none" ? null : cleanerId, status } : null);
    setActionLoading(false);
  };

  const generateInvoice = async (booking: Booking) => {
    setActionLoading(true);
    const count = invoices.length + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;
    const balance = booking.total_price - booking.deposit_amount;
    await supabase.from("invoices").insert({
      booking_id: booking.id,
      invoice_number: invoiceNumber,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      amount: balance,
      status: "pending",
      due_date: booking.booking_date,
    });
    await fetchInvoices();
    setActionLoading(false);
  };

  const sendReminder = async (booking: Booking) => {
    setActionLoading(true);
    try {
      await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: booking.customer_email,
          name: booking.customer_name,
          date: booking.booking_date,
          time: booking.booking_time,
          service: booking.service,
        }),
      });
    } catch {
      // Graceful degradation if email service not configured
    }
    setActionLoading(false);
    alert(`Reminder email queued for ${booking.customer_name}`);
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Email", "Phone", "Service", "Date", "Time", "Postcode", "Extras", "Total (pence)", "Deposit (pence)", "Status", "Cleaner ID"];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.customer_name,
      b.customer_email,
      b.customer_phone,
      b.service,
      b.booking_date,
      b.booking_time,
      b.postcode,
      b.extras.join("; "),
      b.total_price,
      b.deposit_amount,
      b.status,
      b.cleaner_id ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `puremaids-bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !user || profile?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof List }[] = [
    { id: "bookings", label: "Bookings", icon: List },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "cleaners", label: "Cleaners", icon: UserCog },
    { id: "customers", label: "Customers", icon: Users },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "revenue", label: "Revenue", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-ink-800">
                Pure<span className="text-brand-500">Maids</span>
              </span>
            </Link>
            <span className="hidden rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600 sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => signOut().then(() => router.push("/admin/login"))}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
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
            {/* BOOKINGS TAB */}
            {tab === "bookings" && (
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 gap-2">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportCSV}>
                    <Download className="h-4 w-4" /> Export CSV
                  </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-ink-100 bg-ink-50/50">
                        <tr>
                          {["Ref", "Customer", "Service", "Date", "Total", "Status", "Actions"].map((h) => (
                            <th key={h} className="px-4 py-3 text-left font-semibold text-ink-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-100">
                        {filteredBookings.length === 0 ? (
                          <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No bookings found.</td></tr>
                        ) : (
                          filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-ink-50/50">
                              <td className="px-4 py-3 font-mono text-xs text-ink-500">#{b.id.slice(0, 8).toUpperCase()}</td>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-ink-800">{b.customer_name}</p>
                                <p className="text-xs text-muted-foreground">{b.postcode}</p>
                              </td>
                              <td className="px-4 py-3">{SERVICE_LABELS[b.service] ?? b.service}</td>
                              <td className="px-4 py-3">
                                <p>{b.booking_date}</p>
                                <p className="text-xs text-muted-foreground">{b.booking_time}</p>
                              </td>
                              <td className="px-4 py-3 font-semibold text-ink-800">{formatCurrency(b.total_price / 100)}</td>
                              <td className="px-4 py-3">
                                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_COLORS[b.status])}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(b)}>
                                  Manage
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CALENDAR TAB */}
            {tab === "calendar" && (
              <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-ink-800">
                    {calendarMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </h2>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2">{d}</div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (!day) return <div key={i} className="min-h-[80px] rounded-lg bg-ink-50/30" />;
                    const dateStr = day.toISOString().split("T")[0];
                    const dayBookings = bookingsByDate.get(dateStr) ?? [];
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    return (
                      <div
                        key={i}
                        className={cn(
                          "min-h-[80px] rounded-lg border p-1.5 text-left",
                          isToday ? "border-brand-400 bg-brand-50/30" : "border-ink-100"
                        )}
                      >
                        <span className={cn("text-xs font-medium", isToday ? "text-brand-700" : "text-ink-600")}>
                          {day.getDate()}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayBookings.slice(0, 3).map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBooking(b)}
                              className="block w-full truncate rounded bg-brand-100 px-1.5 py-0.5 text-left text-[10px] font-medium text-brand-700 transition-colors hover:bg-brand-200"
                            >
                              {b.booking_time} {b.customer_name}
                            </button>
                          ))}
                          {dayBookings.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CLEANERS TAB */}
            {tab === "cleaners" && (
              <CleanersTab cleaners={cleaners} onRefresh={fetchCleaners} />
            )}

            {/* CUSTOMERS TAB */}
            {tab === "customers" && (
              <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-ink-100 bg-ink-50/50">
                      <tr>
                        {["Name", "Email", "Phone", "Bookings", "Total Spent"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-ink-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {customers.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No customers yet.</td></tr>
                      ) : (
                        customers.map((c) => (
                          <tr key={c.email} className="hover:bg-ink-50/50">
                            <td className="px-4 py-3 font-semibold text-ink-800">{c.name}</td>
                            <td className="px-4 py-3 text-ink-600">{c.email}</td>
                            <td className="px-4 py-3 text-ink-600">{c.phone}</td>
                            <td className="px-4 py-3">{c.bookings}</td>
                            <td className="px-4 py-3 font-semibold text-ink-800">{formatCurrency(c.total / 100)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INVOICES TAB */}
            {tab === "invoices" && (
              <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-ink-100 bg-ink-50/50">
                      <tr>
                        {["Invoice #", "Customer", "Email", "Amount", "Status", "Due Date"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-ink-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {invoices.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No invoices yet. Generate one from a booking.</td></tr>
                      ) : (
                        invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-ink-50/50">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-ink-800">{inv.invoice_number}</td>
                            <td className="px-4 py-3">{inv.customer_name}</td>
                            <td className="px-4 py-3 text-ink-600">{inv.customer_email}</td>
                            <td className="px-4 py-3 font-semibold text-ink-800">{formatCurrency(inv.amount / 100)}</td>
                            <td className="px-4 py-3">
                              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : inv.status === "overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ink-600">{inv.due_date ?? "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REVENUE TAB */}
            {tab === "revenue" && (
              <div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Revenue", value: formatCurrency(revenue.totalRevenue / 100), icon: DollarSign, color: "text-brand-600" },
                    { label: "Deposits Collected", value: formatCurrency(revenue.depositsCollected / 100), icon: TrendingUp, color: "text-accent" },
                    { label: "Completed Revenue", value: formatCurrency(revenue.completedRevenue / 100), icon: CheckCircle2, color: "text-emerald-600" },
                    { label: "Pending Revenue", value: formatCurrency(revenue.pendingRevenue / 100), icon: Clock, color: "text-amber-600" },
                  ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                        <card.icon className={cn("h-4 w-4", card.color)} />
                      </div>
                      <p className={cn("mt-2 font-display text-2xl font-bold", card.color)}>{card.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Total Bookings", value: revenue.totalBookings, icon: List },
                    { label: "Completed", value: revenue.completedCount, icon: CheckCircle2 },
                    { label: "Pending/Confirmed", value: revenue.pendingCount, icon: AlertCircle },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <s.icon className="h-4 w-4 text-ink-400" />
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                      </div>
                      <p className="mt-2 font-display text-3xl font-bold text-ink-800">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-ink-800">Revenue this month</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {calendarMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold text-brand-600">
                    {formatCurrency(revenue.monthRevenue / 100)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          cleaners={cleaners}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={updateBookingStatus}
          onAssignCleaner={assignCleaner}
          onGenerateInvoice={generateInvoice}
          onSendReminder={sendReminder}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}

function CleanersTab({
  cleaners,
  onRefresh,
}: {
  cleaners: Cleaner[];
  onRefresh: () => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areas, setAreas] = useState("");
  const [loading, setLoading] = useState(false);

  const addCleaner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("cleaners").insert({
      name,
      email,
      phone,
      areas: areas.split(",").map((a) => a.trim().toUpperCase()).filter(Boolean),
    });
    setName(""); setEmail(""); setPhone(""); setAreas("");
    setShowAdd(false);
    await onRefresh();
    setLoading(false);
  };

  const toggleStatus = async (c: Cleaner) => {
    const newStatus = c.status === "active" ? "inactive" : "active";
    await supabase.from("cleaners").update({ status: newStatus }).eq("id", c.id);
    await onRefresh();
  };

  const deleteCleaner = async (id: string) => {
    await supabase.from("cleaners").delete().eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="font-display text-xl font-bold text-ink-800">Cleaners ({cleaners.length})</h2>
        <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : "Add cleaner"}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={addCleaner} className="mb-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cname">Name *</Label>
              <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cemail">Email</Label>
              <Input id="cemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cphone">Phone</Label>
              <Input id="cphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="careas">Areas (comma-separated postcodes)</Label>
              <Input id="careas" value={areas} onChange={(e) => setAreas(e.target.value)} placeholder="M, SK, OL" />
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save cleaner"}
          </Button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cleaners.map((c) => (
          <div key={c.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink-800">{c.name}</p>
                {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-500")}>
                {c.status}
              </span>
            </div>
            {c.areas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {c.areas.map((a) => (
                  <span key={a} className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{a}</span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleStatus(c)}>
                {c.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteCleaner(c.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {cleaners.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No cleaners yet. Add your first cleaner above.</p>
        )}
      </div>
    </div>
  );
}

function BookingDetailModal({
  booking,
  cleaners,
  onClose,
  onStatusChange,
  onAssignCleaner,
  onGenerateInvoice,
  onSendReminder,
  actionLoading,
}: {
  booking: Booking;
  cleaners: Cleaner[];
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onAssignCleaner: (id: string, cleanerId: string) => Promise<void>;
  onGenerateInvoice: (b: Booking) => Promise<void>;
  onSendReminder: (b: Booking) => Promise<void>;
  actionLoading: boolean;
}) {
  const assignedCleaner = cleaners.find((c) => c.id === booking.cleaner_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-ink-800">Booking #{booking.id.slice(0, 8).toUpperCase()}</h3>
            <span className={cn("mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_COLORS[booking.status])}>
              {booking.status}
            </span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          {[
            { label: "Customer", value: booking.customer_name },
            { label: "Email", value: booking.customer_email },
            { label: "Phone", value: booking.customer_phone },
            { label: "Service", value: SERVICE_LABELS[booking.service] ?? booking.service },
            { label: "Property", value: `${booking.bedrooms ?? "?"} bed, ${booking.bathrooms ?? "?"} bath` },
            { label: "Date & Time", value: `${booking.booking_date} at ${booking.booking_time}` },
            { label: "Address", value: `${booking.address}, ${booking.postcode}` },
            ...(booking.extras.length > 0 ? [{ label: "Extras", value: booking.extras.join(", ") }] : []),
            ...(booking.notes ? [{ label: "Notes", value: booking.notes }] : []),
          ].map((r) => (
            <div key={r.label} className="flex justify-between gap-4 border-b border-ink-100 pb-2">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="text-right font-medium text-ink-800">{r.value}</span>
            </div>
          ))}
          <div className="flex justify-between border-b border-ink-100 pb-2">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-brand-600">{formatCurrency(booking.total_price / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit paid</span>
            <span className="font-semibold text-accent">{formatCurrency(booking.deposit_amount / 100)}</span>
          </div>
        </div>

        {/* Assign cleaner */}
        <div className="mt-5 space-y-1.5">
          <Label>Assigned cleaner</Label>
          <Select
            value={booking.cleaner_id ?? "none"}
            onValueChange={(v) => onAssignCleaner(booking.id, v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {cleaners.filter((c) => c.status === "active").map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {assignedCleaner && (
            <p className="text-xs text-muted-foreground">
              Areas: {assignedCleaner.areas.join(", ") || "No areas set"}
            </p>
          )}
        </div>

        {/* Status update */}
        <div className="mt-4 space-y-1.5">
          <Label>Update status</Label>
          <Select value={booking.status} onValueChange={(v) => onStatusChange(booking.id, v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateInvoice(booking)}
            disabled={actionLoading}
          >
            <FileText className="h-4 w-4" /> Generate invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendReminder(booking)}
            disabled={actionLoading}
          >
            <Mail className="h-4 w-4" /> Send reminder
          </Button>
        </div>
      </div>
    </div>
  );
}
