"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Loader as Loader2, MapPin, Navigation, Clock, CircleCheck as CheckCircle2, Camera, TriangleAlert as AlertTriangle, Wallet, Bell, X, ChevronLeft, Calendar, Chrome as Home, Plus } from "lucide-react";
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

type Tab = "jobs" | "earnings" | "notifications";

type Booking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  address: string;
  postcode: string;
  total_price: number;
  status: string;
  extras: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  frequency: string | null;
  notes: string | null;
};

type CheckIn = {
  id: string;
  booking_id: string;
  check_in_time: string;
  check_out_time: string | null;
};

type JobIssue = {
  id: string;
  booking_id: string;
  description: string;
  severity: string;
  resolved: boolean;
  created_at: string;
};

type JobPhoto = {
  id: string;
  booking_id: string;
  photo_type: string;
  storage_path: string;
  created_at: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
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

export default function CleanerPortalPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("jobs");
  const [cleanerId, setCleanerId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [issues, setIssues] = useState<JobIssue[]>([]);
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/cleaner/login");
    }
  }, [user, loading, router]);

  // Find the cleaner record linked to this user's email
  useEffect(() => {
    if (!user || !profile) return;
    const findCleaner = async () => {
      const { data } = await supabase
        .from("cleaners")
        .select("id, email")
        .eq("email", profile.email)
        .maybeSingle();
      if (data) {
        setCleanerId(data.id);
      }
    };
    findCleaner();
  }, [user, profile]);

  const fetchAll = useCallback(async () => {
    if (!cleanerId) return;
    const [bookingsRes, checkInsRes, issuesRes, photosRes, notifRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("cleaner_id", cleanerId).order("booking_date", { ascending: true }),
      supabase.from("check_ins").select("*").eq("cleaner_id", cleanerId).order("check_in_time", { ascending: false }),
      supabase.from("job_issues").select("*").eq("cleaner_id", cleanerId).order("created_at", { ascending: false }),
      supabase.from("job_photos").select("*").eq("cleaner_id", cleanerId).order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("cleaner_id", cleanerId).order("created_at", { ascending: false }),
    ]);

    setBookings((bookingsRes.data as Booking[]) ?? []);
    setCheckIns((checkInsRes.data as CheckIn[]) ?? []);
    setIssues((issuesRes.data as JobIssue[]) ?? []);
    setPhotos((photosRes.data as JobPhoto[]) ?? []);
    setNotifications((notifRes.data as Notification[]) ?? []);
    setDataLoading(false);
  }, [cleanerId]);

  useEffect(() => {
    if (cleanerId) fetchAll();
  }, [cleanerId, fetchAll]);

  const today = new Date().toISOString().split("T")[0];
  const todayJobs = bookings.filter((b) => b.booking_date === today && b.status !== "cancelled");
  const upcomingJobs = bookings.filter((b) => b.booking_date > today && b.status !== "cancelled" && b.status !== "completed");
  const completedJobs = bookings.filter((b) => b.status === "completed");

  // Earnings: 70% of total_price for completed jobs
  const earnings = useMemo(() => {
    const total = completedJobs.reduce((sum, b) => sum + Math.round(b.total_price * 0.7), 0);
    const thisMonth = completedJobs
      .filter((b) => {
        const d = new Date(b.booking_date);
        return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
      })
      .reduce((sum, b) => sum + Math.round(b.total_price * 0.7), 0);
    return { total, thisMonth, jobCount: completedJobs.length };
  }, [completedJobs]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs: { id: Tab; label: string; icon: typeof Calendar; badge?: number }[] = [
    { id: "jobs", label: "Jobs", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold text-ink-800">
              Pure<span className="text-brand-500">Maids</span>
            </span>
            <span className="hidden rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 sm:inline">
              Cleaner
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{profile?.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut().then(() => router.push("/cleaner/login"))}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {cleanerId === null && !dataLoading ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="mt-3 font-display text-lg font-bold text-ink-800">Not linked to a cleaner profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account email ({profile?.email}) isn&apos;t linked to a cleaner record.
              An admin must add you as a cleaner with this email address in the admin dashboard.
            </p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Today</p>
                <p className="mt-1 font-display text-2xl font-bold text-brand-600">{todayJobs.length}</p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
                <p className="mt-1 font-display text-2xl font-bold text-indigo-600">{upcomingJobs.length}</p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Earned</p>
                <p className="mt-1 font-display text-2xl font-bold text-accent">{formatCurrency(earnings.total / 100)}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-2xl bg-white p-1.5 shadow-sm">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                    tab === t.id ? "bg-brand-500 text-white shadow-sm" : "text-ink-600 hover:bg-ink-50"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  {t.badge ? (
                    <span className="absolute right-2 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              </div>
            ) : (
              <>
                {tab === "jobs" && (
                  <JobsTab
                    todayJobs={todayJobs}
                    upcomingJobs={upcomingJobs}
                    checkIns={checkIns}
                    issues={issues}
                    photos={photos}
                    cleanerId={cleanerId}
                    onSelectJob={setSelectedJob}
                    onRefresh={fetchAll}
                  />
                )}
                {tab === "earnings" && <EarningsTab earnings={earnings} completedJobs={completedJobs} />}
                {tab === "notifications" && (
                  <NotificationsTab notifications={notifications} onRefresh={fetchAll} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {selectedJob && (
        <JobDetailSheet
          job={selectedJob}
          checkIns={checkIns.filter((c) => c.booking_id === selectedJob.id)}
          issues={issues.filter((i) => i.booking_id === selectedJob.id)}
          photos={photos.filter((p) => p.booking_id === selectedJob.id)}
          cleanerId={cleanerId}
          onClose={() => setSelectedJob(null)}
          onRefresh={fetchAll}
        />
      )}
    </div>
  );
}

// ============ JOBS TAB ============

function JobsTab({
  todayJobs,
  upcomingJobs,
  checkIns,
  issues,
  photos,
  cleanerId,
  onSelectJob,
  onRefresh,
}: {
  todayJobs: Booking[];
  upcomingJobs: Booking[];
  checkIns: CheckIn[];
  issues: JobIssue[];
  photos: JobPhoto[];
  cleanerId: string | null;
  onSelectJob: (b: Booking) => void;
  onRefresh: () => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      {/* Today's jobs */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink-800">
          <Clock className="h-5 w-5 text-brand-500" /> Today&apos;s Jobs
        </h2>
        {todayJobs.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3">No jobs scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayJobs.map((b) => {
              const checkedIn = checkIns.some((c) => c.booking_id === b.id && !c.check_out_time);
              const completed = b.status === "completed";
              return (
                <button
                  key={b.id}
                  onClick={() => onSelectJob(b)}
                  className="block w-full rounded-2xl border border-ink-100 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</h3>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[b.status])}>
                          {b.status}
                        </span>
                        {checkedIn && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Checked in</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{b.customer_name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {b.address}, {b.postcode}
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink-700">{b.booking_time}</p>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-ink-300" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink-800">
          <Calendar className="h-5 w-5 text-indigo-500" /> Upcoming Jobs
        </h2>
        {upcomingJobs.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
            <p>No upcoming jobs assigned.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectJob(b)}
                className="block w-full rounded-2xl border border-ink-100 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.customer_name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {b.address}, {b.postcode}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink-700">{b.booking_date} at {b.booking_time}</p>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-ink-300" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ JOB DETAIL SHEET ============

function JobDetailSheet({
  job,
  checkIns,
  issues,
  photos,
  cleanerId,
  onClose,
  onRefresh,
}: {
  job: Booking;
  checkIns: CheckIn[];
  issues: JobIssue[];
  photos: JobPhoto[];
  cleanerId: string | null;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueDesc, setIssueDesc] = useState("");
  const [issueSeverity, setIssueSeverity] = useState("low");

  const activeCheckIn = checkIns.find((c) => !c.check_out_time);
  const isCheckedIn = !!activeCheckIn;
  const isCompleted = job.status === "completed";

  const handleCheckIn = async () => {
    if (!cleanerId) return;
    setLoading(true);
    let lat: number | null = null;
    let lng: number | null = null;
    try {
      const pos = await navigator.geolocation.getCurrentPosition(
        (p) => { lat = p.coords.latitude; lng = p.coords.longitude; },
        () => {},
        { timeout: 5000 }
      );
    } catch {
      // GPS not available — check in without coordinates
    }
    await supabase.from("check_ins").insert({
      booking_id: job.id,
      cleaner_id: cleanerId,
      check_in_lat: lat,
      check_in_lng: lng,
    });
    await onRefresh();
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (!activeCheckIn) return;
    setLoading(true);
    await supabase
      .from("check_ins")
      .update({ check_out_time: new Date().toISOString() })
      .eq("id", activeCheckIn.id);
    // Mark booking as completed
    await supabase.from("bookings").update({ status: "completed" }).eq("id", job.id);
    await onRefresh();
    setLoading(false);
  };

  const reportIssue = async () => {
    if (!cleanerId || !issueDesc.trim()) return;
    setLoading(true);
    await supabase.from("job_issues").insert({
      booking_id: job.id,
      cleaner_id: cleanerId,
      description: issueDesc,
      severity: issueSeverity,
    });
    setIssueDesc("");
    setIssueSeverity("low");
    setShowIssueForm(false);
    await onRefresh();
    setLoading(false);
  };

  const navigateToJob = () => {
    const query = encodeURIComponent(`${job.address}, ${job.postcode}`);
    window.open(`https://maps.google.com/?q=${query}`, "_blank");
  };

  const uploadPhoto = async (type: "before" | "after") => {
    if (!cleanerId) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setLoading(true);
      const path = `${job.id}/${type}-${Date.now()}.jpg`;
      // Upload to Supabase Storage (bucket: job-photos)
      const { error: uploadError } = await supabase.storage
        .from("job-photos")
        .upload(path, file);
      if (!uploadError) {
        await supabase.from("job_photos").insert({
          booking_id: job.id,
          cleaner_id: cleanerId,
          photo_type: type,
          storage_path: path,
        });
        await onRefresh();
      }
      setLoading(false);
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-ink-800">
              {SERVICE_LABELS[job.service] ?? job.service}
            </h3>
            <span className={cn("mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_COLORS[job.status])}>
              {job.status}
            </span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          {[
            { label: "Customer", value: job.customer_name },
            { label: "Phone", value: job.customer_phone },
            { label: "Date & Time", value: `${job.booking_date} at ${job.booking_time}` },
            { label: "Address", value: `${job.address}, ${job.postcode}` },
            { label: "Property", value: `${job.bedrooms ?? "?"} bed, ${job.bathrooms ?? "?"} bath` },
            ...(job.extras.length > 0 ? [{ label: "Extras", value: job.extras.join(", ") }] : []),
            ...(job.notes ? [{ label: "Notes", value: job.notes }] : []),
          ].map((r) => (
            <div key={r.label} className="flex justify-between gap-4 border-b border-ink-100 pb-2">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="text-right font-medium text-ink-800">{r.value}</span>
            </div>
          ))}
        </div>

        {/* GPS Navigation */}
        <Button variant="outline" className="mt-4 w-full" onClick={navigateToJob}>
          <Navigation className="h-4 w-4" /> Navigate to address
        </Button>

        {/* Check in / out */}
        <div className="mt-4">
          {!isCompleted ? (
            isCheckedIn ? (
              <Button className="w-full" onClick={handleCheckOut} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Check out & complete job</>}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleCheckIn} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Clock className="h-4 w-4" /> Check in</>}
              </Button>
            )
          ) : (
            <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="mx-auto h-5 w-5" />
              Job completed
            </div>
          )}
        </div>

        {/* Photos */}
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-semibold text-ink-700">Before & After Photos</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={() => uploadPhoto("before")} disabled={loading}>
              <Camera className="h-4 w-4" /> Before photo
            </Button>
            <Button variant="outline" size="sm" onClick={() => uploadPhoto("after")} disabled={loading}>
              <Camera className="h-4 w-4" /> After photo
            </Button>
          </div>
          {photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {photos.map((p) => (
                <div key={p.id} className="rounded-lg bg-ink-100 px-3 py-1.5 text-xs">
                  <span className="font-semibold capitalize">{p.photo_type}</span>
                  <span className="ml-2 text-muted-foreground">
                    {new Date(p.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issues */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ink-700">Report an Issue</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowIssueForm((v) => !v)}>
              {showIssueForm ? "Cancel" : <><Plus className="h-3.5 w-3.5" /> Report</>}
            </Button>
          </div>

          {showIssueForm && (
            <div className="mt-2 space-y-2 rounded-xl bg-ink-50 p-3">
              <Textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Describe the issue..."
                className="bg-white"
              />
              <Select value={issueSeverity} onValueChange={setIssueSeverity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low priority</SelectItem>
                  <SelectItem value="medium">Medium priority</SelectItem>
                  <SelectItem value="high">High priority</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={reportIssue} disabled={loading || !issueDesc.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit issue"}
              </Button>
            </div>
          )}

          {issues.length > 0 && (
            <div className="mt-2 space-y-2">
              {issues.map((iss) => (
                <div key={iss.id} className={cn(
                  "rounded-xl border p-3 text-sm",
                  iss.severity === "high" ? "border-red-200 bg-red-50" :
                  iss.severity === "medium" ? "border-amber-200 bg-amber-50" :
                  "border-ink-100 bg-ink-50"
                )}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-3.5 w-3.5", iss.severity === "high" ? "text-red-500" : iss.severity === "medium" ? "text-amber-500" : "text-ink-400")} />
                    <span className="font-semibold capitalize">{iss.severity} priority</span>
                    {iss.resolved && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Resolved</span>}
                  </div>
                  <p className="mt-1 text-ink-600">{iss.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ EARNINGS TAB ============

function EarningsTab({
  earnings,
  completedJobs,
}: {
  earnings: { total: number; thisMonth: number; jobCount: number };
  completedJobs: Booking[];
}) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <Wallet className="h-5 w-5 text-accent" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">Total earned</p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">{formatCurrency(earnings.total / 100)}</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <Wallet className="h-5 w-5 text-brand-500" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">This month</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-600">{formatCurrency(earnings.thisMonth / 100)}</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">Jobs completed</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{earnings.jobCount}</p>
        </div>
      </div>

      <h3 className="mb-3 mt-6 font-display text-lg font-bold text-ink-800">Completed Jobs</h3>
      {completedJobs.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
          <CheckCircle2 className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-3">No completed jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {completedJobs.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-ink-800">{SERVICE_LABELS[b.service] ?? b.service}</p>
                <p className="text-xs text-muted-foreground">{b.booking_date} — {b.customer_name}</p>
              </div>
              <p className="font-bold text-accent">{formatCurrency(Math.round(b.total_price * 0.7) / 100)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ NOTIFICATIONS TAB ============

function NotificationsTab({
  notifications,
  onRefresh,
}: {
  notifications: Notification[];
  onRefresh: () => Promise<void>;
}) {
  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    await onRefresh();
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) => supabase.from("notifications").update({ read: true }).eq("id", n.id))
    );
    await onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink-800">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-muted-foreground">
          <Bell className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-3">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={cn(
                "block w-full rounded-2xl border p-4 text-left shadow-sm transition-all",
                n.read ? "border-ink-100 bg-white" : "border-brand-200 bg-brand-50"
              )}
            >
              <div className="flex items-start gap-3">
                {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                <div className="flex-1">
                  <p className="font-semibold text-ink-800">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-400">
                    {new Date(n.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
