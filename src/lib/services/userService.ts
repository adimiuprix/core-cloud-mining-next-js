import { PrismaClient } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

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

export async function getBalance (userId: number) {
    const currentTime = (Date.now() / 1000) | 0

    // Ambil user plans yang aktif, join dengan plans untuk dapat earning_rate
    const userPlans = await prisma.userMiningRecord.findMany({
        where: {
            user_id: userId,
            status: 'active',
        },
        select: {
            id: true,
            last_sum: true,
            createdAt: true,
            plan: {
                select: {
                earning_rate: true,
                },
            },
        },
    })

    if (userPlans.length === 0) return 0.00000000

    let totalEarning = 0
    const idsToUpdate: number[] = []

    for (const plan of userPlans) {
        const lastSum = Number(plan.last_sum) ? Number(plan.last_sum) : Math.floor(plan.createdAt.getTime() / 1000)
        const sec = currentTime - lastSum
        const earning = sec * (Number(plan.plan.earning_rate) / 60)

        totalEarning += earning
        idsToUpdate.push(plan.id)
    }

    if (idsToUpdate.length > 0) {
        await prisma.userMiningRecord.updateMany({
            where: { id: { in: idsToUpdate } },
            data: { last_sum: BigInt(currentTime) },
        })
    }

    return Number(totalEarning.toFixed(8))
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

export async function getUserBalance (userId: number) {
    const result = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true }
    })
    return result.balance
}

export async function getActiveUserPlans(userId: number) {
  return prisma.userMiningRecord.findMany({
    where: { user_id: userId, status: "active" },
    include: { plan: true }
  })
}
