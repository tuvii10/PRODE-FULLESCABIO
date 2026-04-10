import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CalendarDays, Users, BarChart2, Trophy, PlusCircle, RefreshCw } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [matchCount, userCount, predCount, rankTop3] = await Promise.all([
    supabase.from('matches').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('predictions').select('id', { count: 'exact', head: true }),
    supabase.from('ranking').select('full_name,email,total_points,position').order('position').limit(3),
  ]);

  const stats = [
    { label: 'Partidos',     value: matchCount.count ?? 0,  icon: CalendarDays, href: '/admin/matches', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Usuarios',     value: userCount.count ?? 0,   icon: Users,        href: '/admin/users',   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Pronósticos',  value: predCount.count ?? 0,   icon: BarChart2,    href: '/admin/ranking', color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Panel de administración</h1>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href} className={`card border ${bg} hover:opacity-80 transition-opacity`}>
            <Icon size={18} className={`${color} mb-2`} />
            <span className="text-2xl font-black text-white">{value}</span>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="section-title">Acciones rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/admin/matches/new" className="btn-secondary flex items-center gap-2 justify-center py-3">
            <PlusCircle size={16} className="text-purple-400" />
            Nuevo partido
          </Link>
          <Link href="/admin/matches" className="btn-secondary flex items-center gap-2 justify-center py-3">
            <RefreshCw size={16} className="text-purple-400" />
            Cargar resultados
          </Link>
        </div>
      </div>

      {/* Top 3 */}
      {(rankTop3.data?.length ?? 0) > 0 && (
        <div>
          <h2 className="section-title">Podio actual</h2>
          <div className="space-y-2">
            {(rankTop3.data ?? []).map((r, i) => (
              <div key={i} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-amber-400">#{r.position}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.full_name || r.email}</p>
                    <p className="text-xs text-slate-500">{r.email}</p>
                  </div>
                </div>
                <span className="text-base font-black text-amber-400">{r.total_points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
