'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { Match } from '@/lib/types';

export default function ResultForm({ match }: { match: Match }) {
  const router = useRouter();
  const [home,    setHome]    = useState(match.home_score ?? '');
  const [away,    setAway]    = useState(match.away_score ?? '');
  const [status,  setStatus]  = useState(match.status);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [pending, startTrans] = useTransition();

  function handleSave() {
    setError('');
    startTrans(async () => {
      const body: Record<string, unknown> = { status };
      if (status === 'finished') {
        const h = Number(home);
        const a = Number(away);
        if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
          setError('Marcador inválido.');
          return;
        }
        body.home_score = h;
        body.away_score = a;
        body.recalculate = true;
      }

      const res = await fetch(`/api/admin/matches/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Error al guardar.');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-brand-border pt-3">
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Match['status'])}
        className="input w-36 text-xs py-1.5"
        disabled={pending}
      >
        <option value="upcoming">Próximo</option>
        <option value="live">En vivo</option>
        <option value="finished">Finalizado</option>
        <option value="cancelled">Cancelado</option>
      </select>

      {status === 'finished' && (
        <>
          <input
            type="number" min={0} max={99}
            className="input w-14 text-center py-1.5 text-sm font-bold"
            value={home}
            onChange={e => setHome(e.target.value)}
            placeholder="0"
          />
          <span className="text-slate-500 font-bold">–</span>
          <input
            type="number" min={0} max={99}
            className="input w-14 text-center py-1.5 text-sm font-bold"
            value={away}
            onChange={e => setAway(e.target.value)}
            placeholder="0"
          />
        </>
      )}

      <button onClick={handleSave} disabled={pending} className="btn-primary text-xs px-3 py-1.5">
        {pending ? <Loader2 size={13} className="animate-spin" /> :
         saved    ? <><CheckCircle2 size={13} /> Guardado</> :
         'Guardar'}
      </button>

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
