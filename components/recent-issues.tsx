"use client"

import { useEffect, useState } from "react"

interface Issue {
  _id: string
  complaintId: string
  title: string
  category: string
  location: { address: string }
  status: string
  createdAt: string
}

export default function RecentIssues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues?status=Resolved`)
        const data = await response.json()
        setIssues(data.slice(0, 6))
      } catch (error) {
        console.error("Error fetching issues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  return (
    <section className="py-16 px-4 bg-muted">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-foreground">Recently Resolved Issues</h2>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading issues...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div key={issue._id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground">{issue.category}</p>
                  </div>
                  <span className="text-2xl text-success">✓</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{issue.location?.address || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <span className="inline-block bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium">
                    {issue.complaintId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
