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
  const body: {
    status?: string;
    home_score?: number;
    away_score?: number;
    recalculate?: boolean;
  } = await request.json();

  const supabase = await createServiceClient();

  const updateData: Record<string, unknown> = {};
  if (body.status !== undefined)     updateData.status     = body.status;
  if (body.home_score !== undefined) updateData.home_score = body.home_score;
  if (body.away_score !== undefined) updateData.away_score = body.away_score;

  const { error } = await supabase.from('matches').update(updateData).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Recalcular puntos si el partido finalizó
  if (body.recalculate && body.status === 'finished') {
    const { error: calcError } = await supabase.rpc('recalculate_match_predictions', {
      p_match_id: id,
    });
    if (calcError) {
      console.error('recalculate error:', calcError.message);
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = await createServiceClient();
  const { error } = await supabase.from('matches').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
