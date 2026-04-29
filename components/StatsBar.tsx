"use client";

import { Application } from "@/lib/types";
import { getActiveCount, getResponseRate } from "@/lib/utils";

export default function StatsBar({ apps }: { apps: Application[] }) {
  const total = apps.length;
  const active = getActiveCount(apps);
  const offers = apps.filter((a) => a.status === "offer").length;
  const responseRate = getResponseRate(apps);
  const interviews = apps.filter((a) =>
    ["interview", "final_round"].includes(a.status)
  ).length;

  const stats = [
    { label: "Total", value: total, emoji: "📋", color: "var(--lavender)" },
    { label: "Active", value: active, emoji: "⚡", color: "var(--sky)" },
    { label: "Interviews", value: interviews, emoji: "🎯", color: "var(--yellow)" },
    { label: "Response Rate", value: `${responseRate}%`, emoji: "📬", color: "var(--mint)" },
    { label: "Offers", value: offers, emoji: "🎉", color: "var(--pink)" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card p-4 text-center">
          <p className="text-xl mb-1">{s.emoji}</p>
          <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
