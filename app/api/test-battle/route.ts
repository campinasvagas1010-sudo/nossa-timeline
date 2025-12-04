import { NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini-service';

export async function GET() {
  try {
    console.log('[Test Battle] Testando análise de batalha...');

    const testPrompt = `
Analise o seguinte cenário de uma conversa de casal:

**CONTEXTO:**
Pedro enviou 45 mensagens perguntando "com quem você está?" nas últimas 2 semanas.
Ana enviou apenas 8 mensagens desse tipo no mesmo período.

**TAREFA:**
Determine quem é mais ciumento(a) nessa relação.

Retorne APENAS um JSON válido no formato:
{
  "winner": "Pedro" ou "Ana",
  "confidence": número de 0 a 100,
  "result": "Pedro é MUITO mais ciumento! 😱",
  "evidence": [
    "45 mensagens de ciúme vs apenas 8",
    "Pedro pergunta 'com quem você está?' toda hora",
    "Diferença de 460% no comportamento ciumento"
  ]
}
`;

    const result = await analyzeWithGemini(testPrompt);
    
    console.log('[Test Battle] ✅ Sucesso!', result);

    return NextResponse.json({
      success: true,
      message: 'Análise de batalha funcionando! 🎉',
      result,
      model: 'gemini-2.0-flash',
      cost: '~$0.0001 por análise',
    });

  } catch (error) {
    console.error('[Test Battle] ❌ Erro:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
