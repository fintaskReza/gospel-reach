'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BookOpen, MessageSquare, CheckCircle, Loader2, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProgrammeInfo {
  id: string
  name: string
  description: string | null
  preacherName: string
}

export default function JoinPage() {
  const { programmeId } = useParams<{ programmeId: string }>()
  const [programme, setProgramme] = useState<ProgrammeInfo | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/join/${programmeId}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => { if (data) setProgramme(data) })
  }, [programmeId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch(`/api/join/${programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, phone: form.phone }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
    } else {
      setSuccess(true)
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Programme not found</h1>
          <p className="text-blue-200">This programme may have ended or the link is incorrect.</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-sm">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-3">You are signed up!</h1>
          <p className="text-blue-200 mb-4">
            You will receive SMS messages from <strong className="text-white">{programme?.name}</strong>.
          </p>
          <div className="bg-white/10 rounded-xl p-4 text-sm text-blue-100">
            <p>Messages will come from a US number. You can unsubscribe any time by replying <strong>STOP</strong> or using the link in the message.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <span className="text-2xl font-bold text-white">GospelReach</span>
          </div>

          {!programme ? (
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded w-48 mx-auto mb-2" />
              <div className="h-4 bg-white/10 rounded w-32 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white">{programme.name}</h1>
              {programme.description && (
                <p className="text-blue-200 text-sm mt-1">{programme.description}</p>
              )}
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 px-3 py-1.5 rounded-full text-xs mt-3">
                <MessageSquare className="w-3 h-3" />
                <span>From {programme.preacherName}</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <p className="text-slate-600 text-sm mb-4">
            Enter your details to receive free SMS messages. No spam. Unsubscribe any time.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your name (optional)</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">
                Mobile number * <span className="text-slate-400 font-normal text-xs">(include country code, e.g. +353...)</span>
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+353 87 123 4567"
                  className="pl-9"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800"
              disabled={loading || !programme}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign me up for free
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            By signing up you agree to receive SMS messages. Reply STOP at any time to unsubscribe.
          </p>
        </div>
      </div>
    </div>
  )
}
