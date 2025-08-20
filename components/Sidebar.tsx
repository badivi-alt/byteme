"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CalendarCheck2, ListChecks, Library } from "lucide-react"
import clsx from "clsx"

const items = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/today", label: "Today", icon: ListChecks },
  { href: "/plan", label: "Plan", icon: CalendarCheck2 },
  { href: "/library", label: "Library", icon: Library }
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-14 flex items-center px-4 text-xl font-semibold">
        <span className="text-brand">Byte</span>Sized
      </div>
      <nav className="px-2 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100",
                active && "bg-gray-100 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}