// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const id = process.env.DEMO_USER_ID ?? "demo-user-id";

  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  console.log("Seeded demo user:", id);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
