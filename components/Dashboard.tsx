"use client";

import { Application, STATUS_CONFIG, PRIORITY_CONFIG, CATEGORY_CONFIG, AppStatus, RoleCategory, Priority } from "@/lib/types";
import {
  getActiveCount,
  getInterviewCount,
  getResponseRate,
  getOfferCount,
  getStatusCounts,
  getOverdueApps,
  getStaleApps,
  formatDateShort,
} from "@/lib/utils";
import { AlertCircle, Clock, TrendingUp, Briefcase, Zap, Target, BarChart2, Star } from "lucide-react";

interface DashboardProps {
  apps: Application[];
  onViewApp: (app: Application) => void;
}

const STATUS_ORDER: AppStatus[] = [
  "watching",
  "applied",
  "phone_screen",
  "technical_screen",
  "onsite",
  "final_round",
  "offer",
  "rejected",
  "withdrawn",
];

export default function Dashboard({ apps, onViewApp }: DashboardProps) {
  const statusCounts = getStatusCounts(apps);
  const overdueApps = getOverdueApps(apps);
  const staleApps = getStaleApps(apps);

  const totalApps = apps.length;
  const activeCount = getActiveCount(apps);
  const interviewCount = getInterviewCount(apps);
  const responseRate = getResponseRate(apps);
  const offerCount = getOfferCount(apps);

  // Category counts
  const categoryCounts: Partial<Record<RoleCategory, number>> = {};
  apps.forEach((a) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  // Priority counts
  const priorityCounts: Partial<Record<Priority, number>> = {};
  apps.forEach((a) => {
    priorityCounts[a.priority] = (priorityCounts[a.priority] || 0) + 1;
  });

  const maxStatusCount = Math.max(...STATUS_ORDER.map((s) => statusCounts[s] || 0), 1);

  return (
    <div className="space-y-6 fade-in">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={<Briefcase size={20} style={{ color: "var(--lavender-deep)" }} />} iconBg="var(--lavender-soft)" label="Total Apps" value={totalApps} valueColor="var(--lavender-deep)" />
        <StatCard icon={<Zap size={20} style={{ color: "var(--sky)" }} />} iconBg="var(--sky-soft)" label="Active" value={activeCount} valueColor="var(--sky)" />
        <StatCard icon={<Target size={20} style={{ color: "var(--peach)" }} />} iconBg="var(--peach-soft)" label="Interviews" value={interviewCount} valueColor="var(--peach)" />
        <StatCard icon={<BarChart2 size={20} style={{ color: "var(--mint)" }} />} iconBg="var(--mint-soft)" label="Response Rate" value={`${responseRate}%`} valueColor="var(--mint)" />
        <StatCard icon={<Star size={20} style={{ color: "var(--green)" }} />} iconBg="var(--green-soft)" label="Offers" value={offerCount} valueColor="var(--green)" />
      </div>

      {/* Overdue Next Actions */}
      {overdueApps.length > 0 && (
        <div className="alert-card-red">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} style={{ color: "#c04040" }} />
            <h3 className="font-bold text-sm" style={{ color: "#c04040" }}>
              ⚠️ OVERDUE NEXT ACTIONS ({overdueApps.length})
            </h3>
          </div>
          <div className="space-y-2">
            {overdueApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onViewApp(app)}
                className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all hover:brightness-95"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                    {app.company}
                  </span>
                  <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    {app.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{app.nextAction}</span>
                  <span className="overdue-badge">Due {formatDateShort(app.nextActionDue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stale Applications */}
      {staleApps.length > 0 && (
        <div className="alert-card-yellow">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} style={{ color: "#a08010" }} />
            <h3 className="font-bold text-sm" style={{ color: "#a08010" }}>
              🕐 STALE APPLICATIONS — no update in 14+ days ({staleApps.length})
            </h3>
          </div>
          <div className="space-y-2">
            {staleApps.map((app) => {
              const cfg = STATUS_CONFIG[app.status];
              return (
                <div
                  key={app.id}
                  onClick={() => onViewApp(app)}
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all hover:brightness-95"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                      {app.company}
                    </span>
                    <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {app.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span
                      className="badge"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.emoji} {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {/* Pipeline Bar */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: "var(--lavender-deep)" }} />
            <h3 className="font-bold text-sm" style={{ color: "var(--text-heading)" }}>Pipeline</h3>
          </div>
          <div className="space-y-2.5">
            {STATUS_ORDER.map((status) => {
              const count = statusCounts[status] || 0;
              const cfg = STATUS_CONFIG[status];
              const pct = Math.round((count / maxStatusCount) * 100);
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs w-36 truncate flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                  <div className="flex-1 progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%`, background: cfg.color }}
                    />
                  </div>
                  <span className="text-xs font-bold w-4 text-right flex-shrink-0" style={{ color: "var(--text-body)" }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {/* Category Breakdown */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-heading)" }}>
              📂 By Role Category
            </h3>
            <div className="space-y-2">
              {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
                const count = categoryCounts[cat as RoleCategory] || 0;
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {cfg.emoji} {cfg.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "var(--text-body)" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-heading)" }}>
              🎯 By Priority
            </h3>
            <div className="space-y-2">
              {(["high", "med_high", "medium", "med_low", "low"] as Priority[]).map((p) => {
                const cfg = PRIORITY_CONFIG[p];
                const count = priorityCounts[p] || 0;
                return (
                  <div key={p} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {cfg.emoji} {cfg.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "var(--text-body)" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number | string;
  valueColor: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="rounded-2xl p-2.5 flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-2xl font-bold leading-tight" style={{ color: valueColor }}>{value}</p>
      </div>
    </div>
  );
}
