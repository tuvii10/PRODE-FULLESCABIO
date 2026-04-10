import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key, value } = await request.json();
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('tournament_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
