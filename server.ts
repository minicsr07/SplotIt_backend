import express, { type Express, type Request, type Response, type NextFunction } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/spotit"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Database Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  city: String,
  role: { type: String, enum: ["citizen", "authority", "admin"], default: "citizen" },
  points: { type: Number, default: 0 },
  badges: [String],
  issuesReported: { type: Number, default: 0 },
  issuesResolved: { type: Number, default: 0 },
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

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

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  rank: Number,
  city: String,
  month: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)
const Issue = mongoose.model("Issue", issueSchema)
const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema)

// Auth Middleware
interface AuthRequest extends Request {
  userId?: string
  user?: any
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
}

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "SpotIt Backend is running" })
})

// Auth Routes
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, city } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
    })

    await user.save()
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        city: user.city,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Login failed" })
  }
})

app.get("/api/auth/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// Issue Routes
app.post("/api/issues", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, severity, location, images } = req.body

    const issue = new Issue({
      title,
      description,
      category,
      severity,
      location,
      images,
      reportedBy: req.userId,
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

app.get("/api/issues", async (req: Request, res: Response) => {
  try {
    const { status, category, city } = req.query
    const filter: any = {}

    if (status) filter.status = status
    if (category) filter.category = category
    if (city) filter["location.city"] = city

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })

    res.json(issues)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issues" })
  }
})

app.get("/api/issues/:id", async (req: Request, res: Response) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
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

app.put("/api/issues/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
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
    }

    if (assignedTo) {
      issue.assignedTo = assignedTo
    }

    await issue.save()
    res.json({ message: "Issue updated successfully", issue })
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue" })
  }
})

// Leaderboard Routes
app.get("/api/leaderboard", async (req: Request, res: Response) => {
  try {
    const { city, limit = 10 } = req.query
    const filter: any = {}

    if (city) filter.city = city

    const leaderboard = await Leaderboard.find(filter)
      .populate("userId", "name email city profileImage")
      .sort({ points: -1 })
      .limit(Number(limit))

    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

app.get("/api/leaderboard/user/:userId", async (req: Request, res: Response) => {
  try {
    const userStats = await Leaderboard.findOne({ userId: req.params.userId }).populate(
      "userId",
      "name email city profileImage",
    )

    if (!userStats) {
      return res.status(404).json({ error: "User stats not found" })
    }

    res.json(userStats)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stats" })
  }
})

// Start Server
app.listen(PORT, () => {
  console.log(`SpotIt Backend running on port ${PORT}`)
})

export default app
