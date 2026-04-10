'use client';

import { useState } from 'react';
import { Share2, CheckCheck } from 'lucide-react';

interface ShareButtonProps {
  position: number | null;
  points: number;
}

export default function ShareButton({ position, points }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const text = position
    ? `Estoy en el puesto #${position} del Prode Fullescabio Mundial 2026 con ${points} pts. ¿Te animás a competir?`
    : `Estoy participando del Prode Fullescabio Mundial 2026 con ${points} pts. ¿Te animás a competir?`;

  async function handleShare() {
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ text, title: 'Prode Fullescabio 2026' });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancelled share or clipboard unavailable — silently ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
    >
      {copied
        ? <CheckCheck size={14} className="text-emerald-400" />
        : <Share2 size={14} />}
      {copied ? 'Copiado!' : 'Compartir'}
    </button>
  );
}
