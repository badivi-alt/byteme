import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DndPlanBoard from "@/components/DndPlanBoard"
import { toUiTasks } from "@/lib/toUiTask"

export default async function PlanPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null
  const userId = user?.id ?? ""

  const [todayRaw, tomorrowRaw, laterRaw] = await Promise.all([
    prisma.task.findMany({ where: { userId, bucket: "TODAY" }, orderBy: [{ createdAt: "desc" }] }),
    prisma.task.findMany({ where: { userId, bucket: "TOMORROW" }, orderBy: [{ createdAt: "desc" }] }),
    prisma.task.findMany({ where: { userId, bucket: "LATER" }, orderBy: [{ createdAt: "desc" }] }),
  ])

  const today = toUiTasks(todayRaw)
  const tomorrow = toUiTasks(tomorrowRaw)
  const later = toUiTasks(laterRaw)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Plan</h1>
      <DndPlanBoard initial={{ TODAY: today, TOMORROW: tomorrow, LATER: later }} />
    </div>
  )
}
