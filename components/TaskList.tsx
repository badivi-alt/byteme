"use client"

type Task = {
  id: string
  title: string
  status: "open" | "done"
  bucket: "TODAY" | "TOMORROW" | "LATER"
}

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const toggle = async (task: Task) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: task.status === "open" ? "done" : "open" })
    })
    window.location.reload()
  }

  const move = async (task: Task, bucket: Task["bucket"]) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket })
    })
    window.location.reload()
  }

  const remove = async (task: Task) => {
    if (!confirm("Delete task?")) return
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft divide-y">
      {initialTasks.length === 0 && (
        <div className="p-4 text-sm text-gray-500">Nothing here yet</div>
      )}
      {initialTasks.map((t) => (
        <div key={t.id} className="p-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={t.status === "done"}
            onChange={() => toggle(t)}
            className="h-4 w-4"
          />
          <div className="flex-1">
            <div className={t.status === "done" ? "line-through text-gray-500" : ""}>{t.title}</div>
          </div>
          <select
            value={t.bucket}
            onChange={(e) => move(t, e.target.value as Task["bucket"])}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="TODAY">Today</option>
            <option value="TOMORROW">Tomorrow</option>
            <option value="LATER">Later</option>
          </select>
          <button
            onClick={() => remove(t)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}