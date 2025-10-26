"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"

interface LeaderboardEntry {
  _id: string
  name: string
  points: number
  badges: string[]
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        const data = await response.json()
        setLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "🎖️"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Community Leaderboard</h1>
        <p className="text-muted-foreground mb-8">Top contributors making a difference in their communities</p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry._id}
                className="bg-card p-6 rounded-lg border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getMedalEmoji(index + 1)}</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      #{index + 1} {entry.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {entry.badges.map((badge, i) => (
                        <span key={i} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{entry.points}</div>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
