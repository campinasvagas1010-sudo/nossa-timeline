import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Cron Job da Vercel - Limpa stories expiradas a cada 1 hora
 * URL: /api/cron/cleanup
 * 
 * Configurado em vercel.json para rodar automaticamente
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar token de autorização (segurança)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cleanup] Iniciando limpeza de stories expiradas...');

    // 1. Buscar stories expiradas
    const { data: expiredStories, error: fetchError } = await supabaseAdmin
      .from('stories')
      .select('*')
      .lt('expires_at', new Date().toISOString());

    if (fetchError) {
      console.error('[Cleanup] Erro ao buscar stories:', fetchError);
      throw fetchError;
    }

    if (!expiredStories || expiredStories.length === 0) {
      console.log('[Cleanup] Nenhuma story expirada encontrada');
      return NextResponse.json({
        success: true,
        message: 'No expired stories',
        deleted: 0
      });
    }

    console.log(`[Cleanup] ${expiredStories.length} stories expiradas encontradas`);

    // 2. Fazer backup antes de deletar
    const backupData = expiredStories.map(story => ({
      id: story.id,
      original_slug: story.slug,
      backup_data: story
    }));

    const { error: backupError } = await supabaseAdmin
      .from('stories_backup')
      .insert(backupData);

    if (backupError) {
      console.error('[Cleanup] Erro ao fazer backup:', backupError);
      // Continuar mesmo com erro no backup
    } else {
      console.log(`[Cleanup] Backup de ${backupData.length} stories realizado`);
    }

    // 3. Deletar stories expiradas
    const storyIds = expiredStories.map(s => s.id);
    
    const { error: deleteError } = await supabaseAdmin
      .from('stories')
      .delete()
      .in('id', storyIds);

    if (deleteError) {
      console.error('[Cleanup] Erro ao deletar stories:', deleteError);
      throw deleteError;
    }

    console.log(`[Cleanup] ✅ ${storyIds.length} stories deletadas`);

    // 4. Limpar backups antigos (mais de 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: cleanupBackupError } = await supabaseAdmin
      .from('stories_backup')
      .delete()
      .lt('deleted_at', thirtyDaysAgo.toISOString());

    if (cleanupBackupError) {
      console.error('[Cleanup] Erro ao limpar backups antigos:', cleanupBackupError);
    } else {
      console.log('[Cleanup] Backups antigos limpos (>30 dias)');
    }

    // 5. Retornar resumo
    return NextResponse.json({
      success: true,
      deleted: storyIds.length,
      backed_up: backupData.length,
      stories_deleted: expiredStories.map(s => ({
        slug: s.slug,
        expires_at: s.expires_at,
        person1: s.person1_name,
        person2: s.person2_name
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Cleanup] Erro:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

// Permitir POST também (para teste manual)
export async function POST(request: NextRequest) {
  return GET(request);
}
