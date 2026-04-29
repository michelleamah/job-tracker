// ── Enums / Union Types ─────────────────────────────────────────────────────

export type AppStatus =
  | "watching"
  | "applied"
  | "phone_screen"
  | "technical_screen"
  | "onsite"
  | "final_round"
  | "offer"
  | "rejected"
  | "withdrawn";

export type AppType = "internship" | "fulltime";

export type Priority = "high" | "med_high" | "medium" | "med_low" | "low";

export type RoleCategory =
  | "se"
  | "tpm"
  | "pm"
  | "customer_success"
  | "gtm_strategy"
  | "other";

export type Tier = "tier1" | "tier2" | "tier3";

export type Referral = "yes" | "no" | "pending";

export type RelationshipStatus = "active" | "warm" | "cold";

// ── Sub-structures ──────────────────────────────────────────────────────────

export interface InterviewNote {
  id: string;
  timestamp: number;
  round: string;
  content: string;
}

export interface StatusHistoryEntry {
  status: AppStatus;
  date: string; // ISO date string
  note?: string;
}

// ── Main Models ─────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  company: string;
  role: string;
  category: RoleCategory;
  tier: Tier;
  type: AppType;
  status: AppStatus;
  priority: Priority;
  location: string;
  url: string;
  compensation: string;
  notes: string;
  datePosted: string;      // ISO date
  dateApplied: string;     // ISO date
  referral: Referral;
  referralContact: string;
  recruiterName: string;
  recruiterContact: string;
  nextAction: string;
  nextActionDue: string;   // ISO date
  interviewNotes: InterviewNote[];
  outcome: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: number;
  lastUpdated: number;
}

export interface Contact {
  id: string;
  name: string;
  linkedinUrl: string;
  company: string;
  role: string;
  howMet: string;
  firstContactDate: string;
  lastContactDate: string;
  discussion: string;
  adviceOrOffer: string;
  followUpCommitment: string;
  followUpDueDate: string;
  relationshipStatus: RelationshipStatus;
  notes: string;
  linkedApplicationId: string;
  createdAt: number;
  lastUpdated: number;
}

export interface WeeklyLog {
  id: string;
  weekOf: string; // Monday ISO date of that week
  coldOutreach: number;
  coffeeChats: number;
  applicationsSubmitted: number;
  eventsAttended: number;
  mockInterviews: number;
  skillBuildingHours: number;
  notes: string;
  createdAt: number;
}

// ── Config Maps ─────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<AppStatus, { label: string; emoji: string; color: string; bg: string }> = {
  watching:         { label: "Watching",          emoji: "👀", color: "#c4b5e8", bg: "#ede9fb" },
  applied:          { label: "Applied",            emoji: "📬", color: "#9dd4c4", bg: "#e0f5ef" },
  phone_screen:     { label: "Phone Screen",       emoji: "📞", color: "#f9c5a0", bg: "#fdeee4" },
  technical_screen: { label: "Technical Screen",   emoji: "💻", color: "#a0c9f9", bg: "#e4f1fd" },
  onsite:           { label: "Onsite",             emoji: "🏢", color: "#f9dfa0", bg: "#fdf5dc" },
  final_round:      { label: "Final Round",        emoji: "⭐", color: "#f9a8c9", bg: "#fde8f2" },
  offer:            { label: "Offer",              emoji: "🎉", color: "#86c9a8", bg: "#d4f0e4" },
  rejected:         { label: "Rejected",           emoji: "💔", color: "#d4a0a0", bg: "#f5e4e4" },
  withdrawn:        { label: "Withdrawn",          emoji: "🌫️", color: "#b0a8b8", bg: "#ece9f0" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; emoji: string; color: string }> = {
  high:     { label: "High",      emoji: "🔥", color: "#f9a8c9" },
  med_high: { label: "Med-High",  emoji: "⚡", color: "#f9c5a0" },
  medium:   { label: "Medium",    emoji: "🌤️", color: "#f9dfa0" },
  med_low:  { label: "Med-Low",   emoji: "🌿", color: "#9dd4c4" },
  low:      { label: "Low",       emoji: "💤", color: "#c4b5e8" },
};

export const CATEGORY_CONFIG: Record<RoleCategory, { label: string; emoji: string }> = {
  se:               { label: "Solutions Eng",    emoji: "⚙️" },
  tpm:              { label: "TPM",              emoji: "📋" },
  pm:               { label: "PM",               emoji: "🗺️" },
  customer_success: { label: "Customer Success", emoji: "🤝" },
  gtm_strategy:     { label: "GTM / Strategy",   emoji: "📈" },
  other:            { label: "Other",             emoji: "🔮" },
};

export const TIER_CONFIG: Record<Tier, { label: string; emoji: string; color: string }> = {
  tier1: { label: "Tier 1", emoji: "🥇", color: "#f9dfa0" },
  tier2: { label: "Tier 2", emoji: "🥈", color: "#c4b5e8" },
  tier3: { label: "Tier 3", emoji: "🥉", color: "#9dd4c4" },
};

export const WEEKLY_TARGETS = {
  coldOutreach: 5,
  coffeeChats: 2,
  applicationsSubmitted: 5,
  eventsAttended: 1,
  mockInterviews: 1,
  skillBuildingHours: 4,
};

export const ACTIVE_STATUSES: AppStatus[] = [
  "applied",
  "phone_screen",
  "technical_screen",
  "onsite",
  "final_round",
];

export const INTERVIEW_STATUSES: AppStatus[] = [
  "phone_screen",
  "technical_screen",
  "onsite",
  "final_round",
];
