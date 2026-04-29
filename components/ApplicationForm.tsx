"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
import { format } from "date-fns";

type FormData = Omit<Application, "id" | "createdAt" | "lastUpdated" | "interviewNotes" | "statusHistory">;

interface ApplicationFormProps {
  initial?: Application | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const EMPTY: FormData = {
  company: "",
  role: "",
  category: "se",
  tier: "tier2",
  type: "internship",
  status: "watching",
  priority: "medium",
  location: "",
  url: "",
  compensation: "",
  notes: "",
  datePosted: "",
  dateApplied: "",
  referral: "no",
  referralContact: "",
  recruiterName: "",
  recruiterContact: "",
  nextAction: "",
  nextActionDue: "",
  outcome: "",
};

function fromApp(app: Application): FormData {
  return {
    company: app.company,
    role: app.role,
    category: app.category,
    tier: app.tier,
    type: app.type,
    status: app.status,
    priority: app.priority,
    location: app.location,
    url: app.url,
    compensation: app.compensation,
    notes: app.notes,
    datePosted: app.datePosted,
    dateApplied: app.dateApplied,
    referral: app.referral,
    referralContact: app.referralContact,
    recruiterName: app.recruiterName,
    recruiterContact: app.recruiterContact,
    nextAction: app.nextAction,
    nextActionDue: app.nextActionDue,
    outcome: app.outcome,
  };
}

export default function ApplicationForm({ initial, onClose, onSave }: ApplicationFormProps) {
  const [form, setForm] = useState<FormData>(initial ? fromApp(initial) : { ...EMPTY });
  const [error, setError] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    setForm(initial ? fromApp(initial) : { ...EMPTY });
  }, [initial]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) { setError("Company name is required 🌸"); return; }
    if (!form.role.trim()) { setError("Role is required ✨"); return; }
    setError("");
    onSave(form);
  };

  const Section = ({ title }: { title: string }) => (
    <div className="pt-2 pb-1">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--lavender-deep)" }}>
        {title}
      </p>
      <div className="mt-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
      {children}
    </label>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box-lg p-6">
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
          {/* ── Section 1: Basic Info ── */}
          <Section title="1 · Basic Info" />

          {/* Type toggle */}
          <div className="flex rounded-xl p-1 gap-1" style={{ background: "var(--bg-base)" }}>
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
              <Label>Company *</Label>
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
              <Label>Role *</Label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="input-field"
                placeholder="e.g. Solutions Engineer"
              />
            </div>
          </div>

          {/* Category + Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as RoleCategory)}
                className="input-field"
              >
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tier</Label>
              <select
                value={form.tier}
                onChange={(e) => set("tier", e.target.value as Tier)}
                className="input-field"
              >
                {Object.entries(TIER_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority — 5-level */}
          <div>
            <Label>Priority</Label>
            <div className="flex gap-1.5">
              {(["high", "med_high", "medium", "med_low", "low"] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set("priority", p)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={
                    form.priority === p
                      ? {
                          background: PRIORITY_CONFIG[p].color + "33",
                          borderColor: PRIORITY_CONFIG[p].color,
                          color: "var(--text-body)",
                        }
                      : {
                          background: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-muted)",
                        }
                  }
                  title={PRIORITY_CONFIG[p].label}
                >
                  {PRIORITY_CONFIG[p].emoji}
                  <span className="hidden sm:inline ml-1">{PRIORITY_CONFIG[p].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Section 2: Status & Tracking ── */}
          <Section title="2 · Status & Tracking" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
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
              <Label>Date Posted</Label>
              <input
                type="date"
                value={form.datePosted}
                onChange={(e) => set("datePosted", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <Label>Date Applied</Label>
              <input
                type="date"
                value={form.dateApplied}
                max={today}
                onChange={(e) => set("dateApplied", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Referral toggle */}
          <div>
            <Label>Referral</Label>
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "var(--bg-base)" }}>
              {(["yes", "no", "pending"] as Referral[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("referral", r)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={
                    form.referral === r
                      ? { background: "var(--bg-card)", color: "var(--text-heading)", boxShadow: "0 1px 6px var(--shadow)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {r === "yes" ? "✅ Yes" : r === "no" ? "❌ No" : "⏳ Pending"}
                </button>
              ))}
            </div>
          </div>

          {(form.referral === "yes" || form.referral === "pending") && (
            <div>
              <Label>Referral Contact</Label>
              <input
                type="text"
                value={form.referralContact}
                onChange={(e) => set("referralContact", e.target.value)}
                className="input-field"
                placeholder="e.g. Alex Chen (LinkedIn)"
              />
            </div>
          )}

          {/* ── Section 3: Next Action ── */}
          <Section title="3 · Next Action" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Next Action</Label>
              <input
                type="text"
                value={form.nextAction}
                onChange={(e) => set("nextAction", e.target.value)}
                className="input-field"
                placeholder="e.g. Send follow-up email"
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <input
                type="date"
                value={form.nextActionDue}
                onChange={(e) => set("nextActionDue", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* ── Section 4: Contact & Compensation ── */}
          <Section title="4 · Contact & Compensation" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Recruiter Name</Label>
              <input
                type="text"
                value={form.recruiterName}
                onChange={(e) => set("recruiterName", e.target.value)}
                className="input-field"
                placeholder="e.g. Sarah Kim"
              />
            </div>
            <div>
              <Label>Recruiter Contact</Label>
              <input
                type="text"
                value={form.recruiterContact}
                onChange={(e) => set("recruiterContact", e.target.value)}
                className="input-field"
                placeholder="e.g. email or LinkedIn"
              />
            </div>
            <div>
              <Label>Job URL</Label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Compensation</Label>
              <input
                type="text"
                value={form.compensation}
                onChange={(e) => set("compensation", e.target.value)}
                className="input-field"
                placeholder="e.g. $60/hr or $120k"
              />
            </div>
          </div>

          {/* ── Section 5: Notes ── */}
          <Section title="5 · Notes" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Location</Label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="input-field"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div>
              <Label>Outcome</Label>
              <input
                type="text"
                value={form.outcome}
                onChange={(e) => set("outcome", e.target.value)}
                className="input-field"
                placeholder="e.g. Auto-rejected"
              />
            </div>
          </div>

          <div>
            <Label>General Notes</Label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Referral details, next steps, anything to remember ✨"
              style={{ resize: "vertical" }}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--pink)" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {initial ? "Save Changes ✨" : "Add Application 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
