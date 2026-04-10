import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CalendarDays, BarChart2, Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { flagUrl } from '@/lib/utils/points';
import PointsNotification from '@/components/dashboard/points-notification';
import ShareButton from '@/components/dashboard/share-button';
import type { Profile } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileRes, rankingRes, upcomingRes, predCountRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('ranking').select('*').eq('id', user!.id).single(),
    supabase.from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .gt('match_date', new Date().toISOString())
      .order('match_date', { ascending: true })
      .limit(3),
    supabase.from('predictions')
      .select('id', { count: 'exact' })
      .eq('user_id', user!.id),
  ]);

  const profile   = profileRes.data as Profile | null;
  const ranking   = rankingRes.data;
  const upcoming  = upcomingRes.data ?? [];
  const predCount = predCountRes.count ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Points notification (client component, shows if there are new points) */}
      <PointsNotification userId={user!.id} />

      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Hola, {profile?.full_name?.split(' ')[0] || profile?.username || 'participante'} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Bienvenido al Prode Fullescabio Mundial 2026
          </p>
        </div>
        <ShareButton
          position={ranking?.position ? Number(ranking.position) : null}
          points={ranking?.total_points ?? 0}
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: 'Posición',
            value: ranking?.position ? `#${ranking.position}` : '—',
            icon: Trophy,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
          },
          {
            label: 'Puntos',
            value: ranking?.total_points ?? 0,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
          },
          {
            label: 'Exactos',
            value: ranking?.exact_results ?? 0,
            icon: BarChart2,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
          },
          {
            label: 'Pronósticos',
            value: predCount,
            icon: CalendarDays,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/20',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg} flex flex-col gap-2`}>
            <Icon size={18} className={color} />
            <span className="text-2xl font-black text-white">{value}</span>
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/predictions" className="card hover:border-amber-500/40 transition-colors group flex items-center justify-between">
          <div>
            <CalendarDays size={20} className="text-amber-400 mb-2" />
            <p className="font-bold text-white">Mis pronósticos</p>
            <p className="text-xs text-slate-400 mt-0.5">Cargá o editá antes del inicio</p>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
        </Link>
        <Link href="/ranking" className="card hover:border-amber-500/40 transition-colors group flex items-center justify-between">
          <div>
            <BarChart2 size={20} className="text-amber-400 mb-2" />
            <p className="font-bold text-white">Ranking general</p>
            <p className="text-xs text-slate-400 mt-0.5">Mirá cómo estás vs. todos</p>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
        </Link>
      </div>

      {/* Próximos partidos */}
      {upcoming.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title mb-0">Próximos partidos</h2>
            <Link href="/predictions" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {upcoming.map(match => (
              <div key={match.id} className="card flex items-center gap-4">
                <div className="flex flex-1 items-center justify-center gap-3">
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-semibold text-white text-right">{match.home_team}</span>
                    {match.home_flag && (
                      <img src={flagUrl(match.home_flag)} alt={match.home_team} className="h-5 w-7 object-cover rounded-sm" />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 font-medium">VS</span>
                    <span className="text-[10px] text-slate-600 mt-0.5">
                      {format(new Date(match.match_date), 'dd MMM', { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    {match.away_flag && (
                      <img src={flagUrl(match.away_flag)} alt={match.away_team} className="h-5 w-7 object-cover rounded-sm" />
                    )}
                    <span className="text-sm font-semibold text-white">{match.away_team}</span>
                  </div>
                </div>
                <Link href="/predictions" className="shrink-0 text-xs text-amber-500 hover:text-amber-400">
                  Pronosticar →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
