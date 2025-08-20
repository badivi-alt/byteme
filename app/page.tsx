import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function OverviewPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null

  const userId = user?.id ?? ""

  const [tasks, library] = await Promise.all([
    prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.libraryItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
  ])

  const openCount = tasks.filter(t => t.status === "open").length
  const doneCount = tasks.filter(t => t.status === "done").length
  const todayList = tasks.filter(t => t.bucket === "TODAY" && t.status === "open").slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="text-sm text-gray-500">Open tasks</div>
          <div className="text-3xl font-semibold">{openCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-3xl font-semibold">{doneCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="text-sm text-gray-500">Library items</div>
          <div className="text-3xl font-semibold">{library.length}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Today plan</h2>
            <Link href="/today" className="text-sm text-brand">View all</Link>
          </div>
          <ul className="space-y-2">
            {todayList.length === 0 && <li className="text-sm text-gray-500">No tasks for today</li>}
            {todayList.map(t => (
              <li key={t.id} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand inline-block" />
                <span>{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Library</h2>
            <Link href="/library" className="text-sm text-brand">Open</Link>
          </div>
          <ul className="space-y-2">
            {library.slice(0, 5).map(item => (
              <li key={item.id} className="truncate">
                <span className="font-medium">{item.title}</span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 ml-2"
                  >
                    {new URL(item.url).hostname}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500 ml-2">{item.description}</span>
                )}
              </li>
            ))}
            {library.length === 0 && <li className="text-sm text-gray-500">No items yet</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}