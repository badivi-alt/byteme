import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "demo@bytesized.dev"
  const password = "demo123"
  const passwordHash = await hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo User",
      passwordHash,
      image: null
    }
  })

  // Clean previous demo data
  await prisma.task.deleteMany({ where: { userId: user.id } })
  await prisma.libraryItem.deleteMany({ where: { userId: user.id } })

  await prisma.task.createMany({
    data: [
      { userId: user.id, title: "Set up the project", bucket: "TODAY" },
      { userId: user.id, title: "Write first task", bucket: "TODAY" },
      { userId: user.id, title: "Plan tomorrow work", bucket: "TOMORROW" },
      { userId: user.id, title: "Backlog brainstorming", bucket: "LATER" }
    ]
  })

  await prisma.libraryItem.createMany({
    data: [
      { userId: user.id, title: "Product vision note", description: "Short doc to align on outcomes" },
      { userId: user.id, title: "Design inspiration", url: "https://dribbble.com", description: "Mood board" }
    ]
  })

  console.log("Seed complete")
  console.log("Login with:", email, "password:", password)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})