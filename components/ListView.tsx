"use client";

import { Application, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/types";
import { formatDate, daysAgo } from "@/lib/utils";
import { MapPin, ExternalLink, Edit2, Trash2 } from "lucide-react";

interface ListViewProps {
  apps: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export default function ListView({ apps, onEdit, onDelete }: ListViewProps) {
  if (apps.length === 0) {
    return (
      <div className="card p-16 text-center">
        <p className="text-4xl mb-3">🌸</p>
        <p className="font-semibold" style={{ color: "var(--text-muted)" }}>No applications yet</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Hit &quot;Add Application&quot; to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {apps.map((app) => {
        const sCfg = STATUS_CONFIG[app.status];
        const pCfg = PRIORITY_CONFIG[app.priority];
        return (
          <div key={app.id} className="card px-4 py-3 flex items-center gap-4 group">
            {/* Priority dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: pCfg.color }}
              title={`${pCfg.label} priority`}
            />

            {/* Company + role */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm" style={{ color: "var(--text-heading)" }}>
                  {app.company}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: app.type === "internship" ? "var(--sky-soft)" : "var(--peach-soft)", color: app.type === "internship" ? "var(--sky)" : "var(--peach)" }}
                >
                  {app.type === "internship" ? "🌱 Intern" : "💼 FT"}
                </span>
              </div>
              <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                {app.role}
                {app.location && (
                  <span className="ml-2 inline-flex items-center gap-0.5">
                    <MapPin size={9} /> {app.location}
                  </span>
                )}
              </p>
            </div>

            {/* Status badge */}
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
              style={{ background: sCfg.bg, color: sCfg.color }}
            >
              {sCfg.emoji} {sCfg.label}
            </span>

            {/* Date */}
            <div className="text-xs flex-shrink-0 text-right hidden sm:block" style={{ color: "var(--text-muted)", minWidth: 72 }}>
              {app.appliedDate ? (
                <>
                  <p>{formatDate(app.appliedDate)}</p>
                  <p>{daysAgo(app.appliedDate)}</p>
                </>
              ) : (
                <p>not applied</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(app)}
                className="p-1.5 rounded-lg"
                style={{ background: "var(--lavender-soft)", color: "var(--lavender-deep)" }}
              >
                <Edit2 size={13} />
              </button>
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg"
                  style={{ background: "var(--sky-soft)", color: "var(--sky)" }}
                >
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                onClick={() => onDelete(app.id)}
                className="p-1.5 rounded-lg"
                style={{ background: "var(--pink-soft)", color: "var(--pink)" }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
