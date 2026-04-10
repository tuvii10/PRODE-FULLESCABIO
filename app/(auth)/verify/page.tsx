import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-hero-gradient px-5 text-center">
      <div className="card max-w-sm w-full animate-slide-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15">
          <Mail size={26} className="text-amber-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Confirmá tu email</h1>
        <p className="mt-2 text-sm text-slate-400">
          Revisá tu bandeja de entrada y hacé clic en el link que te enviamos
          para activar tu cuenta.
        </p>
        <Link href="/login" className="btn-secondary mt-5 inline-flex w-full justify-center">
          Volver al login
        </Link>
      </div>
    </div>
  );
}
