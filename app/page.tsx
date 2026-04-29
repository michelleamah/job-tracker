"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import KanbanBoard from "@/components/KanbanBoard";
import ListView from "@/components/ListView";
import ApplicationForm from "@/components/ApplicationForm";
import { Application, AppStatus, AppType, Priority, STATUS_CONFIG } from "@/lib/types";
import { loadApplications, addApplication, updateApplication, deleteApplication } from "@/lib/store";
import { sortApplications } from "@/lib/utils";

type View = "kanban" | "list";
type SortKey = "date" | "company" | "status" | "priority";

export default function Home() {
  const [apps, setApps] = useState<Application[]>([]);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("list");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "all">("all");
  const [filterType, setFilterType] = useState<AppType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setApps(loadApplications());
    setMounted(true);
  }, []);

  const handleAdd = useCallback((data: Omit<Application, "id" | "createdAt" | "lastUpdated">) => {
    const newApp = addApplication(data);
    setApps((prev) => [newApp, ...prev]);
    setShowForm(false);
  }, []);

  const handleEdit = useCallback((data: Omit<Application, "id" | "createdAt" | "lastUpdated">) => {
    if (!editTarget) return;
    const updated = updateApplication(editTarget.id, data);
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditTarget(null);
  }, [editTarget]);

  const handleDelete = useCallback((id: string) => {
    deleteApplication(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleStatusChange = useCallback((id: string, status: AppStatus) => {
    const updated = updateApplication(id, { status });
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }, []);

  const openEdit = useCallback((app: Application) => {
    setEditTarget(app);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditTarget(null);
  }, []);

  const filtered = sortApplications(
    apps.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      const matchType = filterType === "all" || a.type === filterType;
      const matchPriority = filterPriority === "all" || a.priority === filterPriority;
      return matchSearch && matchStatus && matchType && matchPriority;
    }),
    sort
  );

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="text-center">
          <p className="text-5xl float mb-3">🚀</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading your applications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Header onAdd={() => { setEditTarget(null); setShowForm(true); }} />

      <main className="max-w-5xl mx-auto px-4 py-7">
        {/* Welcome */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, var(--lavender-deep), var(--pink), var(--sky))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Job Search HQ ✨
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Summer 2027 internships · SF Bay Area · Solutions Engineer &amp; Sales Engineer roles 🌸
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsBar apps={apps} />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, role, location…"
              className="input-field pl-8"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="btn-ghost flex items-center gap-1.5"
            style={showFilters ? { borderColor: "var(--lavender)", color: "var(--text-heading)" } : {}}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input-field"
            style={{ width: "auto" }}
          >
            <option value="date">Sort: Recent</option>
            <option value="company">Sort: Company</option>
            <option value="status">Sort: Status</option>
            <option value="priority">Sort: Priority</option>
          </select>

          {/* View toggle */}
          <div
            className="flex rounded-xl p-0.5 gap-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {([["list", <List key="l" size={15} />], ["kanban", <LayoutGrid key="k" size={15} />]] as [View, React.ReactNode][]).map(([v, icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="p-1.5 rounded-lg transition-all"
                style={
                  view === v
                    ? { background: "var(--lavender-soft)", color: "var(--lavender-deep)" }
                    : { color: "var(--text-muted)" }
                }
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl fade-in" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {/* Status filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterStatus("all")}
                className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                style={filterStatus === "all" ? { background: "var(--lavender)", color: "white" } : { background: "var(--bg-base)", color: "var(--text-muted)" }}
              >
                All statuses
              </button>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterStatus(k as AppStatus)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                  style={filterStatus === k ? { background: v.color, color: "white" } : { background: v.bg, color: v.color }}
                >
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
            <div className="w-full h-px" style={{ background: "var(--border)" }} />
            {/* Type + Priority */}
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "internship", "fulltime"] as (AppType | "all")[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                  style={filterType === t ? { background: "var(--sky)", color: "white" } : { background: "var(--sky-soft)", color: "var(--sky)" }}
                >
                  {t === "all" ? "All types" : t === "internship" ? "🌱 Internship" : "💼 Full-time"}
                </button>
              ))}
              <span style={{ color: "var(--border)" }}>·</span>
              {(["all", "high", "medium", "low"] as (Priority | "all")[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                  style={filterPriority === p ? { background: "var(--lavender)", color: "white" } : { background: "var(--lavender-soft)", color: "var(--lavender-deep)" }}
                >
                  {p === "all" ? "All priorities" : p === "high" ? "🔥 High" : p === "medium" ? "⚡ Medium" : "🌿 Low"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          {filtered.length} application{filtered.length !== 1 ? "s" : ""}
          {search || filterStatus !== "all" || filterType !== "all" || filterPriority !== "all" ? " (filtered)" : ""}
        </p>

        {/* View */}
        {view === "list" ? (
          <ListView apps={filtered} onEdit={openEdit} onDelete={handleDelete} />
        ) : (
          <KanbanBoard apps={filtered} onEdit={openEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        )}

        {/* Footer quote */}
        <div className="text-center mt-10 py-4">
          <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;Every application is one step closer to your dream role. Keep going! 🌸&rdquo;
          </p>
          <p className="text-base mt-1">✦ 🚀 ✦</p>
        </div>
      </main>

      {showForm && (
        <ApplicationForm
          initial={editTarget}
          onClose={closeForm}
          onSave={editTarget ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
}
