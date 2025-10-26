"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiCall } from "@/lib/api-client"

interface IssueStatus {
  complaintId: string
  title: string
  status: string
  category: string
  createdAt: string
  updatedAt: string
  notes: Array<{ text: string; timestamp: string }>
}

export default function TrackForm() {
  const [searchInput, setSearchInput] = useState("")
  const [issue, setIssue] = useState<IssueStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setIssue(null)

    try {
      const data = await apiCall(`/issues?complaintId=${searchInput}`)

      if (Array.isArray(data) && data.length > 0) {
        setIssue(data[0])
      } else {
        setError("Complaint not found. Please check your complaint ID.")
      }
    } catch (err) {
      setError("Error searching for complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <span className="text-2xl">✓</span>
      case "In Progress":
        return <span className="text-2xl">⏳</span>
      default:
        return <span className="text-2xl">⚠️</span>
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

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Complaint ID or Email</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g., SPOT-20250101-0001 or your@email.com"
            className="input-field"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full btn-primary">
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && (
        <div className="card bg-error/5 border-error text-error">
          <p>{error}</p>
        </div>
      )}

      {issue && (
        <div className="card space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{issue.title}</h2>
              <p className="text-muted-foreground">{issue.complaintId}</p>
            </div>
            {getStatusIcon(issue.status)}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium text-foreground">{issue.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}
              >
                {issue.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reported On</p>
              <p className="font-medium text-foreground">{new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium text-foreground">{new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {issue.notes.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="font-bold text-foreground mb-4">Updates</h3>
              <div className="space-y-3">
                {issue.notes.map((note, idx) => (
                  <div key={idx} className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</p>
                    <p className="text-foreground mt-1">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
