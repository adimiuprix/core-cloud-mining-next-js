import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type User = {
    id: number
}

async function main() {
  await prisma.user.create<User>({
    data: { name: "Admin", email: "admin@test.com" },
  })
}

main().finally(() => prisma.$disconnect())