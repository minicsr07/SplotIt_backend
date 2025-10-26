import express, { type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, city, role } = req.body

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
      role: role || "citizen",
    })

    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req: Request, res: Response) => {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

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

router.get("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

router.put("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, city, profileImage } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, city, profileImage, updatedAt: new Date() },
      { new: true },
    ).select("-password")

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" })
  }
})

export default router
