import mongoose from "mongoose"

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  status: { type: String, enum: ["reported", "assigned", "in-progress", "resolved", "closed"], default: "reported" },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedAuthority: { type: String, enum: ["GHMC", "IRCTC", "WATER", "ELECTRICITY", "ROADS"] },
  images: [String],
  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      comment: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  escalationLevel: { type: Number, default: 0 },
  slaDeadline: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Issue = mongoose.model("Issue", issueSchema)
