import { NextResponse } from "next/server";
import {
    plansCron,
    getBalance,
    updateBalances,
    getUserBalance,
    getActiveUserPlans
} from "@/lib/services/userService"

export async function GET () {
    const userId: number = 2
    await plansCron(userId)
    const balance = await getBalance(userId)
    await updateBalances(userId, balance)
    const userBalance = await getUserBalance(userId)
    const totalBalance = userBalance.toFixed(8)
    const activePlans = await getActiveUserPlans(userId)
    const userEarningRate = activePlans
        .map(p => parseFloat(p.plan.earning_rate.toString()))
        .reduce((acc, curr) => acc + curr, 0)

    return NextResponse.json({
        balance: totalBalance,
        user_earning_rate: userEarningRate
    })
}