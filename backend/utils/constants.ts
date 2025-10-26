export const AUTHORITY_TYPES = {
  GHMC: "GHMC",
  IRCTC: "IRCTC",
  WATER: "WATER",
  ELECTRICITY: "ELECTRICITY",
  ROADS: "ROADS",
}

export const CATEGORY_TO_AUTHORITY: Record<string, string> = {
  pothole: AUTHORITY_TYPES.ROADS,
  streetlight: AUTHORITY_TYPES.ELECTRICITY,
  water: AUTHORITY_TYPES.WATER,
  train: AUTHORITY_TYPES.IRCTC,
  garbage: AUTHORITY_TYPES.GHMC,
  other: AUTHORITY_TYPES.GHMC,
}

export const ISSUE_STATUS = {
  REPORTED: "reported",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
}

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
}

export const POINTS = {
  REPORT_ISSUE: 10,
  RESOLVE_ISSUE: 50,
  BADGE_EARNED: 25,
}

export const SLA_HOURS = {
  LOW: 72,
  MEDIUM: 48,
  HIGH: 24,
  CRITICAL: 12,
}

export const ESCALATION_THRESHOLD_HOURS = {
  LOW: 96,
  MEDIUM: 72,
  HIGH: 48,
  CRITICAL: 24,
}
