'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AtSign, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [username, setUsername] = useState(profile.username ?? '');
  const [phone,    setPhone]    = useState(profile.phone ?? '');
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError('');
    startTransition(async () => {
      const supabase = createClient();
      const { error: err } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          username:  username.trim() || null,
          phone:     phone.trim()    || null,
        })
        .eq('id', profile.id);

      if (err) {
        if (err.code === '23505') {
          setError('Ese nombre de usuario ya está en uso. Elegí otro.');
        } else {
          setError(err.message);
        }
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email — read-only */}
      <div>
        <label className="label">Email</label>
        <div className="input flex items-center gap-2 opacity-60 cursor-not-allowed select-none">
          <AtSign size={14} className="text-slate-500 shrink-0" />
          <span className="text-slate-300 text-sm truncate">{profile.email}</span>
        </div>
        <p className="mt-1 text-xs text-slate-600">El email no se puede cambiar.</p>
      </div>

      {/* Nombre completo */}
      <div>
        <label htmlFor="fullName" className="label">Nombre completo</label>
        <input
          id="fullName"
          type="text"
          className="input"
          placeholder="Ej: Martín Pérez"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          maxLength={60}
        />
        <p className="mt-1 text-xs text-slate-600">Este nombre aparece en el ranking público.</p>
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="label">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          className="input"
          placeholder="Ej: martin26"
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          maxLength={30}
        />
        <p className="mt-1 text-xs text-slate-600">Solo letras minúsculas, números y guiones bajos. Único.</p>
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="label">Teléfono <span className="normal-case font-normal text-slate-600">(opcional)</span></label>
        <input
          id="phone"
          type="tel"
          className="input"
          placeholder="Ej: +54 9 11 1234-5678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          maxLength={30}
        />
        <p className="mt-1 text-xs text-slate-600">Solo visible para los administradores del Prode. No se comparte.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
          <CheckCircle size={14} className="shrink-0" />
          Perfil guardado correctamente.
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending
          ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
          : 'Guardar cambios'}
      </button>
    </form>
  );
}
