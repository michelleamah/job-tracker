"use client";

import { useState, useEffect, useCallback } from "react";
import Header, { TabId } from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ApplicationTable from "@/components/ApplicationTable";
import ApplicationDetail from "@/components/ApplicationDetail";
import ApplicationForm from "@/components/ApplicationForm";
import NetworkingTab from "@/components/NetworkingTab";
import WeeklyLog from "@/components/WeeklyLog";
import { Application } from "@/lib/types";
import {
  loadApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "@/lib/store";

type FormData = Omit<
  Application,
  "id" | "createdAt" | "lastUpdated" | "interviewNotes" | "statusHistory"
>;

export default function Home() {
  const [apps, setApps] = useState<Application[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Application modals
  const [viewTarget, setViewTarget] = useState<Application | null>(null);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setApps(loadApplications());
    setMounted(true);
  }, []);

  // ── Application handlers ────────────────────────────────────────────────────

  const handleAdd = useCallback((data: FormData) => {
    const newApp = addApplication({
      ...data,
      interviewNotes: [],
      statusHistory: [{ status: data.status, date: new Date().toISOString().slice(0, 10) }],
    });
    setApps((prev) => [newApp, ...prev]);
    setShowForm(false);
  }, []);

  const handleEdit = useCallback(
    (data: FormData) => {
      if (!editTarget) return;
      const updated = updateApplication(editTarget.id, data);
      setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setEditTarget(null);
      setShowForm(false);
      // If we came from a detail view, update it
      setViewTarget((prev) => (prev?.id === updated.id ? updated : prev));
    },
    [editTarget]
  );

  const handleDelete = useCallback((id: string) => {
    deleteApplication(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
    setViewTarget(null);
  }, []);

  const handleUpdate = useCallback((updated: Application) => {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setViewTarget(updated);
  }, []);

  const openAdd = useCallback(() => {
    setEditTarget(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((app: Application) => {
    setEditTarget(app);
    setViewTarget(null);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditTarget(null);
  }, []);

  const openView = useCallback((app: Application) => {
    setViewTarget(app);
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="text-center">
          <p className="text-5xl float mb-3">🚀</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading Launchpad…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 py-7">
        {/* Page title */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{
              background:
                "linear-gradient(135deg, var(--lavender-deep), var(--pink), var(--sky))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {activeTab === "dashboard" && "Dashboard ✨"}
            {activeTab === "applications" && "Applications 📋"}
            {activeTab === "networking" && "Networking 🤝"}
            {activeTab === "weekly" && "Weekly Log 📅"}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {activeTab === "dashboard" &&
              "Your job search at a glance 🌸"}
            {activeTab === "applications" &&
              `${apps.length} application${apps.length !== 1 ? "s" : ""} tracked`}
            {activeTab === "networking" &&
              "Manage your professional relationships 💫"}
            {activeTab === "weekly" &&
              "Track your weekly job search activity 📊"}
          </p>
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && (
          <Dashboard
            apps={apps}
            onViewApp={(app) => {
              openView(app);
              // Don't switch tab — show the detail modal from here
            }}
          />
        )}

        {activeTab === "applications" && (
          <ApplicationTable
            apps={apps}
            onAdd={openAdd}
            onView={openView}
          />
        )}

        {activeTab === "networking" && (
          <NetworkingTab apps={apps} />
        )}

        {activeTab === "weekly" && <WeeklyLog />}

        {/* Footer */}
        <div className="text-center mt-12 py-4">
          <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;Every application is one step closer to your dream role. Keep going! 🌸&rdquo;
          </p>
          <p className="text-base mt-1">✦ 🚀 ✦</p>
        </div>
      </main>

      {/* Application Detail modal */}
      {viewTarget && (
        <ApplicationDetail
          app={viewTarget}
          onClose={() => setViewTarget(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {/* Application Form modal */}
      {showForm && (
        <ApplicationForm
          initial={editTarget}
          onClose={closeForm}
          onSave={editTarget ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
}
