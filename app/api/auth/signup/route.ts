import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, phone, city } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = new User({ name, email, password, phone, city })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      token,
      user: { id: user._id, name, email },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
