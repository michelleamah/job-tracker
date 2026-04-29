"use client";

import { Application } from "./types";
import { format, subDays } from "date-fns";

const KEY = "job_applications";

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedData();
  } catch {
    return [];
  }
}

export function saveApplications(apps: Application[]): void {
  localStorage.setItem(KEY, JSON.stringify(apps));
}

export function addApplication(app: Omit<Application, "id" | "createdAt" | "lastUpdated">): Application {
  const apps = loadApplications();
  const newApp: Application = {
    ...app,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };
  saveApplications([newApp, ...apps]);
  return newApp;
}

export function updateApplication(id: string, updates: Partial<Application>): Application {
  const apps = loadApplications();
  const updated = apps.map((a) =>
    a.id === id ? { ...a, ...updates, lastUpdated: Date.now() } : a
  );
  saveApplications(updated);
  return updated.find((a) => a.id === id)!;
}

export function deleteApplication(id: string): void {
  saveApplications(loadApplications().filter((a) => a.id !== id));
}

function fmt(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function seedData(): Application[] {
  const today = new Date();
  const seed: Omit<Application, "id" | "createdAt" | "lastUpdated">[] = [
    {
      company: "Google",
      role: "Solutions Engineer, Enterprise",
      type: "internship",
      status: "interview",
      priority: "high",
      location: "Sunnyvale, CA",
      url: "",
      salary: "$60/hr",
      notes: "Referral from LinkedIn connection. Virtual onsite scheduled.",
      appliedDate: fmt(subDays(today, 18)),
      deadline: "",
    },
    {
      company: "Salesforce",
      role: "Sales Engineer Intern",
      type: "internship",
      status: "applied",
      priority: "high",
      location: "San Francisco, CA",
      url: "",
      salary: "$55/hr",
      notes: "Applied via Handshake. Follow up next week.",
      appliedDate: fmt(subDays(today, 10)),
      deadline: "",
    },
    {
      company: "Stripe",
      role: "Solutions Engineer Intern",
      type: "internship",
      status: "phone_screen",
      priority: "high",
      location: "San Francisco, CA",
      url: "",
      salary: "$65/hr",
      notes: "Phone screen with recruiter went well! Technical round next.",
      appliedDate: fmt(subDays(today, 21)),
      deadline: "",
    },
    {
      company: "Microsoft",
      role: "Technical Solutions Engineer Intern",
      type: "internship",
      status: "applied",
      priority: "medium",
      location: "Redmond, WA (Hybrid)",
      url: "",
      salary: "$52/hr",
      notes: "",
      appliedDate: fmt(subDays(today, 5)),
      deadline: "",
    },
    {
      company: "Databricks",
      role: "Solutions Architect Intern",
      type: "internship",
      status: "wishlist",
      priority: "high",
      location: "San Francisco, CA",
      url: "",
      salary: "",
      notes: "Reach out to CMU alum at Databricks first.",
      appliedDate: "",
      deadline: fmt(subDays(today, -14)),
    },
    {
      company: "HubSpot",
      role: "Sales Engineer Intern",
      type: "internship",
      status: "rejected",
      priority: "medium",
      location: "Remote",
      url: "",
      salary: "",
      notes: "Auto-rejection after application. Try again next cycle.",
      appliedDate: fmt(subDays(today, 30)),
      deadline: "",
    },
  ];

  const apps: Application[] = seed.map((s) => ({
    ...s,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  }));
  saveApplications(apps);
  return apps;
}
