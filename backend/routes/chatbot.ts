import express, { type Request, type Response } from "express"
import { ChatMessage } from "../models/ChatMessage"
import { getChatbotResponse } from "../services/chatbot"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Send message to chatbot
router.post("/message", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" })
    }

    const { response, category, intent } = getChatbotResponse(message)

    const chatMessage = new ChatMessage({
      userId: req.userId,
      message,
      response,
      category,
      intent,
    })

    await chatMessage.save()

    res.json({
      message,
      response,
      category,
      intent,
      messageId: chatMessage._id,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to process message" })
  }
})

// Get chat history
router.get("/history", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50 } = req.query

    const messages = await ChatMessage.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(Number(limit))

    res.json(messages.reverse())
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" })
  }
})

// Mark message as helpful
router.put("/message/:messageId/helpful", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { helpful } = req.body

    const message = await ChatMessage.findByIdAndUpdate(req.params.messageId, { helpful }, { new: true })

    if (!message) {
      return res.status(404).json({ error: "Message not found" })
    }

    res.json({ message: "Feedback recorded", message })
  } catch (error) {
    res.status(500).json({ error: "Failed to record feedback" })
  }
})

// Get chatbot stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const totalMessages = await ChatMessage.countDocuments()
    const helpfulMessages = await ChatMessage.countDocuments({ helpful: true })
    const unhelpfulMessages = await ChatMessage.countDocuments({ helpful: false })

    const categoryStats = await ChatMessage.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json({
      totalMessages,
      helpfulMessages,
      unhelpfulMessages,
      helpfulRate: totalMessages > 0 ? ((helpfulMessages / totalMessages) * 100).toFixed(2) : 0,
      categoryStats,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chatbot stats" })
  }
})

export default router
