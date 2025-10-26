import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">See it. Spot it. Solve it.</h1>
        <p className="text-xl md:text-2xl mb-8 text-balance opacity-90">
          Report civic issues in your neighborhood and track their resolution in real-time
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/report">
            <Button className="bg-accent hover:bg-accent-light text-white px-8 py-3 text-lg">Report an Issue</Button>
          </Link>
          <Link href="/track">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg bg-transparent"
            >
              Track Complaint
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
