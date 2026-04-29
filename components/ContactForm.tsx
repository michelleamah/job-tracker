"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Contact, RelationshipStatus, Application } from "@/lib/types";
import { format } from "date-fns";

type FormData = Omit<Contact, "id" | "createdAt" | "lastUpdated">;

interface ContactFormProps {
  initial?: Contact | null;
  apps: Application[];
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const EMPTY: FormData = {
  name: "",
  linkedinUrl: "",
  company: "",
  role: "",
  howMet: "",
  firstContactDate: "",
  lastContactDate: "",
  discussion: "",
  adviceOrOffer: "",
  followUpCommitment: "",
  followUpDueDate: "",
  relationshipStatus: "warm",
  notes: "",
  linkedApplicationId: "",
};

function fromContact(c: Contact): FormData {
  return {
    name: c.name,
    linkedinUrl: c.linkedinUrl,
    company: c.company,
    role: c.role,
    howMet: c.howMet,
    firstContactDate: c.firstContactDate,
    lastContactDate: c.lastContactDate,
    discussion: c.discussion,
    adviceOrOffer: c.adviceOrOffer,
    followUpCommitment: c.followUpCommitment,
    followUpDueDate: c.followUpDueDate,
    relationshipStatus: c.relationshipStatus,
    notes: c.notes,
    linkedApplicationId: c.linkedApplicationId,
  };
}

export default function ContactForm({ initial, apps, onClose, onSave }: ContactFormProps) {
  const [form, setForm] = useState<FormData>(initial ? fromContact(initial) : { ...EMPTY });
  const [error, setError] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    setForm(initial ? fromContact(initial) : { ...EMPTY });
  }, [initial]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required 🌸"); return; }
    if (!form.company.trim()) { setError("Company is required ✨"); return; }
    setError("");
    onSave(form);
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
      {children}
    </label>
  );

  const Section = ({ title }: { title: string }) => (
    <div className="pt-2 pb-1">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--lavender-deep)" }}>
        {title}
      </p>
      <div className="mt-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );

  // Unique companies from apps for the linked application dropdown
  const appOptions = apps.map((a) => ({ id: a.id, label: `${a.company} — ${a.role}` }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{initial ? "✏️" : "🤝"}</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              {initial ? "Edit Contact" : "New Contact"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic Info */}
          <Section title="Contact Info" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name *</Label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="input-field"
                placeholder="e.g. Alex Chen"
                autoFocus
              />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                className="input-field"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <Label>Company *</Label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="input-field"
                placeholder="e.g. Google"
              />
            </div>
            <div>
              <Label>Their Role</Label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="input-field"
                placeholder="e.g. Solutions Engineer"
              />
            </div>
            <div>
              <Label>How We Met</Label>
              <input
                type="text"
                value={form.howMet}
                onChange={(e) => set("howMet", e.target.value)}
                className="input-field"
                placeholder="e.g. LinkedIn cold outreach"
              />
            </div>
          </div>

          {/* Relationship */}
          <Section title="Relationship" />
          <div>
            <Label>Relationship Status</Label>
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "var(--bg-base)" }}>
              {(["active", "warm", "cold"] as RelationshipStatus[]).map((r) => {
                const map = {
                  active: { emoji: "🔥", label: "Active" },
                  warm:   { emoji: "☀️", label: "Warm" },
                  cold:   { emoji: "🧊", label: "Cold" },
                };
                const cfg = map[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set("relationshipStatus", r)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={
                      form.relationshipStatus === r
                        ? { background: "var(--bg-card)", color: "var(--text-heading)", boxShadow: "0 1px 6px var(--shadow)" }
                        : { color: "var(--text-muted)" }
                    }
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Contact Date</Label>
              <input
                type="date"
                value={form.firstContactDate}
                max={today}
                onChange={(e) => set("firstContactDate", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <Label>Last Contact Date</Label>
              <input
                type="date"
                value={form.lastContactDate}
                max={today}
                onChange={(e) => set("lastContactDate", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Discussion */}
          <Section title="Conversation" />
          <div>
            <Label>What We Discussed</Label>
            <textarea
              value={form.discussion}
              onChange={(e) => set("discussion", e.target.value)}
              className="input-field"
              rows={2}
              placeholder="Topics covered, what I learned…"
              style={{ resize: "vertical" }}
            />
          </div>
          <div>
            <Label>Advice or Offer</Label>
            <textarea
              value={form.adviceOrOffer}
              onChange={(e) => set("adviceOrOffer", e.target.value)}
              className="input-field"
              rows={2}
              placeholder="Any advice given, referral offer, etc."
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Follow-up */}
          <Section title="Follow-up" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Follow-up Commitment</Label>
              <input
                type="text"
                value={form.followUpCommitment}
                onChange={(e) => set("followUpCommitment", e.target.value)}
                className="input-field"
                placeholder="e.g. Send thank you note, share update"
              />
            </div>
            <div>
              <Label>Follow-up Due Date</Label>
              <input
                type="date"
                value={form.followUpDueDate}
                onChange={(e) => set("followUpDueDate", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <Label>Linked Application</Label>
              <select
                value={form.linkedApplicationId}
                onChange={(e) => set("linkedApplicationId", e.target.value)}
                className="input-field"
              >
                <option value="">— None —</option>
                {appOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <Section title="Notes" />
          <div>
            <Label>Additional Notes</Label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="input-field"
              rows={2}
              placeholder="Anything else to remember about this contact ✨"
              style={{ resize: "vertical" }}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--pink)" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {initial ? "Save Changes ✨" : "Add Contact 🤝"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
