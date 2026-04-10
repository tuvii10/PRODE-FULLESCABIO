'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, CalendarDays, BarChart2, LogOut, Shield, UserCircle } from 'lucide-react';
import Logo from '@/components/ui/logo';
import type { Profile } from '@/lib/types';

const NAV = [
  { href: '/dashboard',   label: 'Inicio',      icon: LayoutDashboard },
  { href: '/predictions', label: 'Pronósticos',  icon: CalendarDays },
  { href: '/ranking',     label: 'Ranking',      icon: BarChart2 },
  { href: '/profile',     label: 'Perfil',       icon: UserCircle },
];

export default function Navbar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <>
      {/* ── DESKTOP: top bar ── */}
      <header className="hidden md:flex items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-6 py-3 sticky top-0 z-40">
        <Link href="/dashboard">
          <Logo width={140} />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-[#3483fa]/15 text-[#3483fa]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {profile.is_admin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-purple-500/15 text-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={15} />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 truncate max-w-[140px]">
            {profile.full_name || profile.username || profile.email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </header>

      {/* ── MOBILE: header top ── */}
      <header className="flex md:hidden items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 sticky top-0 z-40">
        <Link href="/dashboard">
          <Logo width={110} />
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
        </button>
      </header>

      {/* ── MOBILE: bottom tab bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#2a2a2a] bg-[#0f0f0f] md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${
              pathname.startsWith(href) ? 'text-[#3483fa]' : 'text-slate-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        {profile.is_admin && (
          <Link
            href="/admin"
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${
              pathname.startsWith('/admin') ? 'text-purple-400' : 'text-slate-500'
            }`}
          >
            <Shield size={20} />
            Admin
          </Link>
        )}
      </nav>
    </>
  );
}
