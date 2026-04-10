'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function TournamentStatusForm({ currentStatus }: { currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saved,  setSaved]  = useState(false);
  const router = useRouter();
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'status', value: status }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-bold text-white">Estado del torneo</h2>
      <select value={status} onChange={e => setStatus(e.target.value)} className="input w-48">
        <option value="upcoming">Próximo (pre-inscripción)</option>
        <option value="active">Activo</option>
        <option value="finished">Finalizado</option>
      </select>
      <button onClick={save} disabled={pending} className="btn-primary">
        {pending ? <Loader2 size={14} className="animate-spin" /> :
         saved    ? <><CheckCircle2 size={14} /> Guardado</> :
         'Guardar'}
      </button>
    </div>
  );
}
