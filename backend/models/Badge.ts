import mongoose from "mongoose"

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  criteria: {
    type: String,
    enum: ["reports_5", "reports_10", "resolved_5", "resolved_10", "points_100", "points_500", "streak_7"],
  },
  createdAt: { type: Date, default: Date.now },
})

export const Badge = mongoose.model("Badge", badgeSchema)
