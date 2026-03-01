'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProgrammeForm from '@/components/ProgrammeForm'
import { toast } from 'sonner'

export default function NewProgrammePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSave(data: {
    name: string
    description: string
    isActive: boolean
    messages: { content: string; dayOffset: number; sendHour: number }[]
  }) {
    setSaving(true)
    // Create programme
    const res = await fetch('/api/programmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, description: data.description }),
    })
    const prog = await res.json()
    if (!res.ok) {
      toast.error(prog.error || 'Failed to create')
      setSaving(false)
      return
    }
    // Update with messages
    await fetch(`/api/programmes/${prog.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    toast.success('Programme created!')
    router.push('/dashboard/programmes')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">New Programme</h1>
      <ProgrammeForm onSave={handleSave} saving={saving} />
    </div>
  )
}
