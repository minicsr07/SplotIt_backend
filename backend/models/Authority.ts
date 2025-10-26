import mongoose from "mongoose"

const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["GHMC", "IRCTC", "WATER", "ELECTRICITY", "ROADS"], required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  city: String,
  slaHours: { type: Number, default: 48 },
  escalationThreshold: { type: Number, default: 72 },
  activeIssues: { type: Number, default: 0 },
  resolvedIssues: { type: Number, default: 0 },
  averageResolutionTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Authority = mongoose.model("Authority", authoritySchema)
