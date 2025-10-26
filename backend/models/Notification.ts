import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["issue_assigned", "issue_updated", "issue_resolved", "badge_earned", "rank_changed", "escalation"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
  actionUrl: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
})

export const Notification = mongoose.model("Notification", notificationSchema)
