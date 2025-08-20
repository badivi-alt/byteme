"use client"

import { useState } from "react"

type Bucket = "TODAY" | "TOMORROW" | "LATER"

export default function AddTask({ defaultBucket = "TODAY" }: { defaultBucket?: Bucket }) {
  const [title, setTitle] = useState("")
  const [bucket, setBucket] = useState<Bucket>(defaultBucket)
  const [loading, setLoading] = useState(false)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, bucket })
    })
    setLoading(false)
    if (res.ok) {
      setTitle("")
      window.location.reload()
    }
  }

  return (
    <form onSubmit={create} className="bg-white rounded-xl p-4 shadow-soft grid md:grid-cols-[1fr,160px,120px] gap-3">
      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="border rounded-lg px-3 py-2 focus:outline-none"
        value={bucket}
        onChange={(e) => setBucket(e.target.value as Bucket)}
      >
        <option value="TODAY">Today</option>
        <option value="TOMORROW">Tomorrow</option>
        <option value="LATER">Later</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 text-white px-3 py-2 hover:opacity-90"
      >
        {loading ? "Adding..." : "Add task"}
      </button>
    </form>
  )
}