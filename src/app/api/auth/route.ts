import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sessionOptions, createCookieStore } from '@/lib/session'
import { getIronSession } from 'iron-session';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username } = await req.json();
  
  let user = await prisma.user.findFirst({ where: { username } });
  const defaultPlan = await prisma.plan.findFirst({ where: { is_default: true } });
  if (!defaultPlan) return NextResponse.json({ error: "Default plan not found" }, { status: 400 });

  try {
    const cookieStore = await createCookieStore();
    const session = await getIronSession(cookieStore, sessionOptions);

    if (user) {
      // Login: simpan session
      session.userId = user.id;
      session.username = user.username;
      await session.save();

      return NextResponse.json({ message: "Login successful", userId: user.id });
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

      // Buat session setelah register
      session.userId = user.id;
      session.username = user.username;
      await session.save();

      return NextResponse.json({ message: "Register successful", userId: user.id });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
