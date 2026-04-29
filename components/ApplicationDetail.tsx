"use client";

import { useState } from "react";
import { X, Edit2, Trash2, ExternalLink, Plus } from "lucide-react";
import {
  Application,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  CATEGORY_CONFIG,
  TIER_CONFIG,
} from "@/lib/types";
import { formatDate, formatDateShort } from "@/lib/utils";
import { addInterviewNote } from "@/lib/store";
import { format } from "date-fns";

interface ApplicationDetailProps {
  app: Application;
  onClose: () => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onUpdate: (app: Application) => void;
}

type DetailTab = "notes" | "history";

export default function ApplicationDetail({
  app,
  onClose,
  onEdit,
  onDelete,
  onUpdate,
}: ApplicationDetailProps) {
  const [detailTab, setDetailTab] = useState<DetailTab>("notes");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteRound, setNoteRound] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusCfg = STATUS_CONFIG[app.status];
  const priCfg = PRIORITY_CONFIG[app.priority];
  const catCfg = CATEGORY_CONFIG[app.category];
  const tierCfg = TIER_CONFIG[app.tier];

  const handleAddNote = () => {
    if (!noteRound.trim() || !noteContent.trim()) return;
    const updated = addInterviewNote(app.id, { round: noteRound, content: noteContent });
    onUpdate(updated);
    setNoteRound("");
    setNoteContent("");
    setShowNoteForm(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(app.id);
    onClose();
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: value ? "var(--text-body)" : "var(--text-muted)" }}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box-lg">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-start justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: "var(--text-heading)" }}>
                {app.company}
              </h2>
              <span
                className="badge"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.emoji} {statusCfg.label}
              </span>
              <span className="badge" style={{ background: "var(--sky-soft)", color: "var(--sky)" }}>
                {app.type === "internship" ? "🌱 Intern" : "💼 Full-time"}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{app.role}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(app)}
              className="btn-ghost flex items-center gap-1.5"
              style={{ padding: "0.4rem 0.8rem" }}
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className={confirmDelete ? "btn-danger flex items-center gap-1.5" : "btn-ghost flex items-center gap-1.5"}
              style={{ padding: "0.4rem 0.8rem" }}
            >
              <Trash2 size={13} /> {confirmDelete ? "Confirm?" : "Delete"}
            </button>
            <button onClick={onClose} style={{ color: "var(--text-muted)" }} className="ml-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Badges row */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Category / Tier / Priority
              </span>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span className="badge" style={{ background: "var(--lavender-soft)", color: "var(--lavender-deep)" }}>
                  {catCfg.emoji} {catCfg.label}
                </span>
                <span className="badge" style={{ background: "var(--yellow-soft)", color: "#a08010" }}>
                  {tierCfg.emoji} {tierCfg.label}
                </span>
                <span className="badge" style={{ background: priCfg.color + "22", color: "var(--text-body)", border: `1px solid ${priCfg.color}` }}>
                  {priCfg.emoji} {priCfg.label}
                </span>
              </div>
            </div>

            <InfoRow label="Location" value={app.location} />
            <InfoRow label="Compensation" value={app.compensation} />
            <InfoRow label="Date Posted" value={app.datePosted ? formatDate(app.datePosted) : undefined} />
            <InfoRow label="Date Applied" value={app.dateApplied ? formatDate(app.dateApplied) : undefined} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Referral
              </span>
              <span className="text-sm" style={{ color: "var(--text-body)" }}>
                {app.referral === "yes" ? "✅ Yes" : app.referral === "pending" ? "⏳ Pending" : "❌ No"}
                {app.referralContact && (
                  <span className="ml-1" style={{ color: "var(--text-muted)" }}>
                    — {app.referralContact}
                  </span>
                )}
              </span>
            </div>
            <InfoRow label="Recruiter" value={app.recruiterName} />
            <InfoRow label="Recruiter Contact" value={app.recruiterContact} />
            {app.url && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Job URL
                </span>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1"
                  style={{ color: "var(--lavender-deep)" }}
                >
                  <ExternalLink size={12} /> Open link
                </a>
              </div>
            )}
            {app.nextAction && (
              <div className="flex flex-col gap-0.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Next Action
                </span>
                <span className="text-sm" style={{ color: "var(--text-body)" }}>
                  {app.nextAction}
                  {app.nextActionDue && (
                    <span className="ml-2 overdue-badge" style={{ display: "inline-flex" }}>
                      Due {formatDateShort(app.nextActionDue)}
                    </span>
                  )}
                </span>
              </div>
            )}
            {app.notes && (
              <div className="flex flex-col gap-0.5 md:col-span-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Notes
                </span>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-body)" }}>
                  {app.notes}
                </p>
              </div>
            )}
            {app.outcome && (
              <div className="flex flex-col gap-0.5 md:col-span-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Outcome
                </span>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{app.outcome}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom tabs */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex gap-0 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            {(["notes", "history"] as DetailTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={`tab-nav-item${detailTab === t ? " active" : ""}`}
                style={{ fontSize: "0.82rem" }}
              >
                {t === "notes" ? "📝 Interview Notes" : "🕐 Status History"}
              </button>
            ))}
          </div>

          {detailTab === "notes" && (
            <div className="space-y-3">
              {(app.interviewNotes ?? []).length === 0 && !showNoteForm && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No interview notes yet.
                </p>
              )}
              {(app.interviewNotes ?? []).map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl"
                  style={{ background: "var(--lavender-soft)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: "var(--lavender-deep)" }}>
                      {note.round}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {format(new Date(note.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-body)" }}>
                    {note.content}
                  </p>
                </div>
              ))}

              {showNoteForm && (
                <div
                  className="p-4 rounded-xl space-y-3 fade-in"
                  style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}
                >
                  <input
                    type="text"
                    value={noteRound}
                    onChange={(e) => setNoteRound(e.target.value)}
                    placeholder="Round (e.g. Phone Screen, Technical, Onsite)"
                    className="input-field"
                    autoFocus
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Notes from this round…"
                    className="input-field"
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowNoteForm(false)} className="btn-ghost text-xs" style={{ padding: "0.4rem 0.9rem" }}>
                      Cancel
                    </button>
                    <button onClick={handleAddNote} className="btn-primary text-xs" style={{ padding: "0.4rem 0.9rem" }}>
                      Save Note ✨
                    </button>
                  </div>
                </div>
              )}

              {!showNoteForm && (
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="btn-ghost flex items-center gap-1.5 text-xs"
                  style={{ padding: "0.4rem 0.9rem" }}
                >
                  <Plus size={12} /> Add Note
                </button>
              )}
            </div>
          )}

          {detailTab === "history" && (
            <div className="space-y-1">
              {(app.statusHistory ?? []).length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No status history recorded.</p>
              )}
              <div className="relative pl-6">
                {(app.statusHistory ?? []).map((entry, i) => {
                  const cfg = STATUS_CONFIG[entry.status];
                  const isLast = i === (app.statusHistory ?? []).length - 1;
                  return (
                    <div key={i} className="relative pb-4">
                      {!isLast && <div className="timeline-line" />}
                      <div className="flex items-start gap-3">
                        <div
                          className="timeline-dot"
                          style={{ background: cfg.color, position: "absolute", left: -8, top: 2 }}
                        />
                        <div className="ml-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="badge"
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              {cfg.emoji} {cfg.label}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {formatDate(entry.date)}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
