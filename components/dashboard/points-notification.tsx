'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap, X } from 'lucide-react';

export default function PointsNotification({ userId }: { userId: string }) {
  const [newPoints,   setNewPoints]   = useState(0);
  const [matchCount,  setMatchCount]  = useState(0);
  const [show,        setShow]        = useState(false);

  useEffect(() => {
    const STORAGE_KEY = `points_last_seen_${userId}`;
    const lastSeen    = localStorage.getItem(STORAGE_KEY) ?? '2000-01-01T00:00:00Z';
    const supabase    = createClient();

    supabase
      .from('predictions')
      .select('points')
      .eq('user_id', userId)
      .eq('calculated', true)
      .gt('updated_at', lastSeen)
      .gt('points', 0)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const total = data.reduce((sum, p) => sum + (p.points ?? 0), 0);
          setNewPoints(total);
          setMatchCount(data.length);
          setShow(true);
        }
      });
  }, [userId]);

  function dismiss() {
    localStorage.setItem(`points_last_seen_${userId}`, new Date().toISOString());
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 shrink-0">
          <Zap size={16} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            +{newPoints} puntos nuevos
          </p>
          <p className="text-xs text-emerald-500/70">
            Se calcularon {matchCount} partido{matchCount !== 1 ? 's' : ''} desde tu última visita.
          </p>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="text-emerald-500/50 hover:text-emerald-400 transition-colors shrink-0 p-1"
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>
    </div>
  );
}
