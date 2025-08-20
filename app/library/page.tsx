import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function LibraryPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user!.email! } })
    : null
  const userId = user?.id ?? ""

  const items = await prisma.libraryItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Library</h1>
      <div className="grid gap-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="font-medium">{it.title}</div>
            {it.url ? (
              <a className="text-sm text-brand" href={it.url} target="_blank" rel="noreferrer">
                {it.url}
              </a>
            ) : (
              <p className="text-sm text-gray-600">{it.description}</p>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No items yet</p>}
      </div>
    </div>
  )
}