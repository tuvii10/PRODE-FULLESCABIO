import { createClient } from '@/lib/supabase/server';
import TournamentStatusForm from './tournament-status-form';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('tournament_settings').select('*');
  const settings: Record<string, string> = {};
  (data ?? []).forEach(row => { settings[row.key] = row.value; });

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="section-title text-2xl">Configuración del torneo</h1>
      <TournamentStatusForm currentStatus={settings['status'] ?? 'upcoming'} />
    </div>
  );
}
