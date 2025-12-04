import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateTimelineWithGemini } from '@/lib/gemini-service';

/**
 * Gera timeline completa após pagamento confirmado
 * POST /api/generate/full-timeline
 */
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 });
    }

    console.log(`[Full Timeline] Iniciando geração para: ${slug}`);

    // Buscar story no banco
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (storyError || !story) {
      return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
    }

    // Verificar se é premium
    if (!story.is_premium) {
      return NextResponse.json({ error: 'Esta história não é premium' }, { status: 403 });
    }

    // Se já foi gerada, não gerar novamente
    if (story.full_timeline_generated) {
      console.log(`[Full Timeline] Timeline já foi gerada para: ${slug}`);
      return NextResponse.json({ success: true, message: 'Timeline já existe' });
    }

    // Buscar conversa original (se foi salva quando virou premium)
    // Por enquanto, usar os momentos existentes como base
    let conversationText = story.conversation_text;

    // Se não tem conversation_text salvo, tentar buscar da memória
    if (!conversationText) {
      const { globalForStories } = global as any;
      const previewData = globalForStories?.storiesInMemory?.get(story.preview_id);
      
      if (previewData?.conversationText) {
        conversationText = previewData.conversationText;
        
        // Salvar no banco para futuras gerações
        await supabase
          .from('stories')
          .update({ conversation_text: conversationText })
          .eq('slug', slug);
      }
    }

    if (!conversationText) {
      console.error(`[Full Timeline] Conversa não encontrada para: ${slug}`);
      return NextResponse.json(
        { error: 'Conversa original não encontrada. Não é possível gerar timeline completa.' },
        { status: 404 }
      );
    }

    // Gerar timeline completa com Gemini
    console.log(`[Full Timeline] Chamando Gemini AI...`);
    const timelineResult = await generateTimelineWithGemini(
      conversationText,
      story.person1_name,
      story.person2_name,
      story.relationship_type
    );

    // Atualizar story com timeline completa
    const { error: updateError } = await supabase
      .from('stories')
      .update({
        moments: timelineResult.timeline || [],
        full_timeline_generated: true,
      })
      .eq('slug', slug);

    if (updateError) {
      console.error(`[Full Timeline] Erro ao salvar timeline:`, updateError);
      throw updateError;
    }

    console.log(`[Full Timeline] ✅ Timeline completa gerada para: ${slug}`);

    return NextResponse.json({
      success: true,
      momentsCount: timelineResult.timeline?.length || 0,
    });

  } catch (error) {
    console.error('[Full Timeline] Erro:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar timeline' },
      { status: 500 }
    );
  }
}
