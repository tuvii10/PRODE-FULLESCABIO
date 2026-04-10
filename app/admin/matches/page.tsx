import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Edit2 } from 'lucide-react';
import ResultForm from './result-form';
import { flagUrl, stageName } from '@/lib/utils/points';

export const revalidate = 0;

export default async function AdminMatchesPage() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl mb-0">Partidos</h1>
        <Link href="/admin/matches/new" className="btn-primary text-sm px-4 py-2">
          <PlusCircle size={15} />
          Nuevo partido
        </Link>
      </div>

      <div className="space-y-2">
        {(matches ?? []).map(match => (
          <div key={match.id} className="card space-y-3">
            {/* Teams row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {match.home_flag && <img src={flagUrl(match.home_flag)} alt="" className="h-5 w-7 object-cover rounded-sm" />}
                <span className="font-semibold text-white text-sm">{match.home_team}</span>
              </div>
              <div className="text-center">
                {match.status === 'finished' && match.home_score != null ? (
                  <span className="text-base font-black text-white">{match.home_score}–{match.away_score}</span>
                ) : (
                  <span className="text-xs text-slate-500">VS</span>
                )}
                <div className="text-[10px] text-slate-600">
                  {format(new Date(match.match_date), 'dd MMM HH:mm', { locale: es })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{match.away_team}</span>
                {match.away_flag && <img src={flagUrl(match.away_flag)} alt="" className="h-5 w-7 object-cover rounded-sm" />}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`badge badge-${match.status}`}>
                  {match.status === 'upcoming' ? 'Próximo' :
                   match.status === 'live'     ? 'En vivo' :
                   match.status === 'finished' ? 'Finalizado' : 'Cancelado'}
                </span>
                <span className="text-xs text-slate-500">{stageName(match.stage)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/matches/${match.id}/edit`} className="btn-secondary text-xs px-3 py-1.5 gap-1">
                  <Edit2 size={12} />
                  Editar
                </Link>
              </div>
            </div>

            {/* Result form */}
            <ResultForm match={match} />
          </div>
        ))}

        {(matches ?? []).length === 0 && (
          <div className="card text-center py-12 text-slate-500">
            No hay partidos. <Link href="/admin/matches/new" className="text-amber-500 hover:underline">Crear el primero</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
