import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/layout/navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  if (profile.is_disqualified) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-hero-gradient px-5 text-center">
        <div className="card max-w-sm">
          <h2 className="text-xl font-bold text-red-400">Cuenta suspendida</h2>
          <p className="mt-2 text-sm text-slate-400">
            {profile.disq_reason || 'Tu cuenta fue suspendida. Contactá al administrador.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-brand-bg">
      <Navbar profile={profile} />
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
