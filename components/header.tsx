"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          SpotIt
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/report" className="text-foreground hover:text-primary transition">
            Report Issue
          </Link>
          <Link href="/track" className="text-foreground hover:text-primary transition">
            Track
          </Link>
          <Link href="/issues" className="text-foreground hover:text-primary transition">
            Issues
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary transition">
            Leaderboard
          </Link>
          <Link href="/chatbot" className="text-foreground hover:text-primary transition">
            Chat
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              🔔<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </Button>
          </Link>
          <Button className="hidden md:inline-flex">Login</Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-2">
          <Link href="/report" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Report Issue
          </Link>
          <Link href="/track" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Track
          </Link>
          <Link href="/issues" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Issues
          </Link>
          <Link href="/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Leaderboard
          </Link>
          <Link href="/chatbot" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
            Chat
          </Link>
          <Button className="w-full">Login</Button>
        </div>
      )}
    </header>
  )
}
