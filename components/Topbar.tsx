"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false
  const saved = localStorage.getItem("theme")
  if (saved === "dark") return true
  if (saved === "light") return false
  // fall back to system preference
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

export default function Topbar() {
  const { data } = useSession()
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(getInitialDark())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark, mounted])

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      <div className="font-medium">
        Welcome{data?.user?.name ? `, ${data.user.name}` : ""}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark((d) => !d)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {mounted && dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {data?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:opacity-90"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  )
}
