import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const original = await prisma.programme.findFirst({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { order: 'asc' } } },
  })

  if (!original) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const copy = await prisma.programme.create({
    data: {
      name: `${original.name} (Copy)`,
      description: original.description,
      userId: session.user.id,
      messages: {
        create: original.messages.map((m) => ({
          content: m.content,
          dayOffset: m.dayOffset,
          sendHour: m.sendHour,
          order: m.order,
        })),
      },
    },
    include: { messages: { orderBy: { order: 'asc' } } },
  })

  return NextResponse.json(copy, { status: 201 })
}
