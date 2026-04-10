import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

export async function GET() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const service = await createServiceClient();

  // Ranking + profiles (para teléfono y username)
  const [rankingRes, profilesRes] = await Promise.all([
    service.from('ranking').select('*').order('position', { ascending: true }),
    service.from('profiles').select('id, username, phone'),
  ]);

  const extraMap = new Map(
    (profilesRes.data ?? []).map(p => [p.id, { username: p.username, phone: p.phone }])
  );

  const rows = (rankingRes.data ?? []).map(r => {
    const extra = extraMap.get(r.id) ?? { username: null, phone: null };
    return {
      'Posición':     r.position,
      'Nombre':       r.full_name ?? '—',
      'Usuario':      extra.username ?? '—',
      'Email':        r.email,
      'Teléfono':     extra.phone ?? '—',
      'Puntos':       r.total_points,
      'Exactos':      r.exact_results,
      'Ganador/Emp.': r.correct_winner,
      'Pronósticos':  r.total_predictions,
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Ancho de columnas
  ws['!cols'] = [
    { wch: 10 }, // Posición
    { wch: 28 }, // Nombre
    { wch: 18 }, // Usuario
    { wch: 30 }, // Email
    { wch: 18 }, // Teléfono
    { wch: 8  }, // Puntos
    { wch: 8  }, // Exactos
    { wch: 12 }, // Ganador
    { wch: 13 }, // Pronósticos
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ranking');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ranking-fullescabio-${new Date().toISOString().slice(0,10)}.xlsx"`,
    },
  });
}
