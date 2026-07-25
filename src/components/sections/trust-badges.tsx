import { TRUST_BADGES } from "@/lib/data";

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {TRUST_BADGES.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <b.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-800">{b.label}</p>
            <p className="text-xs text-muted-foreground">{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
