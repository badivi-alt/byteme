import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const Patch = z.object({
  title: z.string().trim().min(1).optional(),
  url: z.string().url().optional().nullable(),
  description: z.string().trim().optional().nullable()
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = Patch.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const item = await prisma.libraryItem.update({
    where: { id: params.id },
    data: parsed.data
  })
  return NextResponse.json({ item })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.libraryItem.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
