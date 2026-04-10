'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/logo';

export default function LoginPage() {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes('rate')) {
        setError('Demasiados intentos. Esperá unos minutos e intentá de nuevo.');
      } else {
        setError(authError.message);
      }
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-hero-gradient px-5 text-center">
        <div className="card max-w-sm w-full animate-slide-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15">
            <Mail size={26} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Revisá tu email</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enviamos un link mágico a{' '}
            <strong className="text-slate-200">{email}</strong>.<br />
            Hacé clic en el link para ingresar.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            No olvides revisar tu carpeta de spam.
          </p>
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="btn-secondary mt-5 w-full"
          >
            Usar otro email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-hero-gradient px-5">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo width={200} />
          <p className="text-xs text-slate-500 tracking-widest uppercase">Prode Mundial 2026</p>
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-white">Ingresá o registrate</h1>
          <p className="mt-1 text-sm text-slate-400">
            Te enviamos un link mágico a tu email. Sin contraseña.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Enviando...</>
              ) : (
                <><Mail size={16} /> Enviar link de acceso</>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Si es tu primera vez, se crea tu cuenta automáticamente.
            Solo una cuenta por email.
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
