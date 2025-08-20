import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import PlanColumn from "@/components/PlanColumn"

export default async function PlanPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null
  const userId = user?.id ?? ""

  const [today, tomorrow, later] = await Promise.all([
    prisma.task.findMany({ where: { userId, bucket: "TODAY" }, orderBy: [{ status: "asc" }, { createdAt: "desc" }] }),
    prisma.task.findMany({ where: { userId, bucket: "TOMORROW" }, orderBy: [{ status: "asc" }, { createdAt: "desc" }] }),
    prisma.task.findMany({ where: { userId, bucket: "LATER" }, orderBy: [{ status: "asc" }, { createdAt: "desc" }] })
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanColumn title="Today" bucket="TODAY" initialTasks={today} />
        <PlanColumn title="Tomorrow" bucket="TOMORROW" initialTasks={tomorrow} />
        <PlanColumn title="Later" bucket="LATER" initialTasks={later} />
      </div>
    </div>
  )
}