"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "info" | "error"
  read: boolean
  createdAt: Date
  relatedIssueId?: string
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Issue Resolved",
      message: "Your reported pothole on Main Street has been marked as resolved.",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 3600000),
      relatedIssueId: "SPOT-20250101-0001",
    },
    {
      id: "2",
      title: "Status Update",
      message: "Your water supply complaint is now in progress. Authorities are investigating.",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 7200000),
      relatedIssueId: "SPOT-20250101-0002",
    },
    {
      id: "3",
      title: "Escalation Alert",
      message: "Your complaint has been escalated to the municipal corporation.",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 86400000),
      relatedIssueId: "SPOT-20250101-0003",
    },
  ])
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <span className="text-2xl">✓</span>
      case "warning":
        return <span className="text-2xl">⚠️</span>
      case "error":
        return <span className="text-2xl">❌</span>
      default:
        return <span className="text-2xl">ℹ️</span>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/10 text-success"
      case "warning":
        return "bg-warning/10 text-warning"
      case "error":
        return "bg-error/10 text-error"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "read") return n.read
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔔</span>
            <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && <Badge className="bg-error text-white">{unreadCount} new</Badge>}
        </div>
        <p className="text-muted-foreground">Stay updated on your reported issues and complaints</p>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6 flex items-center justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <span className="mr-2">✓</span>
            Mark all as read
          </Button>
        )}
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <span className="text-6xl mb-4 block">🔔</span>
            <p className="text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 flex items-start gap-4 ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{notification.title}</h3>
                  {!notification.read && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
                  {notification.relatedIssueId && (
                    <span className="text-xs text-primary font-medium">{notification.relatedIssueId}</span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 flex gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="text-primary hover:text-primary"
                  >
                    ✓
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                  className="text-muted-foreground hover:text-error"
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
