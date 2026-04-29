export type AppStatus =
  | "wishlist"
  | "applying"
  | "applied"
  | "phone_screen"
  | "interview"
  | "final_round"
  | "offer"
  | "rejected"
  | "withdrawn";

export type AppType = "internship" | "fulltime";

export type Priority = "high" | "medium" | "low";

export interface Application {
  id: string;
  company: string;
  role: string;
  type: AppType;
  status: AppStatus;
  priority: Priority;
  location: string;
  url: string;
  salary: string;
  notes: string;
  appliedDate: string;
  deadline: string;
  lastUpdated: number;
  createdAt: number;
}

export const STATUS_CONFIG: Record<AppStatus, { label: string; emoji: string; color: string; bg: string }> = {
  wishlist:     { label: "Wishlist",     emoji: "🌸", color: "#c4b5e8", bg: "#ede9fb" },
  applying:     { label: "Applying",     emoji: "✍️",  color: "#a0c9f9", bg: "#e4f1fd" },
  applied:      { label: "Applied",      emoji: "📬", color: "#9dd4c4", bg: "#e0f5ef" },
  phone_screen: { label: "Phone Screen", emoji: "📞", color: "#f9c5a0", bg: "#fdeee4" },
  interview:    { label: "Interview",    emoji: "🎯", color: "#f9dfa0", bg: "#fdf5dc" },
  final_round:  { label: "Final Round",  emoji: "⭐", color: "#f9a8c9", bg: "#fde8f2" },
  offer:        { label: "Offer",        emoji: "🎉", color: "#86c9a8", bg: "#d4f0e4" },
  rejected:     { label: "Rejected",     emoji: "💔", color: "#d4a0a0", bg: "#f5e4e4" },
  withdrawn:    { label: "Withdrawn",    emoji: "🌫️", color: "#b0a8b8", bg: "#ece9f0" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; emoji: string; color: string }> = {
  high:   { label: "High",   emoji: "🔥", color: "#f9a8c9" },
  medium: { label: "Medium", emoji: "⚡", color: "#f9dfa0" },
  low:    { label: "Low",    emoji: "🌿", color: "#9dd4c4" },
};

export const ROLE_SUGGESTIONS = [
  "Solutions Engineer",
  "Sales Engineer",
  "Solutions Architect",
  "Customer Success Engineer",
  "Technical Account Manager",
  "Pre-Sales Engineer",
  "Partner Solutions Engineer",
  "Enterprise Solutions Engineer",
  "Cloud Solutions Architect",
  "Technical Solutions Consultant",
];

export const TARGET_COMPANIES = [
  "Google", "Meta", "Apple", "Microsoft", "Amazon", "Salesforce",
  "Stripe", "Databricks", "Snowflake", "Palantir", "Twilio", "HubSpot",
  "Workday", "ServiceNow", "Okta", "Cloudflare", "MongoDB", "Confluent",
];
