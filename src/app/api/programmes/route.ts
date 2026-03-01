import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const programmes = await prisma.programme.findMany({
    where: { userId: session.user.id },
    include: {
      messages: { orderBy: { order: 'asc' } },
      _count: { select: { subscribers: { where: { isActive: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(programmes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const programme = await prisma.programme.create({
    data: { name, description, userId: session.user.id },
  })

  return NextResponse.json(programme, { status: 201 })
}
