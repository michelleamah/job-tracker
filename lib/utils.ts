import {
  Application,
  Contact,
  AppStatus,
  Priority,
  ACTIVE_STATUSES,
  INTERVIEW_STATUSES,
} from "./types";
import { format, parseISO, differenceInDays } from "date-fns";

// ── Date helpers ──────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d");
  } catch {
    return dateStr;
  }
}

export function daysAgo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const diff = differenceInDays(new Date(), parseISO(dateStr));
    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    if (diff < 0) return `in ${Math.abs(diff)}d`;
    return `${diff}d ago`;
  } catch {
    return "";
  }
}

export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    return differenceInDays(new Date(), parseISO(dateStr)) > 0;
  } catch {
    return false;
  }
}

export function daysDiff(dateStr: string): number {
  if (!dateStr) return 0;
  try {
    return differenceInDays(parseISO(dateStr), new Date());
  } catch {
    return 0;
  }
}

// ── Application stats helpers ─────────────────────────────────────────────────

export function getStatusCounts(apps: Application[]): Record<AppStatus, number> {
  const counts = {} as Record<AppStatus, number>;
  apps.forEach((a) => {
    counts[a.status] = (counts[a.status] || 0) + 1;
  });
  return counts;
}

export function getActiveCount(apps: Application[]): number {
  return apps.filter((a) => ACTIVE_STATUSES.includes(a.status)).length;
}

export function getInterviewCount(apps: Application[]): number {
  return apps.filter((a) => INTERVIEW_STATUSES.includes(a.status)).length;
}

export function getResponseRate(apps: Application[]): number {
  const applied = apps.filter(
    (a) => a.status !== "watching"
  );
  const movedPast = applied.filter((a) =>
    [
      "phone_screen",
      "technical_screen",
      "onsite",
      "final_round",
      "offer",
    ].includes(a.status)
  );
  if (applied.length === 0) return 0;
  return Math.round((movedPast.length / applied.length) * 100);
}

export function getOfferCount(apps: Application[]): number {
  return apps.filter((a) => a.status === "offer").length;
}

export function getOverdueApps(apps: Application[]): Application[] {
  const today = new Date();
  return apps.filter((a) => {
    if (!a.nextActionDue) return false;
    try {
      return differenceInDays(today, parseISO(a.nextActionDue)) > 0;
    } catch {
      return false;
    }
  });
}

export function getStaleApps(apps: Application[]): Application[] {
  const today = new Date();
  const activeStatuses: AppStatus[] = [
    "applied",
    "phone_screen",
    "technical_screen",
    "onsite",
    "final_round",
  ];
  return apps.filter((a) => {
    if (!activeStatuses.includes(a.status)) return false;
    const history = a.statusHistory ?? [];
    if (history.length === 0) return false;
    const lastEntry = history[history.length - 1];
    try {
      return differenceInDays(today, parseISO(lastEntry.date)) >= 14;
    } catch {
      return false;
    }
  });
}

// ── Contact helpers ──────────────────────────────────────────────────────────

export function getOverdueContacts(contacts: Contact[]): Contact[] {
  const today = new Date();
  return contacts.filter((c) => {
    if (!c.followUpDueDate) return false;
    try {
      return differenceInDays(today, parseISO(c.followUpDueDate)) > 0;
    } catch {
      return false;
    }
  });
}

// ── Sort helpers ──────────────────────────────────────────────────────────────

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  med_high: 1,
  medium: 2,
  med_low: 3,
  low: 4,
};

const STATUS_ORDER: Record<AppStatus, number> = {
  final_round: 0,
  onsite: 1,
  technical_screen: 2,
  phone_screen: 3,
  applied: 4,
  watching: 5,
  offer: 6,
  withdrawn: 7,
  rejected: 8,
};

export type SortKey = "company" | "role" | "dateApplied" | "priority" | "status";

export function sortApplications(
  apps: Application[],
  sort: SortKey
): Application[] {
  return [...apps].sort((a, b) => {
    switch (sort) {
      case "company":
        return a.company.localeCompare(b.company);
      case "role":
        return a.role.localeCompare(b.role);
      case "dateApplied":
        return (b.dateApplied || "").localeCompare(a.dateApplied || "");
      case "priority":
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case "status":
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      default:
        return b.lastUpdated - a.lastUpdated;
    }
  });
}

// ── CSV Export ────────────────────────────────────────────────────────────────

export function exportApplicationsCSV(apps: Application[]): void {
  const headers = [
    "Company",
    "Role",
    "Category",
    "Tier",
    "Type",
    "Status",
    "Priority",
    "Date Posted",
    "Date Applied",
    "Referral",
    "Referral Contact",
    "Recruiter Name",
    "Recruiter Contact",
    "Compensation",
    "Location",
    "Next Action",
    "Next Action Due",
    "URL",
    "Notes",
    "Outcome",
  ];

  const rows = apps.map((a) => [
    a.company,
    a.role,
    a.category,
    a.tier,
    a.type,
    a.status,
    a.priority,
    a.datePosted,
    a.dateApplied,
    a.referral,
    a.referralContact,
    a.recruiterName,
    a.recruiterContact,
    a.compensation,
    a.location,
    a.nextAction,
    a.nextActionDue,
    a.url,
    a.notes,
    a.outcome,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `launchpad-applications-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
