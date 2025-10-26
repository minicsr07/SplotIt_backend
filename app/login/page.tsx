import LoginForm from "@/components/login-form"
import Header from "@/components/header"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Login</h1>
        <p className="text-muted-foreground mb-8">Sign in to your SpotIt account</p>
        <LoginForm />
      </div>
    </main>
  )
}
