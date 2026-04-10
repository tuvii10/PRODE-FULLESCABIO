'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Match } from '@/lib/types';

interface Props {
  match?: Match;
  onSave: (data: FormData) => Promise<{ error?: string }>;
}

const STAGES = [
  { value: 'group',   label: 'Fase de grupos' },
  { value: 'round16', label: 'Octavos de final' },
  { value: 'quarter', label: 'Cuartos de final' },
  { value: 'semi',    label: 'Semifinal' },
  { value: 'third',   label: 'Tercer puesto' },
  { value: 'final',   label: 'Final' },
];

export default function MatchForm({ match, onSave }: Props) {
  const router  = useRouter();
  const [error, setError]   = useState('');
  const [pending, startTrans] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    startTrans(async () => {
      const res = await onSave(fd);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/admin/matches');
        router.refresh();
      }
    });
  }

  // Convert ISO to datetime-local input format
  const defaultDate = match?.match_date
    ? new Date(match.match_date).toISOString().slice(0, 16)
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Equipo local</label>
          <input name="home_team" className="input" defaultValue={match?.home_team} required placeholder="Ej: Argentina" />
        </div>
        <div>
          <label className="label">Equipo visitante</label>
          <input name="away_team" className="input" defaultValue={match?.away_team} required placeholder="Ej: Brasil" />
        </div>
        <div>
          <label className="label">Bandera local (ISO)</label>
          <input name="home_flag" className="input" defaultValue={match?.home_flag ?? ''} placeholder="Ej: AR" maxLength={2} />
        </div>
        <div>
          <label className="label">Bandera visitante (ISO)</label>
          <input name="away_flag" className="input" defaultValue={match?.away_flag ?? ''} placeholder="Ej: BR" maxLength={2} />
        </div>
      </div>

      <div>
        <label className="label">Fecha y hora (UTC)</label>
        <input name="match_date" type="datetime-local" className="input" defaultValue={defaultDate} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Etapa</label>
          <select name="stage" className="input" defaultValue={match?.stage ?? 'group'}>
            {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Grupo</label>
          <input name="group_name" className="input" defaultValue={match?.group_name ?? ''} placeholder="A, B, C..." maxLength={1} />
        </div>
      </div>

      <div>
        <label className="label">Estadio / Sede</label>
        <input name="venue" className="input" defaultValue={match?.venue ?? ''} placeholder="Ej: Estadio Azteca" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending && <Loader2 size={15} className="animate-spin" />}
          {match ? 'Guardar cambios' : 'Crear partido'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
