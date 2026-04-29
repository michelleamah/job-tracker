"use client";

import { useState, useMemo } from "react";
import { Plus, X, Edit2, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { Contact, Application } from "@/lib/types";
import {
  loadContacts,
  addContact,
  updateContact,
  deleteContact,
} from "@/lib/store";
import { formatDateShort, formatDate, isOverdue, getOverdueContacts } from "@/lib/utils";
import ContactForm from "./ContactForm";

interface NetworkingTabProps {
  apps: Application[];
}

export default function NetworkingTab({ apps }: NetworkingTabProps) {
  const [contacts, setContacts] = useState<Contact[]>(() => loadContacts());
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [viewTarget, setViewTarget] = useState<Contact | null>(null);

  const overdueContacts = useMemo(() => getOverdueContacts(contacts), [contacts]);
  const activeContacts = contacts.filter((c) => c.relationshipStatus === "active").length;

  const handleAdd = (data: Omit<Contact, "id" | "createdAt" | "lastUpdated">) => {
    const newContact = addContact(data);
    setContacts((prev) => [newContact, ...prev]);
    setShowForm(false);
  };

  const handleEdit = (data: Omit<Contact, "id" | "createdAt" | "lastUpdated">) => {
    if (!editTarget) return;
    const updated = updateContact(editTarget.id, data);
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditTarget(null);
    setShowForm(false);
    setViewTarget(updated);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setViewTarget(null);
  };

  const openEdit = (contact: Contact) => {
    setEditTarget(contact);
    setViewTarget(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const relBadge = (rel: Contact["relationshipStatus"]) => {
    const map = {
      active: { label: "Active 🔥", color: "var(--mint)", bg: "var(--mint-soft)" },
      warm:   { label: "Warm ☀️",   color: "var(--peach)", bg: "var(--peach-soft)" },
      cold:   { label: "Cold 🧊",   color: "var(--sky)",   bg: "var(--sky-soft)" },
    };
    const cfg = map[rel];
    return (
      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-static p-4 text-center">
          <div className="text-2xl mb-1">🤝</div>
          <div className="text-2xl font-bold" style={{ color: "var(--lavender-deep)" }}>{contacts.length}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Total Contacts</div>
        </div>
        <div className="card-static p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold" style={{ color: "var(--mint)" }}>{activeContacts}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Active</div>
        </div>
        <div className="card-static p-4 text-center">
          <div className="text-2xl mb-1">⚠️</div>
          <div className="text-2xl font-bold" style={{ color: "#c04040" }}>{overdueContacts.length}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Overdue Follow-ups</div>
        </div>
      </div>

      {/* Overdue follow-ups */}
      {overdueContacts.length > 0 && (
        <div className="alert-card-red">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} style={{ color: "#c04040" }} />
            <span className="text-sm font-bold" style={{ color: "#c04040" }}>
              ⚠️ Overdue Follow-ups ({overdueContacts.length})
            </span>
          </div>
          <div className="space-y-1.5">
            {overdueContacts.map((c) => (
              <div
                key={c.id}
                onClick={() => setViewTarget(c)}
                className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:brightness-95"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{c.name}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.company}</span>
                </div>
                <span className="overdue-badge">Due {formatDateShort(c.followUpDueDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ color: "var(--text-heading)" }}>
          All Contacts ({contacts.length})
        </h3>
        <button onClick={() => { setEditTarget(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Contact
        </button>
      </div>

      {/* Contact cards */}
      {contacts.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
          <div className="text-4xl mb-3">🤝</div>
          <p>No contacts yet. Add your first networking contact!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {contacts.map((contact) => {
          const overdue = contact.followUpDueDate && isOverdue(contact.followUpDueDate);
          return (
            <div
              key={contact.id}
              className="card p-4 cursor-pointer"
              onClick={() => setViewTarget(contact)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold" style={{ color: "var(--text-heading)" }}>{contact.name}</span>
                    {relBadge(contact.relationshipStatus)}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {contact.role} @ {contact.company}
                  </p>
                </div>
                {contact.linkedinUrl && (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "var(--sky)" }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between text-xs mt-3">
                <span style={{ color: "var(--text-muted)" }}>
                  Last contact: {contact.lastContactDate ? formatDateShort(contact.lastContactDate) : "—"}
                </span>
                {contact.followUpDueDate && (
                  overdue ? (
                    <span className="overdue-badge">
                      <AlertCircle size={10} /> Due {formatDateShort(contact.followUpDueDate)}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>
                      Follow up: {formatDateShort(contact.followUpDueDate)}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {viewTarget && (
        <ContactDetailModal
          contact={viewTarget}
          apps={apps}
          onClose={() => setViewTarget(null)}
          onEdit={() => openEdit(viewTarget)}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit form */}
      {showForm && (
        <ContactForm
          initial={editTarget}
          apps={apps}
          onClose={closeForm}
          onSave={editTarget ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
}

// ── Contact Detail Modal ──────────────────────────────────────────────────────

function ContactDetailModal({
  contact,
  apps,
  onClose,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  apps: Application[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const linkedApp = apps.find((a) => a.id === contact.linkedApplicationId);

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

  const relMap = {
    active: { label: "Active 🔥", color: "var(--mint)", bg: "var(--mint-soft)" },
    warm:   { label: "Warm ☀️",   color: "var(--peach)", bg: "var(--peach-soft)" },
    cold:   { label: "Cold 🧊",   color: "var(--sky)",   bg: "var(--sky-soft)" },
  };
  const relCfg = relMap[contact.relationshipStatus];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box-lg">
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-bold" style={{ color: "var(--text-heading)" }}>{contact.name}</h2>
              <span className="badge" style={{ background: relCfg.bg, color: relCfg.color }}>{relCfg.label}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {contact.role} @ {contact.company}
            </p>
            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 mt-1"
                style={{ color: "var(--sky)" }}
              >
                <ExternalLink size={11} /> LinkedIn
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button onClick={onEdit} className="btn-ghost flex items-center gap-1.5" style={{ padding: "0.4rem 0.8rem" }}>
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={() => {
                if (!confirmDelete) { setConfirmDelete(true); return; }
                onDelete(contact.id);
              }}
              className={confirmDelete ? "btn-danger flex items-center gap-1.5" : "btn-ghost flex items-center gap-1.5"}
              style={{ padding: "0.4rem 0.8rem" }}
            >
              <Trash2 size={13} /> {confirmDelete ? "Confirm?" : "Delete"}
            </button>
            <button onClick={onClose} style={{ color: "var(--text-muted)" }} className="ml-1"><X size={18} /></button>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoRow label="How Met" value={contact.howMet} />
          <InfoRow label="First Contact" value={contact.firstContactDate ? formatDate(contact.firstContactDate) : undefined} />
          <InfoRow label="Last Contact" value={contact.lastContactDate ? formatDate(contact.lastContactDate) : undefined} />

          {contact.discussion && (
            <div className="col-span-2 md:col-span-3 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>What We Discussed</span>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-body)" }}>{contact.discussion}</p>
            </div>
          )}

          {contact.adviceOrOffer && (
            <div className="col-span-2 md:col-span-3 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Advice / Offer</span>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-body)" }}>{contact.adviceOrOffer}</p>
            </div>
          )}

          {contact.followUpCommitment && (
            <div className="col-span-2 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Follow-up Commitment</span>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>
                {contact.followUpCommitment}
                {contact.followUpDueDate && (
                  <span className="ml-2" style={{ color: isOverdue(contact.followUpDueDate) ? "#c04040" : "var(--text-muted)" }}>
                    — Due {formatDate(contact.followUpDueDate)}
                  </span>
                )}
              </p>
            </div>
          )}

          {linkedApp && (
            <div className="col-span-2 md:col-span-3 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Linked Application</span>
              <span className="text-sm" style={{ color: "var(--text-body)" }}>
                {linkedApp.company} — {linkedApp.role}
              </span>
            </div>
          )}

          {contact.notes && (
            <div className="col-span-2 md:col-span-3 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Notes</span>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-body)" }}>{contact.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
