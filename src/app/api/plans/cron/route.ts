import { NextResponse } from "next/server"
import { plansCron } from '@/lib/services/planServices'

export async function POST(req: Request) {
  const { userId } = await req.json()
  await plansCron(userId)
  return NextResponse.json({ message: "Plans updated successfully" })
}