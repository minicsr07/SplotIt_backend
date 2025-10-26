import mongoose from "mongoose"

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  response: String,
  category: String,
  intent: String,
  timestamp: { type: Date, default: Date.now },
  helpful: Boolean,
  createdAt: { type: Date, default: Date.now },
})

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema)
