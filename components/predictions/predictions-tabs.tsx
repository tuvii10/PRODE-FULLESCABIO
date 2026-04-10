'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lock, Check, Loader2 } from 'lucide-react';
import { flagUrl, stageName } from '@/lib/utils/points';
import type { Match, Prediction } from '@/lib/types';

interface MatchWithPred extends Match {
  prediction: Prediction | null;
}

interface Props {
  userId:  string;
  groups:  Record<string, MatchWithPred[]>; // 'A'..'L'
  knockout: Record<string, MatchWithPred[]>; // 'round32','round16','quarter','semi','third','final'
}

const GROUP_TABS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const KNOCKOUT_TABS = [
  { key: 'round32', label: 'R32'    },
  { key: 'round16', label: 'Octavos'},
  { key: 'quarter', label: 'Cuartos'},
  { key: 'semi',    label: 'Semi'   },
  { key: 'third',   label: '3° Pto' },
  { key: 'final',   label: 'Final'  },
];

export default function PredictionsTabs({ userId, groups, knockout }: Props) {
  const [active, setActive] = useState<string>('A');

  const currentMatches: MatchWithPred[] =
    active in groups
      ? (groups[active] ?? [])
      : (knockout[active] ?? []);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4">
        <div className="flex gap-1 min-w-max">
          {/* Group tabs */}
          <span className="text-[10px] text-slate-600 self-center mr-1 uppercase tracking-widest">Grupos</span>
          {GROUP_TABS.map(g => (
            <button
              key={g}
              onClick={() => setActive(g)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                active === g
                  ? 'bg-amber-500 text-black'
                  : 'bg-brand-surface text-slate-400 hover:text-white border border-brand-border'
              }`}
            >
              {g}
            </button>
          ))}

          <div className="mx-2 w-px bg-brand-border self-stretch" />

          {/* Knockout tabs */}
          <span className="text-[10px] text-slate-600 self-center mr-1 uppercase tracking-widest">Elim.</span>
          {KNOCKOUT_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                active === key
                  ? 'bg-amber-500 text-black'
                  : 'bg-brand-surface text-slate-400 hover:text-white border border-brand-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Match list */}
      <div className="space-y-2">
        {currentMatches.length === 0 && (
          <div className="card text-center py-10 text-slate-500 text-sm">
            No hay partidos en esta sección todavía.
          </div>
        )}
        {currentMatches.map(match => (
          <MatchRow key={match.id} match={match} userId={userId} />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MatchRow: una fila compacta por partido
────────────────────────────────────────────── */
function MatchRow({ match, userId }: { match: MatchWithPred; userId: string }) {
  const isLocked = match.status !== 'upcoming' || new Date(match.match_date) <= new Date();
  const isDone   = match.status === 'finished' && match.home_score != null;
  const isLive   = match.status === 'live';

  const [homeVal, setHomeVal] = useState<string>(
    match.prediction ? String(match.prediction.home_score_pred) : ''
  );
  const [awayVal, setAwayVal] = useState<string>(
    match.prediction ? String(match.prediction.away_score_pred) : ''
  );
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [pending, startTrans] = useTransition();
  const supabase = createClient();

  function save() {
    const h = Number(homeVal);
    const a = Number(awayVal);
    if (homeVal === '' || awayVal === '' || isNaN(h) || isNaN(a)) return;
    setError('');
    startTrans(async () => {
      let dbError;
      if (match.prediction) {
        ({ error: dbError } = await supabase
          .from('predictions')
          .update({ home_score_pred: h, away_score_pred: a })
          .eq('id', match.prediction!.id));
      } else {
        ({ error: dbError } = await supabase
          .from('predictions')
          .insert({ user_id: userId, match_id: match.id, home_score_pred: h, away_score_pred: a }));
      }
      if (dbError) { setError('Error al guardar'); }
      else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    });
  }

  const predPoints = match.prediction?.calculated
    ? match.prediction.points
    : null;

  return (
    <div className={`rounded-xl border px-3 py-3 transition-all ${
      isLive         ? 'border-green-500/40 bg-green-500/5' :
      isDone         ? 'border-brand-border bg-brand-surface/60' :
                       'border-brand-border bg-brand-surface'
    }`}>
      <div className="flex items-center gap-2">

        {/* Fecha */}
        <div className="w-14 shrink-0 text-center">
          <div className="text-[10px] text-slate-500 leading-tight">
            {format(new Date(match.match_date), 'dd MMM', { locale: es })}
          </div>
          <div className="text-[10px] text-slate-600 leading-tight">
            {format(new Date(match.match_date), 'HH:mm')}
          </div>
        </div>

        {/* Equipo local */}
        <div className="flex flex-1 items-center justify-end gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-white truncate text-right">
            {match.home_team}
          </span>
          {match.home_flag && (
            <img src={flagUrl(match.home_flag)} alt="" className="h-4 w-6 object-cover rounded-sm shrink-0" />
          )}
        </div>

        {/* Resultado real o VS */}
        <div className="w-10 shrink-0 text-center">
          {isDone ? (
            <span className="text-sm font-black text-white">
              {match.home_score}–{match.away_score}
            </span>
          ) : isLive ? (
            <span className="text-[10px] font-bold text-green-400 animate-pulse">VIVO</span>
          ) : (
            <span className="text-xs text-slate-600">vs</span>
          )}
        </div>

        {/* Equipo visitante */}
        <div className="flex flex-1 items-center gap-1.5 min-w-0">
          {match.away_flag && (
            <img src={flagUrl(match.away_flag)} alt="" className="h-4 w-6 object-cover rounded-sm shrink-0" />
          )}
          <span className="text-xs font-semibold text-white truncate">
            {match.away_team}
          </span>
        </div>

        {/* Input / resultado locked */}
        <div className="shrink-0 flex items-center gap-1">
          {isLocked ? (
            <div className="flex items-center gap-1">
              <Lock size={11} className="text-slate-600" />
              {match.prediction ? (
                <span className={`text-xs font-bold ${
                  predPoints === 3 ? 'text-amber-400' :
                  predPoints === 1 ? 'text-emerald-400' :
                  predPoints === 0 ? 'text-slate-500' :
                  'text-slate-400'
                }`}>
                  {match.prediction.home_score_pred}–{match.prediction.away_score_pred}
                  {predPoints !== null && (
                    <span className="ml-1 text-[10px]">({predPoints}p)</span>
                  )}
                </span>
              ) : (
                <span className="text-[10px] text-slate-600">—</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="number" min={0} max={99}
                className="w-9 rounded-lg border border-brand-border bg-[#0a0a1e] px-1 py-1 text-center text-sm font-bold text-white outline-none focus:border-amber-500/70"
                value={homeVal}
                onChange={e => setHomeVal(e.target.value)}
                disabled={pending}
                placeholder="0"
              />
              <span className="text-slate-500 text-xs">–</span>
              <input
                type="number" min={0} max={99}
                className="w-9 rounded-lg border border-brand-border bg-[#0a0a1e] px-1 py-1 text-center text-sm font-bold text-white outline-none focus:border-amber-500/70"
                value={awayVal}
                onChange={e => setAwayVal(e.target.value)}
                disabled={pending}
                placeholder="0"
              />
              <button
                onClick={save}
                disabled={pending || homeVal === '' || awayVal === ''}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  saved
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-40'
                }`}
              >
                {pending ? <Loader2 size={12} className="animate-spin" /> :
                 saved    ? <Check size={12} /> :
                 <span className="text-[10px] font-bold">OK</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-right text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}
