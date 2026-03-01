import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const programme = await prisma.programme.findFirst({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { order: 'asc' } } },
  })

  if (!programme) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(programme)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { name, description, isActive, messages } = await req.json()

  const programme = await prisma.programme.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!programme) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update programme + replace messages
  await prisma.$transaction(async (tx) => {
    await tx.programme.update({
      where: { id },
      data: { name, description, isActive },
    })

    if (messages !== undefined) {
      await tx.programmeMessage.deleteMany({ where: { programmeId: id } })
      if (messages.length > 0) {
        await tx.programmeMessage.createMany({
          data: messages.map((m: { content: string; dayOffset: number; sendHour: number }, i: number) => ({
            content: m.content,
            dayOffset: m.dayOffset,
            sendHour: m.sendHour ?? 9,
            order: i,
            programmeId: id,
          })),
        })
      }
    }
  })

  const updated = await prisma.programme.findFirst({
    where: { id },
    include: { messages: { orderBy: { order: 'asc' } } },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const programme = await prisma.programme.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!programme) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.programme.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
