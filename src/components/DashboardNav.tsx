'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  Users,
  QrCode,
  Trophy,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/programmes', label: 'Programmes', icon: ListChecks },
  { href: '/dashboard/subscribers', label: 'Subscribers', icon: Users },
  { href: '/dashboard/qr', label: 'QR Codes', icon: QrCode },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function DashboardNav({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <div className="bg-blue-950 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">GospelReach</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-xs hidden sm:block">{userName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-blue-200 hover:text-white hover:bg-white/10 px-2"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom nav (mobile) / side-ish top nav */}
      <nav className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="flex max-w-4xl mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors',
                  active
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
