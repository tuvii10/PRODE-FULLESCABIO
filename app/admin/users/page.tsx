import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DisqualifyButton from './disqualify-button';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl mb-0">Usuarios ({users?.length ?? 0})</h1>
        <a
          href="/api/admin/users/export"
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Exportar CSV
        </a>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-left">
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold">Usuario</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold hidden md:table-cell">Registro</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold">Estado</th>
                <th className="px-4 py-3 text-xs text-slate-500 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map(user => (
                <tr key={user.id} className="border-b border-brand-border/50 table-row-hover">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">
                        {user.full_name || user.username || '—'}
                        {user.username && <span className="ml-1.5 text-xs text-slate-600">@{user.username}</span>}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-slate-600">{user.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
                    {format(new Date(user.created_at), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_admin ? (
                      <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">Admin</span>
                    ) : user.is_disqualified ? (
                      <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Suspendido</span>
                    ) : (
                      <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">Activo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!user.is_admin && (
                      <DisqualifyButton
                        userId={user.id}
                        isDisqualified={user.is_disqualified}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
