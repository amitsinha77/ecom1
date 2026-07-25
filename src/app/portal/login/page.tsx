"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader as Loader2, ArrowRight, User, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PortalLoginPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/portal");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, name);
    if (error) {
      setError(error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-bold text-ink-800">
              Pure<span className="text-brand-500">Maids</span>
            </span>
          </Link>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-xl">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-500" />
              <h1 className="font-display text-xl font-bold text-ink-800">
                {mode === "signin" ? "Sign in to your account" : "Create your account"}
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Access your bookings, invoices, and saved details."
                : "Sign up to book and manage your cleans."}
            </p>
          </div>

          <div className="mb-5 flex gap-1 rounded-2xl bg-ink-50 p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === m ? "bg-white text-ink-800 shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required />
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Please wait...</>
              ) : (
                <>{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>
        </div>

        <Link href="/" className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-brand-600">
          Back to website
        </Link>
      </div>
    </div>
  );
}
