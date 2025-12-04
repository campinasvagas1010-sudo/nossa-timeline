import { NextRequest, NextResponse } from 'next/server';
import { generateBattleCard } from '@/lib/card-generator';

/**
 * Endpoint de teste para geração de cards
 * GET /api/test-card?category=ciume
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'ciume';
    
    console.log(`[Test Card] Gerando card de teste: ${category}`);
    
    // Dados mock para teste
    const mockData = {
      category,
      categoryName: 'Mais Ciumento(a)',
      winner: 'Ana',
      loser: 'Pedro',
      winnerPercentage: 68,
      result: 'Ana demonstrou mais ciúmes ao longo da conversa, fazendo perguntas sobre onde Pedro estava e com quem estava.',
      backgroundGradient: ['#FF6B9D', '#C44569'] as [string, string],
    };
    
    const buffer = await generateBattleCard(mockData);
    
    console.log(`[Test Card] ✅ Card gerado com sucesso (${buffer.length} bytes)`);
    
    // Retornar imagem PNG
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error: any) {
    console.error('[Test Card] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar card' },
      { status: 500 }
    );
  }
}
