import express, { type Request, type Response } from "express"
import { Issue } from "../models/Issue"
import { User } from "../models/User"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, severity, location, images } = req.body

    // Determine authority based on category
    const authorityMap: Record<string, string> = {
      pothole: "ROADS",
      streetlight: "ELECTRICITY",
      water: "WATER",
      train: "IRCTC",
      garbage: "GHMC",
      default: "GHMC",
    }

    const assignedAuthority = authorityMap[category] || authorityMap.default

    const issue = new Issue({
      title,
      description,
      category,
      severity,
      location,
      images,
      reportedBy: req.userId,
      assignedAuthority,
      timeline: [
        {
          status: "reported",
          comment: "Issue reported by citizen",
        },
      ],
    })

    await issue.save()

    // Update user points
    await User.findByIdAndUpdate(req.userId, {
      $inc: { points: 10, issuesReported: 1 },
    })

    res.status(201).json({
      message: "Issue reported successfully",
      issue,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to report issue" })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, category, city, severity, limit = 20, page = 1 } = req.query
    const filter: any = {}

    if (status) filter.status = status
    if (category) filter.category = category
    if (city) filter["location.city"] = city
    if (severity) filter.severity = severity

    const skip = (Number(page) - 1) * Number(limit)

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email city")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Issue.countDocuments(filter)

    res.json({
      issues,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issues" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email city profileImage")
      .populate("assignedTo", "name email")
      .populate("timeline.updatedBy", "name email")

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    res.json(issue)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issue" })
  }
})

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, comment, assignedTo } = req.body

    const issue = await Issue.findById(req.params.id)
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    if (status) {
      issue.status = status
      issue.timeline.push({
        status,
        comment,
        updatedBy: req.userId,
      })

      // Award points for resolving issues
      if (status === "resolved") {
        await User.findByIdAndUpdate(req.userId, {
          $inc: { points: 50, issuesResolved: 1 },
        })
      }
    }

    if (assignedTo) {
      issue.assignedTo = assignedTo
    }

    issue.updatedAt = new Date()
    await issue.save()

    res.json({ message: "Issue updated successfully", issue })
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue" })
  }
})

router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const issues = await Issue.find({ reportedBy: req.params.userId })
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })

    res.json(issues)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user issues" })
  }
})

router.get("/authority/:authorityType", async (req: Request, res: Response) => {
  try {
    const { status, limit = 20, page = 1 } = req.query
    const filter: any = { assignedAuthority: req.params.authorityType }

    if (status) filter.status = status

    const skip = (Number(page) - 1) * Number(limit)

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email city")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Issue.countDocuments(filter)

    res.json({
      issues,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authority issues" })
  }
})

export default router
