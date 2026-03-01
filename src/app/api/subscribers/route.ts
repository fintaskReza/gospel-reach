import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const programmeId = url.searchParams.get('programmeId')

  const subscribers = await prisma.subscriber.findMany({
    where: {
      userId: session.user.id,
      ...(programmeId ? { programmeId } : {}),
    },
    include: {
      programme: { select: { name: true } },
      scheduledSms: {
        where: { status: { in: ['pending', 'sent'] } },
        orderBy: { scheduledFor: 'asc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(subscribers)
}
