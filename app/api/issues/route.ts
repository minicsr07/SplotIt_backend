import { connectDB } from "@/lib/db"
import Issue from "@/lib/models/Issue"
import User from "@/lib/models/User"
import { type NextRequest, NextResponse } from "next/server"

const generateComplaintId = () => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `SPOT-${dateStr}-${random}`
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    const filter: any = {}
    if (status) filter.status = status
    if (category) filter.category = category

    const issues = await Issue.find(filter).sort({ createdAt: -1 })
    return NextResponse.json(issues)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { title, description, category, location, photos, trainNumber, reporterEmail } = await req.json()

    const complaintId = generateComplaintId()
    const issue = new Issue({
      complaintId,
      title,
      description,
      category,
      location,
      photos,
      trainNumber,
      reporterEmail,
    })

    await issue.save()

    if (reporterEmail) {
      await User.updateOne({ email: reporterEmail }, { $inc: { points: 10, issuesReported: 1 } })
    }

    return NextResponse.json({ complaintId, issue })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
