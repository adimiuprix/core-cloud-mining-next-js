import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' })
  res.cookies.set('session', '', { maxAge: 0 }) // hapus cookie
  return res
}
