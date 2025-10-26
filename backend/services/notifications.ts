import { Notification } from "../models/Notification"

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  issueId?: string,
  actionUrl?: string,
) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      issueId,
      actionUrl,
    })

    await notification.save()
    return notification
  } catch (error) {
    console.error("Failed to create notification:", error)
  }
}

export const notifyIssueAssigned = async (userId: string, issueTitle: string, issueId: string) => {
  await createNotification(
    userId,
    "issue_assigned",
    "Issue Assigned",
    `Your issue "${issueTitle}" has been assigned to an authority.`,
    issueId,
    `/track?issueId=${issueId}`,
  )
}

export const notifyIssueUpdated = async (userId: string, issueTitle: string, status: string, issueId: string) => {
  await createNotification(
    userId,
    "issue_updated",
    "Issue Updated",
    `Your issue "${issueTitle}" status changed to ${status}.`,
    issueId,
    `/track?issueId=${issueId}`,
  )
}

export const notifyIssueResolved = async (userId: string, issueTitle: string, issueId: string) => {
  await createNotification(
    userId,
    "issue_resolved",
    "Issue Resolved",
    `Great news! Your issue "${issueTitle}" has been resolved. You earned 50 points!`,
    issueId,
    `/track?issueId=${issueId}`,
  )
}

export const notifyBadgeEarned = async (userId: string, badgeName: string) => {
  await createNotification(
    userId,
    "badge_earned",
    "Badge Earned",
    `Congratulations! You earned the "${badgeName}" badge!`,
    undefined,
    "/profile",
  )
}

export const notifyRankChanged = async (userId: string, newRank: number, city: string) => {
  await createNotification(
    userId,
    "rank_changed",
    "Rank Updated",
    `Your rank in ${city} is now #${newRank}. Keep contributing!`,
    undefined,
    "/leaderboard",
  )
}

export const notifyEscalation = async (userId: string, issueTitle: string, issueId: string) => {
  await createNotification(
    userId,
    "escalation",
    "Issue Escalated",
    `Your issue "${issueTitle}" has been escalated for faster resolution.`,
    issueId,
    `/track?issueId=${issueId}`,
  )
}
