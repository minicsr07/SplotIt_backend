import { connectDB } from "@/lib/db"
import Issue from "@/lib/models/Issue"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { text, author } = await req.json()

    const issue = await Issue.findByIdAndUpdate(
      params.id,
      { $push: { comments: { text, author, timestamp: new Date() } } },
      { new: true },
    )

    return NextResponse.json(issue)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
