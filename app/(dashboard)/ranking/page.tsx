import { createClient } from '@/lib/supabase/server';
import { Trophy, Medal, Star } from 'lucide-react';
import type { RankingRow } from '@/lib/types';

export const revalidate = 60;

function PositionBadge({ pos }: { pos: number }) {
  if (pos === 1) return <Trophy size={16} className="text-amber-400" />;
  if (pos === 2) return <Medal  size={16} className="text-slate-300" />;
  if (pos === 3) return <Medal  size={16} className="text-amber-700" />;
  return <span className="text-slate-500 text-sm font-bold w-4 text-center">{pos}</span>;
}

export default async function RankingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [rankingRes, myRankRes] = await Promise.all([
    supabase.from('ranking').select('*').order('position', { ascending: true }).limit(50),
    supabase.from('ranking').select('*').eq('id', user!.id).single(),
  ]);

  const rows   = (rankingRes.data ?? []) as RankingRow[];
  const myRank = myRankRes.data as RankingRow | null;
  const myId   = user!.id;

  const isInTop50 = rows.some(r => r.id === myId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Ranking general</h1>
        <p className="text-sm text-slate-400">Top 50 participantes — actualizado en tiempo real.</p>
      </div>

      {/* Mi posición (si no está en top 50) */}
      {!isInTop50 && myRank && (
        <div className="card border-amber-500/30 bg-amber-500/5">
          <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">Tu posición</p>
          <RankingRow row={myRank} isMe />
        </div>
      )}

      {/* Tabla */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/80 text-left">
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold w-10">#</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold">Participante</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right">Pts</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right hidden sm:table-cell">Exactos</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right hidden sm:table-cell">Ganador</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <RankingRow key={row.id} row={row} isMe={row.id === myId} />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    <Star size={28} className="mx-auto mb-3 opacity-40" />
                    El ranking se publicará cuando haya pronósticos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        En caso de empate: más exactos → más ganadores/empates → fecha de registro más antigua.
      </p>
    </div>
  );
}

function RankingRow({ row, isMe }: { row: RankingRow; isMe: boolean }) {
  return (
    <tr
      className={`border-b border-brand-border/50 table-row-hover ${
        isMe ? 'bg-amber-500/10' : ''
      } ${row.position <= 3 ? 'font-semibold' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center justify-center">
          <PositionBadge pos={Number(row.position)} />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-brand-border flex items-center justify-center shrink-0 text-xs font-bold text-slate-400">
            {(row.full_name || row.username || row.email)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${isMe ? 'text-amber-300' : 'text-white'}`}>
              {row.full_name || row.username || row.email.split('@')[0]}
              {isMe && <span className="ml-1 text-xs text-amber-500/70">(vos)</span>}
            </p>
            {row.username && (
              <p className="text-[11px] text-slate-500 truncate">@{row.username}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-base font-black text-amber-400">{row.total_points}</span>
      </td>
      <td className="px-4 py-3 text-right hidden sm:table-cell text-slate-300">
        {row.exact_results}
      </td>
      <td className="px-4 py-3 text-right hidden sm:table-cell text-slate-400">
        {row.correct_winner}
      </td>
    </tr>
  );
}
