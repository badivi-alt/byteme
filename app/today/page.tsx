import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TaskList from "@/components/TaskList"
import AddTask from "@/components/AddTask"

export default async function TodayPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null
  const userId = user?.id ?? ""

  const tasks = await prisma.task.findMany({
    where: { userId, bucket: "TODAY" },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Today</h1>
      <AddTask defaultBucket="TODAY" />
      <TaskList initialTasks={tasks} />
    </div>
  )
}