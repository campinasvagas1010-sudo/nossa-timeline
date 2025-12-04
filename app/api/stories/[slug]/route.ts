import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API pública para buscar story por slug
 * GET /api/stories/[slug]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 });
    }

    // Buscar story no banco
    const { data: story, error } = await supabase
      .from('stories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !story) {
      return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
    }

    // Retornar dados públicos
    return NextResponse.json({
      success: true,
      story: {
        slug: story.slug,
        person1_name: story.person1_name,
        person2_name: story.person2_name,
        person1_photo: story.person1_photo,
        person2_photo: story.person2_photo,
        relationship_type: story.relationship_type,
        start_date: story.start_date,
        end_date: story.end_date,
        total_messages: story.total_messages,
        cards: story.cards,
        moments: story.moments,
        is_premium: story.is_premium,
        full_timeline_generated: story.full_timeline_generated,
        created_at: story.created_at,
      },
    });
  } catch (error) {
    console.error('[Stories API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar história' },
      { status: 500 }
    );
  }
}
