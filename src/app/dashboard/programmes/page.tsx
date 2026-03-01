'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, Trash2, Pencil, Users, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Programme {
  id: string
  name: string
  description: string | null
  isActive: boolean
  messages: { id: string }[]
  _count: { subscribers: number }
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/programmes')
    const data = await res.json()
    setProgrammes(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function copyProgramme(id: string) {
    const res = await fetch(`/api/programmes/${id}/copy`, { method: 'POST' })
    if (res.ok) {
      toast.success('Programme copied')
      load()
    }
  }

  async function deleteProgramme(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will remove all subscriber data for this programme.`)) return
    const res = await fetch(`/api/programmes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Programme deleted')
      load()
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const prog = programmes.find(p => p.id === id)
    if (!prog) return
    await fetch(`/api/programmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: prog.name, description: prog.description, isActive: !current }),
    })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Programmes</h1>
        <Link href="/dashboard/programmes/new">
          <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
            <Plus className="w-4 h-4" /> New
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-slate-200 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && programmes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 mb-4">No programmes yet. Create your first one!</p>
          <Link href="/dashboard/programmes/new">
            <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
              <Plus className="w-4 h-4" /> Create Programme
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {programmes.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800 truncate">{p.name}</h3>
                  <Badge variant={p.isActive ? 'default' : 'secondary'} className="text-xs shrink-0">
                    {p.isActive ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                {p.description && (
                  <p className="text-sm text-slate-500 truncate">{p.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>{p.messages.length} messages</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {p._count.subscribers} subscribers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(p.id, p.isActive)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title={p.isActive ? 'Pause' : 'Activate'}
                >
                  {p.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <Link href={`/dashboard/programmes/${p.id}`}>
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={() => copyProgramme(p.id)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProgramme(p.id, p.name)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
