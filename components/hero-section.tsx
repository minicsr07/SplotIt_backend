export default function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Report Civic Issues, <span className="text-primary">Drive Change</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          SpotIt empowers citizens to report and track civic issues like potholes, broken streetlights, and water
          problems. Earn points, climb the leaderboard, and make your community better.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <p className="text-muted-foreground">Issues Reported</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-secondary mb-2">15K+</div>
            <p className="text-muted-foreground">Active Citizens</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-success mb-2">8K+</div>
            <p className="text-muted-foreground">Issues Resolved</p>
          </div>
        </div>
      </div>
    </section>
  )
}
