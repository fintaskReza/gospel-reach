'use client'

import { useEffect, useState } from 'react'
import { Users, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Subscriber {
  id: string
  name: string | null
  phone: string
  isActive: boolean
  createdAt: string
  programme: { name: string }
  scheduledSms: Array<{
    scheduledFor: string
    status: string
  }>
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscribers')
      .then(r => r.json())
      .then(data => { setSubscribers(data); setLoading(false) })
  }, [])

  const active = subscribers.filter(s => s.isActive).length
  const inactive = subscribers.filter(s => !s.isActive).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Subscribers</h1>

      <div className="flex gap-4 mb-6">
        <span className="text-sm text-slate-500">{active} active</span>
        <span className="text-sm text-slate-400">{inactive} unsubscribed</span>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && subscribers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">No subscribers yet. Share your QR code to get started!</p>
        </div>
      )}

      <div className="space-y-2">
        {subscribers.map(s => {
          const nextSms = s.scheduledSms.find(sms => sms.status === 'pending')
          return (
            <div
              key={s.id}
              className={`bg-white rounded-xl border px-4 py-3 flex items-center justify-between gap-3 ${!s.isActive ? 'opacity-60 border-slate-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.isActive ? 'bg-green-100' : 'bg-slate-100'}`}>
                  {s.isActive
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : <XCircle className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">
                    {s.name || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="w-3 h-3" />
                    <span>{s.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Badge variant="outline" className="text-xs mb-1 block">
                  {s.programme.name}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(s.createdAt), 'dd/MM/yy')}</span>
                </div>
                {nextSms && (
                  <p className="text-xs text-blue-500 mt-1">
                    Next SMS: {format(new Date(nextSms.scheduledFor), 'dd/MM HH:mm')}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
