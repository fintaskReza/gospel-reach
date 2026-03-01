'use client'

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode as QrIcon, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Programme {
  id: string
  name: string
  isActive: boolean
}

export default function QRPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [selected, setSelected] = useState<string>('')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetch('/api/programmes').then(r => r.json()).then((data: Programme[]) => {
      const active = data.filter(p => p.isActive)
      setProgrammes(active)
      if (active.length > 0) setSelected(active[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    const url = `${window.location.origin}/join/${selected}`
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [selected])

  const signupUrl = selected ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${selected}` : ''

  function download() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `gospelreach-qr.png`
    link.href = qrDataUrl
    link.click()
  }

  function copyUrl() {
    navigator.clipboard.writeText(signupUrl)
    toast.success('Link copied!')
  }

  const selectedProg = programmes.find(p => p.id === selected)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">QR Codes</h1>

      {programmes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <QrIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No active programmes. Create and activate a programme first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Programme selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Programme</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {programmes.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* QR Code display */}
          {qrDataUrl && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center gap-4">
              <div className="text-center mb-2">
                <p className="font-semibold text-slate-800">{selectedProg?.name}</p>
                <p className="text-xs text-slate-400 mt-1">Scan to sign up for SMS messages</p>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-md border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR Code" className="w-56 h-56" />
              </div>

              <div className="w-full">
                <p className="text-xs text-slate-400 mb-1 text-center">Or share this link</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={signupUrl}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 truncate"
                  />
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={download} className="bg-blue-900 hover:bg-blue-800 gap-2 w-full">
                <Download className="w-4 h-4" /> Download QR Code
              </Button>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">Tips for street use:</p>
            <ul className="space-y-1 text-amber-700">
              <li>• Print the QR code and laminate it for outdoor use</li>
              <li>• Show it on your phone screen — most phones can scan QRs</li>
              <li>• Each programme gets its own unique QR code</li>
              <li>• Pausing a programme stops new sign-ups but messages still go to existing subscribers</li>
            </ul>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
