import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const [totalSubscribers, activeSubscribers, programmes, recentSubscribers, smsSent] =
    await Promise.all([
      prisma.subscriber.count({ where: { userId } }),
      prisma.subscriber.count({ where: { userId, isActive: true } }),
      prisma.programme.count({ where: { userId } }),
      prisma.subscriber.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { programme: { select: { name: true } } },
      }),
      prisma.scheduledSms.count({
        where: { subscriber: { userId }, status: 'sent' },
      }),
    ])

  return NextResponse.json({
    totalSubscribers,
    activeSubscribers,
    programmes,
    smsSent,
    recentSubscribers,
  })
}
