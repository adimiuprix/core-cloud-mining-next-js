import { PrismaClient } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

const prisma = new PrismaClient()

export async function getBalance(userId: number) {
  const currentTime = Math.floor(Date.now() / 1000)

  const userPlans = await prisma.userMiningRecord.findMany({
    where: {
      user_id: userId,
      status: "active"
    },
    include: {
      plan: true
    }
  })

  let totalEarning = 0
  const idsToUpdate: number[] = []

  userPlans.forEach(plan => {
    const lastSum = plan.last_sum ? Number(plan.last_sum) : Math.floor(new Date(plan.createdAt).getTime() / 1000)
    const sec = currentTime - lastSum
    const earning = sec * (Number(plan.plan.earning_rate) / 60)  // sama kaya Laravel
    totalEarning += earning
    idsToUpdate.push(plan.id)
  })

  if (idsToUpdate.length > 0) {
    await prisma.userMiningRecord.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { last_sum: BigInt(currentTime) }
    })
  }

  return totalEarning.toFixed(8)
}

export async function updateBalances(userId: number, balance: number) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (user) {
      await tx.user.update({
        where: { id: userId },
        data: { balance: user.balance.plus(new Decimal(balance)) }
      })
    }
    return user
  })
}

export async function getUserBalance(userId: number): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  return Number(user.balance)
}

export async function getActiveUserPlans(userId: number) {
  return prisma.userMiningRecord.findMany({
    where: { user_id: userId, status: "active" },
    include: { plan: true }
  })
}