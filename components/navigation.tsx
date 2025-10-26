"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg text-foreground">SpotIt</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link href="/issues" className="text-foreground hover:text-primary transition">
            Issues
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary transition">
            Leaderboard
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Sign Up</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border p-4 flex flex-col gap-4">
          <Link href="/issues" className="text-foreground hover:text-primary">
            Issues
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary">
            Leaderboard
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary">
            Dashboard
          </Link>
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              Login
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button className="w-full">Sign Up</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
