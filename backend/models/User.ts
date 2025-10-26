import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  city: String,
  role: { type: String, enum: ["citizen", "authority", "admin"], default: "citizen" },
  authorityType: { type: String, enum: ["GHMC", "IRCTC", "WATER", "ELECTRICITY", "ROADS"], default: null },
  points: { type: Number, default: 0 },
  badges: [String],
  issuesReported: { type: Number, default: 0 },
  issuesResolved: { type: Number, default: 0 },
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const User = mongoose.model("User", userSchema)
