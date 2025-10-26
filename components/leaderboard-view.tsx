"use client"

import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"

interface LeaderboardEntry {
  _id: string
  name: string
  points: number
  issuesReported: number
  city?: string
}

export default function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await apiCall("/leaderboard")
        setLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🏆</span>
    if (rank === 2) return <span className="text-2xl">🥈</span>
    if (rank === 3) return <span className="text-2xl">🥉</span>
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="card overflow-hidden">
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading leaderboard...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Issues Reported</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={entry._id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4 flex items-center gap-2">{getMedalIcon(idx + 1)}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{entry.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{entry.issuesReported}</td>
                  <td className="px-6 py-4 font-bold text-primary">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
