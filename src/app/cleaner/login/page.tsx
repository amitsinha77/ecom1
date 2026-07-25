"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader as Loader2, ArrowRight, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CleanerLoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/cleaner");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
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
              <Wrench className="h-5 w-5 text-brand-500" />
              <h1 className="font-display text-xl font-bold text-ink-800">Cleaner Portal</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to view your assigned jobs, check in, and upload photos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@puremaids.co.uk"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl bg-ink-50 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-ink-700">Cleaner access</p>
            <p className="mt-1">
              Your account email must match a cleaner record in the system.
              An admin adds cleaners from the admin dashboard. If you don&apos;t have
              an account yet, contact your supervisor.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-brand-600"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
