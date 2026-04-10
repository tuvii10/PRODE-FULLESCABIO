import { createClient } from '@/lib/supabase/server';
import ProfileForm from '@/components/profile/profile-form';
import { UserCircle } from 'lucide-react';

export const metadata = { title: 'Mi perfil — Prode Fullescabio' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  return (
    <div className="animate-fade-in max-w-md space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black text-white">
          <UserCircle size={24} className="text-[#3483fa]" />
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Configurá tu nombre público y datos de contacto.
        </p>
      </div>

      <div className="card">
        <ProfileForm profile={profile!} />
      </div>
    </div>
  );
}
