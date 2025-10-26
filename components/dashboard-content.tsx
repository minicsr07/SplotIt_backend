"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Issue {
  complaintId: string
  title: string
  status: string
  category: string
  createdAt: string
  updatedAt: string
  location: { address: string }
  votes: number
}

interface DashboardStats {
  totalIssues: number
  resolvedIssues: number
  inProgressIssues: number
  pendingIssues: number
}

export default function DashboardContent() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    pendingIssues: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues`)
        const data = await response.json()
        setIssues(data)

        // Calculate stats
        const resolved = data.filter((i: Issue) => i.status === "Resolved").length
        const inProgress = data.filter((i: Issue) => i.status === "In Progress").length
        const pending = data.filter((i: Issue) => i.status === "Pending").length

        setStats({
          totalIssues: data.length,
          resolvedIssues: resolved,
          inProgressIssues: inProgress,
          pendingIssues: pending,
        })
      } catch (error) {
        console.error("Error fetching issues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <span className="text-xl">✓</span>
      case "In Progress":
        return <span className="text-xl">⏳</span>
      default:
        return <span className="text-xl">⚠️</span>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-success/10 text-success"
      case "In Progress":
        return "bg-warning/10 text-warning"
      case "Escalated":
        return "bg-error/10 text-error"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Train: "bg-blue-100 text-blue-800",
      Road: "bg-orange-100 text-orange-800",
      Sanitation: "bg-green-100 text-green-800",
      Lighting: "bg-yellow-100 text-yellow-800",
      Water: "bg-cyan-100 text-cyan-800",
      Traffic: "bg-red-100 text-red-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true
    return issue.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track and manage civic issues in your area</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalIssues}</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl font-bold text-success">{stats.resolvedIssues}</p>
            </div>
            <span className="text-4xl">✓</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-warning">{stats.inProgressIssues}</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-muted-foreground">{stats.pendingIssues}</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </Card>
      </div>

      {/* Issues List */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Issues</h2>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
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
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.complaintId} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(issue.status)}
                      <h3 className="text-lg font-semibold text-foreground">{issue.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.complaintId}</p>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(issue.category)}`}>
                      {issue.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{issue.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📅</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">📊</span>
                    <span className="text-sm font-medium text-foreground">{issue.votes} votes</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
