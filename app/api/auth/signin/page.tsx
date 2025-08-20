"use client"

import { signIn } from "next-auth/react"

export default function SignInPage() {
  const providers = [
    { id: "credentials", label: "Email + Password" },
    ...(process.env.NEXT_PUBLIC_HAS_GOOGLE ? [{ id: "google", label: "Continue with Google" }] : []),
    ...(process.env.NEXT_PUBLIC_HAS_GITHUB ? [{ id: "github", label: "Continue with GitHub" }] : [])
  ]

  async function demoLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    await signIn("credentials", { email, password, callbackUrl: "/" })
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="card p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Sign in</h1>

        <form onSubmit={demoLogin} className="space-y-3">
          <input name="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" defaultValue="demo@bytesized.dev" />
          <input name="password" type="password" placeholder="Password" className="w-full border rounded-lg px-3 py-2" defaultValue="demo123" />
          <button className="w-full rounded-lg bg-gray-900 text-white py-2">Sign in</button>
        </form>

        {providers.filter(p => p.id !== "credentials").length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 text-center">or</div>
            <div className="grid gap-2">
              {providers.filter(p => p.id !== "credentials").map(p => (
                <button
                  key={p.id}
                  onClick={() => signIn(p.id, { callbackUrl: "/" })}
                  className="w-full border rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
