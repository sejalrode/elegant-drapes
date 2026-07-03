import type { ReactNode } from "react";

type DashboardCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "plain" | "good" | "warn" | "danger";
};

const tones = {
  plain: "bg-white text-ink",
  good: "bg-emerald-50 text-emerald-900",
  warn: "bg-amber-50 text-amber-900",
  danger: "bg-rose-50 text-rose-900"
};

export function DashboardCard({ label, value, icon, tone = "plain" }: DashboardCardProps) {
  return (
    <section className={`rounded-lg border border-slate-200 p-4 shadow-soft ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <div className="text-palm">{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-normal">{value}</p>
    </section>
  );
}
