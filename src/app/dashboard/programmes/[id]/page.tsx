'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProgrammeForm from '@/components/ProgrammeForm'
import { toast } from 'sonner'

interface Programme {
  id: string
  name: string
  description: string | null
  isActive: boolean
  messages: { content: string; dayOffset: number; sendHour: number; order: number }[]
}

export default function EditProgrammePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [programme, setProgramme] = useState<Programme | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/programmes/${id}`).then((r) => r.json()).then(setProgramme)
  }, [id])

  async function handleSave(data: {
    name: string
    description: string
    isActive: boolean
    messages: { content: string; dayOffset: number; sendHour: number }[]
  }) {
    setSaving(true)
    const res = await fetch(`/api/programmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Programme saved!')
      router.push('/dashboard/programmes')
    } else {
      toast.error('Failed to save')
    }
  }

  if (!programme) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-48" />
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Programme</h1>
      <ProgrammeForm
        initial={programme}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  )
}
