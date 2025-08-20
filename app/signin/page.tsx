"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("demo@bytesized.dev")
  const [password, setPassword] = useState("demo123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/"
    })
    setLoading(false)
    if (res?.ok) {
      window.location.href = "/"
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-soft p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Password</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90"
        >
          <LogIn className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-gray-500">
          Use the demo account from the seed step.
        </p>
      </form>
    </div>
  )
}