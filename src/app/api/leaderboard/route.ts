import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: { subscribers: { where: { isActive: true } } },
      },
    },
    orderBy: { subscribers: { _count: 'desc' } },
    take: 50,
  })

  return NextResponse.json(
    users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      count: u._count.subscribers,
      memberSince: u.createdAt,
    }))
  )
}
