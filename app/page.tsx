import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stats from "@/components/Stats"
import AddLibraryItem from "@/components/AddLibraryItem"
import LibraryList from "@/components/LibraryList"

export default async function OverviewPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null
  const userId = user?.id ?? ""

  const [counts, todayTop, library] = await Promise.all([
    prisma.task.groupBy({
      by: ["bucket"],
      where: { userId, status: "open" },
      _count: true
    }),
    prisma.task.findMany({
      where: { userId, bucket: "TODAY", status: "open" },
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
      take: 5
    }),
    prisma.libraryItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ])

  const openTotal = counts.reduce((a, c) => a + c._count, 0)
  const byBucket = (b: string) => counts.find(x => x.bucket === b)?._count ?? 0

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <Stats
        cards={[
          { label: "Open tasks", value: openTotal },
          { label: "Today", value: byBucket("TODAY") },
          { label: "Tomorrow", value: byBucket("TOMORROW") },
          { label: "Later", value: byBucket("LATER") }
        ]}
      />

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Today’s plan</h2>
          {todayTop.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Nothing planned yet.</div>
          ) : (
            <ul className="space-y-2">
              {todayTop.map(t => (
                <li key={t.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-0.5" />
                  <span>{t.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Quick add to Library</h2>
            <AddLibraryItem />
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Library</h2>
            <LibraryList initialItems={library} />
          </div>
        </div>
      </section>
    </div>
  )
}
