import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.plan.create({
    data: {
      plan_name: "Plan 1",
      earn_per_day: 0.50000000,
      earning_rate: 1.50000000,
      price: 100.00000000,
      duration: 1,
      profit: 15.00000000,
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
