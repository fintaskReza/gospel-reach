'use client'

import { useEffect, useState } from 'react'
import { Users, MessageSquare, ListChecks, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardData {
  totalSubscribers: number
  activeSubscribers: number
  programmes: number
  smsSent: number
  recentSubscribers: Array<{
    id: string
    name: string | null
    phone: string
    createdAt: string
    programme: { name: string }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/dashboard').then((r) => r.json()).then(setData)
  }, [])

  const stats = data
    ? [
        { label: 'Total Subscribers', value: data.totalSubscribers, icon: Users, color: 'bg-blue-50 text-blue-700' },
        { label: 'Active Subscribers', value: data.activeSubscribers, icon: Users, color: 'bg-green-50 text-green-700' },
        { label: 'Programmes', value: data.programmes, icon: ListChecks, color: 'bg-purple-50 text-purple-700' },
        { label: 'SMS Sent', value: data.smsSent, icon: Send, color: 'bg-amber-50 text-amber-700' },
      ]
    : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color.split(' ')[0]}`}>
            <div className={`flex items-center gap-2 ${s.color.split(' ')[1]} mb-1`}>
              <s.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{s.value}</div>
          </div>
        ))}
        {!data && (
          [...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 bg-slate-100 animate-pulse h-20" />
          ))
        )}
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Recent Sign-ups</h2>
        </div>
        {data?.recentSubscribers.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-6">
            No subscribers yet. Share your QR code to get started!
          </p>
        )}
        <div className="space-y-3">
          {data?.recentSubscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-medium text-sm text-slate-800">{s.name || 'Anonymous'}</p>
                <p className="text-xs text-slate-400">{s.programme.name}</p>
              </div>
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
