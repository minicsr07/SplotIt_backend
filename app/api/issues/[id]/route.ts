import { connectDB } from "@/lib/db"
import Issue from "@/lib/models/Issue"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const issue = await Issue.findById(params.id)
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }
    return NextResponse.json(issue)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { status, note, assignedAuthority } = await req.json()

    const issue = await Issue.findByIdAndUpdate(
      params.id,
      { status, assignedAuthority, updatedAt: new Date() },
      { new: true },
    )

    if (note) {
      issue.notes.push({ text: note, addedBy: "admin", timestamp: new Date() })
      await issue.save()
    }

    return NextResponse.json(issue)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
