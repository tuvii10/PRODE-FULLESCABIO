import { createClient } from '@/lib/supabase/server';
import MatchForm from '@/components/admin/match-form';

async function createMatch(fd: FormData) {
  'use server';
  const supabase = await createClient();
  const { error } = await supabase.from('matches').insert({
    home_team:  fd.get('home_team') as string,
    away_team:  fd.get('away_team') as string,
    home_flag:  (fd.get('home_flag') as string) || null,
    away_flag:  (fd.get('away_flag') as string) || null,
    match_date: new Date(fd.get('match_date') as string).toISOString(),
    stage:      fd.get('stage') as string,
    group_name: (fd.get('group_name') as string) || null,
    venue:      (fd.get('venue') as string) || null,
  });
  return { error: error?.message };
}

export default function NewMatchPage() {
  return (
    <div className="space-y-4">
      <h1 className="section-title text-2xl">Nuevo partido</h1>
      <MatchForm onSave={createMatch} />
    </div>
  );
}
