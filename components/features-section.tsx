export default function FeaturesSection() {
  const features = [
    {
      title: "Easy Reporting",
      description: "Report issues with photos, location, and description in seconds",
      icon: "📍",
    },
    {
      title: "Smart Routing",
      description: "Issues automatically routed to relevant authorities (GHMC, IRCTC, etc.)",
      icon: "🎯",
    },
    {
      title: "Real-time Tracking",
      description: "Track issue status from open to resolved with live updates",
      icon: "📊",
    },
    {
      title: "Earn Rewards",
      description: "Gain points and badges for reporting and resolving issues",
      icon: "🏆",
    },
    {
      title: "Community Leaderboard",
      description: "Compete with other citizens and see top contributors",
      icon: "🥇",
    },
    {
      title: "Multi-language Support",
      description: "Available in English and Telugu for wider accessibility",
      icon: "🌐",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Why Choose SpotIt?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-8 rounded-lg border border-border hover:border-primary transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
