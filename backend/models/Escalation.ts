import mongoose from "mongoose"

const escalationSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  fromAuthority: { type: String, required: true },
  toAuthority: { type: String, required: true },
  reason: String,
  escalationLevel: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

export const Escalation = mongoose.model("Escalation", escalationSchema)
