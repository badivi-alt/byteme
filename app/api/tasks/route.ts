import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Bucket = "TODAY" | "TOMORROW" | "LATER";
const asBucket = (b: unknown): Bucket =>
  b === "TOMORROW" ? "TOMORROW" : b === "LATER" ? "LATER" : "TODAY";

// GET /api/tasks?bucket=TODAY|TOMORROW|LATER&userId=<id>
export async function GET(req: Request) {
  const url = new URL(req.url);
  const bucketParam = url.searchParams.get("bucket");
  const userIdParam = url.searchParams.get("userId");
  const userId = (userIdParam ?? process.env.DEMO_USER_ID ?? "").trim();

  const where: any = {};
  if (bucketParam) where.bucket = asBucket(bucketParam);
  if (userId) where.userId = userId;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

// POST /api/tasks
// body: { title: string; bucket?: Bucket; notes?: string; userId?: string }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  const title = String(body.title ?? "").trim();
  const notes = body.notes ?? null;
  const bucket = asBucket(body.bucket);
  const bodyUserId = typeof body.userId === "string" ? body.userId.trim() : "";
  const userId = (bodyUserId || process.env.DEMO_USER_ID || "").trim();

  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json(
      { error: "userId required. Pass body.userId or set DEMO_USER_ID in .env" },
      { status: 400 }
    );
  }

  // Satisfy required relation by connecting (or creating) the user
  const created = await prisma.task.create({
    data: {
      title,
      notes,
      bucket,
      status: "open",
      user: {
        connectOrCreate: {
          where: { id: userId },
          create: { id: userId, email: "demo@example.com", name: "Demo User" },
        },
      },
    },
  });

  return NextResponse.json({ task: created }, { status: 201 });
}
