import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, notes, status, bucket } = body as {
    title?: string
    notes?: string | null
    status?: "open" | "done"
    bucket?: "TODAY" | "TOMORROW" | "LATER"
  }

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(bucket !== undefined ? { bucket } : {})
    }
  })

  return NextResponse.json({ task: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}