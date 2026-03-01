import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendSms } from '@/lib/twilio'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Get all pending SMS that should have been sent by now
  const pending = await prisma.scheduledSms.findMany({
    where: {
      status: 'pending',
      scheduledFor: { lte: now },
      subscriber: { isActive: true },
    },
    include: {
      subscriber: true,
      message: true,
    },
    take: 50, // process in batches
  })

  const results = { sent: 0, failed: 0, skipped: 0 }

  for (const sms of pending) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gospel-reach.vercel.app'
      const unsubUrl = `${appUrl}/unsubscribe?token=${sms.subscriber.unsubToken}`

      const body = `${sms.message.content}\n\nReply STOP to unsubscribe or visit: ${unsubUrl}`

      const twilioSid = await sendSms(sms.subscriber.phone, body)

      await prisma.scheduledSms.update({
        where: { id: sms.id },
        data: { status: 'sent', sentAt: now, twilioSid },
      })

      results.sent++
    } catch (err) {
      console.error(`Failed to send SMS ${sms.id}:`, err)
      await prisma.scheduledSms.update({
        where: { id: sms.id },
        data: { status: 'failed' },
      })
      results.failed++
    }
  }

  return NextResponse.json({ ...results, processedAt: now.toISOString() })
}
