import express, { type Request, type Response } from "express"
import { User } from "../models/User"
import { Badge } from "../models/Badge"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Get global leaderboard
router.get("/global", async (req: Request, res: Response) => {
  try {
    const { limit = 50, page = 1 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const users = await User.find()
      .select("name email city points badges issuesReported issuesResolved profileImage")
      .sort({ points: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await User.countDocuments()

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      user,
      points: user.points,
    }))

    res.json({
      leaderboard,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

// Get city leaderboard
router.get("/city/:city", async (req: Request, res: Response) => {
  try {
    const { limit = 50, page = 1 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const users = await User.find({ city: req.params.city })
      .select("name email city points badges issuesReported issuesResolved profileImage")
      .sort({ points: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await User.countDocuments({ city: req.params.city })

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      user,
      points: user.points,
    }))

    res.json({
      leaderboard,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch city leaderboard" })
  }
})

// Get user rank
router.get("/rank/:userId", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const globalRank = await User.countDocuments({ points: { $gt: user.points } })
    const cityRank = await User.countDocuments({
      city: user.city,
      points: { $gt: user.points },
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        points: user.points,
        badges: user.badges,
      },
      globalRank: globalRank + 1,
      cityRank: cityRank + 1,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user rank" })
  }
})

// Get badges
router.get("/badges", async (req: Request, res: Response) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 })
    res.json(badges)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch badges" })
  }
})

// Award badge to user
router.post("/badges/award", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, badgeName } = req.body

    const badge = await Badge.findOne({ name: badgeName })
    if (!badge) {
      return res.status(404).json({ error: "Badge not found" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.badges.includes(badgeName)) {
      user.badges.push(badgeName)
      await user.save()
    }

    res.json({ message: "Badge awarded successfully", user })
  } catch (error) {
    res.status(500).json({ error: "Failed to award badge" })
  }
})

// Check and award badges based on criteria
router.post("/check-badges/:userId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const badges = await Badge.find()
    const newBadges: string[] = []

    for (const badge of badges) {
      if (user.badges.includes(badge.name)) continue

      let shouldAward = false

      switch (badge.criteria) {
        case "reports_5":
          shouldAward = user.issuesReported >= 5
          break
        case "reports_10":
          shouldAward = user.issuesReported >= 10
          break
        case "resolved_5":
          shouldAward = user.issuesResolved >= 5
          break
        case "resolved_10":
          shouldAward = user.issuesResolved >= 10
          break
        case "points_100":
          shouldAward = user.points >= 100
          break
        case "points_500":
          shouldAward = user.points >= 500
          break
      }

      if (shouldAward) {
        user.badges.push(badge.name)
        newBadges.push(badge.name)
      }
    }

    if (newBadges.length > 0) {
      await user.save()
    }

    res.json({
      message: "Badge check completed",
      newBadges,
      user,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to check badges" })
  }
})

// Get user achievements
router.get("/achievements/:userId", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const badges = await Badge.find({ name: { $in: user.badges } })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        points: user.points,
        issuesReported: user.issuesReported,
        issuesResolved: user.issuesResolved,
      },
      badges,
      totalBadges: user.badges.length,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch achievements" })
  }
})

export default router
