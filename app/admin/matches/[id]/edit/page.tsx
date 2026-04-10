import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import MatchForm from '@/components/admin/match-form';

interface Props {
  params: Promise<{ id: string }>;
}

async function updateMatch(id: string, fd: FormData) {
  'use server';
  const supabase = await createClient();
  const { error } = await supabase.from('matches').update({
    home_team:  fd.get('home_team') as string,
    away_team:  fd.get('away_team') as string,
    home_flag:  (fd.get('home_flag') as string) || null,
    away_flag:  (fd.get('away_flag') as string) || null,
    match_date: new Date(fd.get('match_date') as string).toISOString(),
    stage:      fd.get('stage') as string,
    group_name: (fd.get('group_name') as string) || null,
    venue:      (fd.get('venue') as string) || null,
  }).eq('id', id);
  return { error: error?.message };
}

export default async function EditMatchPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: match } = await supabase.from('matches').select('*').eq('id', id).single();
  if (!match) notFound();

  const boundUpdate = updateMatch.bind(null, id);

  return (
    <div className="space-y-4">
      <h1 className="section-title text-2xl">
        Editar: {match.home_team} vs {match.away_team}
      </h1>
      <MatchForm match={match} onSave={boundUpdate} />
    </div>
  );
}
