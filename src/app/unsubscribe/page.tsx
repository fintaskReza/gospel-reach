import { BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-8 h-8 text-amber-400" />
          <span className="text-2xl font-bold">GospelReach</span>
        </div>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Unsubscribed</h1>
        <p className="text-blue-200 mb-6">
          You have been successfully unsubscribed and will not receive any more messages.
        </p>
        <p className="text-sm text-blue-300">
          Changed your mind?{' '}
          <Link href="/" className="text-amber-300 underline">
            Visit GospelReach
          </Link>{' '}
          to sign up again.
        </p>
      </div>
    </div>
  )
}
