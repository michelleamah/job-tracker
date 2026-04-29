"use client";

import { useState, useMemo } from "react";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { WeeklyLog as WeeklyLogType, WEEKLY_TARGETS } from "@/lib/types";
import {
  loadWeeklyLogs,
  addWeeklyLog,
  updateWeeklyLog,
  deleteWeeklyLog,
} from "@/lib/store";
import { format, startOfWeek, parseISO } from "date-fns";

function getMondayStr(d: Date = new Date()): string {
  const monday = startOfWeek(d, { weekStartsOn: 1 });
  return format(monday, "yyyy-MM-dd");
}

const METRICS: { key: keyof typeof WEEKLY_TARGETS; label: string; emoji: string }[] = [
  { key: "coldOutreach",           label: "Cold Outreach",          emoji: "📬" },
  { key: "coffeeChats",            label: "Coffee Chats",           emoji: "☕" },
  { key: "applicationsSubmitted",  label: "Applications Submitted", emoji: "📋" },
  { key: "eventsAttended",         label: "Events Attended",        emoji: "🎪" },
  { key: "mockInterviews",         label: "Mock Interviews",        emoji: "🎤" },
  { key: "skillBuildingHours",     label: "Skill Building (hrs)",   emoji: "📚" },
];

type FormData = Omit<WeeklyLogType, "id" | "createdAt">;

const EMPTY_FORM: FormData = {
  weekOf: getMondayStr(),
  coldOutreach: 0,
  coffeeChats: 0,
  applicationsSubmitted: 0,
  eventsAttended: 0,
  mockInterviews: 0,
  skillBuildingHours: 0,
  notes: "",
};

function fromLog(log: WeeklyLogType): FormData {
  return {
    weekOf: log.weekOf,
    coldOutreach: log.coldOutreach,
    coffeeChats: log.coffeeChats,
    applicationsSubmitted: log.applicationsSubmitted,
    eventsAttended: log.eventsAttended,
    mockInterviews: log.mockInterviews,
    skillBuildingHours: log.skillBuildingHours,
    notes: log.notes,
  };
}

export default function WeeklyLog() {
  const [logs, setLogs] = useState<WeeklyLogType[]>(() => loadWeeklyLogs());
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<WeeklyLogType | null>(null);

  const currentWeek = getMondayStr();
  const currentLog = logs.find((l) => l.weekOf === currentWeek);
  const pastLogs = logs
    .filter((l) => l.weekOf !== currentWeek)
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf));

  const handleAdd = (data: FormData) => {
    const newLog = addWeeklyLog(data);
    setLogs((prev) => [newLog, ...prev]);
    setShowForm(false);
  };

  const handleEdit = (data: FormData) => {
    if (!editTarget) return;
    const updated = updateWeeklyLog(editTarget.id, data);
    setLogs((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditTarget(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteWeeklyLog(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const openAdd = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const openEdit = (log: WeeklyLogType) => {
    setEditTarget(log);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Current Week */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold" style={{ color: "var(--text-heading)" }}>
            📅 This Week ({format(parseISO(currentWeek), "MMM d")})
          </h3>
          {currentLog ? (
            <button
              onClick={() => openEdit(currentLog)}
              className="btn-ghost flex items-center gap-1.5"
              style={{ padding: "0.4rem 0.9rem" }}
            >
              <Edit2 size={13} /> Edit
            </button>
          ) : (
            <button
              onClick={openAdd}
              className="btn-primary flex items-center gap-1.5"
            >
              <Plus size={15} /> Log This Week
            </button>
          )}
        </div>

        {currentLog ? (
          <WeekLogCard log={currentLog} onEdit={() => openEdit(currentLog)} onDelete={handleDelete} />
        ) : (
          <div
            className="card-static p-8 text-center cursor-pointer"
            onClick={openAdd}
            style={{ border: "2px dashed var(--border)" }}
          >
            <div className="text-3xl mb-2">📅</div>
            <p style={{ color: "var(--text-muted)" }}>No log for this week yet.</p>
            <p className="text-sm mt-1" style={{ color: "var(--lavender-deep)" }}>Click to log your activity ✨</p>
          </div>
        )}
      </div>

      {/* Past Weeks */}
      {pastLogs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: "var(--text-heading)" }}>
              Past Weeks
            </h3>
            <button onClick={openAdd} className="btn-ghost flex items-center gap-1.5" style={{ padding: "0.4rem 0.9rem" }}>
              <Plus size={13} /> Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {pastLogs.map((log) => (
              <WeekLogCard
                key={log.id}
                log={log}
                onEdit={() => openEdit(log)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📅</div>
          <p style={{ color: "var(--text-muted)" }}>No weekly logs yet. Start tracking your progress!</p>
          <button onClick={openAdd} className="btn-primary mt-4 flex items-center gap-1.5 mx-auto">
            <Plus size={15} /> Log This Week
          </button>
        </div>
      )}

      {showForm && (
        <WeeklyLogForm
          initial={editTarget}
          onClose={closeForm}
          onSave={editTarget ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
}

// ── Week Log Card ─────────────────────────────────────────────────────────────

function WeekLogCard({
  log,
  onEdit,
  onDelete,
}: {
  log: WeeklyLogType;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Overall score
  const totalPct = useMemo(() => {
    const scores = METRICS.map(({ key }) => {
      const val = log[key] as number;
      const target = WEEKLY_TARGETS[key];
      return Math.min(val / target, 1);
    });
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
  }, [log]);

  const weekLabel = useMemo(() => {
    try {
      const monday = parseISO(log.weekOf);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      return `${format(monday, "MMM d")} – ${format(sunday, "MMM d, yyyy")}`;
    } catch {
      return log.weekOf;
    }
  }, [log.weekOf]);

  function barColor(val: number, target: number): string {
    const pct = val / target;
    if (pct >= 1) return "#86c9a8";     // green
    if (pct >= 0.5) return "#f9dfa0";   // yellow
    return "#f9a8c9";                    // red/pink
  }

  return (
    <div className="card-static p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-bold text-sm" style={{ color: "var(--text-heading)" }}>
            Week of {weekLabel}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="progress-bar-track" style={{ width: "80px" }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${totalPct}%`, background: barColor(totalPct, 100) }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
              {totalPct}% of targets
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onEdit}
            className="btn-ghost flex items-center gap-1"
            style={{ padding: "0.35rem 0.7rem", fontSize: "0.78rem" }}
          >
            <Edit2 size={12} /> Edit
          </button>
          <button
            onClick={() => {
              if (!confirmDelete) { setConfirmDelete(true); return; }
              onDelete(log.id);
            }}
            className={confirmDelete ? "btn-danger flex items-center gap-1" : "btn-ghost flex items-center gap-1"}
            style={{ padding: "0.35rem 0.7rem", fontSize: "0.78rem" }}
          >
            <Trash2 size={12} /> {confirmDelete ? "Sure?" : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {METRICS.map(({ key, label, emoji }) => {
          const val = log[key] as number;
          const target = WEEKLY_TARGETS[key];
          const pct = Math.min((val / target) * 100, 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {emoji} {label}
                </span>
                <span className="text-xs font-bold" style={{ color: val >= target ? "#4a9a7a" : "var(--text-body)" }}>
                  {val}/{target}
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, background: barColor(val, target) }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {log.notes && (
        <p className="text-xs mt-3 italic" style={{ color: "var(--text-muted)" }}>
          💬 {log.notes}
        </p>
      )}
    </div>
  );
}

// ── Weekly Log Form ───────────────────────────────────────────────────────────

function WeeklyLogForm({
  initial,
  onClose,
  onSave,
}: {
  initial?: WeeklyLogType | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>(
    initial ? fromLog(initial) : { ...EMPTY_FORM }
  );

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              {initial ? "Edit Weekly Log" : "Log This Week"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
              Week Of (Monday)
            </label>
            <input
              type="date"
              value={form.weekOf}
              onChange={(e) => set("weekOf", e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {METRICS.map(({ key, label, emoji }) => (
              <div key={key}>
                <label className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  {emoji} {label}
                  <span style={{ color: "var(--lavender)" }}>/ {WEEKLY_TARGETS[key]}</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form[key] as number}
                  onChange={(e) => set(key, Number(e.target.value))}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Highlights, challenges, focus for next week… ✨"
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {initial ? "Save Changes ✨" : "Log Week 📅"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
