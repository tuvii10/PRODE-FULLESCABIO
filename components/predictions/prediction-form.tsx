'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Check, Lock } from 'lucide-react';
import type { Match, Prediction } from '@/lib/types';

interface Props {
  match:      Match;
  prediction: Prediction | null;
  userId:     string;
}

export default function PredictionForm({ match, prediction, userId }: Props) {
  const locked = match.status !== 'upcoming' || new Date(match.match_date) <= new Date();

  const [home,    setHome]    = useState(prediction?.home_score_pred ?? '');
  const [away,    setAway]    = useState(prediction?.away_score_pred ?? '');
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [pending, startTrans] = useTransition();

  const supabase = createClient();

  function handleSave() {
    const h = Number(home);
    const a = Number(away);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
      setError('Ingresá un marcador válido (0 o más).');
      return;
    }
    setError('');

    startTrans(async () => {
      const payload = {
        user_id:         userId,
        match_id:        match.id,
        home_score_pred: h,
        away_score_pred: a,
      };

      let dbError;
      if (prediction) {
        ({ error: dbError } = await supabase
          .from('predictions')
          .update({ home_score_pred: h, away_score_pred: a })
          .eq('id', prediction.id));
      } else {
        ({ error: dbError } = await supabase
          .from('predictions')
          .insert(payload));
      }

      if (dbError) {
        setError(dbError.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  if (locked) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Lock size={14} />
        {match.status === 'finished' && match.home_score != null
          ? <span className="font-bold text-slate-300">{match.home_score} – {match.away_score}</span>
          : <span>Pronóstico cerrado</span>
        }
        {prediction && (
          <span className="ml-2 text-xs text-slate-600">
            (Tu pronóstico: {prediction.home_score_pred}–{prediction.away_score_pred}
            {prediction.calculated && (
              <span className={
                prediction.points === 3 ? ' text-amber-400' :
                prediction.points === 1 ? ' text-emerald-400' : ' text-slate-500'
              }> · {prediction.points} pts</span>
            )}
            )
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={99}
        className="input w-14 text-center px-2 py-2 text-base font-bold"
        value={home}
        onChange={e => setHome(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
        placeholder="0"
        disabled={pending}
      />
      <span className="text-slate-500 font-bold">–</span>
      <input
        type="number"
        min={0}
        max={99}
        className="input w-14 text-center px-2 py-2 text-base font-bold"
        value={away}
        onChange={e => setAway(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
        placeholder="0"
        disabled={pending}
      />
      <button
        onClick={handleSave}
        disabled={pending || home === '' || away === ''}
        className="btn-primary px-3 py-2 text-xs"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> :
         saved    ? <Check size={14} /> : 'Guardar'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
