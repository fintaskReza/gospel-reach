import Link from 'next/link'
import { QrCode, MessageSquare, Users, Trophy, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      {/* Nav */}
      <nav className="px-4 py-4 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <span className="text-xl font-bold">GospelReach</span>
        </div>
        <div className="flex gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 text-sm px-3">
              Log in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-semibold text-sm px-4">
              Get Started Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <span>Free for street preachers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Share the Gospel<br />
          <span className="text-amber-400">one scan at a time</span>
        </h1>
        <p className="text-blue-200 text-lg mb-8">
          Generate QR codes strangers can scan to receive scheduled SMS messages with scripture,
          testimonies, and the good news — all managed by you.
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-lg px-8 py-6 rounded-xl">
            Start for free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* How it works */}
      <section className="px-4 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-blue-950" />
            </div>
            <h3 className="font-bold mb-2">1. Create a programme</h3>
            <p className="text-blue-200 text-sm">
              Set up a series of SMS messages to send over days or weeks — scriptures, encouragements, gospel messages.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-950" />
            </div>
            <h3 className="font-bold mb-2">2. Share your QR code</h3>
            <p className="text-blue-200 text-sm">
              Print or show your QR code. A stranger scans it, enters their number, and they are signed up instantly.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-950" />
            </div>
            <h3 className="font-bold mb-2">3. Messages go out automatically</h3>
            <p className="text-blue-200 text-sm">
              Messages are sent on schedule via SMS. Recipients can unsubscribe any time. You track everything.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: <Trophy className="w-5 h-5" />, title: 'Leaderboard', desc: 'See how many souls your fellow preachers are reaching.' },
            { icon: <QrCode className="w-5 h-5" />, title: 'QR per Programme', desc: 'Different QR codes for different message series.' },
            { icon: <MessageSquare className="w-5 h-5" />, title: 'Easy unsubscribe', desc: 'Every SMS has a one-click unsubscribe link.' },
            { icon: <Users className="w-5 h-5" />, title: 'Subscriber manager', desc: 'See who signed up, when, and their message status.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 bg-white/5 rounded-xl p-4">
              <div className="text-amber-400 mt-0.5">{f.icon}</div>
              <div>
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-blue-200 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to reach more people?</h2>
        <p className="text-blue-200 mb-8">Free forever. No credit card needed.</p>
        <Link href="/auth/register">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold px-8">
            Create your free account
          </Button>
        </Link>
      </section>

      <footer className="text-center py-6 text-blue-300 text-sm border-t border-white/10">
        <p>GospelReach &mdash; Go into all the world. Mark 16:15</p>
      </footer>
    </div>
  )
}
