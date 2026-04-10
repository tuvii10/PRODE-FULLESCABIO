import { createClient } from '@/lib/supabase/server';
import PredictionsTabs from '@/components/predictions/predictions-tabs';
import type { Match, Prediction } from '@/lib/types';

export const revalidate = 0;

interface MatchWithPred extends Match {
  prediction: Prediction | null;
}

export default async function PredictionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [matchesRes, predsRes] = await Promise.all([
    supabase.from('matches').select('*').order('match_date', { ascending: true }),
    supabase.from('predictions').select('*').eq('user_id', user!.id),
  ]);

  const matches     = (matchesRes.data ?? []) as Match[];
  const predictions = (predsRes.data ?? []) as Prediction[];
  const predMap     = new Map(predictions.map(p => [p.match_id, p]));

  // Separar grupos de knockout
  const groups:  Record<string, MatchWithPred[]> = {};
  const knockout: Record<string, MatchWithPred[]> = {};

  for (const match of matches) {
    const mp: MatchWithPred = { ...match, prediction: predMap.get(match.id) ?? null };

    if (match.stage === 'group') {
      const g = match.group_name ?? '?';
      if (!groups[g]) groups[g] = [];
      groups[g].push(mp);
    } else {
      if (!knockout[match.stage]) knockout[match.stage] = [];
      knockout[match.stage].push(mp);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="text-xl font-black text-white">Mis pronósticos</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Seleccioná el grupo o fase · Se bloquea al inicio del partido
        </p>
      </div>

      <PredictionsTabs
        userId={user!.id}
        groups={groups}
        knockout={knockout}
      />
    </div>
  );
}
