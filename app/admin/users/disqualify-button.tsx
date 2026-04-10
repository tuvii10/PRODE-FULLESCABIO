'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserX, UserCheck } from 'lucide-react';

interface Props {
  userId: string;
  isDisqualified: boolean;
}

export default function DisqualifyButton({ userId, isDisqualified }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function toggle() {
    const reason = !isDisqualified
      ? prompt('Motivo de suspensión (opcional):') ?? ''
      : '';

    start(async () => {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_disqualified: !isDisqualified,
          disq_reason:     reason || null,
        }),
      });
      router.refresh();
    });
  }

  return (
    <button onClick={toggle} disabled={pending} className={isDisqualified ? 'btn-secondary text-xs px-3 py-1' : 'btn-danger text-xs px-3 py-1'}>
      {pending ? <Loader2 size={12} className="animate-spin" /> :
       isDisqualified ? <><UserCheck size={12} /> Rehabilitar</> :
                        <><UserX    size={12} /> Suspender</>}
    </button>
  );
}
