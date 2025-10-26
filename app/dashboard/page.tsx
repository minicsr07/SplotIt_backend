"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/auth/login"
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        // This would be implemented in the backend
        setUser({ name: "User", points: 0, badges: [] })
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Your Points</h3>
            <div className="text-4xl font-bold text-primary">{user?.points || 0}</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Badges Earned</h3>
            <div className="text-4xl font-bold text-secondary">{user?.badges?.length || 0}</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Issues Reported</h3>
            <div className="text-4xl font-bold text-success">0</div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/report">
              <Button className="w-full">Report New Issue</Button>
            </Link>
            <Link href="/issues">
              <Button variant="outline" className="w-full bg-transparent">
                View All Issues
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="w-full bg-transparent">
                View Leaderboard
              </Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
