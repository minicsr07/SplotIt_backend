"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Issue {
  complaintId: string
  title: string
  description: string
  status: string
  category: string
  createdAt: string
  updatedAt: string
  location: { address: string }
  votes: number
}

export default function IssueTracker() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const categories = ["all", "Train", "Road", "Sanitation", "Lighting", "Water", "Traffic", "Other"]

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues`)
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

  useEffect(() => {
    const filtered = issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "votes") {
      filtered.sort((a, b) => b.votes - a.votes)
    } else if (sortBy === "updated") {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    setFilteredIssues(filtered)
  }, [issues, searchTerm, selectedCategory, sortBy])

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Issue Tracker</h1>
        <p className="text-muted-foreground">Browse and track all reported civic issues</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-3 text-muted-foreground">🔍</span>
              <Input
                placeholder="Search issues by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground mt-2">⚙️</span>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground mt-2">Sort by:</span>
            <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
              Recent
            </Button>
            <Button variant={sortBy === "votes" ? "default" : "outline"} size="sm" onClick={() => setSortBy("votes")}>
              Most Voted
            </Button>
            <Button
              variant={sortBy === "updated" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("updated")}
            >
              Recently Updated
            </Button>
          </div>
        </div>
      </Card>

      {/* Issues Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading issues...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No issues found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Card key={issue.complaintId} className="p-6 hover:shadow-lg transition">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground flex-1">{issue.title}</h3>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{issue.complaintId}</p>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{issue.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(issue.category)}`}>
                    {issue.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📍</span>
                  <span className="truncate">{issue.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📅</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <span className="text-primary">👍</span>
                  <span className="text-sm font-medium text-foreground">{issue.votes}</span>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
