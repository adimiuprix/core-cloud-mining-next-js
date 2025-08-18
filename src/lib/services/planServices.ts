import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function plansCron(userId: number) {
  return prisma.userMiningRecord.updateMany({
    where: {
      user_id: userId,
      status: "active",
      expire_date: {
        not: null,
        lte: new Date(),
      },
    },
    data: {
      status: "inactive",
    },
  })
}