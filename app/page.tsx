"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import StatsSection from "@/components/stats-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />

      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of citizens reporting and resolving civic issues</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/report">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Report an Issue
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
