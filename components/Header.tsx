"use client";

import { Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Header({ onAdd }: { onAdd: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 px-6 py-4"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
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

        <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span className="twinkle" style={{ color: "var(--lavender)" }}>✦</span>
          CMU SV · MSSM · Class of Dec 2027
          <span className="twinkle" style={{ color: "var(--pink)", animationDelay: "0.9s" }}>✦</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn-ghost" style={{ padding: "0.45rem 0.65rem" }} aria-label="Toggle theme">
            {theme === "dark"
              ? <Sun size={16} style={{ color: "var(--yellow)" }} />
              : <Moon size={16} style={{ color: "var(--lavender)" }} />}
          </button>
          <button onClick={onAdd} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} />
            Add Application
          </button>
        </div>
      </div>
    </header>
  );
}
