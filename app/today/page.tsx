import { prisma } from "@/lib/prisma"
import { toUiTasks } from "@/lib/toUiTask"
import TaskList from "@/components/TaskList"

export default async function TodayPage() {
  const tasksRaw = await prisma.task.findMany({
    where: { bucket: "TODAY" },
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
  })

  const tasks = toUiTasks(tasksRaw)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Today</h1>
      <TaskList initialTasks={tasks} />
    </div>
  )
}
