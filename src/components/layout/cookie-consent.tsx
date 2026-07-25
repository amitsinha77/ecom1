"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const KEY = "puremaids-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (choice: "accepted" | "rejected") => {
    localStorage.setItem(KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-2xl shadow-ink-900/10 md:flex-row md:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Cookie className="h-5 w-5" />
        </div>
        <p className="flex-1 text-sm text-ink-600">
          We use cookies to improve your experience and analyse site traffic. By
          clicking "Accept", you agree to our use of cookies. See our{" "}
          <Link href="/cookies" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex w-full gap-2 md:w-auto">
          <button
            onClick={() => accept("rejected")}
            className="flex-1 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 md:flex-none"
          >
            Reject
          </button>
          <button
            onClick={() => accept("accepted")}
            className="btn-primary flex-1 md:flex-none"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
