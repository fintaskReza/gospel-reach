import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns'

export async function GET(req: Request, { params }: { params: Promise<{ programmeId: string }> }) {
  const { programmeId } = await params

  const programme = await prisma.programme.findFirst({
    where: { id: programmeId, isActive: true },
    include: { user: { select: { name: true } } },
  })

  if (!programme) return NextResponse.json({ error: 'Programme not found' }, { status: 404 })

  return NextResponse.json({
    id: programme.id,
    name: programme.name,
    description: programme.description,
    preacherName: programme.user.name,
  })
}

export async function POST(req: Request, { params }: { params: Promise<{ programmeId: string }> }) {
  const { programmeId } = await params
  const { phone, name } = await req.json()

  if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

  // Normalize phone - ensure E.164 format
  let normalizedPhone = phone.replace(/\s+/g, '').replace(/-/g, '')
  if (!normalizedPhone.startsWith('+')) {
    normalizedPhone = '+' + normalizedPhone
  }

  const programme = await prisma.programme.findFirst({
    where: { id: programmeId, isActive: true },
    include: {
      messages: { orderBy: { order: 'asc' } },
      user: { select: { id: true } },
    },
  })

  if (!programme) return NextResponse.json({ error: 'Programme not found or inactive' }, { status: 404 })

  // Check if already subscribed
  const existing = await prisma.subscriber.findFirst({
    where: { phone: normalizedPhone, programmeId },
  })

  if (existing && existing.isActive) {
    return NextResponse.json({ error: 'Already subscribed to this programme' }, { status: 400 })
  }

  // Create or reactivate subscriber
  let subscriber
  const now = new Date()

  if (existing) {
    subscriber = await prisma.subscriber.update({
      where: { id: existing.id },
      data: { name, isActive: true, createdAt: now },
    })
    // Clear old scheduled sms
    await prisma.scheduledSms.deleteMany({
      where: { subscriberId: subscriber.id, status: 'pending' },
    })
  } else {
    subscriber = await prisma.subscriber.create({
      data: {
        phone: normalizedPhone,
        name,
        programmeId,
        userId: programme.user.id,
      },
    })
  }

  // Schedule SMS messages
  const schedules = programme.messages.map((msg) => {
    const sendDate = addDays(now, msg.dayOffset)
    const scheduledFor = setSeconds(setMinutes(setHours(sendDate, msg.sendHour), 0), 0)
    return {
      subscriberId: subscriber.id,
      messageId: msg.id,
      scheduledFor,
    }
  })

  if (schedules.length > 0) {
    await prisma.scheduledSms.createMany({ data: schedules })
  }

  return NextResponse.json({ success: true, subscriberId: subscriber.id }, { status: 201 })
}
