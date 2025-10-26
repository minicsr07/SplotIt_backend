import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const users = await User.find().select("name email points issuesReported city").sort({ points: -1 }).limit(100)

    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
