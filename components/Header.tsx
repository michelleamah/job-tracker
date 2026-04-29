"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export type TabId = "dashboard" | "applications" | "networking" | "weekly";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "dashboard",    label: "Dashboard",    emoji: "📊" },
  { id: "applications", label: "Applications", emoji: "📋" },
  { id: "networking",   label: "Networking",   emoji: "🤝" },
  { id: "weekly",       label: "Weekly Log",   emoji: "📅" },
];

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onAdd: () => void;
}

export default function Header({ activeTab, onTabChange, onAdd }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 px-6 py-3"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl float">🚀</span>
          <h1 className="text-base font-bold" style={{ color: "var(--text-heading)" }}>
            Launchpad
          </h1>
        </div>

        {/* Pill tabs — centered */}
        <nav
          className="flex items-center gap-1 flex-1 justify-center px-2 py-1 rounded-full mx-4"
          style={{ background: "var(--bg-base)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-nav-item${activeTab === tab.id ? " active" : ""}`}
            >
              <span className="hidden sm:inline">{tab.emoji} </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggle}
            className="btn-ghost"
            style={{ padding: "0.45rem 0.65rem" }}
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun size={15} style={{ color: "var(--yellow)" }} />
              : <Moon size={15} style={{ color: "var(--lavender)" }} />}
          </button>
          <button onClick={onAdd} className="btn-primary flex items-center gap-1.5 text-sm">
            <Sparkles size={14} />
            Add
          </button>
        </div>
      </div>
    </header>
  );
}
