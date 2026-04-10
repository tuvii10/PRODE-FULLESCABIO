import { createClient } from '@/lib/supabase/server';
import type { RankingRow } from '@/lib/types';

export const revalidate = 0;

export default async function AdminRankingPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('ranking')
    .select('*')
    .order('position', { ascending: true });

  const allRows = (rows ?? []) as RankingRow[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl mb-0">Ranking completo ({allRows.length})</h1>
        <a href="/api/admin/users/export" className="btn-secondary text-xs px-3 py-1.5">
          Exportar CSV
        </a>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-left">
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold w-12">#</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold">Participante</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right">Pts</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right">Exactos</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right">Ganador</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold text-right">Pronósticos</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map(row => (
                <tr key={row.id} className="border-b border-brand-border/50 table-row-hover">
                  <td className="px-4 py-3 text-center font-bold text-amber-400">
                    {row.position}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{row.full_name || row.email.split('@')[0]}</p>
                    <p className="text-xs text-slate-500">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-black text-amber-400">{row.total_points}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{row.exact_results}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{row.correct_winner}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{row.total_predictions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
