'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Message {
  content: string
  dayOffset: number
  sendHour: number
}

interface Props {
  initial?: {
    name: string
    description: string | null
    isActive: boolean
    messages: Message[]
  }
  onSave: (data: { name: string; description: string; isActive: boolean; messages: Message[] }) => void
  saving: boolean
}

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`,
}))

export default function ProgrammeForm({ initial, onSave, saving }: Props) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [messages, setMessages] = useState<Message[]>(
    initial?.messages || []
  )

  function addMessage() {
    const lastDay = messages.length > 0 ? messages[messages.length - 1].dayOffset : -1
    setMessages([...messages, { content: '', dayOffset: lastDay + 1, sendHour: 9 }])
  }

  function removeMessage(i: number) {
    setMessages(messages.filter((_, idx) => idx !== i))
  }

  function updateMessage(i: number, field: keyof Message, value: string | number) {
    const updated = [...messages]
    updated[i] = { ...updated[i], [field]: value }
    setMessages(updated)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ name, description, isActive, messages })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <Label htmlFor="name">Programme name *</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 7-Day Gospel Journey"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Input
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description shown on signup page"
            className="mt-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 text-sm"
          >
            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-slate-600">{isActive ? 'Active (accepting sign-ups)' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-slate-800">SMS Messages</h2>
            <p className="text-xs text-slate-400">Messages are sent on the day offset after sign-up</p>
          </div>
          <Badge variant="outline">{messages.length} messages</Badge>
        </div>

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs">Day offset (days after sign-up)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={msg.dayOffset}
                        onChange={(e) => updateMessage(i, 'dayOffset', parseInt(e.target.value) || 0)}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Send time</Label>
                      <select
                        value={msg.sendHour}
                        onChange={(e) => updateMessage(i, 'sendHour', parseInt(e.target.value))}
                        className="mt-1 h-8 text-sm w-full rounded-md border border-input bg-background px-3 py-1"
                      >
                        {HOURS.map((h) => (
                          <option key={h.value} value={h.value}>{h.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Message content</Label>
                    <Textarea
                      value={msg.content}
                      onChange={(e) => updateMessage(i, 'content', e.target.value)}
                      placeholder="Enter your SMS message... (160 chars per SMS)"
                      rows={3}
                      className="mt-1 text-sm resize-none"
                      maxLength={480}
                    />
                    <p className="text-xs text-slate-400 mt-1">{msg.content.length}/480 characters</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMessage(i)}
                  className="text-slate-300 hover:text-red-400 transition-colors mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addMessage}
          className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add message
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/programmes">
          <Button type="button" variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <Button type="submit" className="bg-blue-900 hover:bg-blue-800 gap-2 flex-1 sm:flex-none" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Programme
        </Button>
      </div>
    </form>
  )
}
