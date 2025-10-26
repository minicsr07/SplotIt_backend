import express, { type Request, type Response } from "express"
import { Issue } from "../models/Issue"
import { Authority } from "../models/Authority"
import { Escalation } from "../models/Escalation"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Get all authorities
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, city } = req.query
    const filter: any = {}

    if (type) filter.type = type
    if (city) filter.city = city

    const authorities = await Authority.find(filter).sort({ resolvedIssues: -1 })

    res.json(authorities)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authorities" })
  }
})

// Get authority details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const authority = await Authority.findById(req.params.id)

    if (!authority) {
      return res.status(404).json({ error: "Authority not found" })
    }

    res.json(authority)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authority" })
  }
})

// Get authority's assigned issues
router.get("/:authorityType/issues", async (req: Request, res: Response) => {
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

// Assign issue to authority
router.post("/:authorityType/assign/:issueId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { assignedTo } = req.body

    const issue = await Issue.findById(req.params.issueId)
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    issue.assignedTo = assignedTo
    issue.status = "assigned"
    issue.timeline.push({
      status: "assigned",
      comment: `Assigned to authority: ${req.params.authorityType}`,
      updatedBy: req.userId,
    })

    await issue.save()

    // Update authority stats
    await Authority.findOneAndUpdate({ type: req.params.authorityType }, { $inc: { activeIssues: 1 } })

    res.json({ message: "Issue assigned successfully", issue })
  } catch (error) {
    res.status(500).json({ error: "Failed to assign issue" })
  }
})

// Escalate issue to higher authority
router.post("/escalate/:issueId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body

    const issue = await Issue.findById(req.params.issueId)
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    const escalationMap: Record<string, string> = {
      ROADS: "GHMC",
      ELECTRICITY: "GHMC",
      WATER: "GHMC",
      IRCTC: "IRCTC",
      GHMC: "GHMC",
    }

    const toAuthority = escalationMap[issue.assignedAuthority || "GHMC"]

    const escalation = new Escalation({
      issueId: issue._id,
      fromAuthority: issue.assignedAuthority,
      toAuthority,
      reason,
      escalationLevel: (issue.escalationLevel || 0) + 1,
    })

    await escalation.save()

    issue.escalationLevel = (issue.escalationLevel || 0) + 1
    issue.timeline.push({
      status: "escalated",
      comment: `Escalated to ${toAuthority}: ${reason}`,
      updatedBy: req.userId,
    })

    await issue.save()

    res.json({ message: "Issue escalated successfully", escalation })
  } catch (error) {
    res.status(500).json({ error: "Failed to escalate issue" })
  }
})

// Get escalations
router.get("/escalations/pending", async (req: Request, res: Response) => {
  try {
    const escalations = await Escalation.find({ status: "pending" }).populate("issueId").sort({ timestamp: -1 })

    res.json(escalations)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch escalations" })
  }
})

// Accept escalation
router.post("/escalations/:escalationId/accept", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const escalation = await Escalation.findByIdAndUpdate(
      req.params.escalationId,
      { status: "accepted" },
      { new: true },
    )

    if (!escalation) {
      return res.status(404).json({ error: "Escalation not found" })
    }

    const issue = await Issue.findById(escalation.issueId)
    if (issue) {
      issue.assignedAuthority = escalation.toAuthority
      issue.timeline.push({
        status: "escalation-accepted",
        comment: `Escalation accepted by ${escalation.toAuthority}`,
        updatedBy: req.userId,
      })
      await issue.save()
    }

    res.json({ message: "Escalation accepted", escalation })
  } catch (error) {
    res.status(500).json({ error: "Failed to accept escalation" })
  }
})

export default router
