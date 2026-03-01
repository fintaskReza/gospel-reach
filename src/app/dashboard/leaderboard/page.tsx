'use client'

import { useEffect, useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import { format } from 'date-fns'

interface Entry {
  rank: number
  name: string
  count: number
  memberSince: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
  }, [])

  const rankColors = ['text-amber-500', 'text-slate-400', 'text-amber-700']
  const rankBg = ['bg-amber-50 border-amber-200', 'bg-slate-50 border-slate-200', 'bg-orange-50 border-orange-200']

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-7 h-7 text-amber-500" />
        <h1 className="text-2xl font-bold text-slate-800">Leaderboard</h1>
      </div>
      <p className="text-sm text-slate-500 mb-6">Ranked by active subscribers — keep reaching people!</p>

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-16 text-slate-400">No preachers registered yet.</div>
      )}

      <div className="space-y-2">
        {entries.map((e) => (
          <div
            key={e.rank}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${e.rank <= 3 ? rankBg[e.rank - 1] : 'bg-white border-slate-200'}`}
          >
            <div className={`text-2xl font-bold w-8 text-center ${e.rank <= 3 ? rankColors[e.rank - 1] : 'text-slate-400'}`}>
              {e.rank <= 3 ? <Medal className="w-6 h-6 mx-auto" /> : e.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">{e.name}</p>
              <p className="text-xs text-slate-400">Since {format(new Date(e.memberSince), 'MMM yyyy')}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">{e.count}</p>
              <p className="text-xs text-slate-400">subscribers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
