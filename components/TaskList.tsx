"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/Toaster"

type Task = {
  id: string
  title: string
  status: "open" | "done"
  bucket: "TODAY" | "TOMORROW" | "LATER"
}

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [busy, setBusy] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const toast = useToast()
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // keep done at bottom
  useEffect(() => {
    setTasks((list) => sortWithDoneLast(list))
  }, [])

  function sortWithDoneLast(list: Task[]) {
    const open = list.filter(t => t.status === "open")
    const done = list.filter(t => t.status === "done")
    return [...open, ...done]
  }

  const persistOrder = async (bucket: Task["bucket"], ids: string[]) => {
    await fetch("/api/tasks/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, ids })
    })
  }

  const patch = async (id: string, data: Partial<Task>) => {
    const idx = tasks.findIndex(t => t.id === id)
    if (idx === -1) return
    const prev = tasks[idx]
    const next = { ...prev, ...data }

    const optimistic = sortWithDoneLast(tasks.map((t, i) => (i === idx ? next : t)))
    setTasks(optimistic)

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error(await res.text())
      if (typeof data.status !== "undefined") {
        await persistOrder(prev.bucket, optimistic.map(t => t.id))
      }
      toast({ type: "success", message: "Updated task" })
    } catch {
      setTasks(tasks) // rollback visual
      toast({ type: "error", message: "Could not save changes" })
    }
  }

  const toggle = async (t: Task) => {
    setBusy(t.id)
    await patch(t.id, { status: t.status === "open" ? "done" : "open" })
    setBusy(null)
  }

  const cycleBucket = (b: Task["bucket"]): Task["bucket"] =>
    b === "TODAY" ? "TOMORROW" : b === "TOMORROW" ? "LATER" : "TODAY"

  const move = async (t: Task, bucket: Task["bucket"]) => {
    setBusy(t.id)
    const snapshot = tasks
    // optimistic remove from Today list if moving away
    const optimistic = bucket === "TODAY" ? snapshot : snapshot.filter(x => x.id !== t.id)
    setTasks(optimistic)
    try {
      const res = await fetch(`/api/tasks/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket })
      })
      if (!res.ok) throw new Error(await res.text())
      toast({ type: "success", message: bucket === "TODAY" ? "Moved within Today" : `Moved to ${bucket.toLowerCase()}` })
    } catch {
      setTasks(snapshot)
      toast({ type: "error", message: "Could not move task" })
    } finally {
      setBusy(null)
    }
  }

  const remove = async (t: Task) => {
    if (!confirm("Delete task?")) return
    const prev = tasks
    setTasks(cur => cur.filter(x => x.id !== t.id))
    try {
      const res = await fetch(`/api/tasks/${t.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      toast({ type: "success", message: "Deleted task" })
    } catch {
      setTasks(prev)
      toast({ type: "error", message: "Could not delete task" })
    }
  }

  const onKeyDown = (e: React.KeyboardEvent, t: Task, index: number) => {
    if (e.key === "x" || e.key === " ") {
      e.preventDefault()
      toggle(t)
      return
    }
    if (e.key.toLowerCase() === "m") {
      e.preventDefault()
      move(t, cycleBucket(t.bucket))
      return
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault()
      remove(t)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = tasks[index + 1]
      if (next) {
        setActiveId(next.id)
        rowRefs.current[next.id]?.focus()
      }
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = tasks[index - 1]
      if (prev) {
        setActiveId(prev.id)
        rowRefs.current[prev.id]?.focus()
      }
      return
    }
  }

  useEffect(() => {
    // when list changes, keep focus on the same id if possible
    if (activeId && rowRefs.current[activeId]) {
      rowRefs.current[activeId]!.focus()
    }
  }, [tasks, activeId])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft divide-y divide-gray-100 dark:divide-gray-800">
      {tasks.length === 0 && (
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Nothing here yet</div>
      )}
      {tasks.map((t, i) => (
        <div
          key={t.id}
          ref={(el) => (rowRefs.current[t.id] = el)}
          tabIndex={0}
          onFocus={() => setActiveId(t.id)}
          onKeyDown={(e) => onKeyDown(e, t, i)}
          className={
            "p-4 flex items-center gap-3 outline-none " +
            (activeId === t.id ? "ring-2 ring-brand rounded-xl" : "")
          }
        >
          <input
            type="checkbox"
            checked={t.status === "done"}
            onChange={() => toggle(t)}
            className="h-4 w-4"
            disabled={busy === t.id}
            aria-label="Toggle done"
          />
          <div className="flex-1">
            <div className={t.status === "done" ? "line-through text-gray-500 dark:text-gray-400" : ""}>
              {t.title}
            </div>
          </div>
          <select
            value={t.bucket}
            onChange={(e) => move(t, e.target.value as Task["bucket"])}
            className="border rounded-lg px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
            disabled={busy === t.id}
            aria-label="Change bucket"
          >
            <option value="TODAY">Today</option>
            <option value="TOMORROW">Tomorrow</option>
            <option value="LATER">Later</option>
          </select>
          <button
            onClick={() => remove(t)}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
            disabled={busy === t.id}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
