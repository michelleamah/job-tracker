"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Application, AppStatus, AppType, Priority, STATUS_CONFIG, PRIORITY_CONFIG, ROLE_SUGGESTIONS } from "@/lib/types";
import { format } from "date-fns";

interface ApplicationFormProps {
  initial?: Application | null;
  onClose: () => void;
  onSave: (data: Omit<Application, "id" | "createdAt" | "lastUpdated">) => void;
}

const EMPTY: Omit<Application, "id" | "createdAt" | "lastUpdated"> = {
  company: "",
  role: "",
  type: "internship",
  status: "wishlist",
  priority: "medium",
  location: "",
  url: "",
  salary: "",
  notes: "",
  appliedDate: "",
  deadline: "",
};

export default function ApplicationForm({ initial, onClose, onSave }: ApplicationFormProps) {
  const [form, setForm] = useState(initial ? {
    company: initial.company,
    role: initial.role,
    type: initial.type,
    status: initial.status,
    priority: initial.priority,
    location: initial.location,
    url: initial.url,
    salary: initial.salary,
    notes: initial.notes,
    appliedDate: initial.appliedDate,
    deadline: initial.deadline,
  } : { ...EMPTY });
  const [error, setError] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company,
        role: initial.role,
        type: initial.type,
        status: initial.status,
        priority: initial.priority,
        location: initial.location,
        url: initial.url,
        salary: initial.salary,
        notes: initial.notes,
        appliedDate: initial.appliedDate,
        deadline: initial.deadline,
      });
    }
  }, [initial]);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) { setError("Company name is required 🌸"); return; }
    if (!form.role.trim()) { setError("Role is required ✨"); return; }
    setError("");
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{initial ? "✏️" : "🚀"}</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              {initial ? "Edit Application" : "New Application"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type toggle */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "var(--bg-base)" }}
          >
            {(["internship", "fulltime"] as AppType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  form.type === t
                    ? { background: "var(--bg-card)", color: "var(--text-heading)", boxShadow: "0 1px 6px var(--shadow)" }
                    : { color: "var(--text-muted)" }
                }
              >
                {t === "internship" ? "🌱 Internship" : "💼 Full-time"}
              </button>
            ))}
          </div>

          {/* Company + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Company *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="input-field"
                placeholder="e.g. Google"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Role *
              </label>
              <input
                type="text"
                list="role-suggestions"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="input-field"
                placeholder="e.g. Solutions Engineer"
              />
              <datalist id="role-suggestions">
                {ROLE_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
              </datalist>
            </div>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as AppStatus)}
                className="input-field"
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Priority
              </label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("priority", p)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                    style={
                      form.priority === p
                        ? { background: PRIORITY_CONFIG[p].color + "22", borderColor: PRIORITY_CONFIG[p].color, color: "var(--text-body)" }
                        : { background: "var(--bg-base)", borderColor: "var(--border)", color: "var(--text-muted)" }
                    }
                  >
                    {PRIORITY_CONFIG[p].emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location + Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="input-field"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Salary / Comp
              </label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                className="input-field"
                placeholder="e.g. $60/hr"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Applied Date
              </label>
              <input
                type="date"
                value={form.appliedDate}
                max={today}
                onChange={(e) => set("appliedDate", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
              Job URL
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Referral? Next steps? Anything to remember ✨"
              style={{ resize: "vertical" }}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--pink)" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {initial ? "Save Changes ✨" : "Add Application 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
