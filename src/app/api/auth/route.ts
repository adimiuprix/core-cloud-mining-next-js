'use server'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username } = await req.json();

  let user = await prisma.user.findFirst({ where: { username } });
  const defaultPlan = await prisma.plan.findFirst({ where: { is_default: true } });
  if (!defaultPlan) return NextResponse.json({ error: "Default plan not found" }, { status: 400 });

  try {
    if (user) {
      const userData = {id: user.id, username: user.username}
      return NextResponse.json(
        { message: 'Login successful', userId: user.id },
        {
          status: 200,
          headers: {
            'Set-Cookie': `session=${encodeURIComponent(JSON.stringify(userData))}; HttpOnly; Path=/; SameSite=Lax`,
          },
        }
      )
    } else {
      // Register + assign default plan
      user = await prisma.user.create({ data: { username } });
      const now = new Date();
      const expireDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await prisma.userMiningRecord.create({
        data: {
          user_id: user.id,
          plan_id: defaultPlan.id,
          status: "active",
          createdAt: now,
          expire_date: expireDate,
          last_sum: BigInt(Math.floor(Date.now() / 1000)),
        },
      });

      const userData = {id: user.id, username: user.username}
      return NextResponse.json(
        { message: 'Register successful', userId: user.id },
        {
          status: 200,
          headers: {
            'Set-Cookie': `session=${encodeURIComponent(JSON.stringify(userData))}; HttpOnly; Path=/; SameSite=Lax`,
          },
        }
      )
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
