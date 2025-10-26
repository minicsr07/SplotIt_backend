"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  issuesReported: number
  joinedDate: string
  status: "active" | "inactive"
}

interface AdminIssue {
  id: string
  title: string
  category: string
  status: string
  reportedBy: string
  createdAt: string
  priority: "low" | "medium" | "high"
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      issuesReported: 5,
      joinedDate: "2025-01-01",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      issuesReported: 8,
      joinedDate: "2024-12-15",
      status: "active",
    },
  ])

  const [issues] = useState<AdminIssue[]>([
    {
      id: "SPOT-001",
      title: "Pothole on Main Street",
      category: "Road",
      status: "In Progress",
      reportedBy: "John Doe",
      createdAt: "2025-01-10",
      priority: "high",
    },
    {
      id: "SPOT-002",
      title: "Water Supply Issue",
      category: "Water",
      status: "Pending",
      reportedBy: "Jane Smith",
      createdAt: "2025-01-12",
      priority: "medium",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-error/10 text-error"
      case "medium":
        return "bg-warning/10 text-warning"
      case "low":
        return "bg-success/10 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-success/10 text-success"
      case "In Progress":
        return "bg-warning/10 text-warning"
      case "Pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage issues, users, and system settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-foreground">1,234</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
              <p className="text-3xl font-bold text-foreground">567</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl font-bold text-success">432</p>
            </div>
            <span className="text-4xl">✓</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolution Rate</p>
              <p className="text-3xl font-bold text-primary">76%</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-foreground">New issue reported: Pothole on Main Street</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-foreground">Issue resolved: Water supply issue</span>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-foreground">New user registered: Jane Smith</span>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Issues</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-foreground">{user.issuesReported}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.joinedDate}</td>
                    <td className="px-6 py-4">
                      <Badge className={user.status === "active" ? "bg-success/10 text-success" : "bg-muted"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === "issues" && (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="border border-border rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{issue.title}</h4>
                    <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{issue.id}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Category: {issue.category}</span>
                    <span>Reported by: {issue.reportedBy}</span>
                    <span>Date: {issue.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-error hover:text-error bg-transparent">
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send notifications to users</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded">
                  <div>
                    <p className="font-medium text-foreground">Auto-escalation</p>
                    <p className="text-sm text-muted-foreground">Automatically escalate old issues</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>
            </div>
            <Button className="btn-primary">Save Settings</Button>
          </div>
        )}
      </Card>
    </div>
  )
}
