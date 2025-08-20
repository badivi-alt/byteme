import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const bucket = searchParams.get("bucket") as "TODAY" | "TOMORROW" | "LATER" | null

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ tasks: [] })

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      ...(bucket ? { bucket } : {})
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json({ tasks })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, notes, bucket } = body as { title: string; notes?: string; bucket?: "TODAY" | "TOMORROW" | "LATER" }
  if (!title || title.trim().length === 0) return NextResponse.json({ error: "Title required" }, { status: 400 })

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      notes: notes?.trim() || null,
      bucket: bucket ?? "TODAY",
      userId: user.id
    }
  })

  return NextResponse.json({ task }, { status: 201 })
}