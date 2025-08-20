"use client"

import { useEffect, useMemo, useState } from "react"
import { useToast } from "@/components/Toaster"

type Item = {
  id: string
  title: string
  url?: string | null
  description?: string | null
  createdAt: string
}

export default function LibraryList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const toast = useToast()

  // external refresh (after quick add)
  useEffect(() => {
    const handler = async () => {
      const res = await fetch("/api/library")
      const json = await res.json()
      setItems(json.items ?? [])
    }
    window.addEventListener("library:refresh" as any, handler)
    return () => window.removeEventListener("library:refresh" as any, handler)
  }, [])

  const remove = async (it: Item) => {
    if (!confirm("Remove from library?")) return
    const snapshot = items
    setItems(cur => cur.filter(x => x.id !== it.id))
    try {
      const res = await fetch(`/api/library/${it.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      toast({ type: "success", message: "Removed" })
    } catch {
      setItems(snapshot)
      toast({ type: "error", message: "Could not remove" })
    }
  }

  const update = async (id: string, patch: Partial<Item>) => {
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return
    const prev = items[idx]
    const next = { ...prev, ...patch }
    setItems(cur => {
      const copy = [...cur]; copy[idx] = next; return copy
    })
    try {
      const res = await fetch(`/api/library/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      })
      if (!res.ok) throw new Error(await res.text())
      toast({ type: "success", message: "Updated" })
    } catch {
      setItems(cur => {
        const copy = [...cur]; copy[idx] = prev; return copy
      })
      toast({ type: "error", message: "Could not update" })
    }
  }

  if (items.length === 0) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">No items yet.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="flex items-start gap-3 border rounded-xl p-3 dark:border-gray-700">
          <div className="flex-1">
            <input
              className="w-full bg-transparent font-medium outline-none"
              value={it.title}
              onChange={(e) => update(it.id, { title: e.target.value })}
            />
            {it.url && (
              <a href={it.url} target="_blank" className="text-sm text-blue-600 dark:text-blue-400 underline">
                {it.url}
              </a>
            )}
            {typeof it.description === "string" && (
              <textarea
                className="mt-2 w-full bg-transparent text-sm outline-none"
                rows={2}
                placeholder="Add a short note…"
                value={it.description ?? ""}
                onChange={(e) => update(it.id, { description: e.target.value })}
              />
            )}
          </div>
          <button
            onClick={() => remove(it)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
