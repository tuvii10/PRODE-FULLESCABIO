import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Shield, CalendarDays, Users, BarChart2, Settings, ChevronLeft } from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin',          label: 'Panel',    icon: Shield,       exact: true },
  { href: '/admin/matches',  label: 'Partidos', icon: CalendarDays, exact: false },
  { href: '/admin/users',    label: 'Usuarios', icon: Users,        exact: false },
  { href: '/admin/ranking',  label: 'Ranking',  icon: BarChart2,    exact: false },
  { href: '/admin/settings', label: 'Config',   icon: Settings,     exact: false },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/dashboard');

  return (
    <div className="min-h-dvh bg-brand-bg">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-purple-500/20 bg-[#0d0820] px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mr-2">
          <ChevronLeft size={14} />
          App
        </Link>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-purple-400" />
          <span className="text-sm font-bold text-purple-300">Panel Admin</span>
        </div>
        <nav className="ml-4 flex items-center gap-1 overflow-x-auto">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
