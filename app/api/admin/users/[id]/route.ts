import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body: { is_disqualified?: boolean; disq_reason?: string | null } = await request.json();

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      is_disqualified: body.is_disqualified,
      disq_reason:     body.disq_reason ?? null,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
