"use client";

import { Moon, Sun } from "lucide-react";
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
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-2xl float">🚀</span>
          <div>
            <h1 className="text-lg font-bold leading-none" style={{ color: "var(--text-heading)" }}>
              Launchpad
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              your job search, organized ✨
            </p>
          </div>
        </div>

        {/* Tab nav */}
        <nav className="flex items-end gap-0 flex-1 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-nav-item${activeTab === tab.id ? " active" : ""}`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggle}
            className="btn-ghost"
            style={{ padding: "0.45rem 0.65rem" }}
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun size={16} style={{ color: "var(--yellow)" }} />
              : <Moon size={16} style={{ color: "var(--lavender)" }} />}
          </button>
        </div>
      </div>
    </header>
  );
}
