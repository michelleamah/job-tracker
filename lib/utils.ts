import { Application, AppStatus } from "./types";

export function getStatusCounts(apps: Application[]): Record<AppStatus, number> {
  const counts = {} as Record<AppStatus, number>;
  apps.forEach((a) => {
    counts[a.status] = (counts[a.status] || 0) + 1;
  });
  return counts;
}

export function getActiveCount(apps: Application[]): number {
  const active: AppStatus[] = ["applying", "applied", "phone_screen", "interview", "final_round"];
  return apps.filter((a) => active.includes(a.status)).length;
}

export function getResponseRate(apps: Application[]): number {
  const applied = apps.filter((a) => a.status !== "wishlist" && a.status !== "applying");
  const responded = applied.filter((a) =>
    ["phone_screen", "interview", "final_round", "offer"].includes(a.status)
  );
  if (applied.length === 0) return 0;
  return Math.round((responded.length / applied.length) * 100);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function daysAgo(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const diff = Math.floor((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff}d ago`;
}

export function sortApplications(apps: Application[], sort: "date" | "company" | "status" | "priority"): Application[] {
  return [...apps].sort((a, b) => {
    if (sort === "date") return b.lastUpdated - a.lastUpdated;
    if (sort === "company") return a.company.localeCompare(b.company);
    if (sort === "status") return a.status.localeCompare(b.status);
    if (sort === "priority") {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });
}
