"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function Topbar() {
  const { data } = useSession()

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="font-medium">Welcome{data?.user?.name ? `, ${data.user.name}` : ""}</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">{data?.user?.email}</div>
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