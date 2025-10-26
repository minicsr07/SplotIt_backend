export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-muted-foreground">Available Anytime</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">100%</div>
            <p className="text-muted-foreground">Free to Use</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-success mb-2">5+</div>
            <p className="text-muted-foreground">Issue Categories</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-warning mb-2">10+</div>
            <p className="text-muted-foreground">Authorities Connected</p>
          </div>
        </div>
      </div>
    </section>
  )
}
