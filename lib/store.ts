"use client";

import {
  Application,
  Contact,
  WeeklyLog,
  InterviewNote,
  StatusHistoryEntry,
} from "./types";
import { format, subDays, startOfWeek } from "date-fns";

const APPS_KEY = "jt_applications";
const CONTACTS_KEY = "jt_contacts";
const WEEKLY_KEY = "jt_weekly";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function todayStr(): string {
  return fmt(new Date());
}

// ── Applications ─────────────────────────────────────────────────────────────

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPS_KEY);
    if (raw) return JSON.parse(raw) as Application[];
    return seedApplications();
  } catch {
    return [];
  }
}

export function saveApplications(apps: Application[]): void {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function addApplication(
  app: Omit<Application, "id" | "createdAt" | "lastUpdated">
): Application {
  const apps = loadApplications();
  const now = Date.now();
  const firstEntry: StatusHistoryEntry = {
    status: app.status,
    date: todayStr(),
  };
  const newApp: Application = {
    ...app,
    id: crypto.randomUUID(),
    createdAt: now,
    lastUpdated: now,
    interviewNotes: app.interviewNotes ?? [],
    statusHistory: app.statusHistory?.length ? app.statusHistory : [firstEntry],
  };
  saveApplications([newApp, ...apps]);
  return newApp;
}

export function updateApplication(
  id: string,
  updates: Partial<Application>
): Application {
  const apps = loadApplications();
  const existing = apps.find((a) => a.id === id);
  if (!existing) throw new Error(`Application ${id} not found`);

  const now = Date.now();
  let statusHistory = existing.statusHistory ?? [];

  // Auto-append to statusHistory when status changes
  if (updates.status && updates.status !== existing.status) {
    const entry: StatusHistoryEntry = {
      status: updates.status,
      date: todayStr(),
    };
    statusHistory = [...statusHistory, entry];
  }

  const updated: Application = {
    ...existing,
    ...updates,
    statusHistory,
    lastUpdated: now,
  };

  const newApps = apps.map((a) => (a.id === id ? updated : a));
  saveApplications(newApps);
  return updated;
}

export function deleteApplication(id: string): void {
  saveApplications(loadApplications().filter((a) => a.id !== id));
}

export function addInterviewNote(
  appId: string,
  noteData: Omit<InterviewNote, "id" | "timestamp">
): Application {
  const apps = loadApplications();
  const app = apps.find((a) => a.id === appId);
  if (!app) throw new Error(`Application ${appId} not found`);

  const note: InterviewNote = {
    ...noteData,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  return updateApplication(appId, {
    interviewNotes: [...(app.interviewNotes ?? []), note],
  });
}

// ── Contacts ─────────────────────────────────────────────────────────────────

export function loadContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw) as Contact[];
    return seedContacts();
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function addContact(
  contact: Omit<Contact, "id" | "createdAt" | "lastUpdated">
): Contact {
  const contacts = loadContacts();
  const now = Date.now();
  const newContact: Contact = {
    ...contact,
    id: crypto.randomUUID(),
    createdAt: now,
    lastUpdated: now,
  };
  saveContacts([newContact, ...contacts]);
  return newContact;
}

export function updateContact(
  id: string,
  updates: Partial<Contact>
): Contact {
  const contacts = loadContacts();
  const updated = contacts.map((c) =>
    c.id === id ? { ...c, ...updates, lastUpdated: Date.now() } : c
  );
  saveContacts(updated);
  return updated.find((c) => c.id === id)!;
}

export function deleteContact(id: string): void {
  saveContacts(loadContacts().filter((c) => c.id !== id));
}

// ── Weekly Logs ───────────────────────────────────────────────────────────────

export function loadWeeklyLogs(): WeeklyLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (raw) return JSON.parse(raw) as WeeklyLog[];
    return seedWeeklyLogs();
  } catch {
    return [];
  }
}

export function saveWeeklyLogs(logs: WeeklyLog[]): void {
  localStorage.setItem(WEEKLY_KEY, JSON.stringify(logs));
}

export function addWeeklyLog(
  log: Omit<WeeklyLog, "id" | "createdAt">
): WeeklyLog {
  const logs = loadWeeklyLogs();
  const newLog: WeeklyLog = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  saveWeeklyLogs([newLog, ...logs]);
  return newLog;
}

export function updateWeeklyLog(
  id: string,
  updates: Partial<WeeklyLog>
): WeeklyLog {
  const logs = loadWeeklyLogs();
  const updated = logs.map((l) => (l.id === id ? { ...l, ...updates } : l));
  saveWeeklyLogs(updated);
  return updated.find((l) => l.id === id)!;
}

export function deleteWeeklyLog(id: string): void {
  saveWeeklyLogs(loadWeeklyLogs().filter((l) => l.id !== id));
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

function seedApplications(): Application[] {
  const today = new Date();
  const apps: Application[] = [
    {
      id: crypto.randomUUID(),
      company: "Google",
      role: "Solutions Engineer, Enterprise",
      category: "se",
      tier: "tier1",
      type: "internship",
      status: "onsite",
      priority: "high",
      location: "Sunnyvale, CA",
      url: "https://careers.google.com",
      compensation: "$60/hr",
      notes: "Referral from LinkedIn connection. Virtual onsite scheduled.",
      datePosted: fmt(subDays(today, 25)),
      dateApplied: fmt(subDays(today, 18)),
      referral: "yes",
      referralContact: "Alex Chen (LinkedIn)",
      recruiterName: "Sarah Kim",
      recruiterContact: "sarah.kim@google.com",
      nextAction: "Prepare system design question",
      nextActionDue: fmt(subDays(today, -2)),
      interviewNotes: [
        {
          id: crypto.randomUUID(),
          timestamp: subDays(today, 10).getTime(),
          round: "Phone Screen",
          content: "Great call with recruiter Sarah. She emphasized culture fit and gave tips on the next round. Mentioned that the team focuses on AI/ML tooling.",
        },
      ],
      outcome: "",
      statusHistory: [
        { status: "watching", date: fmt(subDays(today, 30)) },
        { status: "applied", date: fmt(subDays(today, 18)) },
        { status: "phone_screen", date: fmt(subDays(today, 12)) },
        { status: "onsite", date: fmt(subDays(today, 5)) },
      ],
      createdAt: subDays(today, 30).getTime(),
      lastUpdated: subDays(today, 5).getTime(),
    },
    {
      id: crypto.randomUUID(),
      company: "Stripe",
      role: "Solutions Engineer Intern",
      category: "se",
      tier: "tier1",
      type: "internship",
      status: "phone_screen",
      priority: "high",
      location: "San Francisco, CA",
      url: "https://stripe.com/jobs",
      compensation: "$65/hr",
      notes: "Phone screen with recruiter went well! Technical round next.",
      datePosted: fmt(subDays(today, 28)),
      dateApplied: fmt(subDays(today, 21)),
      referral: "pending",
      referralContact: "Reaching out to Jamie at Stripe",
      recruiterName: "Tyler Park",
      recruiterContact: "tyler@stripe.com",
      nextAction: "Prepare for technical screen",
      nextActionDue: fmt(subDays(today, -5)),
      interviewNotes: [],
      outcome: "",
      statusHistory: [
        { status: "applied", date: fmt(subDays(today, 21)) },
        { status: "phone_screen", date: fmt(subDays(today, 7)) },
      ],
      createdAt: subDays(today, 28).getTime(),
      lastUpdated: subDays(today, 7).getTime(),
    },
    {
      id: crypto.randomUUID(),
      company: "Salesforce",
      role: "Sales Engineer Intern",
      category: "se",
      tier: "tier1",
      type: "internship",
      status: "applied",
      priority: "high",
      location: "San Francisco, CA",
      url: "https://salesforce.com/careers",
      compensation: "$55/hr",
      notes: "Applied via Handshake. Follow up next week.",
      datePosted: fmt(subDays(today, 15)),
      dateApplied: fmt(subDays(today, 10)),
      referral: "no",
      referralContact: "",
      recruiterName: "",
      recruiterContact: "",
      nextAction: "Send follow-up email",
      nextActionDue: fmt(subDays(today, -3)),
      interviewNotes: [],
      outcome: "",
      statusHistory: [
        { status: "applied", date: fmt(subDays(today, 10)) },
      ],
      createdAt: subDays(today, 15).getTime(),
      lastUpdated: subDays(today, 10).getTime(),
    },
    {
      id: crypto.randomUUID(),
      company: "Microsoft",
      role: "Technical Program Manager Intern",
      category: "tpm",
      tier: "tier1",
      type: "internship",
      status: "watching",
      priority: "medium",
      location: "Redmond, WA (Hybrid)",
      url: "https://careers.microsoft.com",
      compensation: "$52/hr",
      notes: "Posted recently — check back for updates.",
      datePosted: fmt(subDays(today, 8)),
      dateApplied: "",
      referral: "no",
      referralContact: "",
      recruiterName: "",
      recruiterContact: "",
      nextAction: "Apply when ready",
      nextActionDue: fmt(subDays(today, -7)),
      interviewNotes: [],
      outcome: "",
      statusHistory: [
        { status: "watching", date: fmt(subDays(today, 8)) },
      ],
      createdAt: subDays(today, 8).getTime(),
      lastUpdated: subDays(today, 8).getTime(),
    },
    {
      id: crypto.randomUUID(),
      company: "Databricks",
      role: "Solutions Architect Intern",
      category: "se",
      tier: "tier1",
      type: "internship",
      status: "applied",
      priority: "high",
      location: "San Francisco, CA",
      url: "https://databricks.com/company/careers",
      compensation: "",
      notes: "Referral from CMU alum. Application submitted.",
      datePosted: fmt(subDays(today, 20)),
      dateApplied: fmt(subDays(today, 16)),
      referral: "yes",
      referralContact: "Jordan Lee (CMU alum, Databricks)",
      recruiterName: "",
      recruiterContact: "",
      nextAction: "Follow up with referral contact",
      nextActionDue: fmt(subDays(today, -1)),
      interviewNotes: [],
      outcome: "",
      statusHistory: [
        { status: "watching", date: fmt(subDays(today, 22)) },
        { status: "applied", date: fmt(subDays(today, 16)) },
      ],
      createdAt: subDays(today, 22).getTime(),
      lastUpdated: subDays(today, 16).getTime(),
    },
    {
      id: crypto.randomUUID(),
      company: "HubSpot",
      role: "Sales Engineer Intern",
      category: "se",
      tier: "tier2",
      type: "internship",
      status: "rejected",
      priority: "med_low",
      location: "Remote",
      url: "",
      compensation: "",
      notes: "Auto-rejection after application. Try again next cycle.",
      datePosted: fmt(subDays(today, 45)),
      dateApplied: fmt(subDays(today, 30)),
      referral: "no",
      referralContact: "",
      recruiterName: "",
      recruiterContact: "",
      nextAction: "",
      nextActionDue: "",
      interviewNotes: [],
      outcome: "Auto-rejected",
      statusHistory: [
        { status: "applied", date: fmt(subDays(today, 30)) },
        { status: "rejected", date: fmt(subDays(today, 20)) },
      ],
      createdAt: subDays(today, 45).getTime(),
      lastUpdated: subDays(today, 20).getTime(),
    },
  ];

  saveApplications(apps);
  return apps;
}

function seedContacts(): Contact[] {
  const today = new Date();
  const contacts: Contact[] = [
    {
      id: crypto.randomUUID(),
      name: "Alex Chen",
      linkedinUrl: "https://linkedin.com/in/alexchen",
      company: "Google",
      role: "Solutions Engineer",
      howMet: "LinkedIn cold outreach",
      firstContactDate: fmt(subDays(today, 25)),
      lastContactDate: fmt(subDays(today, 18)),
      discussion: "Discussed the SE role at Google and the interview process.",
      adviceOrOffer: "Offered to refer me and gave tips on the technical interview.",
      followUpCommitment: "Send thank you note and update on interview progress",
      followUpDueDate: fmt(subDays(today, -3)),
      relationshipStatus: "active",
      notes: "Super helpful! Very responsive on LinkedIn.",
      linkedApplicationId: "",
      createdAt: subDays(today, 25).getTime(),
      lastUpdated: subDays(today, 18).getTime(),
    },
    {
      id: crypto.randomUUID(),
      name: "Jordan Lee",
      linkedinUrl: "https://linkedin.com/in/jordanlee",
      company: "Databricks",
      role: "Solutions Architect",
      howMet: "CMU alumni network",
      firstContactDate: fmt(subDays(today, 22)),
      lastContactDate: fmt(subDays(today, 16)),
      discussion: "Talked about the Solutions Architect role and team culture.",
      adviceOrOffer: "Agreed to refer me for the intern role.",
      followUpCommitment: "Update Jordan after hearing back from recruiter",
      followUpDueDate: fmt(subDays(today, -2)),
      relationshipStatus: "warm",
      notes: "CMU MSSM grad. Very supportive of fellow CMU students.",
      linkedApplicationId: "",
      createdAt: subDays(today, 22).getTime(),
      lastUpdated: subDays(today, 16).getTime(),
    },
    {
      id: crypto.randomUUID(),
      name: "Priya Sharma",
      linkedinUrl: "https://linkedin.com/in/priyasharma",
      company: "Snowflake",
      role: "Technical Account Manager",
      howMet: "Tech industry virtual event",
      firstContactDate: fmt(subDays(today, 40)),
      lastContactDate: fmt(subDays(today, 38)),
      discussion: "Brief intro at the virtual networking event.",
      adviceOrOffer: "Said to reach out if interested in Snowflake opportunities.",
      followUpCommitment: "Schedule a coffee chat to learn more about TAM role",
      followUpDueDate: fmt(subDays(today, 10)),
      relationshipStatus: "cold",
      notes: "Should warm this relationship back up.",
      linkedApplicationId: "",
      createdAt: subDays(today, 40).getTime(),
      lastUpdated: subDays(today, 38).getTime(),
    },
  ];

  saveContacts(contacts);
  return contacts;
}

function seedWeeklyLogs(): WeeklyLog[] {
  const today = new Date();
  const thisMonday = startOfWeek(today, { weekStartsOn: 1 });
  const lastMonday = subDays(thisMonday, 7);

  const logs: WeeklyLog[] = [
    {
      id: crypto.randomUUID(),
      weekOf: fmt(thisMonday),
      coldOutreach: 3,
      coffeeChats: 1,
      applicationsSubmitted: 2,
      eventsAttended: 0,
      mockInterviews: 1,
      skillBuildingHours: 2,
      notes: "Busy week with midterms. Focused on Google onsite prep.",
      createdAt: thisMonday.getTime(),
    },
    {
      id: crypto.randomUUID(),
      weekOf: fmt(lastMonday),
      coldOutreach: 6,
      coffeeChats: 2,
      applicationsSubmitted: 5,
      eventsAttended: 1,
      mockInterviews: 1,
      skillBuildingHours: 5,
      notes: "Great week! Hit all targets. Attended Carta networking event.",
      createdAt: lastMonday.getTime(),
    },
  ];

  saveWeeklyLogs(logs);
  return logs;
}
