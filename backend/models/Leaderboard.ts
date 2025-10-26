import mongoose from "mongoose"

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  rank: Number,
  city: String,
  month: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema)
