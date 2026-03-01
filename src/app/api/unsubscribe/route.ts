import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubToken: token },
  })

  if (!subscriber) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { isActive: false },
  })

  // Cancel pending sms
  await prisma.scheduledSms.updateMany({
    where: { subscriberId: subscriber.id, status: 'pending' },
    data: { status: 'cancelled' },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gospel-reach.vercel.app'
  return NextResponse.redirect(new URL('/unsubscribe', appUrl))
}
