"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"

interface Issue {
  _id: string
  title: string
  description: string
  category: string
  severity: string
  status: string
  address: string
  createdAt: string
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issues")
        const data = await response.json()
        setIssues(data)
      } catch (error) {
        console.error("Error fetching issues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  const filteredIssues = filter === "all" ? issues : issues.filter((issue) => issue.status === filter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger/10 text-danger"
      case "high":
        return "bg-warning/10 text-warning"
      case "medium":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-success/10 text-success"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-success/10 text-success"
      case "in-progress":
        return "bg-primary/10 text-primary"
      case "closed":
        return "bg-muted"
      default:
        return "bg-warning/10 text-warning"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Reported Issues</h1>
          <Link href="/report">
            <Button>Report New Issue</Button>
          </Link>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "open", "in-progress", "resolved", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading issues...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No issues found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredIssues.map((issue) => (
              <Link key={issue._id} href={`/issues/${issue._id}`}>
                <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-foreground">{issue.title}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{issue.description}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{issue.address}</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
