"use client"

import { useState } from "react"
import { useToast } from "@/components/Toaster"

export default function AddLibraryItem() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), url: url.trim(), description: description.trim() })
      })
      if (!res.ok) throw new Error(await res.text())
      setTitle(""); setUrl(""); setDescription("")
      toast({ type: "success", message: "Saved to library" })
      // best-effort refresh library list via custom event
      window.dispatchEvent(new CustomEvent("library:refresh"))
    } catch {
      toast({ type: "error", message: "Could not save" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-[1fr,1fr,160px] gap-3">
      <input
        className="border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
        placeholder="https://link (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 text-white px-3 py-2 hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add"}
      </button>
      <textarea
        className="md:col-span-3 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
        placeholder="Short description (optional)"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </form>
  )
}
