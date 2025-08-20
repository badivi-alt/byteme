"use client"

import TaskList from "./TaskList"

type Task = {
  id: string
  title: string
  status: "open" | "done"
  bucket: "TODAY" | "TOMORROW" | "LATER"
}

export default function PlanColumn({
  title,
  bucket,
  initialTasks
}: {
  title: string
  bucket: "TODAY" | "TOMORROW" | "LATER"
  initialTasks: Task[]
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <TaskList initialTasks={initialTasks} />
    </div>
  )
}