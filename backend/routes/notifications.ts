import express, { type Response } from "express"
import { Notification } from "../models/Notification"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Get user notifications
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, page = 1, unreadOnly = false } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const filter: any = { userId: req.userId }
    if (unreadOnly === "true") filter.read = false

    const notifications = await Notification.find(filter)
      .populate("issueId", "title")
      .populate("relatedUserId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Notification.countDocuments(filter)

    res.json({
      notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
})

// Get unread count
router.get("/unread/count", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    })

    res.json({ unreadCount })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread count" })
  }
})

// Mark notification as read
router.put("/:notificationId/read", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true })

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json({ message: "Notification marked as read", notification })
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" })
  }
})

// Mark all notifications as read
router.put("/read/all", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all notifications as read" })
  }
})

// Delete notification
router.delete("/:notificationId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId)

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json({ message: "Notification deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" })
  }
})

// Clear all notifications
router.delete("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.deleteMany({ userId: req.userId })

    res.json({ message: "All notifications cleared" })
  } catch (error) {
    res.status(500).json({ error: "Failed to clear notifications" })
  }
})

export default router
