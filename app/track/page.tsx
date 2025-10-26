import TrackForm from "@/components/track-form"
import Header from "@/components/header"

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Track Your Complaint</h1>
        <p className="text-muted-foreground mb-8">Enter your complaint ID or email to check the status</p>
        <TrackForm />
      </div>
    </main>
  )
}
