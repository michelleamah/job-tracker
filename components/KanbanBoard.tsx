"use client";

import { Application, AppStatus, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { MapPin, ExternalLink, Trash2, Edit2 } from "lucide-react";

const COLUMNS: AppStatus[] = [
  "wishlist", "applying", "applied", "phone_screen", "interview", "final_round", "offer", "rejected",
];

interface KanbanBoardProps {
  apps: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppStatus) => void;
}

export default function KanbanBoard({ apps, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
      {COLUMNS.map((col) => {
        const colApps = apps.filter((a) => a.status === col);
        const cfg = STATUS_CONFIG[col];
        return (
          <div key={col} className="flex-shrink-0 w-56">
            {/* Column header */}
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl mb-2 text-sm font-semibold"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <span
                className="ml-auto text-xs rounded-full px-1.5 py-0.5 font-bold"
                style={{ background: cfg.color + "33" }}
              >
                {colApps.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {colApps.map((app) => {
                const pCfg = PRIORITY_CONFIG[app.priority];
                return (
                  <div
                    key={app.id}
                    className="card p-3 cursor-pointer group"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ color: "var(--text-heading)" }}>
                          {app.company}
                        </p>
                        <p className="truncate" style={{ color: "var(--text-muted)" }}>
                          {app.role}
                        </p>
                      </div>
                      <span className="text-sm flex-shrink-0">{pCfg.emoji}</span>
                    </div>

                    {/* Location */}
                    {app.location && (
                      <div className="flex items-center gap-1 mb-2" style={{ color: "var(--text-muted)" }}>
                        <MapPin size={10} />
                        <span className="truncate">{app.location}</span>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: app.type === "internship" ? "var(--sky-soft)" : "var(--peach-soft)",
                          color: app.type === "internship" ? "var(--sky)" : "var(--peach)",
                        }}
                      >
                        {app.type === "internship" ? "🌱 Intern" : "💼 Full-time"}
                      </span>
                      {app.appliedDate && (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                          {formatDate(app.appliedDate)}
                        </span>
                      )}
                    </div>

                    {/* Actions on hover */}
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(app)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: "var(--lavender-soft)", color: "var(--lavender-deep)" }}
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg transition-colors"
                          style={{ background: "var(--sky-soft)", color: "var(--sky)" }}
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-1 rounded-lg transition-colors"
                        style={{ background: "var(--pink-soft)", color: "var(--pink)" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Status move buttons */}
                    <div className="mt-2 flex gap-1">
                      {COLUMNS.filter((c) => c !== col).slice(0, 2).map((nextCol) => (
                        <button
                          key={nextCol}
                          onClick={() => onStatusChange(app.id, nextCol)}
                          className="flex-1 text-xs py-0.5 rounded-lg truncate transition-colors"
                          style={{
                            background: STATUS_CONFIG[nextCol].bg,
                            color: STATUS_CONFIG[nextCol].color,
                            fontSize: "0.68rem",
                          }}
                          title={`Move to ${STATUS_CONFIG[nextCol].label}`}
                        >
                          → {STATUS_CONFIG[nextCol].emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
