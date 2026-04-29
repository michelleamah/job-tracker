"use client";

import { useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown, SlidersHorizontal, AlertCircle, X } from "lucide-react";
import {
  Application,
  AppStatus,
  AppType,
  Priority,
  RoleCategory,
  Tier,
  Referral,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  CATEGORY_CONFIG,
  TIER_CONFIG,
} from "@/lib/types";
import { sortApplications, exportApplicationsCSV, formatDateShort, isOverdue, SortKey } from "@/lib/utils";

interface ApplicationTableProps {
  apps: Application[];
  onView: (app: Application) => void;
}

function getRowBg(status: AppStatus): string {
  const map: Record<AppStatus, string> = {
    offer:            "rgba(134, 201, 168, 0.12)",
    final_round:      "rgba(249, 168, 201, 0.10)",
    onsite:           "rgba(249, 223, 160, 0.10)",
    technical_screen: "rgba(160, 201, 249, 0.10)",
    phone_screen:     "rgba(249, 197, 160, 0.10)",
    applied:          "rgba(157, 212, 196, 0.08)",
    watching:         "rgba(196, 181, 232, 0.07)",
    rejected:         "rgba(212, 160, 160, 0.10)",
    withdrawn:        "rgba(176, 168, 184, 0.08)",
  };
  return map[status] ?? "transparent";
}

export default function ApplicationTable({ apps, onView }: ApplicationTableProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AppStatus | "all">("all");
  const [filterType, setFilterType] = useState<AppType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<RoleCategory | "all">("all");
  const [filterTier, setFilterTier] = useState<Tier | "all">("all");
  const [filterReferral, setFilterReferral] = useState<Referral | "all">("all");
  const [sort, setSort] = useState<SortKey>("dateApplied");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const activeFilterCount = [
    filterStatus !== "all",
    filterType !== "all",
    filterPriority !== "all",
    filterCategory !== "all",
    filterTier !== "all",
    filterReferral !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterType("all");
    setFilterPriority("all");
    setFilterCategory("all");
    setFilterTier("all");
    setFilterReferral("all");
  };

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = apps.filter((a) => {
      return (
        (!q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)) &&
        (filterStatus === "all" || a.status === filterStatus) &&
        (filterType === "all" || a.type === filterType) &&
        (filterPriority === "all" || a.priority === filterPriority) &&
        (filterCategory === "all" || a.category === filterCategory) &&
        (filterTier === "all" || a.tier === filterTier) &&
        (filterReferral === "all" || a.referral === filterReferral)
      );
    });
    const sorted = sortApplications(base, sort);
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }, [apps, search, filterStatus, filterType, filterPriority, filterCategory, filterTier, filterReferral, sort, sortDir]);

  function SortHeader({ label, sortKey }: { label: string; sortKey: SortKey }) {
    const active = sort === sortKey;
    return (
      <button
        className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wide hover:opacity-80 transition-opacity"
        style={{ color: active ? "var(--lavender-deep)" : "var(--text-muted)" }}
        onClick={() => toggleSort(sortKey)}
      >
        {label}
        {active
          ? (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
          : <ChevronDown size={11} style={{ opacity: 0.3 }} />}
      </button>
    );
  }

  return (
    <div className="space-y-3 fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role…"
            className="input-field"
            style={{ paddingLeft: "2rem" }}
          />
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="btn-ghost flex items-center gap-1.5"
          style={showFilters || activeFilterCount > 0
            ? { borderColor: "var(--lavender)", color: "var(--lavender-deep)" }
            : {}}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--lavender)", color: "white", lineHeight: 1 }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Export */}
        <button onClick={() => exportApplicationsCSV(apps)} className="btn-ghost flex items-center gap-1.5">
          <Download size={14} /> CSV
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="card p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 fade-in"
        >
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Status</p>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as AppStatus | "all")} className="input-field text-xs">
              <option value="all">All</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Tier</p>
            <select value={filterTier} onChange={(e) => setFilterTier(e.target.value as Tier | "all")} className="input-field text-xs">
              <option value="all">All</option>
              {Object.entries(TIER_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Priority</p>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | "all")} className="input-field text-xs">
              <option value="all">All</option>
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Category</p>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as RoleCategory | "all")} className="input-field text-xs">
              <option value="all">All</option>
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Type</p>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as AppType | "all")} className="input-field text-xs">
              <option value="all">All</option>
              <option value="internship">🌱 Internship</option>
              <option value="fulltime">💼 Full-time</option>
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Referral</p>
            <select value={filterReferral} onChange={(e) => setFilterReferral(e.target.value as Referral | "all")} className="input-field text-xs">
              <option value="all">All</option>
              <option value="yes">✅ Yes</option>
              <option value="no">❌ No</option>
              <option value="pending">⏳ Pending</option>
            </select>
          </div>
          {activeFilterCount > 0 && (
            <div className="col-span-full flex justify-end">
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <X size={11} /> Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {filtered.length} of {apps.length} application{apps.length !== 1 ? "s" : ""}
        {activeFilterCount > 0 || search ? " (filtered)" : ""}
      </p>

      {/* Table */}
      <div className="card overflow-hidden">
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-base)" }}>
                <th className="px-4 py-3 text-left"><SortHeader label="Company" sortKey="company" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Role" sortKey="role" /></th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Cat</span>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Tier</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Pri</span>
                </th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Type</span>
                </th>
                <th className="px-4 py-3 text-left"><SortHeader label="Status" sortKey="status" /></th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Ref</span>
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell"><SortHeader label="Applied" sortKey="dateApplied" /></th>
                <th className="px-4 py-3 text-left hidden xl:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Next Due</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-16 text-center" style={{ color: "var(--text-muted)" }}>
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="text-sm">No applications match your filters</div>
                  </td>
                </tr>
              )}
              {filtered.map((app, i) => {
                const statusCfg = STATUS_CONFIG[app.status];
                const priCfg = PRIORITY_CONFIG[app.priority];
                const catCfg = CATEGORY_CONFIG[app.category];
                const tierCfg = TIER_CONFIG[app.tier];
                const overdueNext = app.nextActionDue && isOverdue(app.nextActionDue);
                return (
                  <tr
                    key={app.id}
                    className="table-row"
                    onClick={() => onView(app)}
                    style={{
                      background: getRowBg(app.status),
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: "var(--text-heading)" }}>{app.company}</span>
                    </td>
                    <td className="px-4 py-3 max-w-48">
                      <span className="text-sm truncate block" style={{ color: "var(--text-body)" }}>{app.role}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge" style={{ background: "var(--lavender-soft)", color: "var(--lavender-deep)" }}>
                        {catCfg.emoji}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge" style={{ background: "var(--yellow-soft)", color: "#a08010" }}>
                        {tierCfg.emoji} {tierCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span title={priCfg.label} className="text-base">{priCfg.emoji}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge" style={{ background: "var(--sky-soft)", color: "var(--sky)" }}>
                        {app.type === "internship" ? "🌱 Intern" : "💼 FT"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {statusCfg.emoji} {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm" style={{ color: "var(--text-muted)" }}>
                      {app.referral === "yes" ? "✅" : app.referral === "pending" ? "⏳" : "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs" style={{ color: "var(--text-muted)" }}>
                      {app.dateApplied ? formatDateShort(app.dateApplied) : "—"}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {app.nextActionDue
                        ? overdueNext
                          ? <span className="overdue-badge"><AlertCircle size={10} /> {formatDateShort(app.nextActionDue)}</span>
                          : <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDateShort(app.nextActionDue)}</span>
                        : <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
