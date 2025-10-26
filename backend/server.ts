import express, { type Express } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database"

// Import routes
import authRoutes from "./routes/auth"
import issueRoutes from "./routes/issues"
import authorityRoutes from "./routes/authority"
import leaderboardRoutes from "./routes/leaderboard"
import chatbotRoutes from "./routes/chatbot"
import notificationRoutes from "./routes/notifications"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Connect to MongoDB
connectDB()

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "SpotIt Backend is running", timestamp: new Date() })
})

app.use("/api/auth", authRoutes)
app.use("/api/issues", issueRoutes)
app.use("/api/authority", authorityRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/chatbot", chatbotRoutes)
app.use("/api/notifications", notificationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Start Server
app.listen(PORT, () => {
  console.log(`SpotIt Backend running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

export default app
